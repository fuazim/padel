import { query } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const courtsResult = await query("SELECT * FROM courts ORDER BY id ASC");
        const courts = courtsResult.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            desc: c.desc_id || c.desc,
            descEN: c.desc_en,
            price: c.price,
            image: c.image
        }));
        return { courts, dbSuccess: true };
    } catch (_) {
        return { courts: null, dbSuccess: false };
    }
};

export const actions: Actions = {
    addCourt: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const name = data.get('name') as string;
        const type = data.get('type') as string;
        const price = parseInt(data.get('price') as string || '0');
        const desc = data.get('desc') as string;
        const descEN = data.get('descEN') as string;
        const image = data.get('image') as string || '/images/images/lesson-card.webp';

        try {
            await query(
                `INSERT INTO courts (id, name, type, desc_id, desc_en, price, image) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id, name, type, desc, descEN, price, image]
            );
            return { success: true };
        } catch (e) {
            console.error("Action error adding court:", e);
            return { success: false, error: "Failed to add court" };
        }
    },
    updateCourt: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const name = data.get('name') as string;
        const type = data.get('type') as string;
        const price = parseInt(data.get('price') as string || '0');
        const desc = data.get('desc') as string;
        const descEN = data.get('descEN') as string;

        try {
            await query(
                `UPDATE courts SET name = $1, type = $2, price = $3, desc_id = $4, desc_en = $5 
                 WHERE id = $6`,
                [name, type, price, desc, descEN, id]
            );
            return { success: true };
        } catch (e) {
            console.error("Action error updating court:", e);
            return { success: false, error: "Failed to update court" };
        }
    },
    deleteCourt: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        try {
            await query("DELETE FROM courts WHERE id = $1", [id]);
            return { success: true };
        } catch (e) {
            console.error("Action error deleting court:", e);
            return { success: false, error: "Failed to delete court" };
        }
    }
};
