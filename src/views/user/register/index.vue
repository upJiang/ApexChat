<template>
	<HeaderComponent onlyMenuShow v-if="isMobile" />
	<div class="main-container" :style="isMobile ? 'margin-top: 50px;' : ''">
		<div class="login-title">
			<span class="text">欢迎使用ApexChat</span>
		</div>
		<div class="tips-container">请填写以下内容</div>
		<n-tabs
			animated
			v-model:value="model.currentTab.value"
			class="tab-container"
			:on-update:value="presenter.handleTabChange"
		>
			<n-tab-pane name="login" tab="登录" />
			<n-tab-pane name="register" tab="注册" />
		</n-tabs>
		<n-form
			class="form-container"
			ref="formRef"
			:model="model.formState"
			:rules="model.rules"
		>
			<n-form-item path="userPhoneNumber" class="form-item">
				<n-input
					size="large"
					v-model:value.trim="model.formState.userPhoneNumber"
					placeholder="请输入手机号"
				/>
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
					placeholder="请输入您的登录密码"
					type="password"
					show-password-on="click"
				/>
			</n-form-item>
			<n-form-item path="password2" class="form-item">
				<n-input
					size="large"
					v-model:value.trim="model.formState.password2"
					placeholder="请再次输入您的登录密码"
					type="password"
					show-password-on="click"
				/>
			</n-form-item>
			<n-form-item class="form-item">
				<n-input
					size="large"
					v-model:value.trim="model.formState.inviteUserId"
					placeholder="邀请码(非必填)"
				/>
			</n-form-item>

			<n-form-item class="form-item">
				<n-button
					size="large"
					type="primary"
					class="submit-btn"
					attr-type="button"
					@click="handleOnSubmit"
					:loading="model.submitLoading.value"
				>
					注册并登录
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

<style lang="less">
@import url("../index.less");
</style>
