import { query } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const courts = await query('SELECT * FROM courts ORDER BY id ASC');
        const mappedCourts = courts.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            desc: c.desc_id || c.desc,
            descEN: c.desc_en,
            price: c.price,
            image: c.image
        }));
        return {
            dbCourts: mappedCourts,
            dbSuccess: true
        };
    } catch (_) {
        return {
            dbCourts: null,
            dbSuccess: false
        };
    }
};

export const actions: Actions = {
    createBooking: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const memberName = data.get('memberName') as string;
        const courtName = data.get('courtName') as string;
        const date = data.get('date') as string;
        const time = data.get('time') as string;
        const amount = parseInt(data.get('amount') as string || '0');
        const code = data.get('code') as string;
        const status = data.get('status') as string || 'Paid';
        const addonsRaw = data.get('addons') as string || '[]';
        
        let addons: string[] = [];
        try {
            addons = JSON.parse(addonsRaw);
        } catch (_) {
            addons = [];
        }

        try {
            await query(
                `INSERT INTO bookings (id, member_name, court_name, booking_date, booking_time, amount, status, code, addons) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [id, memberName, courtName, date, time, amount, status, code, addons]
            );
            return { success: true };
        } catch (err) {
            console.error("Action error saving booking:", err);
            return { success: false, error: "Database save failed" };
        }
    }
};
