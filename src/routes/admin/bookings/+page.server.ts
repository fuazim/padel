import { query } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    try {
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
        return { bookings, dbSuccess: true };
    } catch (_) {
        return { bookings: null, dbSuccess: false };
    }
};

export const actions: Actions = {
    updateStatus: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const status = data.get('status') as string;

        try {
            await query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);
            return { success: true };
        } catch (e) {
            console.error("Action error updating booking status:", e);
            return { success: false, error: "Failed to update status" };
        }
    },
    deleteBooking: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        try {
            await query("DELETE FROM bookings WHERE id = $1", [id]);
            return { success: true };
        } catch (e) {
            console.error("Action error deleting booking:", e);
            return { success: false, error: "Failed to delete booking" };
        }
    }
};
