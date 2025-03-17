import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { message } from "@/hooks/useNaiveUIProvider";
import { checkLoginShow } from "@/hooks/useShowLogin";

import { getCookie } from "./cookie";

const instance = axios.create({
	timeout: 30 * 1000,
});

interface SimpleKeyValueObject {
	[key: string]: string;
}
const transformFromData = (data: SimpleKeyValueObject) => {
	const formData = new FormData();
	for (const key in data) {
		data[key] && formData.append(key, data[key]);
	}
	return formData;
};

// 请求拦截
instance.interceptors.request.use(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(config: any) => {
		if (config?.data?.formDataRequest) {
			config.data = transformFromData(config.data);
			config.headers["Content-Type"] = "multipart/form-data;charset=utf-8";
		}
		const token = getCookie("access_token");
		config.headers = {
			Authorization: `Bearer ${token}`,
			token: `${token}`,
			"access-token": `${token}`,
			...config.headers,
		};
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// 响应拦截
instance.interceptors.response.use(
	(res) => {
		if (
			res.data.code !== undefined &&
			res.data.code !== 0 &&
			res.data.code !== 200 &&
			!(res.config as AxiosRequestConfig & { skipErrorHandler?: boolean })
				.skipErrorHandler
		) {
			message.error(res.data.msg || res.data.message);
			return Promise.reject(res.data);
		}

		return Promise.resolve(res.data);
	},
	(error: AxiosError<{ code: number; message?: string; msg?: string }>) => {
		const skipErrorHandler = (
			error.config as AxiosRequestConfig & { skipErrorHandler?: boolean }
		).skipErrorHandler;

		if (error.response?.status === 401 && !skipErrorHandler) {
			checkLoginShow(true);
			return Promise.reject(error);
		}
		if (!skipErrorHandler) {
			message.error(
				error.response?.data?.message ||
					error.response?.data?.msg ||
					error.message,
			);
		}
		return Promise.reject(error);
	},
);

type Request = <T = unknown>(
	config: AxiosRequestConfig & { skipErrorHandler?: boolean },
) => Promise<T>;

export const request = instance.request as Request;
