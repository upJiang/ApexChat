//本地存储使用了
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const localSave = async (key: string, value: any) => {
	await localforage.setItem(key, value);
};
//本地存储获取
export const localGet = async (key: string) => {
	return await localforage.getItem(key);
};
