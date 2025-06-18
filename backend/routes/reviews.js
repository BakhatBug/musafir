const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { protect } = require('../middleware/auth');

// Get all reviews for a tour
router.get('/tour/:tourId', async (req, res) => {
    try {
        const [reviews] = await pool.query(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.tour_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.tourId]);

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews'
        });
    }
});

// Get user's reviews
router.get('/my-reviews', protect, async (req, res) => {
    try {
        const [reviews] = await pool.query(`
            SELECT r.*, t.name as tour_name
            FROM reviews r
            JOIN tour_packages t ON r.tour_id = t.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `, [req.user.id]);

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews'
        });
    }
});

// Create new review
router.post('/', protect, async (req, res) => {
    try {
        const { tour_id, rating, comment } = req.body;

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

        // Check if user has already reviewed this tour
        const [existingReviews] = await pool.query(
            'SELECT * FROM reviews WHERE user_id = ? AND tour_id = ?',
            [req.user.id, tour_id]
        );

        if (existingReviews.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this tour'
            });
        }

        // Create review
        const [result] = await pool.query(
            `INSERT INTO reviews 
            (user_id, tour_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, NOW())`,
            [req.user.id, tour_id, rating, comment]
        );

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review'
        });
    }
});

// Update review
router.put('/:id', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        // Check if review exists and belongs to user
        const [reviews] = await pool.query(
            'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Update review
        await pool.query(
            `UPDATE reviews 
            SET rating = ?, comment = ?, updated_at = NOW()
            WHERE id = ?`,
            [rating, comment, req.params.id]
        );

        res.json({
            success: true,
            message: 'Review updated successfully'
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review'
        });
    }
});

// Delete review
router.delete('/:id', protect, async (req, res) => {
    try {
        // Check if review exists and belongs to user
        const [reviews] = await pool.query(
            'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Delete review
        await pool.query(
            'DELETE FROM reviews WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review'
        });
    }
});

module.exports = router; 