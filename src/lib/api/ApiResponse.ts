export class ApiResponse {
    public success: true = true;
    constructor(
        public data: any,
        public message: string = "Success",
    ) {}
}
