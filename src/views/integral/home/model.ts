import { ref } from "vue";
import { useRoute } from "vue-router";

export const useModel = () => {
	const route = useRoute();
	const currentTab = ref((route.query.tab as string) || "RulesAndBug");
	console.log("currentTab", currentTab);

	return {
		currentTab,
	};
};

export type Model = ReturnType<typeof useModel>;
