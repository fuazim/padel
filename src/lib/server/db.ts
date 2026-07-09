import { Pool } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

const databaseUrl = env.DATABASE_URL || (typeof process !== 'undefined' ? process.env.DATABASE_URL : '');

// Create connection pool if database connection is configured
export const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;

/**
 * Execute a query on the Neon database using PG Pool client.
 * Throws an error if DATABASE_URL is not configured or query fails.
 */
export async function query(queryString: string, params: any[] = []): Promise<any[]> {
    if (!pool) {
        throw new Error("DATABASE_URL is not configured");
    }
    try {
        const result = await pool.query(queryString, params);
        return result.rows;
    } catch (err) {
        console.error("Database query failed:", err);
        throw err;
    }
}

/**
 * Resolves the logged-in session user and their role from the Neon database.
 */
export async function getSessionUser(cookies: any) {
    const sessionToken = cookies.get('better-auth.session_token');
    if (!sessionToken) return null;

    try {
        const sessionResult = await query(`
            SELECT u.email, u.name
            FROM neon_auth.session s
            JOIN neon_auth.user u ON s."userId" = u.id
            WHERE s.token = $1 AND s."expiresAt" > NOW()
            LIMIT 1
        `, [sessionToken]);

        if (sessionResult.length > 0) {
            const email = sessionResult[0].email;
            const name = sessionResult[0].name;

            // Fetch the role from public.members
            const memberResult = await query(`
                SELECT role FROM public.members WHERE email = $1 LIMIT 1
            `, [email]);

            const role = memberResult.length > 0 ? memberResult[0].role : 'user';

            return {
                email,
                name,
                role
            };
        }
    } catch (e) {
        console.error("Error verifying session token on server:", e);
    }
    return null;
}
