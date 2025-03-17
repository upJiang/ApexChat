import { ref } from "vue";

export const useModel = () => {
	const modelImage = ref<File | undefined | null>();
	const garmentImage = ref<File | undefined | null>();
	return { modelImage, garmentImage };
};

export type Model = ReturnType<typeof useModel>;
