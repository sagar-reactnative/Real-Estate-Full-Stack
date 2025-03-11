import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import notification from './notification';
import { ApiResponse } from '@/models/api-response.model';

const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL
});

axiosInstance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (axios.isCancel(error)) {
            window.console.log('Request canceled', error.message);
        }

        return Promise.reject(error);
    }
);

const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T | null> => {
    try {
        const response = await axiosInstance.get<ApiResponse<T>>(url, config);

        if (!response || !response.data || !response.data.success) {
            notification(response?.data?.message ?? `Error while fetching ${url}`, 'error');
            return null;
        }

        return response.data.data;
    } catch (error) {
        const message = (error as AxiosError<ApiResponse<T>>).response?.data?.message;

        notification(message ?? `Error while fetching ${url}`, 'error');
        return null;
    }
};

export { get };
