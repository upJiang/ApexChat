import vue from "@vitejs/plugin-vue";
import path from "path";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import type { PluginOption } from "vite";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

function setupPlugins(env: ImportMetaEnv): PluginOption[] {
	return [
		vue(),
		Components({
			resolvers: [NaiveUiResolver()],
		}),
		env.VITE_GLOB_APP_PWA === "true" &&
			VitePWA({
				injectRegister: "auto",
				manifest: {
					name: "chatGPT",
					short_name: "chatGPT",
					icons: [
						{ src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
						{ src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
					],
				},
			}),
	];
}

export default defineConfig((env) => {
	const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv;

	return {
		resolve: {
			alias: {
				"@": path.resolve(process.cwd(), "src"),
			},
		},
		plugins: setupPlugins(viteEnv),
		server: {
			host: "0.0.0.0",
			port: 8600,
			open: false,
			proxy: {
				"/api": "https://zyai.tech", // http://120.46.76.233
				"/gptservice": "https://zyai.tech",
				"/v1": "https://api.gptgod.online",
			},
		},
		build: {
			reportCompressedSize: false,
			sourcemap: false,
			commonjsOptions: {
				ignoreTryCatch: false,
			},
		},
	};
});
