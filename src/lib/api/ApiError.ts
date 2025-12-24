export class ApiError extends Error {
    public success: false = false;

    constructor(
        public statusCode: number,
        message: string = "Something went wrong",
        public errors: string[] = []
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
