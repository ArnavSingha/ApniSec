import { NextRequest } from 'next/server';
import { AuthController } from '@/lib/modules/auth/AuthController';

const authController = new AuthController();

/**
 * API endpoint to handle forgot password requests.
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function POST(req: NextRequest) {
  return authController.forgotPassword(req);
}
