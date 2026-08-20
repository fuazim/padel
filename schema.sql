-- ==============================================================================
-- Padel Club & Sports Booking System - Database Schema & Seed Script
-- Compatible with PostgreSQL, Neon Serverless, Supabase, and Railway
-- ==============================================================================

-- 1. COURTS TABLE
CREATE TABLE IF NOT EXISTS courts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    desc_id TEXT,
    desc_en TEXT,
    price INT NOT NULL DEFAULT 0,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    member_name VARCHAR(255) NOT NULL,
    court_name VARCHAR(255) NOT NULL,
    booking_date VARCHAR(50) NOT NULL,
    booking_time VARCHAR(50) NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Paid',
    code VARCHAR(50) NOT NULL,
    addons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MEMBERS TABLE
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    membership_tier VARCHAR(50) DEFAULT 'Basic',
    member_expiry VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MEMBERSHIP PLANS TABLE
CREATE TABLE IF NOT EXISTS membership_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    price_en VARCHAR(50) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    features_en JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE,
    badge VARCHAR(50),
    badge_en VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS newsletter_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_date VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Courts
INSERT INTO courts (id, name, type, desc_id, desc_en, price, image)
VALUES 
    ('court-1', 'Court Alpha (Indoor)', 'Indoor', 'Lapangan indoor ber-AC dengan karpet khusus World Padel Tour, minim terpaan angin dan pencahayaan optimal.', 'Air-conditioned indoor court with World Padel Tour carpet, minimal wind disturbance and optimal lighting.', 180000, '/images/images/lesson-card.webp'),
    ('court-2', 'Court Beta (Outdoor)', 'Outdoor', 'Lapangan outdoor premium dengan sirkulasi udara alami yang segar. Nikmati sensasi bermain padel di bawah langit terbuka.', 'Premium outdoor court with fresh natural air. Enjoy the sensation of playing padel under the open sky.', 130000, '/images/images/practice-card.webp'),
    ('court-3', 'Court Arena (Championship)', 'Indoor/Pro', 'Lapangan utama untuk turnamen, dilengkapi tribun penonton mini, sistem video-replay, dan pencahayaan profesional.', 'Main tournament court equipped with a mini spectator stand, video-replay system, and professional lighting.', 220000, '/images/images/hero-image.webp')
ON CONFLICT (id) DO NOTHING;

-- Seed Membership Plans
INSERT INTO membership_plans (id, name, price, price_en, features, features_en, is_popular, badge, badge_en)
VALUES
    ('basic', 'Basic Member', 'Rp 450.000', '$30', '["Akses booking 7 hari sebelumnya", "Diskon 10% sewa raket & bola", "Akses ruang ganti & shower premium", "Komunitas grup WhatsApp"]'::jsonb, '["7-day advance court booking", "10% discount on racket & ball rental", "Access to premium locker & showers", "Exclusive WhatsApp community"]'::jsonb, false, null, null),
    ('premium', 'Pro Player', 'Rp 850.000', '$55', '["Akses booking 14 hari sebelumnya", "Diskon 25% sewa raket & coaching", "1x sesi coaching privat per bulan", "Prioritas slot jam prime-time", "Free towel & locker khusus"]'::jsonb, '["14-day advance court booking", "25% discount on racket & coaching", "1x monthly private coaching session", "Priority prime-time slot booking", "Free towel & dedicated locker"]'::jsonb, true, 'PALING POPULER', 'MOST POPULAR'),
    ('elite', 'VIP Club', 'Rp 1.500.000', '$99', '["Akses booking tanpa batas waktu", "Unlimited free towel & rental kit", "3x sesi coaching privat per bulan", "Akses VIP lounge & sauna", "Undangan turnamen eksklusif"]'::jsonb, '["Unlimited booking window", "Unlimited free towel & rental kit", "3x monthly private coaching session", "Access to VIP lounge & sauna", "Exclusive tournament invitations"]'::jsonb, false, 'VIP EXCLUSIVE', 'VIP EXCLUSIVE')
ON CONFLICT (id) DO NOTHING;

-- Seed Admin & Demo Members
INSERT INTO members (name, email, phone, membership_tier, member_expiry, role)
VALUES 
    ('Admin Manager', 'admin@padelclub.com', '+62 812-3456-7890', 'VIP Club', '2027-12-31', 'admin'),
    ('Kevin Sanjaya', 'kevin@example.com', '+62 811-2233-4455', 'Pro Player', '2026-11-20', 'user'),
    ('Ayu Rahmawati', 'ayu@example.com', '+62 813-9988-7766', 'Basic Member', '2026-09-15', 'user')
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Bookings
INSERT INTO bookings (id, member_name, court_name, booking_date, booking_time, amount, status, code, addons)
VALUES 
    ('BK-84920', 'Kevin Sanjaya', 'Court Alpha (Indoor)', 'Today', '19:00 - 20:00', 180000, 'Paid', 'PADEL-84920', '["Racket Rental"]'::jsonb),
    ('BK-73911', 'Ayu Rahmawati', 'Court Beta (Outdoor)', 'Today', '17:00 - 18:00', 130000, 'Paid', 'PADEL-73911', '[]'::jsonb),
    ('BK-62840', 'Michael Surya', 'Court Arena (Championship)', 'Tomorrow', '20:00 - 21:00', 220000, 'Pending', 'PADEL-62840', '["Ball Can (3pcs)", "Coach Assistance"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
