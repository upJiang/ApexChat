import { FileInfo } from "naive-ui/es/upload/src/interface";
import { computed, reactive, ref } from "vue";

import { useUserStore } from "@/store";
import { useIntegralStore } from "@/store/modules/integral";

export const useModel = () => {
	const userStore = useUserStore();

	const userInfo = computed(() => userStore.userInfo);
	const integralInfo = computed(() => useIntegralStore());

	const formState = reactive({
		avatorList: [] as FileInfo[], // 头像
		userName: "", // 用户名
		mobile: "", // 手机号
		integral: 0, // 积分
	});

	// 正在编辑修改用户名
	const isNameModify = ref(false);
	const saveNameLoading = ref(false);
	// 正在编辑修改手机号
	const isMobileModify = ref(true);

	const rules = {
		email: {
			required: true,
			message: "请输入邮箱",
			trigger: "change",
		},
		smsCode: {
			required: true,
			message: "请输入验证码",
			trigger: "change",
		},
		password: {
			required: true,
			message: "请输入您设置的账号密码",
			trigger: ["change"],
		},
	};

	const uploadKey = ref(0);

	// 退出登录加载
	const logoutLoading = ref(false);

	return {
		formState,
		rules,
		isNameModify,
		isMobileModify,
		userInfo,
		saveNameLoading,
		logoutLoading,
		uploadKey,
		integralInfo,
	};
};

export type Model = ReturnType<typeof useModel>;
