import { Client } from "@gradio/client";
import {
	UploadCustomRequestOptions,
	UploadFileInfo,
	useMessage,
} from "naive-ui";
import { onMounted } from "vue";

import { useModel } from "./model";
import Service from "./service";

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);

	const message = useMessage();
	const handleBeforeUpload = (data: {
		file: UploadFileInfo;
		fileList: UploadFileInfo[];
	}) => {
		if (Number(data.file.file?.size || 0) > 4294967295) {
			message.error("请上传大小低于 2M 的图片");
			return false;
		}
		if (
			data.file.file?.type !== "image/png" &&
			data.file.file?.type !== "image/jpg" &&
			data.file.file?.type !== "image/jpeg"
		) {
			message.error("请上传 png/jpg/jpeg 格式的图片");
			return false;
		}
		return true;
	};

	const handleModelUpload = ({ file }: UploadCustomRequestOptions) => {
		model.modelImage.value = file!.file;
	};

	const handleGarmentUpload = ({ file }: UploadCustomRequestOptions) => {
		model.garmentImage.value = file!.file;
	};

	const handleOnSubmit = async () => {
		// const response_0 = await fetch(
		// 	"https://rlawjdghek-stableviton.hf.space/file=/tmp/gradio/c84f635b555b72dc10863a1b23857422376f648a/1.jpg",
		// );
		// const response_1 = await fetch(
		// 	"https://rlawjdghek-stableviton.hf.space/file=/tmp/gradio/959dd02d3ae6fe10ef7c420ec314ed880e4459ed/1.jpg",
		// );
		// const exampleImage0 = await response_0.blob();
		// const exampleImage1 = await response_1.blob();
		// console.log(exampleImage0, exampleImage1);

		const app = await Client.connect("rlawjdghek/StableVITON");
		console.log("app", app);
		console.log("model.modelImage.value[0]", model.modelImage.value);
		console.log("model.garmentImage.value[0]", model.garmentImage.value);

		const result = await app.predict("/process_hd", [
			model.modelImage.value, // blob in 'Model' Image component
			model.garmentImage.value, // blob in 'Garment' Image component
			10, // number (numeric value between 10 and 50) in 'Steps' Slider component
			true, // boolean  in 'customized model' Checkbox component
		]);
		console.log(result);
	};

	onMounted(async () => {});
	return {
		model,
		service,
		handleBeforeUpload,
		handleOnSubmit,
		handleModelUpload,
		handleGarmentUpload,
	};
};
