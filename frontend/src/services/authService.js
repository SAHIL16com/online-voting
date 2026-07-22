const API_BASE = '/api/auth';

/**
 * Register a new user in the backend database
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

/**
 * Login user and receive JWT token & profile
 */
export const loginUser = async ({ email, password, role }) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

/**
 * Fetch current user profile using JWT token
 */
export const getCurrentProfile = async (token) => {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user profile');
  }

  return data;
};

/**
 * Update user profile details in MongoDB database
 */
export const updateProfileApi = async (profileData, token) => {
  const response = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data;
};

/**
 * Upload avatar image to Cloudinary and update MongoDB
 */
export const uploadAvatarApi = async (base64Image, token) => {
  const response = await fetch(`${API_BASE}/upload-avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image: base64Image }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload photo to Cloudinary');
  }

  return data;
};
