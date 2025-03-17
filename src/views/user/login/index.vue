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
			<n-form-item
				path="userPassword"
				v-if="!model.loginType.value"
				class="form-item"
			>
				<n-input
					size="large"
					v-model:value.trim="model.formState.userPassword"
					placeholder="请输入您的登录密码"
					type="password"
					show-password-on="click"
				/>
			</n-form-item>
			<n-form-item
				path="valiedateCode"
				class="form-item"
				v-if="model.loginType.value"
			>
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

			<!-- 注册,忘记密码 -->
			<div class="tips-container">
				<div class="tips-left">
					<n-button
						text
						class="tips-oprate"
						@click="presenter.handleOnForgetPassword"
					>
						忘记密码
					</n-button>
				</div>
				<div class="tips-right">
					<n-button
						color="#18a058"
						text
						class="tips-oprate"
						@click="presenter.handleOnLoginTypeChange"
					>
						{{ model.loginType.value ? "密码登录" : "验证码登录" }}
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
					登录
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

const formRef = ref<FormInst | null>(null);
const handleOnSubmit = (e: MouseEvent) => {
	e.preventDefault();
	formRef.value?.validate((errors) => {
		if (!errors) {
			presenter.handleOnSubmit();
		}
	});
};

const { isMobile } = useBasicLayout();

const presenter = usePresenter();
const { model } = presenter;
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
