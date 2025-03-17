import { createParser } from "eventsource-parser";

import { checkLoginShow } from "@/hooks/useShowLogin";

import { fetch as globalFetch } from "./fetch";
import { streamAsyncIterable } from "./stream-async-iterable";
import * as types from "./types";

export class ChatGPTError2 extends types.ChatGPTError {
	reason?: string;
}
export async function fetchSSE(
	url: string,
	options: Parameters<typeof fetch>[1] & {
		onMessage: (data: string) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError?: (error: any) => void;
	},
	fetch: types.FetchFn = globalFetch,
) {
	const { onMessage, onError, ...fetchOptions } = options;
	let res;

	try {
		res = await fetch(url, fetchOptions);
		console.log(res, "res");
		if (res.status === 401) {
			checkLoginShow(true);
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		console.log("失败", e);

		throw {
			reason: JSON.stringify({
				message: "fetch error, pleace check url",
				url,
				code: "fetch_error",
			}),
		};
	}
	if (!res.ok) {
		let reason: string;

		try {
			reason = await res.text();
		} catch (err) {
			reason = res.statusText;
		}

		const msg = `ChatGPT error ${res.status}: ${reason}`;
		const error = new ChatGPTError2(msg, { cause: res });
		error.statusCode = res.status;
		error.statusText = res.statusText;
		error.reason = reason;
		throw error;
	}

	const parser = createParser((event) => {
		if (event.type === "event") {
			onMessage(event.data);
		}
	});

	// handle special response errors
	const feed = (chunk: string) => {
		console.log("chunk", chunk);

		let response = null;

		try {
			response = JSON.parse(chunk);
		} catch {
			// ignore
		}
		if (response?.code === 500) {
			if (onError) {
				onError(response?.msg || "");
			} else {
				console.error(error);
			}
		}
		if (response?.detail?.type === "invalid_request_error") {
			const msg = `ChatGPT error ${response.detail.message}: ${response.detail.code} (${response.detail.type})`;
			const error = new types.ChatGPTError(msg, { cause: response });
			error.statusCode = response.detail.code;
			error.statusText = response.detail.message;

			if (onError) {
				onError(error);
			} else {
				console.error(error);
			}

			// don't feed to the event parser
			return;
		}

		parser.feed(chunk);
	};

	if (!res?.body?.getReader) {
		// Vercel polyfills `fetch` with `node-fetch`, which doesn't conform to
		// web standards, so this is a workaround...
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const body: NodeJS.ReadableStream = res.body as any;
		console.log("body,", body);

		if (!body.on || !body.read) {
			throw new types.ChatGPTError('unsupported "fetch" implementation');
		}

		body.on("readable", () => {
			let chunk: string | Buffer;
			while (null !== (chunk = body.read())) {
				feed(chunk.toString());
			}
		});
	} else {
		for await (const chunk of streamAsyncIterable(res.body)) {
			const str = new TextDecoder().decode(chunk);
			//console.log(str );
			feed(str);
		}
	}
}
