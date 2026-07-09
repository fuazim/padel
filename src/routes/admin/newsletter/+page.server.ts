import { query } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const newsletterSubsResult = await query("SELECT * FROM newsletter_emails ORDER BY id DESC");
        const newsletterSubs = newsletterSubsResult.map(n => ({
            id: n.id,
            email: n.email,
            date: n.subscribed_date
        }));
        return { newsletterSubs, dbSuccess: true };
    } catch (_) {
        return { newsletterSubs: null, dbSuccess: false };
    }
};

export const actions: Actions = {
    addEmail: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const date = new Date().toISOString().split("T")[0];

        try {
            await query("INSERT INTO newsletter_emails (email, subscribed_date) VALUES ($1, $2)", [email, date]);
            return { success: true };
        } catch (e) {
            console.error("Action error adding newsletter email:", e);
            return { success: false, error: "Failed to subscribe email" };
        }
    },
    deleteEmail: async ({ request }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string || '0');

        try {
            await query("DELETE FROM newsletter_emails WHERE id = $1", [id]);
            return { success: true };
        } catch (e) {
            console.error("Action error deleting newsletter email:", e);
            return { success: false, error: "Failed to delete email" };
        }
    }
};
