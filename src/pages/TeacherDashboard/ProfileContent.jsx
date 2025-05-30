import React, { useState, useEffect, useRef } from 'react';
import './profile.css';
import {
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Upload as UploadIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useUploadAvatarMutation
} from '../../features/auth/authApiService';
import { selectIsAuthenticated, selectAccessToken } from '../../features/auth/authSlice';

export const ProfileContent = () => {
  const { data: userData, isLoading, error } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);

  // Snackbar state for feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Debug logs
  console.log('ProfileContent render - auth state:', {
    isAuthenticated,
    hasToken: !!accessToken,
    userData,
    isLoading,
    error
  });

  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    bio: userData?.bio || "",
    avatar: userData?.avatar || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Update form data when user data is updated by mutation
  // Initial data for display comes directly from userData
  useEffect(() => {
    console.log('useEffect triggered. userData:', userData);
    // Only update profileData state for the form if userData is available
    if (userData) {
      // Check if user data from query is different from current form state before updating
      // This prevents unnecessary re-renders of the form
      if (
        userData.fullName !== profileData.fullName ||
        userData.email !== profileData.email ||
        userData.phone !== profileData.phone ||
        userData.address !== profileData.address ||
        userData.bio !== profileData.bio ||
        userData.avatar !== profileData.avatar
      ) {
        console.log('Updating profileData state for form from useEffect', userData);
        setProfileData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          bio: userData.bio || '',
          avatar: userData.avatar || ''
        });
      }
    }
  }, [userData]); // Depend on userData

  // Form validation for editable fields (optional, backend also validates)
  const validateProfileForm = () => {
    const newErrors = {};
    if (!profileData.fullName || !profileData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    // Add validation for other editable fields if necessary (phone format etc.)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required.";
    }
     if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "New password and confirm password do not match.";
    }
    // Add complexity rules for new password if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile updates
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) {
        setSnackbar({
            open: true,
            message: 'Please check the information.',
            severity: 'warning'
        });
        return;
    }

    try {
      const dataToUpdate = {
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio,
      };

      const result = await updateProfile(dataToUpdate).unwrap();

      if (result) {
        console.log('Profile updated successfully, received data:', result);
        // State will be updated by useEffect due to RTK Query cache invalidation
        setSnackbar({
            open: true,
            message: "Profile updated successfully!",
            severity: 'success'
        });
      } else {
        setSnackbar({
            open: true,
            message: "Update successful, but data refresh may be delayed.",
            severity: 'info'
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage = error.data?.message || "Failed to update profile.";
      setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
      });
    }
  };

  // Handle avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        await uploadAvatar(formData).unwrap();
        setSnackbar({
            open: true,
            message: "Avatar updated successfully!",
            severity: 'success'
        });
        // RTK Query will automatically refetch user data due to tag invalidation
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        const errorMessage = error.data?.message || "Failed to upload avatar.";
        setSnackbar({
            open: true,
            message: errorMessage,
            severity: 'error'
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
       setSnackbar({
            open: true,
            message: 'Please check the entered passwords.',
            severity: 'warning'
        });
        return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      setSnackbar({
          open: true,
          message: 'Password changed successfully!',
          severity: 'success'
      });
      // Clear password fields on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      const errorMessage = error.data?.message || 'Failed to change password.';
       setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
        </Box>
    );
  }

  // Show error state
  if (error) {
    return <Typography color="error">Error loading profile: {error.message || 'Could not load profile data.'}</Typography>;
  }

  // Only render profile content if userData is available after loading and no error
  // This check is a safeguard, should be covered by isLoading/error
  if (!userData) {
    return <Typography>No profile data found or data is still processing...</Typography>;
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body1">
          Manage your personal information and account settings
        </Typography>
      </div>

      <Grid container spacing={3}>
        {/* Left column - Profile info */}
        <Grid item xs={12} md={4}>
          <div className="profile-card">
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <div className={`profile-avatar-container ${isUploading || isUploadingAvatar ? 'loading' : ''}`} onClick={() => fileInputRef.current?.click()}>
                {isUploading || isUploadingAvatar ? (
                    <CircularProgress size={60} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-30px', marginLeft: '-30px', zIndex: 1 }} />
                ) : null}
                <Avatar
                  alt="Profile Avatar"
                  src={profileData.avatar || 'https://ui-avatars.com/api/?name=' + (userData?.fullName || 'User')}
                  sx={{ width: 120, height: 120, margin: '0 auto 1.5rem', transition: 'opacity 0.3s ease', opacity: isUploading || isUploadingAvatar ? 0.5 : 1 }}
                />
                 <IconButton
                  className="avatar-upload-button"
                  size="small"
                  sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'background.paper', zIndex: 2 }}
                >
                  <UploadIcon />
                </IconButton>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              <Typography variant="h6" gutterBottom>
                {userData?.fullName || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                 {userData?.role === 'teacher' ? 'Teacher' : 'User'}
              </Typography>

              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <div className="info-item">
                  <EmailIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value">{userData?.email || 'Not provided'}</div>
                  </div>
                </div>

                <div className="info-item" style={{ marginTop: '1rem' }}>
                  <PhoneIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <div>
                    <div className="info-label">Phone Number</div>
                    <div className="info-value">{userData?.phone || "Not provided"}</div>
                  </div>
                </div>

                <div className="info-item" style={{ marginTop: '1rem' }}>
                  <LocationIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <div>
                    <div className="info-label">Address</div>
                    <div className="info-value">{userData?.address || "Not provided"}</div>
                  </div>
                </div>

                <div className="info-item" style={{ marginTop: '1rem' }}>
                  <InfoIcon sx={{ color: '#6B7280', mr: 1 }} />
                  <div>
                    <div className="info-label">Bio</div>
                    <div className="info-value">{userData?.bio || "Not provided"}</div>
                  </div>
                </div>
              </Box>
            </Box>
          </div>
        </Grid>

        {/* Right column - Edit forms */}
        <Grid item xs={12} md={8}>
          {/* Profile Edit Form */}
          <div className="form-card">
            <div className="form-title">Edit Information</div>
            <form onSubmit={handleUpdateProfile}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={profileData.fullName || ''}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profileData.email || ''}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone || ''}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={profileData.address || ''}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    error={!!errors.address}
                    helperText={errors.address}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={profileData.bio || ''}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    error={!!errors.bio}
                    helperText={errors.bio}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    className="submit-button"
                    type="submit"
                    startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="form-card">
            <div className="form-title">Change Password</div>
            <form onSubmit={handlePasswordChange}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    variant="outlined"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            className="password-toggle-button"
                            onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                            edge="end"
                          >
                            {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    variant="outlined"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            className="password-toggle-button"
                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                            edge="end"
                          >
                            {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmNewPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    variant="outlined"
                    error={!!errors.confirmNewPassword}
                    helperText={errors.confirmNewPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            className="password-toggle-button"
                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                            edge="end"
                          >
                            {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    className="submit-button"
                    type="submit"
                    startIcon={isChangingPassword ? <CircularProgress size={20} color="inherit" /> : null}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Processing...' : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfileContent;