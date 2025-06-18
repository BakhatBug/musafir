const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const [bookings] = await pool.query(`
            SELECT b.*, u.name as user_name, t.name as tour_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN tour_packages t ON b.tour_id = t.id
            ORDER BY b.booking_date DESC
        `);

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
    try {
        const [bookings] = await pool.query(`
            SELECT b.*, t.name as tour_name, t.image_url
            FROM bookings b
            JOIN tour_packages t ON b.tour_id = t.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
        `, [req.user.id]);

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

// Create new booking
router.post('/', protect, async (req, res) => {
    try {
        const { tour_id, number_of_people, total_price } = req.body;

        // Check if tour exists
        const [tours] = await pool.query(
            'SELECT * FROM tour_packages WHERE id = ?',
            [tour_id]
        );

        if (tours.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        // Check if tour is available for the requested number of people
        const tour = tours[0];
        if (number_of_people > tour.max_group_size) {
            return res.status(400).json({
                success: false,
                message: `Maximum group size for this tour is ${tour.max_group_size}`
            });
        }

        // Create booking
        const [result] = await pool.query(
            `INSERT INTO bookings 
            (user_id, tour_id, booking_date, number_of_people, total_price, status, payment_status)
            VALUES (?, ?, NOW(), ?, ?, 'pending', 'pending')`,
            [req.user.id, tour_id, number_of_people, total_price]
        );

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
});

// Update booking status (admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, payment_status } = req.body;

        const [result] = await pool.query(
            `UPDATE bookings 
            SET status = ?, payment_status = ?
            WHERE id = ?`,
            [status, payment_status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully'
        });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking'
        });
    }
});

// Cancel booking
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        // Check if booking exists and belongs to user
        const [bookings] = await pool.query(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = bookings[0];

        // Check if booking can be cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Update booking status
        await pool.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            ['cancelled', req.params.id]
        );

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        });
    }
});

module.exports = router; 