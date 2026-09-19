const Job = require("../models/Job");

// Create a new job
const createJob = async (req, res) => {
  try {
    // Only employers can create jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can create jobs",
      });
    }

    const {
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
      employer: req.user.userId,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// Get all jobs with search and filters
const getAllJobs = async (req, res) => {
  try {
    const { search, location, jobType } = req.query;

    const filter = {};

    // Search by job title or company
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Filter by job type
    if (jobType) {
      filter.jobType = jobType;
    }

    const jobs = await Job.find(filter)
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// Get a single job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    // Only employers can update jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can update jobs",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Make sure this job belongs to the logged-in employer
    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
      });
    }

    const {
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
    } = req.body;

    // Update only the fields provided
    if (title !== undefined) job.title = title;
    if (company !== undefined) job.company = company;
    if (location !== undefined) job.location = location;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) job.requirements = requirements;
    if (salary !== undefined) job.salary = salary;
    if (jobType !== undefined) job.jobType = jobType;

    await job.save();

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    // Only employers can delete jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can delete jobs",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Make sure this job belongs to the logged-in employer
    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

// Get jobs posted by the logged-in employer
const getMyJobs = async (req, res) => {
  try {
    // Only employers can view their posted jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view their posted jobs",
      });
    }

    const jobs = await Job.find({
      employer: req.user.userId,
    })
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: jobs.length,
      jobs,
    });
    } catch (error) {
    console.error("GET MY JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch your jobs",
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};