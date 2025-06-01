const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

// Cấu hình transporter cho Gmail (cần thay đổi user, pass bằng tài khoản thật hoặc biến môi trường)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CONTACT_EMAIL_USER || 'contact@gmail.com',
    pass: process.env.CONTACT_EMAIL_PASS || 'yourpassword'
  }
});

// POST /api/contact
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const newMessage = await ContactMessage.create({ name, email, subject, message });
    // Đã tắt gửi email cho admin
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/contact (admin only)
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PATCH /api/contact/:id/reply (admin/teacher reply)
exports.replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const { id } = req.params;
    if (!reply) {
      return res.status(400).json({ success: false, message: 'Reply is required.' });
    }
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    message.reply = reply;
    message.repliedAt = new Date();
    await message.save();

    // Gửi email phản hồi cho khách hàng
    await transporter.sendMail({
      from: process.env.CONTACT_EMAIL_USER || 'contact@gmail.com',
      to: message.email,
      subject: `Reply to your contact: ${message.subject}`,
      text: `Dear ${message.name},\n\nYour message: ${message.message}\n\nAdmin reply: ${reply}\n\nBest regards,\nSupport Team`
    });

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/contact/:id (admin/teacher)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}; 