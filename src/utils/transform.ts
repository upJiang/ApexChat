// 文件流转base64
export const fileToBase64 = (file) => {
	return new Promise<string>((resolve, reject) => {
		if (!file) {
			reject("没有文件");
			return;
		}
		const reader = new FileReader();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		reader.onload = (e: any) => resolve(e.target.result);
		reader.onerror = (e) => reject(e);
		reader.readAsDataURL(file);
	});
};

/**
 * 将Base64编码字符串转换为File对象。
 * @param {string} base64Data Base64编码的字符串。
 * @param {string} filename 文件名。
 * @param {string} [contentType='image/jpeg'] 文件的MIME类型，默认为'image/jpeg'。
 * @returns {File} 返回一个File对象。
 */
export function base64ToFile(
	base64Data,
	filename = "file",
	contentType = "image/jpeg",
) {
	// 分割数据以获取mime类型和纯粹的base64数据
	const parts = base64Data.split(";base64,");
	let rawBase64;
	if (parts.length === 2) {
		contentType = parts[0].split(":")[1];
		rawBase64 = parts[1];
	} else {
		rawBase64 = base64Data;
	}

	// Base64解码
	const byteCharacters = atob(rawBase64);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const byteArrays = [] as any;

	for (let offset = 0; offset < byteCharacters.length; offset += 512) {
		const slice = byteCharacters.slice(offset, offset + 512);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	// 创建Blob对象
	const blob = new Blob(byteArrays, { type: contentType });

	// 创建File对象
	const file = new File([blob], filename, { type: contentType });

	return file;
}

/* 将文件转换为Blob并生成可引用的URL
 * @param file - 要转换的文件
 * @param mimeType - 文件的MIME类型，默认值为'text/javascript'
 * @returns 一个Promise，解析为Blob URL字符串
 */
export function fileToBlobUrl(
	file: File,
	mimeType: string = "text/javascript",
): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = function (event) {
			if (event.target?.result) {
				const fileContent = event.target.result as string;

				// 创建Blob对象
				const blob = new Blob([fileContent], { type: mimeType });

				// 生成可以引用Blob对象的URL
				const url = URL.createObjectURL(blob);

				resolve(url);
			} else {
				reject(new Error("Failed to read file content"));
			}
		};

		reader.onerror = function () {
			reject(new Error("Error reading file"));
		};

		// 读取文件内容为文本
		reader.readAsText(file);
	});
}
