<template>
	<HeaderComponent onlyMenuShow v-if="isMobile" />
	<div class="main-container" style="margin-top: 40px">
		<div class="login-title">
			<span class="text">个人信息</span>
		</div>

		<n-form
			label-placement="left"
			label-width="80"
			class="form-container user-info-container"
			ref="formRef"
			:model="model.formState"
			:rules="model.rules"
		>
			<n-form-item path="mobile" label="头像 :" class="user-form-item">
				<n-upload
					:key="model.uploadKey.value"
					accept="image/jpeg, image/jpg, image/png"
					:max="1"
					:default-file-list="model.formState.avatorList"
					list-type="image-card"
					:custom-request="presenter.handleAvatorUpload"
					@before-upload="presenter.handleBeforeUpload"
				>
					点击上传
				</n-upload>
			</n-form-item>
			<n-form-item path="mobile" label="用户名  :" class="user-form-item">
				<n-space>
					<n-input
						style="width: 160px"
						v-model:value.trim="model.formState.userName"
						placeholder="请输入新用户名"
					/>
					<n-button
						@click="presenter.handleNameModify"
						type="primary"
						:loading="model.saveNameLoading.value"
					>
						保存
					</n-button>
				</n-space>
			</n-form-item>
			<n-form-item path="mobile" label="手机号 :" class="user-form-item">
				<n-space style="align-items: center">
					<span>{{ model.userInfo.value.userPhoneNumber }}</span>
					<n-text
						@click="presenter.handleMobileModify"
						type="primary"
						size="small"
						style="cursor: pointer"
					>
						修改
					</n-text>
				</n-space>
			</n-form-item>
			<n-form-item path="mobile" label="积分 :" class="user-form-item">
				<n-space style="align-items: center">
					<span>
						{{ model.integralInfo.value?.userIntegralInfo?.score || 0 }}
					</span>
					<n-text
						type="primary"
						style="cursor: pointer"
						@click="presenter.handleScoreRecharge"
					>
						积分充值
					</n-text>
					<n-text
						type="primary"
						style="cursor: pointer"
						@click="presenter.handleScoreRecord"
					>
						积分历史
					</n-text>
				</n-space>
			</n-form-item>
		</n-form>
	</div>
</template>

<script lang="ts" setup>
import { useBasicLayout } from "@/hooks/useBasicLayout";
import HeaderComponent from "@/views/chat/components/Header/index.vue";

import { usePresenter } from "./presenter";

const { isMobile } = useBasicLayout();

const presenter = usePresenter();
const { model } = presenter;
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>
