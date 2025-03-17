import type { App } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";

import { ChatLayout } from "@/views/chat/layout";
import mjlayout from "@/views/mj/layout.vue";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "Root",
		component: ChatLayout,
		redirect: "/chat",
		children: [
			{
				path: "/chat/:uuid?",
				name: "Chat",
				component: () => import("@/views/chat/index.vue"),
			},
			{
				path: "/integral/home",
				name: "IntegralHome",
				component: () => import("@/views/integral/home/index.vue"),
			},
			{
				path: "/login",
				name: "login",
				component: () => import("@/views/user/login/index.vue"),
			},
			{
				path: "/register",
				name: "register",
				component: () => import("@/views/user/register/index.vue"),
			},
			{
				path: "/mobileModify",
				name: "mobileModify",
				component: () => import("@/views/user/mobileModify/index.vue"),
			},
			{
				path: "/findPassword",
				name: "findPassword",
				component: () => import("@/views/user/findPassword/index.vue"),
			},
			{
				path: "/userInfo",
				name: "userInfo",
				component: () => import("@/views/user/userInfo/index.vue"),
			},
			{
				path: "/creative",
				name: "creative",
				component: () => import("@/views/creative/index/index.vue"),
			},
			{
				path: "/gpts",
				name: "gpts",
				component: () => import("@/views/mj/aiGpts.vue"),
			},
			{
				path: "/gradio",
				name: "gradio",
				component: () => import("@/views/gradio/index/index.vue"),
			},
		],
	},
	{
		path: "/g",
		name: "g",
		component: ChatLayout,
		redirect: "/g/g-2fkFE8rbu",
		children: [
			{
				path: "/g/:gid",
				name: "GPTs",
				component: () => import("@/views/chat/index.vue"),
			},
		],
	},
	{
		path: "/m",
		name: "m",
		component: ChatLayout,
		redirect: "/m/gpt-3.5-turbo",
		children: [
			{
				path: "/m/:gid",
				name: "Model",
				component: () => import("@/views/chat/index.vue"),
			},
		],
	},
	{
		path: "/s",
		name: "s",
		component: ChatLayout,
		redirect: "/s/t",
		children: [
			{
				path: "/s/t",
				name: "Setting",
				component: () => import("@/views/chat/index.vue"),
			},
		],
	},

	{
		path: "/draw",
		name: "Rootdraw",
		component: mjlayout,
		redirect: "/draw/index",
		children: [
			{
				path: "/draw/:uuid?",
				name: "draw",
				component: () => import("@/views/mj/draw.vue"),
			},
		],
	},

	//调试
	// {
	//   path: '/mytest',
	//   name: 'mytest',
	//   component: () => import('@/views/mj/myTest.vue'),
	// },

	{
		path: "/404",
		name: "404",
		component: () => import("@/views/exception/404/index.vue"),
	},

	{
		path: "/500",
		name: "500",
		component: () => import("@/views/exception/500/index.vue"),
	},

	{
		path: "/:pathMatch(.*)*",
		name: "notFound",
		redirect: "/404",
	},
];

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});
// const whiteList = ["/session", "/login", "/register", "/chat"];
// router.beforeEach((to, _from, next) => {
// 	if (!whiteList.indexOf(to.path)) {
// 		next("/login");
// 	} else {
// 		next();
// 	}
// });
// setupPageGuard(router);

export async function setupRouter(app: App) {
	app.use(router);
	await router.isReady();
}
