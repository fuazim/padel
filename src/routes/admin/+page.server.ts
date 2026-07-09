import { query } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Fetch all bookings
        const bookingsResult = await query("SELECT * FROM bookings ORDER BY created_at DESC");
        const bookings = bookingsResult.map(b => ({
            id: b.id,
            name: b.member_name,
            court: b.court_name,
            date: b.booking_date,
            time: b.booking_time,
            amount: b.amount,
            status: b.status,
            code: b.code,
            addons: b.addons || []
        }));

        // Fetch counts
        const membersCountResult = await query("SELECT COUNT(*) as count FROM members WHERE role != 'admin' OR role IS NULL");
        const membersCount = parseInt(membersCountResult[0].count || '0');

        const newsletterCountResult = await query("SELECT COUNT(*) as count FROM newsletter_emails");
        const newsletterCount = parseInt(newsletterCountResult[0].count || '0');

        // Fetch newsletter list
        const newsletterSubsResult = await query("SELECT * FROM newsletter_emails ORDER BY id DESC");
        const newsletterSubs = newsletterSubsResult.map(n => ({
            id: n.id,
            email: n.email,
            date: n.subscribed_date
        }));

        // Fetch members list
        const membersResult = await query("SELECT * FROM members WHERE role != 'admin' OR role IS NULL ORDER BY id DESC");
        const members = membersResult.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone,
            membershipTier: m.membership_tier,
            memberExpiry: m.member_expiry,
            role: m.role
        }));

        return {
            bookings,
            members,
            membersCount,
            newsletterCount,
            newsletterSubs,
            dbSuccess: true
        };
    } catch (_) {
        return {
            bookings: null,
            members: null,
            membersCount: 0,
            newsletterCount: 0,
            newsletterSubs: null,
            dbSuccess: false
        };
    }
};
