import localforage from "localforage";

import { gptServerStore } from "@/store";

localforage.config({
	driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
	name: "mj",
	version: 1.0,
	size: 4980736, // Size of database, in bytes. WebSQL-only for now.
	storeName: "mjkv", // Should be alphanumeric, with underscores.
	description: "some description",
});

export async function saveImg(key: string, value: string) {
	await localforage.setItem(key, value);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getImg(key: string): Promise<any> {
	return await localforage.getItem(key);
}

//本地存储使用了
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const localSave = async (key: string, value: any) => {
	await localforage.setItem(key, value);
};
//本地存储获取
export const localGet = async (key: string) => {
	return await localforage.getItem(key);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const localSaveAny = async (value: any, key?: string) => {
	if (!key) key = `MJ:r:${Date.now()}:${Math.floor(Math.random() * 100)}`;
	await localSave(key, value);
	return key;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function img2base64(img: any) {
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return "";
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL("image/jpeg");
}

export function url2base64More(url: string, key?: string) {
	return new Promise<{ key: string; base64: string }>((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const base64 = img2base64(img);
			localSaveAny(base64, key)
				.then((d) => resolve({ key: d, base64 }))
				.catch((e) => reject(e));
		};
		img.onerror = (e) => reject(e);
		img.src = url;
	});
}

export const url2base64 = async (url: string, key?: string) => {
	try {
		return await url2base64More(url, key);
	} catch (e) {
		return await url2base64More(wsrvUrl(url), key);
	}
};

export const wsrvUrl = (url: string) => {
	if (url.indexOf("attachments") > 0) {
		const arr = url.split("attachments", 2);
		url = "https://cdn.discordapp.com/attachments" + arr[1];
	}
	return `https://wsrv.nl/?url=` + encodeURIComponent(url);
};

export const mjImgUrl = (url: string) => {
	if (gptServerStore.myData.MJ_CDN_WSRV) return wsrvUrl(url);
	return url;
};

export const getMjAll = (ChatState: Chat.ChatState) => {
	const rz: Chat.Chat[] = [];
	ChatState.chat.forEach((v) => {
		// mlog('uid>>', v.uuid );
		v.data.forEach((chat) => {
			if (chat?.mjID) {
				// mlog('MJID>> ',chat?.mjID);
				rz.push(chat);
			}
		});
	});
	return rz;
};
