<template>
	<n-upload
		accept="image/jpeg, image/jpg, image/png"
		:max="1"
		list-type="image-card"
		@before-upload="presenter.handleBeforeUpload"
		:custom-request="presenter.handleModelUpload"
	>
		点击上传1
	</n-upload>
	<n-upload
		accept="image/jpeg, image/jpg, image/png"
		:max="1"
		list-type="image-card"
		@before-upload="presenter.handleBeforeUpload"
		:custom-request="presenter.handleGarmentUpload"
	>
		点击上传2
	</n-upload>
	<n-button @click="presenter.handleOnSubmit">提交</n-button>
</template>

<script lang="ts" setup>
import { usePresenter } from "./presenter";

const presenter = usePresenter();
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
