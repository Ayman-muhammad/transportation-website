-- ============================
-- TransportCo Database Schema
-- ============================

CREATE DATABASE IF NOT EXISTS transportco_db;
USE transportco_db;

-- ----------------------------
-- Users & Authentication
-- ----------------------------
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer', 'driver', 'admin', 'dispatcher') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- Vehicle Fleet
-- ----------------------------
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year YEAR NOT NULL,
    vehicle_type ENUM('sedan', 'van', 'minibus', 'bus', 'truck') NOT NULL,
    category ENUM('executive', 'standard', 'cargo') NOT NULL,
    capacity INT NOT NULL, -- Number of passengers/seats
    luggage_space VARCHAR(100),
    features JSON, -- Stores features like AC, WiFi, etc.
    status ENUM('available', 'in_use', 'maintenance', 'unavailable') DEFAULT 'available',
    current_location VARCHAR(255),
    last_maintenance DATE,
    next_maintenance DATE,
    daily_rate DECIMAL(10,2),
    per_km_rate DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Drivers
-- ----------------------------
CREATE TABLE drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    years_experience INT,
    status ENUM('available', 'on_trip', 'off_duty', 'sick_leave') DEFAULT 'available',
    current_vehicle_id INT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_trips INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (current_vehicle_id) REFERENCES vehicles(id)
);

-- ----------------------------
-- Service Types
-- ----------------------------
CREATE TABLE service_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_fare DECIMAL(10,2),
    per_km_rate DECIMAL(10,2),
    minimum_fare DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE
);

-- ----------------------------
-- Bookings
-- ----------------------------
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    service_type_id INT NOT NULL,
    vehicle_type_requested ENUM('sedan', 'van', 'minibus', 'bus', 'truck') NOT NULL,
    
    -- Trip Details
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    distance_km DECIMAL(8,2),
    estimated_duration_minutes INT,
    
    -- Timing
    pickup_datetime DATETIME NOT NULL,
    return_datetime DATETIME NULL,
    trip_type ENUM('one_way', 'round_trip', 'hourly') NOT NULL,
    
    -- Passenger & Requirements
    number_of_passengers INT NOT NULL,
    special_requirements TEXT,
    
    -- Pricing
    base_fare DECIMAL(10,2),
    distance_fare DECIMAL(10,2),
    total_fare DECIMAL(10,2),
    payment_status ENUM('pending', 'paid', 'refunded', 'cancelled') DEFAULT 'pending',
    
    -- Assignment
    assigned_vehicle_id INT,
    assigned_driver_id INT,
    
    -- Status
    status ENUM('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (service_type_id) REFERENCES service_types(id),
    FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id)
);

-- ----------------------------
-- Shipments & Cargo Tracking
-- ----------------------------
CREATE TABLE shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(20) NOT NULL,
    sender_address TEXT NOT NULL,
    
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_address TEXT NOT NULL,
    
    -- Package Details
    package_description TEXT NOT NULL,
    package_weight_kg DECIMAL(8,2),
    package_dimensions VARCHAR(100), -- "LxWxH" format
    declared_value DECIMAL(10,2),
    
    -- Service Details
    service_type ENUM('express', 'standard', 'economy') NOT NULL,
    requires_signature BOOLEAN DEFAULT FALSE,
    insurance_required BOOLEAN DEFAULT FALSE,
    
    -- Pricing
    shipping_cost DECIMAL(10,2),
    insurance_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    
    -- Assignment
    assigned_vehicle_id INT,
    assigned_driver_id INT,
    
    -- Status
    current_status ENUM('package_received', 'in_transit', 'out_for_delivery', 'delivered', 'delayed') DEFAULT 'package_received',
    current_location VARCHAR(255),
    
    -- Timestamps
    estimated_delivery DATETIME,
    actual_delivery DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id)
);

-- ----------------------------
-- Shipment Tracking History
-- ----------------------------
CREATE TABLE shipment_tracking_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shipment_id INT NOT NULL,
    status ENUM('package_received', 'in_transit', 'out_for_delivery', 'delivered', 'delayed') NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- ----------------------------
-- Vehicle Tracking (Real-time)
-- ----------------------------
CREATE TABLE vehicle_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    speed_kmh DECIMAL(6,2),
    heading_degrees INT,
    fuel_level DECIMAL(5,2),
    odometer_km DECIMAL(10,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- ----------------------------
-- Payments
-- ----------------------------
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_reference VARCHAR(50) UNIQUE NOT NULL,
    booking_id INT,
    shipment_id INT,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('mpesa', 'card', 'cash', 'bank_transfer') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    mpesa_code VARCHAR(50), -- For M-Pesa transactions
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (shipment_id) REFERENCES shipments(id)
);

-- ----------------------------
-- Contact Form Submissions
-- ----------------------------
CREATE TABLE contact_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Career Applications
-- ----------------------------
CREATE TABLE career_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_reference VARCHAR(50) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(255) NOT NULL,
    experience_years INT,
    cover_letter TEXT,
    resume_path VARCHAR(500), -- Path to uploaded resume
    status ENUM('new', 'reviewed', 'interview', 'rejected', 'hired') DEFAULT 'new',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- Routes & Pricing
-- ----------------------------
CREATE TABLE routes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    distance_km DECIMAL(8,2) NOT NULL,
    estimated_duration_minutes INT NOT NULL,
    base_price_sedan DECIMAL(10,2),
    base_price_van DECIMAL(10,2),
    base_price_minibus DECIMAL(10,2),
    base_price_bus DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================
-- Sample Data
-- ============================

-- Insert sample service types
INSERT INTO service_types (name, description, base_fare, per_km_rate, minimum_fare) VALUES
('Executive Sedan', 'Luxury sedan service with professional driver', 3500.00, 150.00, 3500.00),
('Shuttle Van', 'Comfortable van service for groups', 7200.00, 250.00, 7200.00),
('Minibus', 'Larger vehicle for bigger groups', 12000.00, 450.00, 12000.00),
('Executive Bus', 'Premium bus service with amenities', 25000.00, 800.00, 25000.00),
('Cargo Transport', 'Goods and package delivery service', 5000.00, 300.00, 5000.00);

-- Insert sample vehicles
INSERT INTO vehicles (registration_number, make, model, year, vehicle_type, category, capacity, luggage_space, features, status, daily_rate, per_km_rate) VALUES
('KCA123A', 'Toyota', 'Premio', 2023, 'sedan', 'executive', 4, 'Medium trunk', '{"ac": true, "wifi": true, "entertainment": "Premium audio", "leather_seats": true}', 'available', 15000.00, 150.00),
('KCB456B', 'Toyota', 'Hiace', 2023, 'van', 'standard', 14, 'Large space', '{"ac": true, "wifi": false, "entertainment": "Radio", "charging_ports": true}', 'available', 25000.00, 250.00),
('KCC789C', 'Nissan', 'Civilian', 2023, 'minibus', 'standard', 25, 'Overhead storage', '{"ac": true, "wifi": false, "entertainment": "LCD screens", "reclining_seats": true}', 'available', 40000.00, 450.00),
('KCD012D', 'Mercedes', 'Sprinter', 2023, 'bus', 'executive', 50, 'Large compartment', '{"ac": true, "wifi": true, "entertainment": "LCD screens", "toilet": true, "refreshments": true}', 'available', 75000.00, 800.00);

-- Insert sample routes
INSERT INTO routes (from_location, to_location, distance_km, estimated_duration_minutes, base_price_sedan, base_price_van, base_price_minibus, base_price_bus) VALUES
('Nairobi', 'Mombasa', 485, 480, 3500.00, 7200.00, 12000.00, 25000.00),
('Nairobi', 'Kisumu', 345, 360, 2500.00, 5500.00, 9000.00, 18000.00),
('Nairobi', 'Nakuru', 160, 150, 1500.00, 3200.00, 5500.00, 12000.00),
('Mombasa', 'Malindi', 120, 120, 1200.00, 2500.00, 4000.00, 8000.00);

-- ============================
-- Indexes for Performance
-- ============================
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(current_status);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicle_tracking_vehicle ON vehicle_tracking(vehicle_id);
CREATE INDEX idx_vehicle_tracking_time ON vehicle_tracking(recorded_at);
CREATE INDEX idx_tracking_history_shipment ON shipment_tracking_history(shipment_id);

-- ============================
-- Views for Common Queries
-- ============================

-- View for available vehicles
CREATE VIEW available_vehicles AS
SELECT v.*, d.full_name as driver_name
FROM vehicles v
LEFT JOIN drivers d ON v.id = d.current_vehicle_id
WHERE v.status = 'available';

-- View for booking details
CREATE VIEW booking_details AS
SELECT 
    b.*,
    u.full_name as customer_name,
    u.email as customer_email,
    u.phone as customer_phone,
    s.name as service_name,
    v.registration_number,
    v.make,
    v.model,
    d.full_name as driver_name
FROM bookings b
LEFT JOIN users u ON b.customer_id = u.id
LEFT JOIN service_types s ON b.service_type_id = s.id
LEFT JOIN vehicles v ON b.assigned_vehicle_id = v.id
LEFT JOIN drivers d ON b.assigned_driver_id = d.id;

-- View for shipment tracking
CREATE VIEW shipment_tracking_details AS
SELECT 
    s.*,
    u.full_name as customer_name,
    v.registration_number,
    d.full_name as driver_name,
    sth.status as last_status,
    sth.location as last_location,
    sth.recorded_at as status_time
FROM shipments s
LEFT JOIN users u ON s.customer_id = u.id
LEFT JOIN vehicles v ON s.assigned_vehicle_id = v.id
LEFT JOIN drivers d ON s.assigned_driver_id = d.id
LEFT JOIN (
    SELECT shipment_id, status, location, recorded_at
    FROM shipment_tracking_history
    WHERE (shipment_id, recorded_at) IN (
        SELECT shipment_id, MAX(recorded_at)
        FROM shipment_tracking_history
        GROUP BY shipment_id
    )
) sth ON s.id = sth.shipment_id;