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
    console.error("Create job error:", error);

    res.status(500).json({
      message: "Failed to create job",
    });
  }
};

// Get all jobs with search, filters, sorting and pagination
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Search by job title or company
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by location
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by job type
    if (jobType) {
      filter.jobType = jobType;
    }

    // Pagination
    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const jobsPerPage = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      50
    );

    const skip = (currentPage - 1) * jobsPerPage;

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "salary-high") {
      sortOption = {
        salary: -1,
      };
    }

    if (sort === "salary-low") {
      sortOption = {
        salary: 1,
      };
    }

    // Get total number of matching jobs
    const totalJobs = await Job.countDocuments(filter);

    // Get paginated jobs
    const jobs = await Job.find(filter)
      .populate("employer", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(jobsPerPage);

    const totalPages = Math.ceil(
      totalJobs / jobsPerPage
    );

    res.json({
      count: jobs.length,
      totalJobs,
      currentPage,
      totalPages,
      jobsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      jobs,
    });
  } catch (error) {
    console.error("Fetch jobs error:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
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
    console.error("Fetch job error:", error);

    res.status(500).json({
      message: "Failed to fetch job",
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
    if (description !== undefined) {
      job.description = description;
    }
    if (requirements !== undefined) {
      job.requirements = requirements;
    }
    if (salary !== undefined) job.salary = salary;
    if (jobType !== undefined) job.jobType = jobType;

    await job.save();

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      message: "Failed to update job",
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
    console.error("Delete job error:", error);

    res.status(500).json({
      message: "Failed to delete job",
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
    console.error("Fetch my jobs error:", error);

    res.status(500).json({
      message: "Failed to fetch your jobs",
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