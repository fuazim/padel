import { createAuthClient } from '@neondatabase/auth';
import { env } from '$env/dynamic/public';

const authUrl = env.PUBLIC_NEON_AUTH_URL || 'https://ep-jolly-thunder-ao7btucd.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth';

// Neon Auth createAuthClient accepts the baseURL string directly
export const auth = createAuthClient(authUrl);
