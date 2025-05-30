const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const controllerHandler = require('../utils/controllerHandler');

// Register handler
exports.register = controllerHandler(async (req, res) => {
    const { fullName, email, password, role } = req.body;

    // Validate role
    const allowedRoles = ['student', 'teacher', 'admin'];
    if (role && !allowedRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role. Must be one of: student, teacher, admin'
        });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email đã được sử dụng'
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: role || 'student'
    });

    // Generate tokens
    const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        accessToken,
        refreshToken,
        user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role
        }
    });
});

// Login handler
exports.login = controllerHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Email hoặc mật khẩu không đúng'
        });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Email hoặc mật khẩu không đúng'
        });
    }

    // Generate tokens
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }
    });
});

// Logout handler
exports.logout = controllerHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công'
    });
});

// Refresh token handler
exports.refreshToken = controllerHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }
    });
});

// Get user profile handler
exports.getUserProfile = controllerHandler(async (req, res) => {
    console.log('GetUserProfile - Request:', {
        userId: req.user?.id,
        headers: req.headers
    });
    
    const user = await User.findById(req.user?.id).select('-password');
    console.log('GetUserProfile - Found user:', user);
    
    if (!user) {
        console.log('GetUserProfile - User not found');
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
        });
    }

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            bio: user.bio,
            role: user.role,
            avatar: user.avatar
        }
    });
});

// Update profile handler
exports.updateUserProfile = controllerHandler(async (req, res) => {
    const { fullName, email, phone, address, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
        });
    }

    // Check email uniqueness if changing email
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }
        user.email = email;
    }

    // Update fields
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        user: {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            bio: updatedUser.bio,
            role: updatedUser.role,
            avatar: updatedUser.avatar
        }
    });
});

// Change password handler
exports.changePassword = controllerHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
        });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: 'Mật khẩu hiện tại không đúng'
        });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Đổi mật khẩu thành công'
    });
});

// Get all users (admin only)
exports.getAllUsers = controllerHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

// Get user by ID (admin only)
exports.getUserById = controllerHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
        });
    }

    res.status(200).json({
        success: true,
        user
    });
});

// Update user by ID (admin only)
exports.updateUserById = controllerHandler(async (req, res) => {
    const { fullName, email, role, phone, address, bio } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
        });
    }

    // Check email uniqueness if changing email
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }
        user.email = email;
    }

    // Update fields (only allow specific fields to be updated by admin)
    user.fullName = fullName || user.fullName;
    user.role = role || user.role; // Allow admin to change role
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;
    // Password change should be handled separately for security

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        message: 'Cập nhật người dùng thành công',
        user: { // Return updated user data
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            address: updatedUser.address,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
        }
    });
});

// Delete user by ID (admin only)
exports.deleteUserById = controllerHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
        });
    }

    await user.remove(); // Using remove() for Mongoose versions < 6.0, use deleteOne() or deleteMany() otherwise

    res.status(200).json({
        success: true,
        message: 'Xóa người dùng thành công'
    });
});
