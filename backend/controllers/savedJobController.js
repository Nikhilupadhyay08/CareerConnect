const SavedJob = require("../models/SavedJob");

// Save a job
const saveJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can save jobs",
      });
    }

    const { jobId } = req.params;

    const existingSavedJob = await SavedJob.findOne({
      user: req.user.userId,
      job: jobId,
    });

    if (existingSavedJob) {
      return res.status(400).json({
        message: "Job is already saved",
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user.userId,
      job: jobId,
    });

    res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    console.error("Save job error:", error);

    res.status(500).json({
      message: "Failed to save job",
    });
  }
};

// Remove a saved job
const removeSavedJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can remove saved jobs",
      });
    }

    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      user: req.user.userId,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found",
      });
    }

    res.json({
      message: "Job removed from saved jobs",
    });
  } catch (error) {
    console.error("Remove saved job error:", error);

    res.status(500).json({
      message: "Failed to remove saved job",
    });
  }
};

// Get all saved jobs for the logged-in jobseeker
const getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can view saved jobs",
      });
    }

    const savedJobs = await SavedJob.find({
      user: req.user.userId,
    })
      .populate({
        path: "job",
        populate: {
          path: "employer",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      count: savedJobs.length,
      savedJobs,
    });
  } catch (error) {
    console.error("Fetch saved jobs error:", error);

    res.status(500).json({
      message: "Failed to fetch saved jobs",
    });
  }
};

// Check whether a specific job is saved
const checkSavedJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can check saved jobs",
      });
    }

    const { jobId } = req.params;

    const savedJob = await SavedJob.findOne({
      user: req.user.userId,
      job: jobId,
    });

    res.json({
      saved: !!savedJob,
    });
  } catch (error) {
    console.error("Check saved job error:", error);

    res.status(500).json({
      message: "Failed to check saved job",
    });
  }
};

module.exports = {
  saveJob,
  removeSavedJob,
  getSavedJobs,
  checkSavedJob,
};