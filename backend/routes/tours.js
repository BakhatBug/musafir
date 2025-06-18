const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { protect, authorize } = require('../middleware/auth');

// Get all tours
router.get('/', async (req, res) => {
    try {
        const [tours] = await pool.query(`
            SELECT t.*, 
                   GROUP_CONCAT(DISTINCT ti.day_number, ':', ti.title, ':', ti.description) as itinerary
            FROM tour_packages t
            LEFT JOIN tour_itinerary ti ON t.id = ti.tour_id
            GROUP BY t.id
        `);

        // Format itinerary data
        const formattedTours = tours.map(tour => ({
            ...tour,
            itinerary: tour.itinerary ? tour.itinerary.split(',').map(day => {
                const [dayNum, title, desc] = day.split(':');
                return { day_number: dayNum, title, description: desc };
            }) : []
        }));

        res.json({
            success: true,
            count: formattedTours.length,
            data: formattedTours
        });
    } catch (error) {
        console.error('Get tours error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tours'
        });
    }
});

// Get single tour
router.get('/:id', async (req, res) => {
    try {
        const [tours] = await pool.query(`
            SELECT t.*, 
                   GROUP_CONCAT(DISTINCT ti.day_number, ':', ti.title, ':', ti.description) as itinerary
            FROM tour_packages t
            LEFT JOIN tour_itinerary ti ON t.id = ti.tour_id
            WHERE t.id = ?
            GROUP BY t.id
        `, [req.params.id]);

        if (tours.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        const tour = tours[0];
        tour.itinerary = tour.itinerary ? tour.itinerary.split(',').map(day => {
            const [dayNum, title, desc] = day.split(':');
            return { day_number: dayNum, title, description: desc };
        }) : [];

        res.json({
            success: true,
            data: tour
        });
    } catch (error) {
        console.error('Get tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tour'
        });
    }
});

// Create new tour (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const {
            name,
            description,
            duration,
            price,
            max_group_size,
            difficulty_level,
            season,
            image_url
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO tour_packages 
            (name, description, duration, price, max_group_size, difficulty_level, season, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, duration, price, max_group_size, difficulty_level, season, image_url]
        );

        res.status(201).json({
            success: true,
            message: 'Tour created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating tour'
        });
    }
});

// Update tour (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const {
            name,
            description,
            duration,
            price,
            max_group_size,
            difficulty_level,
            season,
            image_url
        } = req.body;

        const [result] = await pool.query(
            `UPDATE tour_packages 
            SET name = ?, description = ?, duration = ?, price = ?, 
                max_group_size = ?, difficulty_level = ?, season = ?, image_url = ?
            WHERE id = ?`,
            [name, description, duration, price, max_group_size, difficulty_level, season, image_url, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        res.json({
            success: true,
            message: 'Tour updated successfully'
        });
    } catch (error) {
        console.error('Update tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating tour'
        });
    }
});

// Delete tour (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM tour_packages WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }

        res.json({
            success: true,
            message: 'Tour deleted successfully'
        });
    } catch (error) {
        console.error('Delete tour error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting tour'
        });
    }
});

module.exports = router; 