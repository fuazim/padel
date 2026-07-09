import { query } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const plansResult = await query("SELECT * FROM membership_plans ORDER BY id ASC");
        const plans = plansResult.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            priceEN: p.price_en,
            features: p.features || [],
            featuresEN: p.features_en || [],
            isPopular: p.is_popular,
            badge: p.badge,
            badgeEN: p.badge_en
        }));
        return { plans, dbSuccess: true };
    } catch (_) {
        return { plans: null, dbSuccess: false };
    }
};

export const actions: Actions = {
    addPlan: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const name = data.get('name') as string;
        const price = data.get('price') as string;
        const priceEN = data.get('priceEN') as string;
        const isPopular = data.get('isPopular') === 'true';
        const badge = data.get('badge') as string || null;
        const badgeEN = data.get('badgeEN') as string || null;
        
        let features: string[] = [];
        let featuresEN: string[] = [];
        try {
            features = JSON.parse(data.get('features') as string || '[]');
            featuresEN = JSON.parse(data.get('featuresEN') as string || '[]');
        } catch (_) {}

        try {
            await query(
                `INSERT INTO membership_plans (id, name, price, price_en, features, features_en, is_popular, badge, badge_en) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [id, name, price, priceEN, features, featuresEN, isPopular, badge, badgeEN]
            );
            return { success: true };
        } catch (e) {
            console.error("Action error adding plan:", e);
            return { success: false, error: "Failed to add plan" };
        }
    },
    updatePlan: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const name = data.get('name') as string;
        const price = data.get('price') as string;
        const priceEN = data.get('priceEN') as string;
        const isPopular = data.get('isPopular') === 'true';
        const badge = data.get('badge') as string || null;
        const badgeEN = data.get('badgeEN') as string || null;

        let features: string[] = [];
        let featuresEN: string[] = [];
        try {
            features = JSON.parse(data.get('features') as string || '[]');
            featuresEN = JSON.parse(data.get('featuresEN') as string || '[]');
        } catch (_) {}

        try {
            await query(
                `UPDATE membership_plans SET name = $1, price = $2, price_en = $3, features = $4, features_en = $5, 
                 is_popular = $6, badge = $7, badge_en = $8 WHERE id = $9`,
                [name, price, priceEN, features, featuresEN, isPopular, badge, badgeEN, id]
            );
            return { success: true };
        } catch (e) {
            console.error("Action error updating plan:", e);
            return { success: false, error: "Failed to update plan" };
        }
    },
    deletePlan: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        try {
            await query("DELETE FROM membership_plans WHERE id = $1", [id]);
            return { success: true };
        } catch (e) {
            console.error("Action error deleting plan:", e);
            return { success: false, error: "Failed to delete plan" };
        }
    }
};
