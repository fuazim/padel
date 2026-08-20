/**
 * Centralized Site & Business Configuration
 * 
 * Customize your brand, contact details, operational hours, social media links,
 * and SEO metadata easily in this single file.
 */
export const siteConfig = {
    // Brand & Identity
    name: "Padel Club",
    shortName: "PADEL",
    tagline: {
        id: "Padel Club Premium Pertama di Jakarta",
        en: "The First Premium Padel Club in Jakarta"
    },
    description: {
        id: "Bergabunglah dengan komunitas padel terbaik di Indonesia. Fasilitas kelas dunia, pelatih profesional, dan pengalaman bermain yang tak terlupakan.",
        en: "Join the best padel community in Indonesia. World-class facilities, professional coaches, and an unforgettable playing experience."
    },

    // Contact Information
    contact: {
        phone: "+62 812-3456-7890",
        phoneFormatted: "+62 812 3456 7890",
        email: "info@padelclub.com",
        address: "Jl. Padel Utama No. 45, Jakarta Selatan, Indonesia",
        whatsappUrl: "https://wa.me/6281234567890",
    },

    // Operational Hours
    hours: {
        weekday: "06:00 - 22:00",
        weekend: "06:00 - 23:00",
    },

    // Social Media Links
    social: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        tiktok: "https://tiktok.com",
    },

    // Currency & Formatting
    currency: {
        code: "IDR",
        symbol: "Rp",
        locale: "id-ID"
    },

    // Navigation Links
    navLinks: [
        { href: "/#about", labelID: "Tentang Kami", labelEN: "About Us", id: "about" },
        { href: "/#services", labelID: "Program & Layanan", labelEN: "Programs & Services", id: "services" },
        { href: "/#membership", labelID: "Membership", labelEN: "Membership", id: "membership" },
        { href: "/#testimonials", labelID: "Testimoni", labelEN: "Testimonials", id: "testimonials" },
    ]
};
