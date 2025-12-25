import { NextRequest } from 'next/server';
import { UserController } from '@/lib/modules/users/UserController';

const userController = new UserController();

/**
 * API endpoint to get the current user's profile.
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function GET(req: NextRequest) {
  return userController.getProfile(req);
}

/**
 * API endpoint to update the current user's profile.
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function PUT(req: NextRequest) {
  return userController.updateProfile(req);
}
