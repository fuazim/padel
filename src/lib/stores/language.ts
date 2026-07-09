import { writable } from 'svelte/store';

export type Language = 'id' | 'en';

// Create a writable store with default language as Indonesian
export const currentLanguage = writable<Language>('id');

// Translations for the entire website
export const translations = {
    id: {
        // Navbar
        nav: {
            about: 'Tentang Kami',
            services: 'Program & Layanan',
            membership: 'Membership',
            testimonials: 'Testimoni',
            bookNow: 'Booking Sekarang',
        },
        // Hero
        hero: {
            badge: 'Premium Padel Club',
            title: 'Rasakan Sensasi Bermain Padel di Fasilitas Terbaik',
            subtitle: 'Bergabunglah dengan komunitas padel terbaik di Indonesia. Fasilitas kelas dunia, pelatih profesional, dan pengalaman bermain yang tak terlupakan.',
            cta: 'Mulai Bermain',
            learnMore: 'Pelajari Lebih Lanjut',
        },
        // About
        about: {
            badge: 'Tentang Kami',
            title: 'Padel Club Premium Pertama di Jakarta',
            description: 'Kami hadir untuk menghadirkan pengalaman bermain padel terbaik dengan fasilitas modern dan standar internasional.',
            stat1Title: 'Lapangan Premium',
            stat2Title: 'Member Aktif',
            stat3Title: 'Pelatih Bersertifikat',
            stat4Title: 'Tahun Pengalaman',
        },
        // Services
        services: {
            badge: 'Program & Layanan',
            title: 'Layanan Lengkap untuk Semua Level',
            subtitle: 'Dari pemula hingga profesional, kami menyediakan program yang sesuai dengan kebutuhan Anda.',
            courtRental: 'Sewa Lapangan',
            courtRentalDesc: 'Lapangan premium dengan standar internasional',
            coaching: 'Pelatihan Privat',
            coachingDesc: 'Pelatih bersertifikat untuk semua level',
            tournament: 'Turnamen',
            tournamentDesc: 'Kompetisi reguler untuk mengasah kemampuan',
            equipment: 'Peralatan',
            equipmentDesc: 'Penyewaan dan penjualan peralatan premium',
        },
        // Membership
        membership: {
            badge: 'Membership',
            title: 'Pilih Paket yang Sesuai',
            subtitle: 'Nikmati berbagai keuntungan menjadi member Padel Club.',
            basic: 'Basic',
            premium: 'Premium',
            elite: 'Elite',
            perMonth: '/bulan',
            popular: 'Populer',
            selectPlan: 'Pilih Paket',
        },
        // Testimonials
        testimonials: {
            badge: 'Testimoni',
            title: 'Apa Kata Member Kami',
            subtitle: 'Dengarkan pengalaman langsung dari komunitas kami.',
        },
        // FAQ
        faq: {
            badge: 'FAQ',
            title: 'Pertanyaan yang Sering Diajukan',
            subtitle: 'Temukan jawaban untuk pertanyaan umum tentang layanan kami.',
            moreQuestions: 'Masih ada pertanyaan lain?',
            contactUs: 'Hubungi Kami',
        },
        // CTA
        cta: {
            badge: 'Bergabung Sekarang',
            title: 'Siap Memulai Perjalanan Padel Anda?',
            subtitle: 'Daftar sekarang dan dapatkan penawaran eksklusif untuk member baru.',
            placeholder: 'Masukkan email Anda',
            subscribe: 'Daftar',
        },
        // Footer
        footer: {
            description: 'Klub padel premium dengan fasilitas kelas dunia dan komunitas yang bersemangat.',
            quickLinks: 'Link Cepat',
            services: 'Layanan',
            contact: 'Kontak',
            rights: 'Hak cipta dilindungi.',
        },
    },
    en: {
        // Navbar
        nav: {
            about: 'About Us',
            services: 'Programs & Services',
            membership: 'Membership',
            testimonials: 'Testimonials',
            bookNow: 'Book Now',
        },
        // Hero
        hero: {
            badge: 'Premium Padel Club',
            title: 'Experience the Thrill of Playing Padel at the Best Facilities',
            subtitle: 'Join the best padel community in Indonesia. World-class facilities, professional coaches, and an unforgettable playing experience.',
            cta: 'Start Playing',
            learnMore: 'Learn More',
        },
        // About
        about: {
            badge: 'About Us',
            title: 'The First Premium Padel Club in Jakarta',
            description: 'We are here to provide the best padel playing experience with modern facilities and international standards.',
            stat1Title: 'Premium Courts',
            stat2Title: 'Active Members',
            stat3Title: 'Certified Coaches',
            stat4Title: 'Years of Experience',
        },
        // Services
        services: {
            badge: 'Programs & Services',
            title: 'Complete Services for All Levels',
            subtitle: 'From beginners to professionals, we provide programs tailored to your needs.',
            courtRental: 'Court Rental',
            courtRentalDesc: 'Premium courts with international standards',
            coaching: 'Private Coaching',
            coachingDesc: 'Certified coaches for all levels',
            tournament: 'Tournaments',
            tournamentDesc: 'Regular competitions to sharpen your skills',
            equipment: 'Equipment',
            equipmentDesc: 'Premium equipment rental and sales',
        },
        // Membership
        membership: {
            badge: 'Membership',
            title: 'Choose the Right Package',
            subtitle: 'Enjoy various benefits of being a Padel Club member.',
            basic: 'Basic',
            premium: 'Premium',
            elite: 'Elite',
            perMonth: '/month',
            popular: 'Popular',
            selectPlan: 'Select Plan',
        },
        // Testimonials
        testimonials: {
            badge: 'Testimonials',
            title: 'What Our Members Say',
            subtitle: 'Hear directly from our community.',
        },
        // FAQ
        faq: {
            badge: 'FAQ',
            title: 'Frequently Asked Questions',
            subtitle: 'Find answers to common questions about our services.',
            moreQuestions: 'Still have questions?',
            contactUs: 'Contact Us',
        },
        // CTA
        cta: {
            badge: 'Join Now',
            title: 'Ready to Start Your Padel Journey?',
            subtitle: 'Register now and get exclusive offers for new members.',
            placeholder: 'Enter your email',
            subscribe: 'Subscribe',
        },
        // Footer
        footer: {
            description: 'Premium padel club with world-class facilities and a passionate community.',
            quickLinks: 'Quick Links',
            services: 'Services',
            contact: 'Contact',
            rights: 'All rights reserved.',
        },
    },
};

// Helper function to get translation
export function t(lang: Language, path: string): string {
    const keys = path.split('.');
    let result: any = translations[lang];

    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return path; // Return path if translation not found
        }
    }

    return typeof result === 'string' ? result : path;
}
