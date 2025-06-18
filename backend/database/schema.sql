-- Create database if not exists
CREATE DATABASE IF NOT EXISTS northern_pakistan_travels;
USE northern_pakistan_travels;

-- Tours table (main table)
CREATE TABLE IF NOT EXISTS tours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    season ENUM('spring', 'summer', 'autumn', 'winter') NOT NULL,
    difficulty ENUM('easy', 'moderate', 'challenging') NOT NULL,
    highlights TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (simplified)
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    tour_id INT NOT NULL,
    booking_date DATE NOT NULL,
    number_of_people INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id)
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample tour data
INSERT INTO tours (name, description, duration, price, image_url, season, difficulty, highlights) VALUES
('Hunza Valley Explorer', 'Experience the beauty of Hunza Valley with its stunning landscapes and rich culture.', '7 Days', 45000.00, './images/hunza.jpg', 'summer', 'moderate', '["Visit Karimabad and Altit Fort", "Experience local culture", "Enjoy panoramic mountain views", "Visit Attabad Lake"]'),
('Naran Kaghan Adventure', 'Discover the scenic beauty of Naran and Kaghan valleys.', '5 Days', 35000.00, './images/naran.jpg', 'summer', 'moderate', '["Visit Lake Saiful Muluk", "Explore Lulusar Lake", "Experience local cuisine", "Enjoy mountain trekking"]'),
('Skardu Paradise', 'Explore the wonders of Skardu and its surrounding areas.', '8 Days', 55000.00, './images/skardu.jpg', 'summer', 'challenging', '["Visit Shangrila Resort", "Explore Kachura Lake", "Experience Deosai Plains", "Visit Khaplu Fort"]'); 