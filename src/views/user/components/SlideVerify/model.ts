import { ref } from "vue";

export const useModel = () => {
	const verifyCode = ref("");
	return { verifyCode };
};

export type Model = ReturnType<typeof useModel>;
