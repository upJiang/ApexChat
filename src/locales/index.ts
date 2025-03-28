import type { App } from "vue";
import { createI18n } from "vue-i18n";

import { useAppStoreWithOut } from "@/store/modules/app";
import type { Language } from "@/store/modules/app/helper";

import enUS from "./en-US";
import frFr from "./fr-FR";
import koKR from "./ko-KR";
import ruRU from "./ru-RU";
import trTr from "./tr-TR";
import viVn from "./vi-VN";
import zhCN from "./zh-CN";
import zhTW from "./zh-TW";

const appStore = useAppStoreWithOut();

const defaultLocale = appStore.language || "zh-CN";

const i18n = createI18n({
	locale: defaultLocale,
	fallbackLocale: "en-US",
	allowComposition: true,
	messages: {
		"en-US": enUS,
		"ko-KR": koKR,
		"zh-CN": zhCN,
		"zh-TW": zhTW,
		"ru-RU": ruRU,
		"vi-VN": viVn,
		"fr-FR": frFr,
		"tr-TR": trTr,
	},
});

export const t = i18n.global.t;

export function setLocale(locale: Language) {
	i18n.global.locale = locale;
}

export function setupI18n(app: App) {
	app.use(i18n);
}

export default i18n;
