const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    salary: {
      type: String,
      default: "Not specified",
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB indexes for faster job queries
jobSchema.index({ createdAt: -1 });
jobSchema.index({ jobType: 1, createdAt: -1 });
jobSchema.index({ location: 1, createdAt: -1 });
jobSchema.index({ employer: 1, createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);