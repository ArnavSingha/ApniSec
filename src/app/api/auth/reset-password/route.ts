import { NextRequest } from 'next/server';
import { AuthController } from '@/lib/modules/auth/AuthController';

const authController = new AuthController();

/**
 * API endpoint to handle the actual password reset.
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function POST(req: NextRequest) {
  return authController.resetPassword(req);
}
