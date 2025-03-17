import {
	UploadCustomRequestOptions,
	UploadFileInfo,
	useMessage,
} from "naive-ui";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useChatStore } from "@/store";
import { useUserStore } from "@/store/modules/user/index";
import { base64ToFile, fileToBase64 } from "@/utils/transform";

import { useModel } from "./model";
import Service from "./service";

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);
	const router = useRouter();

	const message = useMessage();

	const userStore = useUserStore();
	const chatStore = useChatStore();

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

	// 修改头像
	const handleAvatorUpload = async ({ file }: UploadCustomRequestOptions) => {
		const newUserHead = await fileToBase64(file.file);
		await userStore.handleUpdateUserInfo({
			userHead: newUserHead,
			updateType: 0,
		});
		message.success("头像修改成功");
	};

	// 修改用户名
	const handleNameModify = async () => {
		if (!model.formState.userName.trim()) {
			return message.error("请输入用户名");
		}
		try {
			model.saveNameLoading.value = true;
			await userStore.handleUpdateUserInfo({
				userName: model.formState.userName,
				updateType: 0,
			});
			model.isNameModify.value = false;
			message.success("用户名修改成功");
		} finally {
			model.saveNameLoading.value = false;
		}
	};

	// 找回密码
	const handleFindPassword = () => {
		router.replace("/findPassword");
	};

	// 修改手机号
	const handleMobileModify = () => {
		router.replace("/mobileModify");
	};

	// 取消
	const handleOnCancel = () => {
		router.go(-1);
	};

	// 退出登录
	const handleLogout = async () => {
		try {
			model.logoutLoading.value = true;
			await service.onLogout();
			message.success("退出登录成功");
			userStore.resetUserInfo();
			router.replace("/chat/" + chatStore.active ?? "1002");
		} finally {
			model.logoutLoading.value = false;
		}
	};

	// 积分充值
	const handleScoreRecharge = () => {
		router.replace("/integral/home?tab=RulesAndBug");
	};

	// 积分记录
	const handleScoreRecord = () => {
		router.replace("/integral/home?tab=UseHistory");
	};

	onMounted(() => {
		if (model.userInfo.value.userHead) {
			model.formState.avatorList = [
				{
					id: 1,
					name: "11",
					status: "finished",
					batchId: 1,
					file: base64ToFile(model.userInfo.value.userHead),
					type: "image/jpeg",
				},

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			] as any;
			model.uploadKey.value++;
		}

		model.formState.userName = model.userInfo.value?.userName || "";
	});

	return {
		model,
		service,
		handleFindPassword,
		handleMobileModify,
		handleNameModify,
		handleLogout,
		handleAvatorUpload,
		handleBeforeUpload,
		handleScoreRecharge,
		handleScoreRecord,
		handleOnCancel,
	};
};
