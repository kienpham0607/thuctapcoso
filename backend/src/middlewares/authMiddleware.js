const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header
            token = req.headers.authorization.split(' ')[1];

            // Xác minh token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Tìm người dùng dựa trên ID trong token và loại trừ mật khẩu
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                 return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
            }

            next(); // Chuyển sang middleware hoặc controller tiếp theo

        } catch (error) {
             console.error('Lỗi xác thực token:', error);
             // Xử lý lỗi liên quan đến token (ví dụ: token hết hạn, không hợp lệ)
             let message = 'Không được phép, token không hợp lệ';
             if (error.name === 'TokenExpiredError') {
                 message = 'Không được phép, token đã hết hạn';
             }
            res.status(401).json({ success: false, message: message });
        }
    }

    if (!token) {
        // Nếu không có token
        res.status(401).json({ success: false, message: 'Không được phép, không có token' });
    }
};

module.exports = {
    protect,
}; 