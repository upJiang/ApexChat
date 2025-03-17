import { computed } from "vue";

import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useModelStore } from "@/store/modelStore";

export const useModel = () => {
	const { isMobile } = useBasicLayout();
	const tableData = computed(() => useModelStore().modelList);

	return { tableData, isMobile };
};

export type Model = ReturnType<typeof useModel>;
