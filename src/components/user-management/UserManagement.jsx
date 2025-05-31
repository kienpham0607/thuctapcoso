import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './user-management.css';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  useGetUsersQuery,
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} from '../../features/auth/authApiService';
import { alpha } from '@mui/material/styles';

const UserForm = ({ user, onSave, onCancel, isSubmitting, onError }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "student",
    password: "",
    confirmPassword: "",
  });

  // Reset form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "student",
        password: "",
        confirmPassword: "",
      });
    } else {
      // Reset for add new user case
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "student",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // Reset changePassword state when user prop changes or for new user
  useEffect(() => {
    setChangePassword(false);
  }, [user]);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      onError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      onError('Email is required');
      return false;
    }
    // Only validate password for new users or if change password is checked
    if (!user) {
      if (!formData.password) {
        onError('Password is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        onError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        onError('Password must be at least 6 characters long');
        return false;
      }
    } else if (changePassword) {
      // For existing users, validate password only if change password is checked
      if (!formData.password) {
        onError('Password is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        onError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        onError('Password must be at least 6 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      phone: formData.phone
    };

    // Only include password for new users or if change password is checked and password is provided for existing users
    if (!user || (user && changePassword && formData.password)) {
      userData.password = formData.password;
    }

    onSave(userData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleInputChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
           <Typography variant="caption" color="text.secondary">Create and manage lessons and tests</Typography>
        </Grid>
        
        {/* Password fields - only show for new users or if change password is checked */}
        {(user && changePassword) || !user ? (
          <>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    color="primary"
                  />
                }
                label="Change Password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required={!user || changePassword}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!user || changePassword}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  color="primary"
                />
              }
              label="Change Password"
            />
          </Grid>
        )}
      </Grid>
      <DialogActions sx={{ mt: 3 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ borderRadius: 2 }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #3147BF 0%, #B740AF 100%)',
            }
          }}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting
            ? (user ? 'Saving...' : 'Creating...')
            : (user ? 'Save Changes' : 'Create Account')
          }
        </Button>
      </DialogActions>
    </form>
  );
};

export const UserManagement = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading, error: fetchError } = useGetUsersQuery();
  const [register, { isLoading: isCreating }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [error, setError] = useState(fetchError?.message || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredUsers = users?.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  }) || [];

  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message || 'Failed to load user data');
    }
  }, [fetchError]);

  const handleAddUser = async (formData) => {
    try {
      const result = await register(formData).unwrap();
      setIsAddDialogOpen(false);
      showSuccess('User created successfully');
      setSearchQuery(''); // Clear search to show new user
    } catch (error) {
      console.error('Failed to create user:', error);
      showError(error?.data?.message || 'Failed to create user');
    }
  };

  const handleEditUser = async (userData) => {
    try {
      await updateUser({
        id: selectedUser._id,
        ...userData
      }).unwrap();
      setIsEditDialogOpen(false);
      showSuccess('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      showError(error.message || 'Failed to update user');
      if (error.status === 403) {
        setError('You do not have permission to update users');
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser._id).unwrap();
      setIsDeleteDialogOpen(false);
      showSuccess('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      showError(error.message || 'Failed to delete user');
      if (error.status === 403) {
        setError('You do not have permission to delete users');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  const showSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        {error.includes('permission') ? (
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Return to Dashboard
          </Button>
        ) : (
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        )}
      </Box>
    );
  }

  return (
    <>
      {/* Main Content */}
      <Box sx={{ p: 3 }} className="user-management-container">
        <Box sx={{ 
          mb: 4,
          background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
          p: 3,
          borderRadius: 2,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            User Management
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>
            Manage and monitor user accounts across the platform
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          className="table-container" 
          sx={{ 
            mb: 4, 
            borderRadius: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />,
              }}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: 40,
                  '& input': {
                    padding: '8px 14px'
                  },
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => setIsAddDialogOpen(true)}
              size="small"
              sx={{
                borderRadius: 2,
                height: 40,
                px: 2,
                background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3147BF 0%, #B740AF 100%)',
                }
              }}
            >
              Add User
            </Button>
          </Box>

          <Box sx={{ mt: 0 }} className="custom-scrollbar">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => {
                  const [firstName, ...lastNameParts] = (user.fullName || '').split(' ');
                  const lastName = lastNameParts.join(' ');
                  return (
                    <TableRow 
                      key={user._id} 
                      className="table-row"
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha('#16977D', 0.05)
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={user.avatar} 
                            alt={`${user.firstName} ${user.lastName}`}
                            className="avatar"
                            sx={{ 
                              width: 40, 
                              height: 40,
                              background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            {firstName?.[0]}{lastName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {user.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{
                          textTransform: 'capitalize',
                          color: user.role === 'admin' ? 'error.main' : 'text.primary',
                          fontWeight: 500
                        }}>
                          {user.role}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}
                            disabled={isUpdating}
                            sx={{
                              bgcolor: alpha('#16977D', 0.1),
                              color: '#16977D',
                              '&:hover': { 
                                bgcolor: alpha('#16977D', 0.2)
                              }
                            }}
                          >
                            {isUpdating && selectedUser?._id === user._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <EditIcon fontSize="small" />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={isDeleting}
                            sx={{
                              bgcolor: alpha('#d32f2f', 0.1),
                              color: '#d32f2f',
                              '&:hover': { 
                                bgcolor: alpha('#d32f2f', 0.2)
                              }
                            }}
                          >
                            {isDeleting && selectedUser?._id === user._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )})}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>

      {/* Dialogs */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        PaperProps={{
          sx: { 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          },
          className: "dialog-content"
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Add New User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Create a new user account
          </Typography>
          <UserForm
            onSave={handleAddUser}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isCreating}
            onError={showError}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        }}
        PaperProps={{
          sx: { 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          },
          className: "dialog-content"
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Edit User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Update user information
          </Typography>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSave={handleEditUser}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }}
              isSubmitting={isUpdating}
              onError={showError}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: { 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          },
          className: "dialog-content"
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #d32f2f 0%, #ff1744 100%)',
          color: 'white'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Delete User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
          {selectedUser && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mt: 3, 
              p: 2, 
              bgcolor: alpha('#d32f2f', 0.1), 
              borderRadius: 2 
            }}>
              <Avatar
                src={selectedUser.avatar}
                alt={selectedUser.fullName}
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)'
                }}
              >
                {selectedUser.fullName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {selectedUser.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.email}
                </Typography>
              </Box>
            </Box>
          )}
          <DialogActions sx={{ mt: 3 }}>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              variant="contained"
              color="error"
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #d32f2f 0%, #ff1744 100%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #b71c1c 0%, #d50000 100%)',
                }
              }}
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserManagement;
