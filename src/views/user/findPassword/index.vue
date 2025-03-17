<template>
	<HeaderComponent onlyMenuShow v-if="isMobile" />
	<div class="main-container" :style="isMobile ? 'margin-top: 50px;' : ''">
		<div class="login-title">
			<span class="text">欢迎使用ApexChat</span>
		</div>
		<div class="tips-container">请填写以下内容</div>
		<div class="fomr-title-container">忘记密码</div>
		<n-form
			class="form-container"
			ref="formRef"
			:model="model.formState"
			:rules="model.rules"
		>
			<n-form-item path="userPhoneNumber" class="form-item">
				<n-input
					size="large"
					v-if="!model.userInfo.value?.isLogin"
					placeholder="请输入手机号"
					v-model:value.trim="model.formState.userPhoneNumber"
				/>
				<span v-else>{{ model.userInfo.value?.userPhoneNumber }}</span>
			</n-form-item>
			<n-form-item path="valiedateCode" class="form-item">
				<n-input
					size="large"
					v-model:value.trim="model.formState.valiedateCode"
					placeholder="请输入短信验证码"
				/>
				<n-button
					size="large"
					class="get-code-btn"
					@click="presenter.handleGetSmsCode"
				>
					{{
						presenter.inCodeSend.value
							? presenter.seconds.value + "s"
							: "获取验证码"
					}}
				</n-button>
			</n-form-item>
			<n-form-item path="password1" class="form-item">
				<n-input
					size="large"
					v-model:value.trim="model.formState.password1"
					placeholder="请输入您新的登录密码"
					type="password"
					show-password-on="click"
				/>
			</n-form-item>
			<n-form-item path="password2" class="form-item">
				<n-input
					size="large"
					v-model:value.trim="model.formState.password2"
					placeholder="请再次输入您新的登录密码"
					type="password"
					show-password-on="click"
				/>
			</n-form-item>

			<div class="tips-container" v-if="!model.userInfo.value?.isLogin">
				<div class="tips-left"></div>
				<div class="tips-right">
					<n-button
						text
						class="tips-oprate"
						@click="presenter.handleRebackLogin"
					>
						返回登录
					</n-button>
				</div>
			</div>

			<n-form-item class="form-item">
				<n-button
					size="large"
					type="primary"
					class="submit-btn"
					attr-type="button"
					@click="handleOnSubmit"
					:loading="model.submitLoading.value"
				>
					提交
				</n-button>
			</n-form-item>
		</n-form>
	</div>

	<slide-verify
		v-model:visible="model.slideVerifyVisible.value"
		@cancel="model.slideVerifyVisible.value = false"
		@success="presenter.handleSlideVerifySuccess"
	/>
</template>

<script lang="ts" setup>
import { FormInst } from "naive-ui";
import { ref } from "vue";

import { useBasicLayout } from "@/hooks/useBasicLayout";
import HeaderComponent from "@/views/chat/components/Header/index.vue";

import SlideVerify from "../components/SlideVerify/index.vue";
import { usePresenter } from "./presenter";

const { isMobile } = useBasicLayout();

const formRef = ref<FormInst | null>(null);
const handleOnSubmit = (e: MouseEvent) => {
	e.preventDefault();
	formRef.value?.validate((errors) => {
		if (!errors) {
			presenter.handleOnSubmit();
		}
	});
};

const presenter = usePresenter();
const { model } = presenter;
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
