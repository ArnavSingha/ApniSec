import { NextResponse } from 'next/server';
import { ApiError } from './ApiError';

type ResponseData = Record<string, any>;
type ResponseHeaders = Record<string, string>;

export class ApiResponse {
    
    /**
     * Creates a standardized successful API response.
     * @param data - The payload to be sent.
     * @param message - A descriptive message for the response.
     * @returns A NextResponse object for a successful response.
     */
    static success(
        data: ResponseData,
        message: string = "Success",
        statusCode: number = 200,
        headers: ResponseHeaders = {}
    ): NextResponse {
        return NextResponse.json(
            {
                success: true,
                message,
                data,
            },
            { status: statusCode, headers }
        );
    }

    /**
     * Creates a standardized error API response from an ApiError instance.
     * @param error - An instance of ApiError.
     * @returns A NextResponse object for an error response.
     */
    static error(error: ApiError, headers: ResponseHeaders = {}): NextResponse {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
                errors: error.errors.length > 0 ? error.errors : undefined,
            },
            { status: error.statusCode, headers }
        );
    }

    /**
     * Handles generic errors and converts them into a standardized API error response.
     * @param error - The error object, which can be an ApiError or any other error.
     * @returns A NextResponse object for the handled error.
     */
    static handle(error: unknown, headers: ResponseHeaders = {}): NextResponse {
        if (error instanceof ApiError) {
            return ApiResponse.error(error, headers);
        }

        console.error("UNHANDLED_API_ERROR:", error);

        const genericError = new ApiError(500, "Internal Server Error");
        return ApiResponse.error(genericError, headers);
    }
}
