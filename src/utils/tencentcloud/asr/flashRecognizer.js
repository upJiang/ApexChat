import axios from "axios";
import CryptoJS from "crypto-js";

import NewCredential from "../common/credential";

class FlashRecognizer {
	constructor(params) {
		this.appid = params.appid || "";
		this.secretid = params.secretid || "";
		this.secretkey = params.secretkey || "";
		this.query = {
			...params,
		};
		this.OnError = function () {};
	}
	// 拼接鉴权数据
	getUrl() {
		if (!this.appid || !this.secretid) {
			console.log("请确认是否填入appid和secretid");
			return false;
		}
		const asr = new NewCredential(this.query);
		return asr.getSignStr();
	}
	// 签名函数示例
	signCallback(signStr) {
		// 创建 HmacSHA1 哈希
		const hash = CryptoJS.HmacSHA1(signStr, this.secretkey || "");

		// 获取 base64 编码的结果
		const result = CryptoJS.enc.Base64.stringify(hash);

		return result;
	}
	doRequest(url, data, headers, callback) {
		axios.post(url, headers, data, function (error, response, body) {
			/**
			 * `.request` 的请求回调
			 * @callback requestCallback
			 * @param {Error} error 请求错误
			 * @param {Object} response 请求响应
			 * @param {String} body API 请求结果
			 */
			callback(error, response, body);
		});
	}
	recognize(videoData, callback) {
		const signStr = this.getUrl();
		const headers = {};
		if (!signStr) {
			console.log("鉴权失败");
			return;
		}
		headers["Authorization"] = this.signCallback(signStr);
		headers["Host"] = "asr.cloud.tencent.com";
		const url = `https://${signStr.substring(4, signStr.length)}`;
		this.doRequest(url, videoData, headers, callback);
	}
}

export default FlashRecognizer;
