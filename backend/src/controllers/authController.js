const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const controllerHandler = require('../utils/controllerHandler');

// Đăng ký tài khoản
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

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email đã được sử dụng'
        });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        role: role || 'student' // Use provided role or default to student
    });

    await newUser.save();

    // Tạo Access Token (1 giờ)
    const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Tạo Refresh Token (1 ngày)
    const refreshToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Lưu refresh token trong cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

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

// Đăng nhập
exports.login = controllerHandler(async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Email hoặc mật khẩu không đúng'
        });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Email hoặc mật khẩu không đúng'
        });
    }

    // Tạo Access Token (1 giờ)
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Tạo Refresh Token (1 ngày)
    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Lưu refresh token trong cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

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

// Làm mới token
exports.refreshToken = controllerHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token is required'
        });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        // Check if user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
});

// Đăng xuất
exports.logout = controllerHandler(async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
});

// Lấy thông tin profile
exports.getUserProfile = controllerHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

// Cập nhật profile
exports.updateUserProfile = controllerHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    if (req.body.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        user.email = req.body.email;
    }

    const updatedUser = await user.save();
    res.json({
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar
    });
});

// Lấy danh sách tất cả người dùng
exports.getAllUsers = controllerHandler(async (req, res) => {
    const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: users.length,
        users: users
    });
});
