const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/gallery');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE || 5242880 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Get all gallery images
router.get('/', async (req, res) => {
    try {
        const [images] = await pool.query(`
            SELECT * FROM gallery
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery images'
        });
    }
});

// Get images by category
router.get('/category/:category', async (req, res) => {
    try {
        const [images] = await pool.query(
            'SELECT * FROM gallery WHERE category = ? ORDER BY created_at DESC',
            [req.params.category]
        );

        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        console.error('Get category images error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category images'
        });
    }
});

// Upload new image (admin only)
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        const { title, description, category } = req.body;
        const image_url = `/uploads/gallery/${req.file.filename}`;

        const [result] = await pool.query(
            `INSERT INTO gallery 
            (title, description, image_url, category, created_at)
            VALUES (?, ?, ?, ?, NOW())`,
            [title, description, image_url, category]
        );

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                id: result.insertId,
                title,
                description,
                image_url,
                category
            }
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image'
        });
    }
});

// Update image details (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const [result] = await pool.query(
            `UPDATE gallery 
            SET title = ?, description = ?, category = ?
            WHERE id = ?`,
            [title, description, category, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            message: 'Image details updated successfully'
        });
    } catch (error) {
        console.error('Update image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating image details'
        });
    }
});

// Delete image (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        // Get image details before deletion
        const [images] = await pool.query(
            'SELECT image_url FROM gallery WHERE id = ?',
            [req.params.id]
        );

        if (images.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete image from database
        await pool.query(
            'DELETE FROM gallery WHERE id = ?',
            [req.params.id]
        );

        // TODO: Delete image file from server
        // const imagePath = path.join(__dirname, '..', images[0].image_url);
        // fs.unlinkSync(imagePath);

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting image'
        });
    }
});

module.exports = router; 