const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// ==================== HELPERS ====================

// Handle standard API responses
const handleResponse = async (response, defaultMessage) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Token is missing, invalid, or expired
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error(
      "Your session has expired. Please login again."
    );
  }

  if (!response.ok) {
    throw new Error(data.message || defaultMessage);
  }

  return data;
};

// Authorization headers
const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});


// ==================== AUTH ====================

// Register user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response, "Registration failed");
};

// Login user
export const loginUser = async (loginData) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  return handleResponse(response, "Login failed");
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await fetch(
    `${API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  return handleResponse(
    response,
    "Failed to process password reset request"
  );
};

// Reset password
export const resetPassword = async (
  token,
  password
) => {
  const response = await fetch(
    `${API_URL}/auth/reset-password/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    }
  );

  return handleResponse(
    response,
    "Failed to reset password"
  );
};


// ==================== PROFILE ====================

// Get logged-in user's profile
export const getMyProfile = async (token) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    headers: authHeaders(token),
  });

  return handleResponse(response, "Failed to fetch profile");
};

// Update logged-in user's profile
export const updateMyProfile = async (token, userData) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response, "Failed to update profile");
};


// ==================== JOBS ====================

// Get all jobs with search, filters, sorting and pagination
export const getAllJobs = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.search) {
    queryParams.append("search", filters.search);
  }

  if (filters.location) {
    queryParams.append("location", filters.location);
  }

  if (filters.jobType) {
    queryParams.append("jobType", filters.jobType);
  }

  if (filters.sort) {
    queryParams.append("sort", filters.sort);
  }

  if (filters.page) {
    queryParams.append("page", filters.page);
  }

  if (filters.limit) {
    queryParams.append("limit", filters.limit);
  }

  const queryString = queryParams.toString();

  const response = await fetch(
    `${API_URL}/jobs${queryString ? `?${queryString}` : ""}`
  );

  return handleResponse(response, "Failed to fetch jobs");
};

// Get a single job
export const getJobById = async (jobId) => {
  const response = await fetch(
    `${API_URL}/jobs/${jobId}`
  );

  return handleResponse(response, "Failed to fetch job");
};

// Create a new job
export const createJob = async (token, jobData) => {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(jobData),
  });

  return handleResponse(response, "Failed to create job");
};

// Update an existing job
export const updateJob = async (
  token,
  jobId,
  jobData
) => {
  const response = await fetch(
    `${API_URL}/jobs/${jobId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify(jobData),
    }
  );

  return handleResponse(response, "Failed to update job");
};

// Get jobs posted by logged-in employer
export const getMyJobs = async (token) => {
  const response = await fetch(
    `${API_URL}/jobs/my-jobs`,
    {
      method: "GET",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to fetch your jobs"
  );
};

// Delete a job
export const deleteJob = async (token, jobId) => {
  const response = await fetch(
    `${API_URL}/jobs/${jobId}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to delete job"
  );
};


// ==================== SAVED JOBS ====================

// Save a job
export const saveJob = async (token, jobId) => {
  const response = await fetch(
    `${API_URL}/saved-jobs/${jobId}`,
    {
      method: "POST",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to save job"
  );
};

// Remove a saved job
export const removeSavedJob = async (
  token,
  jobId
) => {
  const response = await fetch(
    `${API_URL}/saved-jobs/${jobId}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to remove saved job"
  );
};

// Get all saved jobs
export const getSavedJobs = async (token) => {
  const response = await fetch(
    `${API_URL}/saved-jobs`,
    {
      method: "GET",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to fetch saved jobs"
  );
};

// Check whether a job is saved
export const checkSavedJob = async (
  token,
  jobId
) => {
  const response = await fetch(
    `${API_URL}/saved-jobs/${jobId}`,
    {
      method: "GET",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to check saved job"
  );
};


// ==================== APPLICATIONS ====================

// Apply for a job
export const applyForJob = async (
  token,
  jobId,
  resumeFile
) => {
  const formData = new FormData();

  formData.append("jobId", jobId);
  formData.append("resume", resumeFile);

  const response = await fetch(
    `${API_URL}/applications`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
    }
  );

  return handleResponse(
    response,
    "Failed to apply for job"
  );
};

// Get logged-in user's applications
export const getMyApplications = async (token) => {
  const response = await fetch(
    `${API_URL}/applications/my-applications`,
    {
      method: "GET",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to fetch applications"
  );
};

// Get applications for an employer's job
export const getJobApplicants = async (
  token,
  jobId
) => {
  const response = await fetch(
    `${API_URL}/applications/job/${jobId}`,
    {
      method: "GET",
      headers: authHeaders(token),
    }
  );

  return handleResponse(
    response,
    "Failed to fetch applicants"
  );
};

// View application resume
export const viewApplicationResume = async (
  token,
  applicationId
) => {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/resume/view`,
    {
      headers: authHeaders(token),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      data.message || "Failed to view resume"
    );
  }

  return response.blob();
};

// Update application status
export const updateApplicationStatus = async (
  token,
  applicationId,
  status
) => {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(token),
      },
      body: JSON.stringify({ status }),
    }
  );

  return handleResponse(
    response,
    "Failed to update application status"
  );
};