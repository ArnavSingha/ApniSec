
import { NextRequest } from 'next/server';
import { IssueController } from '@/lib/modules/issues/IssueController';

const issueController = new IssueController();

/**
 * API endpoint to get a single issue by ID.
 * @param req - The NextRequest object.
 * @param params - The route parameters, containing the issue ID.
 * @returns A NextResponse object.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return issueController.getById(req, id);
}

/**
 * API endpoint to update an issue.
 * @param req - The NextRequest object.
 * @param params - The route parameters, containing the issue ID.
 * @returns A NextResponse object.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return issueController.update(req, id);
}

/**
 * API endpoint to delete an issue.
 * @param req - The NextRequest object.
 * @param params - The route parameters, containing the issue ID.
 * @returns A NextResponse object.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return issueController.delete(req, id);
}
