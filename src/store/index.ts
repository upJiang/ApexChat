import piniaPersist from "pinia-plugin-persist";
import type { App } from "vue";

import { store } from "./helper";

export function setupStore(app: App) {
	store.use(piniaPersist);
	app.use(store);
}

export * from "./homeStore";
export * from "./modules";
