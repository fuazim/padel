import { getSessionUser } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const user = await getSessionUser(cookies);
    
    // Server-side logs for diagnostics
    console.log("ADMIN LAYOUT LOAD: Resolved user on server:", user);

    return {
        adminUser: user
    };
};
