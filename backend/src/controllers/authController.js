const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const controllerHandler = require('../utils/controllerHandler');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const OtpToken = require('../models/OtpToken');
const nodemailer = require('nodemailer');

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
    const { fullName, email, role, phone, address, bio, password } = req.body;

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

    // Update password if provided
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

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

// Delete user handler (Admin only)
exports.deleteUserById = controllerHandler(async (req, res) => {
    // Check if the authenticated user has permission to delete users (e.g., admin role)
    // This is a basic check, you might need more robust permission handling
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
         return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền thực hiện thao tác này'
        });
    }

    const userId = req.params.id;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Xóa người dùng thành công',
        user: deletedUser // Optionally return deleted user info
    });
});

// Multer config for avatar upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPG, JPEG, PNG allowed'));
    }
});

exports.uploadAvatar = [
    upload.single('avatar'),
    controllerHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            // Xóa file vừa upload nếu user không tồn tại
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Xóa avatar cũ nếu có
        if (user.avatar && user.avatar.startsWith('/uploads/')) {
            const oldPath = path.join(__dirname, '../../', user.avatar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        user.avatar = `/uploads/${req.file.filename}`;
        await user.save();
        res.status(200).json({ success: true, avatar: user.avatar });
    })
];

// Gửi OTP
exports.sendOtp = controllerHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  // Nếu email đã đăng ký thì không gửi OTP nữa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email đã được đăng ký, vui lòng dùng email khác.' });
  }

  // Sinh OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

  // Lưu vào DB (ghi đè nếu đã có)
  await OtpToken.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  // Gửi email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.CONTACT_EMAIL_USER,
    to: email,
    subject: 'Mã OTP xác thực đăng ký',
    text: `Mã OTP của bạn là: ${otp} (có hiệu lực 5 phút)`
  });

  res.json({ success: true, message: 'OTP sent' });
});

// Xác thực OTP
exports.verifyOtp = controllerHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

  const record = await OtpToken.findOne({ email, otp });
  if (!record) return res.status(400).json({ success: false, message: 'OTP không đúng' });
  if (record.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'OTP đã hết hạn' });

  // Xóa OTP sau khi xác thực thành công
  await OtpToken.deleteOne({ email, otp });

  res.json({ success: true, message: 'OTP verified' });
});

// Quên mật khẩu
exports.forgotPassword = controllerHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  // Kiểm tra email có tồn tại không
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'Email không tồn tại trong hệ thống' });
  }

  // Sinh OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

  // Lưu vào DB (ghi đè nếu đã có)
  await OtpToken.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  // Gửi email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.CONTACT_EMAIL_USER,
    to: email,
    subject: 'Mã OTP đặt lại mật khẩu',
    text: `Mã OTP của bạn là: ${otp} (có hiệu lực 5 phút)`
  });

  res.json({ success: true, message: 'OTP đã được gửi đến email của bạn' });
});

// Reset mật khẩu
exports.resetPassword = controllerHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email, OTP và mật khẩu mới là bắt buộc' 
    });
  }

  // Kiểm tra OTP
  const record = await OtpToken.findOne({ email, otp });
  if (!record) {
    return res.status(400).json({ success: false, message: 'OTP không đúng' });
  }
  if (record.expiresAt < new Date()) {
    return res.status(400).json({ success: false, message: 'OTP đã hết hạn' });
  }

  // Tìm user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }

  // Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Xóa OTP sau khi đặt lại mật khẩu thành công
  await OtpToken.deleteOne({ email, otp });

  res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
});
