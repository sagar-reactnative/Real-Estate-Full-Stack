export interface ApiResponse<T> {
    data: T;
    infoMessage?: string;
    errorMessages?: string[];
}
