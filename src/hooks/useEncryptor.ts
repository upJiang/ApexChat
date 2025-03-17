import JSEncrypt from "jsencrypt";

const VITE_APP_ENCRYPTOR_KEY = import.meta.env.VITE_APP_ENCRYPTOR_KEY;

// 加密
export const useEncrypt = (str: string) => {
	const encryptor = new JSEncrypt();
	encryptor.setPublicKey(VITE_APP_ENCRYPTOR_KEY);

	return encryptor.encrypt(str) || "";
};
