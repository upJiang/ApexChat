import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: "",
	}),
	actions: {
		// 设置 token 的 action
		setToken(newToken: string) {
			this.token = newToken;
			localStorage.setItem("token", newToken);
		},
	},
});
