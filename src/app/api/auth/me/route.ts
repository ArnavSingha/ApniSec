import { NextRequest } from 'next/server';
import { AuthController } from '@/lib/modules/auth/AuthController';

const authController = new AuthController();

/**
 * API endpoint to get the current authenticated user's data.
 * @param req - The NextRequest object.
 * @returns A NextResponse object with the user's data.
 */
export async function GET(req: NextRequest) {
  return authController.getCurrentUser(req);
}
