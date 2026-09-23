const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from saving the same job multiple times
savedJobSchema.index(
  { user: 1, job: 1 },
  { unique: true }
);

module.exports = mongoose.model("SavedJob", savedJobSchema);