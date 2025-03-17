import type {
	AxiosProgressEvent,
	AxiosResponse,
	GenericAbortSignal,
} from "axios";

import { useAuthStore } from "@/store";

import request from "./axios";

export interface HttpOption {
	url: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: any;
	method?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headers?: any;
	onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
	signal?: GenericAbortSignal;
	beforeRequest?: () => void;
	afterRequest?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Response<T = any> {
	data: T;
	message: string | null;
	status: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function http<T = any>({
	url,
	data,
	method,
	headers,
	onDownloadProgress,
	signal,
	beforeRequest,
	afterRequest,
}: HttpOption) {
	const successHandler = (res: AxiosResponse<Response<T>>) => {
		const authStore = useAuthStore();

		if (res.data.status === "Success" || typeof res.data === "string")
			return res.data;

		if (res.data.status === "Unauthorized") {
			authStore.removeToken();
			window.location.reload();
		}

		return Promise.reject(res.data);
	};

	const failHandler = (error: Response<Error>) => {
		afterRequest?.();
		throw new Error(error?.message || "Error");
	};

	beforeRequest?.();

	method = method || "GET";

	const params = Object.assign(
		typeof data === "function" ? data() : data ?? {},
		{},
	);

	return method === "GET"
		? request
				.get(url, { params, signal, onDownloadProgress })
				.then(successHandler, failHandler)
		: request
				.post(url, params, { headers, signal, onDownloadProgress })
				.then(successHandler, failHandler);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get<T = any>({
	url,
	data,
	method = "GET",
	onDownloadProgress,
	signal,
	beforeRequest,
	afterRequest,
}: HttpOption): Promise<Response<T>> {
	return http<T>({
		url,
		method,
		data,
		onDownloadProgress,
		signal,
		beforeRequest,
		afterRequest,
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function post<T = any>({
	url,
	data,
	method = "POST",
	headers,
	onDownloadProgress,
	signal,
	beforeRequest,
	afterRequest,
}: HttpOption): Promise<Response<T>> {
	return http<T>({
		url,
		method,
		data,
		headers,
		onDownloadProgress,
		signal,
		beforeRequest,
		afterRequest,
	});
}

export default post;
