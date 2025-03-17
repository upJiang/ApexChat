<template>
	<div class="search-container">
		<n-form
			class="intergral-history-form-container"
			label-placement="left"
			:model="model.formState"
		>
			<n-space>
				<n-form-item path="source" label="来源">
					<n-select
						v-model:value="model.formState.scoreSourceId"
						placeholder="请选择"
						style="width: 200px"
						:options="model.scoreSourceList"
						clearable
						@change="presenter.handleOnSubmit"
					/>
				</n-form-item>
				<n-form-item>
					<n-button attr-type="button" @click="presenter.handleOnReset">
						重置
					</n-button>
				</n-form-item>
				<n-form-item>
					<n-button
						type="primary"
						attr-type="button"
						@click="presenter.handleOnSubmit"
					>
						查询
					</n-button>
				</n-form-item>
			</n-space>
		</n-form>

		<n-card class="history-card">
			<n-row class="history-card-row">
				<n-col :span="12" class="card-item card-line">
					<div class="label">剩余积分</div>
					<div class="value">
						{{ model.userIntegralInfo.value?.score || 0 }}
					</div>
				</n-col>
				<n-col :span="12" class="card-item">
					<div class="label">请求数量</div>
					<div class="value">{{ model.userIntegralInfo.value?.rqm || 0 }}</div>
				</n-col>
			</n-row>
			<n-row>
				<n-col :span="12" class="card-item card-line">
					<div class="label">rpm(每分钟请求量)</div>
					<div class="value">{{ model.userIntegralInfo.value?.rpm || 0 }}</div>
				</n-col>
				<n-col :span="12" class="card-item">
					<div class="label">tpm(每分钟积分量)</div>
					<div class="value">{{ model.userIntegralInfo.value?.tpm || 0 }}</div>
				</n-col>
			</n-row>
		</n-card>

		<n-card class="history-card">
			<n-data-table
				:columns="columns"
				:data="model.tableData.value"
				:bordered="false"
				:loading="model.tableLoading.value"
			/>
			<n-pagination
				style="margin-top: 20px"
				v-model:page-size="model.pagination.pageSize"
				v-model:page="model.pagination.pageNum"
				:item-count="model.pagination.total"
				:page-sizes="[10, 20, 30, 40]"
				show-size-picker
				show-quick-jumper
				:on-update:page="presenter.handlePageChange"
				:on-update:page-size="presenter.handlePageSizeChange"
			/>
		</n-card>
	</div>
</template>

<script lang="ts" setup>
import { usePresenter } from "./presenter";

const presenter = usePresenter();
const { model } = presenter;

const columns = [
	{
		title: "积分",
		key: "modelPrice",
	},
	{
		title: "来源",
		key: "modelName",
	},
	{
		title: "时间",
		key: "time",
	},
	// {
	// 	title: "操作",
	// 	key: "actions",
	// },
];
</script>

<style lang="less">
@import url("./index.less");
</style>
