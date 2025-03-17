// 暴露可以在非js中使用的Naive组件,https://www.naiveui.com/zh-CN/os-theme/components/discrete
import {
	ConfigProviderProps,
	createDiscreteApi,
	darkTheme,
	lightTheme,
} from "naive-ui";
import { computed, ref } from "vue";

const themeRef = ref<"light" | "dark">("light");

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
	theme: themeRef.value === "light" ? lightTheme : darkTheme,
}));
export const { message } = createDiscreteApi(["message"], {
	configProviderProps: configProviderPropsRef,
});
