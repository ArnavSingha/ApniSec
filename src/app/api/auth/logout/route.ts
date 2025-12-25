import { AuthController } from '@/lib/modules/auth/AuthController';

const authController = new AuthController();

/**
 * API endpoint to log the user out by clearing the auth cookie.
 * @returns A NextResponse object.
 */
export async function POST() {
  return authController.logout();
}
