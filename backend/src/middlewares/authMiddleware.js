const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    console.log('Auth Middleware - Headers:', req.headers);

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Auth Middleware - Token found:', token ? 'Yes' : 'No');
    }

    // If no token found
    if (!token) {
        console.log('Auth Middleware - No token provided');
        return res.status(401).json({
            success: false,
            message: 'Không có quyền truy cập, vui lòng đăng nhập'
        });
    }

    try {
        // Verify token
        console.log('Auth Middleware - Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth Middleware - Token decoded:', decoded);

        // Find user from token
        const user = await User.findById(decoded.userId).select('-password');
        console.log('Auth Middleware - User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            console.log('Auth Middleware - User not found for token');
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Add user to request
        req.user = user;
        console.log('Auth Middleware - Authentication successful');
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi xác thực: ' + error.message
        });
    }
};

// Middleware to check if user has required role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền thực hiện hành động này'
            });
        }
        next();
    };
};

// Middleware to verify refresh token
exports.verifyRefreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy refresh token'
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
                message: 'Người dùng không tồn tại'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token không hợp lệ'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token đã hết hạn'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi xác thực refresh token: ' + error.message
        });
    }
};

exports.authenticate = exports.protect;