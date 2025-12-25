import { NextResponse } from 'next/server';
import { Database } from '@/lib/core/Database';
import { ApiResponse } from '@/lib/core/ApiResponse';

/**
 * API endpoint to check the health of the database connection.
 * @returns A NextResponse object indicating the connection status.
 */
export async function GET() {
  try {
    console.log('Starting database health check...');
    await Database.getConnection();
    console.log('Database health check successful.');
    return ApiResponse.success({ status: 'ok' }, 'Database connection successful!');
  } catch (error: any) {
    console.error('DATABASE_CONNECTION_HEALTH_CHECK_FAILED:', error);
    // We are not using ApiResponse.handle(error) here because we want to return a specific
    // payload even on failure, rather than the standard error format.
    return NextResponse.json(
        {
            success: false,
            message: 'Database connection failed.',
            error: {
                name: error.name,
                message: error.message,
                reason: error.reason?.toString(), // Mongoose often includes a 'reason' field
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            }
        },
        { status: 500 }
    );
  }
}
