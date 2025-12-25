
import { NextRequest } from 'next/server';
import { IssueController } from '@/lib/modules/issues/IssueController';

const issueController = new IssueController();

/**
 * API endpoint to get a single issue by ID.
 * @param req - The NextRequest object.
 * @param params - The route parameters, containing the issue ID.
 * @returns A NextResponse object.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return issueController.getById(req, params.id);
}

/**
 * API endpoint to update an issue.
 * @param req - The NextRequest object.
 * @param params - The route parameters, containing the issue ID.
 * @returns A NextResponse object.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return issueController.update(req, params.id);
}

/**
 * API endpoint to delete an issue.
 * @param req - The NextRequest object.
 * @param params - The route parameters, containing the issue ID.
 * @returns A NextResponse object.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return issueController.delete(req, params.id);
}
