import React, { useState } from 'react';
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
  Grid
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

// Mock data for users
const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    lastLogin: "2024-05-15T10:30:00",
    createdAt: "2024-01-10",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    lastLogin: "2024-05-14T14:45:00",
    createdAt: "2024-02-05",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@example.com",
    lastLogin: "2024-05-10T09:15:00",
    createdAt: "2024-03-20",
    avatar: "/placeholder.svg",
  },
];

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    user || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "student",
      password: "",
      confirmPassword: "",
    }
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
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
        <Grid item xs={12} sm={6}>
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            required
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
            required
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
      </Grid>
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ 
            borderRadius: 2,
            background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #3147BF 0%, #B740AF 100%)',
            }
          }}
        >
          {user ? 'Save Changes' : 'Create Account'}
        </Button>
      </DialogActions>
    </form>
  );
};

export const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleAddUser = (userData) => {
    const newUser = {
      ...userData,
      id: users.length + 1,
      lastLogin: null,
      createdAt: new Date().toISOString().split("T")[0],
      avatar: "/placeholder.svg",
    };
    setUsers([newUser, ...users]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (userData) => {
    setUsers(users.map((user) => (user.id === userData.id ? { ...user, ...userData } : user)));
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Box sx={{ p: 3 }} className="user-management-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" className="gradient-text" gutterBottom>
          User Management
        </Typography>
        <Typography color="text.secondary">
          Manage user accounts
        </Typography>
      </Box>

      <Paper elevation={0} className="table-container" sx={{ mb: 4, p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            className="search-input gradient-border"
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDialogOpen(true)}
            className="action-button"
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3147BF 0%, #B740AF 100%)',
              }
            }}
          >
            Add User
          </Button>
        </Box>

        <Box sx={{ mt: 3 }} className="custom-scrollbar">
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="table-row">
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={user.avatar} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="avatar"
                        sx={{ 
                          width: 40, 
                          height: 40,
                          background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)'
                        }}
                      >
                        {user.firstName[0]}{user.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditDialogOpen(true);
                      }}
                      className="action-button"
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton className="action-button" sx={{ color: 'primary.main' }}>
                      <MailIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="action-button"
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Add User Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
          className: "dialog-content"
        }}
      >
        <DialogTitle>
          <Typography variant="h5" className="gradient-text">
            Add New User
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Create a new user account
          </Typography>
          <UserForm
            onSave={handleAddUser}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
          className: "dialog-content"
        }}
      >
        <DialogTitle>
          <Typography variant="h5" className="gradient-text">
            Edit User
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Update user information
          </Typography>
          <UserForm
            user={selectedUser}
            onSave={handleEditUser}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog 
        open={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 },
          className: "dialog-content"
        }}
      >
        <DialogTitle>
          <Typography variant="h5" className="gradient-text">
            Delete User
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
          {selectedUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Avatar 
                src={selectedUser.avatar} 
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: 'linear-gradient(45deg, #4158D0 0%, #C850C0 100%)'
                }}
              >
                {selectedUser.firstName[0]}{selectedUser.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.email}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
            variant="outlined"
            className="action-button"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser}
            variant="contained" 
            color="error"
            className="action-button"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;