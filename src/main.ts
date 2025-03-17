import { createApp } from "vue";

import App from "./App.vue";
import { setupI18n } from "./locales";
import { setupAssets, setupScrollbarStyle } from "./plugins";
import { setupRouter } from "./router";
import { setupStore } from "./store";

async function bootstrap() {
	const app = createApp(App);
	setupStore(app);
	setupAssets();

	setupScrollbarStyle();

	setupI18n(app);

	await setupRouter(app);

	app.mount("#app");
}

bootstrap();
