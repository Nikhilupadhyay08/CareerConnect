const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

const uploadToCloudinary = require("../utils/cloudinaryUpload");
const sendEmail = require("../utils/mail");

// ============================================================
// Apply for a job
// ============================================================
const applyForJob = async (req, res) => {
  try {
    // Only job seekers can apply
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs",
      });
    }

    const { jobId } = req.body;

    // Resume is required
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Get applicant details for email
    const applicant = await User.findById(req.user.userId);

    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    // Upload resume to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer
    );

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
      resume: uploadResult.secure_url,
    });

    // Send application confirmation email
    // Email failure will NOT cancel the application
    try {
      await sendEmail({
        to: applicant.email,
        subject: `Application Submitted - ${job.title}`,

        text: `Hello ${applicant.name},

Your application for the position of ${job.title} at ${job.company} has been submitted successfully.

Application Status: Applied

You can track your application status from your CareerConnect dashboard.

Thank you for using CareerConnect.

Best regards,
CareerConnect Team`,

        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px;">

            <h2 style="color: #2563eb;">
              Application Submitted Successfully
            </h2>

            <p>
              Hello ${applicant.name},
            </p>

            <p>
              Your application for
              <strong>${job.title}</strong>
              at
              <strong>${job.company}</strong>
              has been submitted successfully.
            </p>

            <p>
              <strong>Application Status:</strong>
              Applied
            </p>

            <p>
              You can track your application status from your
              CareerConnect dashboard.
            </p>

            <p>
              Thank you for using CareerConnect.
            </p>

            <p>
              Best regards,<br />
              <strong>CareerConnect Team</strong>
            </p>

          </div>
        `,
      });

      console.log(
        `Application confirmation email sent to ${applicant.email}`
      );
    } catch (emailError) {
      console.error(
        "Application saved, but confirmation email failed:",
        emailError.message
      );
    }

    // Send successful application response
    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

// ============================================================
// Get applications of the logged-in job seeker
// ============================================================
const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can view their applications",
      });
    }

    const applications = await Application.find({
      applicant: req.user.userId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// ============================================================
// Get applicants for an employer's job
// ============================================================
const getJobApplicants = async (req, res) => {
  try {
    // Only employers can view applicants
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view applicants",
      });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Make sure this job belongs to the logged-in employer
    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to view these applicants",
      });
    }

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("applicant", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};

// ============================================================
// Update application status
// ============================================================
const updateApplicationStatus = async (req, res) => {
  try {
    // Only employers can update status
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message:
          "Only employers can update application status",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Hired",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    // Find application
    const application = await Application.findById(
      req.params.applicationId
    ).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Make sure the application belongs to the employer's job
    if (!application.job) {
      return res.status(404).json({
        message: "The job associated with this application no longer exists",
      });
    }

    if (
      application.job.employer.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this application",
      });
    }

    // Update status
    application.status = status;

    await application.save();

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

// ============================================================
// View resume in browser
// Employers can view resumes for their own jobs.
// Admins can view all resumes.
// ============================================================
const viewResume = async (req, res) => {
  try {
    // Only employers and admins can view resumes
    if (
      req.user.role !== "employer" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Only employers and admins can view resumes",
      });
    }

    const application = await Application.findById(
      req.params.applicationId
    ).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Resume cannot be accessed if it doesn't exist
    if (!application.resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // If the user is an employer, make sure the job belongs
    // to that employer.
    // Admins can view resumes from all jobs.
    if (req.user.role === "employer") {
      if (!application.job) {
        return res.status(404).json({
          message:
            "The job associated with this application no longer exists",
        });
      }

      if (
        application.job.employer.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to view this resume",
        });
      }
    }

    // Fetch resume from Cloudinary
    const response = await fetch(application.resume);

    if (!response.ok) {
      return res.status(500).json({
        message: "Failed to fetch resume",
      });
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'inline; filename="resume.pdf"'
    );

    res.send(buffer);
  } catch (error) {
    console.error("View resume error:", error);

    res.status(500).json({
      message: "Failed to view resume",
      error: error.message,
    });
  }
};

// ============================================================
// Download resume
// Employers can download resumes for their own jobs.
// Admins can download all resumes.
// ============================================================
const downloadResume = async (req, res) => {
  try {
    // Only employers and admins can download resumes
    if (
      req.user.role !== "employer" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Only employers and admins can download resumes",
      });
    }

    const application = await Application.findById(
      req.params.applicationId
    ).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Resume cannot be downloaded if it doesn't exist
    if (!application.resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // If the user is an employer, make sure the job belongs
    // to that employer.
    // Admins can download resumes from all jobs.
    if (req.user.role === "employer") {
      if (!application.job) {
        return res.status(404).json({
          message:
            "The job associated with this application no longer exists",
        });
      }

      if (
        application.job.employer.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to download this resume",
        });
      }
    }

    // Fetch resume from Cloudinary
    const response = await fetch(application.resume);

    if (!response.ok) {
      return res.status(500).json({
        message: "Failed to fetch resume",
      });
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="resume.pdf"'
    );

    res.send(buffer);
  } catch (error) {
    console.error("Download resume error:", error);

    res.status(500).json({
      message: "Failed to download resume",
      error: error.message,
    });
  }
};

// ============================================================
// Exports
// ============================================================
module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  viewResume,
  downloadResume,
};