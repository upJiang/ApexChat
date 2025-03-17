<template>
	<n-modal
		v-model:show="modalShow"
		style="width: 90%; max-width: 500px"
		:on-update:show="handleCancel"
		preset="card"
	>
		<slide-verify
			:imgs="[img1]"
			class="silde_box"
			ref="block"
			slider-text="向右滑动"
			:accuracy="8"
			@again="onAgain"
			@success="onSuccess"
			@fail="onFail"
		/>
	</n-modal>
</template>

<script lang="ts" setup>
import "vue3-slide-verify/dist/style.css"; //引入滑动验证组件样式

import { getCurrentInstance, ref, watch } from "vue";
import SlideVerify from "vue3-slide-verify";

import { useEncrypt } from "@/hooks/useEncryptor";
import { message } from "@/hooks/useNaiveUIProvider";

import img1 from "./imgs/1.png";
import { usePresenter } from "./presenter";

const presenter = usePresenter();
const { model } = presenter;

//引入滑动验证组件
interface IProps {
	visible: boolean;
}

const props = defineProps<IProps>();

const modalShow = ref(false);
watch(
	() => props.visible,
	(n) => {
		if (n) {
			modalShow.value = true;
			block.value?.refresh();
			model.verifyCode.value = "";
			presenter.service.getVerifyCode();
		}
	},
);

const block = ref();

const instanse = getCurrentInstance();

const onAgain = () => {
	// 刷新
	block.value?.refresh();
};
//成功的回调
const onSuccess = async () => {
	if (!model.verifyCode.value) {
		return message.warning("发送验证码失败");
	}
	modalShow.value = false;
	const encrypt = await useEncrypt(model.verifyCode.value);
	instanse?.emit("success", encrypt);
};

const handleCancel = () => {
	modalShow.value = false;
	instanse?.emit("cancel");
};
//失败的回调
const onFail = () => {
	// 刷新
	block.value?.refresh();
};
</script>
<style scoped>
.silde_box {
	margin: 0 auto;
	overscroll-behavior: contain;
}
</style>
