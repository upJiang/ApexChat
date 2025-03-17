import { reactive } from "vue";

const state = reactive<{
	modalType: string;
}>({
	modalType: "login",
});

export const useStore = () => {
	return state;
};

export type Store = ReturnType<typeof useStore>;
