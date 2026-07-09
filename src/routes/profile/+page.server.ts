import { query, getSessionUser } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
    const user = await getSessionUser(cookies);
    console.log("PROFILE LOAD: Resolved user on server:", user);

    let profile = null;
    let bookings: any[] = [];
    let plans: any[] = [];

    try {
        const email = user?.email;
        if (email) {
            const membersResult = await query("SELECT * FROM members WHERE email = $1 LIMIT 1", [email]);
            if (membersResult.length > 0) {
                profile = {
                    name: membersResult[0].name,
                    email: membersResult[0].email,
                    phone: membersResult[0].phone,
                    membershipTier: membersResult[0].membership_tier,
                    memberExpiry: membersResult[0].member_expiry
                };
                
                const bookingsResult = await query("SELECT * FROM bookings WHERE member_name = $1 ORDER BY id DESC", [profile.name]);
                bookings = bookingsResult.map(b => ({
                    id: b.id,
                    court: b.court_name,
                    date: b.booking_date,
                    time: b.booking_time,
                    amount: b.amount,
                    status: b.status,
                    code: b.code,
                    addons: b.addons || []
                }));
            }
        }

        const plansResult = await query("SELECT * FROM membership_plans ORDER BY id ASC");
        plans = plansResult.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            priceEN: p.price_en,
            features: p.features || [],
            featuresEN: p.features_en || []
        }));

        return {
            profile,
            bookings: bookings.length > 0 ? bookings : null,
            plans,
            dbSuccess: true
        };
    } catch (_) {
        return {
            profile: null,
            bookings: null,
            plans: null,
            dbSuccess: false
        };
    }
};

export const actions: Actions = {
    getProfile: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;

        try {
            let result = await query("SELECT * FROM members WHERE email = $1 LIMIT 1", [email]);
            if (result.length === 0) {
                const name = email.split('@')[0];
                await query(
                    `INSERT INTO members (name, email, phone, membership_tier, member_expiry, role) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [name, email, '', 'Casual Member', '2027-01-12', (email === 'admin@padel.com' || email === 'admin@padelin.com') ? 'admin' : 'user']
                );
                result = await query("SELECT * FROM members WHERE email = $1 LIMIT 1", [email]);
            }

            if (result.length > 0) {
                return {
                    success: true,
                    profile: {
                        name: result[0].name,
                        email: result[0].email,
                        phone: result[0].phone,
                        membershipTier: result[0].membership_tier,
                        memberExpiry: result[0].member_expiry
                    }
                };
            }
            return { success: false, profile: null };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    },
    updateProfile: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const phone = data.get('phone') as string;
        const email = data.get('email') as string || 'fauzi@example.com';

        try {
            const exists = await query("SELECT id FROM members WHERE email = $1 LIMIT 1", [email]);
            if (exists.length > 0) {
                await query(
                    "UPDATE members SET name = $1, phone = $2 WHERE email = $3",
                    [name, phone, email]
                );
            } else {
                await query(
                    `INSERT INTO members (name, email, phone, membership_tier, member_expiry, role) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [name, email, phone, "Elite Member", "2030-01-12", (email === "admin@padel.com" || email === "admin@padelin.com") ? "admin" : "user"]
                );
            }
            return { success: true };
        } catch (e) {
            console.error("Action error updating profile:", e);
            return { success: false, error: "Failed to update profile" };
        }
    },
    updatePlan: async ({ request }) => {
        const data = await request.formData();
        const planName = data.get('planName') as string;
        const email = data.get('email') as string || 'fauzi@example.com';

        try {
            await query(
                "UPDATE members SET membership_tier = $1 WHERE email = $2",
                [planName, email]
            );
            return { success: true };
        } catch (e) {
            console.error("Action error updating membership plan:", e);
            return { success: false, error: "Failed to update plan" };
        }
    }
};
