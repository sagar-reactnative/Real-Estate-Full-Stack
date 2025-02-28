export interface ApiResponse<T> {
    data?: T;
    statusCode: number;
    infoMessage?: string;
    errorMessages?: string[];
}
