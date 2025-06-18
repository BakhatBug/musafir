const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

// Get all contact messages (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const [messages] = await pool.query(`
            SELECT * FROM contact_messages
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages'
        });
    }
});

// Create new contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const [result] = await pool.query(
            `INSERT INTO contact_messages 
            (name, email, phone, subject, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'unread', NOW())`,
            [name, email, phone, subject, message]
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message'
        });
    }
});

// Update message status (admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body;

        const [result] = await pool.query(
            `UPDATE contact_messages 
            SET status = ?, updated_at = NOW()
            WHERE id = ?`,
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message status updated successfully'
        });
    } catch (error) {
        console.error('Update message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating message status'
        });
    }
});

// Delete message (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM contact_messages WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting message'
        });
    }
});

module.exports = router; 