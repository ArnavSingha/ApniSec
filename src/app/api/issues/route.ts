import { NextRequest } from 'next/server';
import { IssueController } from '@/lib/modules/issues/IssueController';

const issueController = new IssueController();

/**
 * API endpoint to create a new issue.
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function POST(req: NextRequest) {
  return issueController.create(req);
}

/**
 * API endpoint to get all issues for the authenticated user.
 * Supports filtering by type via query parameter (e.g., /api/issues?type=VAPT).
 * @param req - The NextRequest object.
 * @returns A NextResponse object.
 */
export async function GET(req: NextRequest) {
  return issueController.getAll(req);
}
