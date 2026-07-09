import { query } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    try {
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

        const plansResult = await query("SELECT * FROM membership_plans ORDER BY id ASC");
        const plans = plansResult.map(p => ({
            id: p.id,
            name: p.name
        }));

        return { members, plans, dbSuccess: true };
    } catch (_) {
        return { members: null, plans: null, dbSuccess: false };
    }
};

export const actions: Actions = {
    updateTier: async ({ request }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string || '0');
        const tier = data.get('tier') as string;

        try {
            await query("UPDATE members SET membership_tier = $1 WHERE id = $2", [tier, id]);
            return { success: true };
        } catch (e) {
            console.error("Action error updating member tier:", e);
            return { success: false, error: "Failed to update tier" };
        }
    },
    deleteMember: async ({ request }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id') as string || '0');

        try {
            await query("DELETE FROM members WHERE id = $1", [id]);
            return { success: true };
        } catch (e) {
            console.error("Action error deleting member:", e);
            return { success: false, error: "Failed to delete member" };
        }
    }
};
