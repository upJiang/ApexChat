<script setup lang="ts">
import {
	NDialogProvider,
	NLoadingBarProvider,
	NMessageProvider,
	NNotificationProvider,
	useDialog,
	useLoadingBar,
	useMessage,
	useNotification,
} from "naive-ui";
import { defineComponent, h } from "vue";

function registerNaiveTools() {
	window.$loadingBar = useLoadingBar();
	window.$dialog = useDialog();
	window.$message = useMessage();
	window.$notification = useNotification();
}

const NaiveProviderContent = defineComponent({
	name: "NaiveProviderContent",
	setup() {
		registerNaiveTools();
	},
	render() {
		return h("div");
	},
});
</script>

<template>
	<NLoadingBarProvider>
		<NDialogProvider>
			<NNotificationProvider>
				<NMessageProvider>
					<slot></slot>
					<NaiveProviderContent />
				</NMessageProvider>
			</NNotificationProvider>
		</NDialogProvider>
	</NLoadingBarProvider>
</template>
