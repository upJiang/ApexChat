<template>
	<div class="title-container">
		<n-h3 prefix="bar">
			<n-text class="title">获取积分</n-text>
		</n-h3>
	</div>
	<div class="intergral-card-container">
		<n-card
			class="intergral-card"
			v-for="item in model.buyList.value"
			:key="item.scoreConfigId"
			:class="{
				web: !model.isMobile.value,
			}"
		>
			<div class="item">
				<n-text class="name">
					{{ item.scoreConfigValue / 100 }}
					积分
				</n-text>
			</div>
			<div class="item">
				<n-text class="price" type="error">
					¥ {{ (item.scoreConfigKey / 100) * item.scoreConfigRate }} 元
				</n-text>
			</div>
			<div class="item">
				<n-text class="tips">积分可以使用网站内所有模型</n-text>
			</div>
			<div class="item">
				<n-dropdown
					placement="right-start"
					trigger="click"
					:options="model.buyOptions"
					@select="presenter.handleSelectBuyType($event, item.scoreConfigId)"
				>
					<n-button type="primary" class="buy-btn">
						<template #icon>
							<SvgIcon icon="icons8:buy" class="text-2xl" />
						</template>
						购买
					</n-button>
				</n-dropdown>
			</div>
		</n-card>
	</div>

	<div class="title-container paddingTop">
		<n-h4 prefix="bar">
			<n-text class="title">1. 签到</n-text>
		</n-h4>
		<n-button
			type="primary"
			class="buy-btn"
			:loading="model.scoreSignLoading.value"
			@click="presenter.handleOnScoreSign"
		>
			<template #icon>
				<SvgIcon icon="grommet-icons:sign" class="text-2xl" />
			</template>
			签到
		</n-button>
	</div>

	<div class="title-container paddingTop">
		<n-h4 prefix="bar">
			<n-text class="title">2. 🔥🔥邀请返利🔥🔥</n-text>
		</n-h4>
		<div>好友用你的邀请码注册，双方都可获得奖励</div>

		<div class="link-container">
			<span class="link">邀请链接：{{ model.inviteLink.value }}</span>

			<n-button
				class="get-code-btn"
				size="small"
				@click="presenter.handleInviteLinkCopy"
			>
				复制
			</n-button>
		</div>
	</div>

	<div class="title-container paddingTop">
		<n-h4 prefix="bar">
			<n-text class="title">3. cdkey积分兑换码兑换</n-text>
		</n-h4>
		<n-text>
			在下方输入框输入兑换码点击兑换即可成功获得积分，每个兑换码只能使用一次哦
		</n-text>
		<n-form-item path="valiedateCode">
			<n-input
				v-model:value.trim="model.cdkey.value"
				placeholder="请输入兑换码"
				style="width: 260px"
			>
				<template #prefix>
					<SvgIcon icon="solar:key-linear" class="text-2xl" />
				</template>
			</n-input>
			<n-button
				style="margin-left: 10px"
				type="primary"
				class="get-code-btn"
				@click="presenter.handleCdkeySubmit"
				:loading="model.cdkeySubmitLoading.value"
			>
				兑换
			</n-button>
		</n-form-item>
	</div>

	<div class="title-container paddingTop">
		<n-h4 prefix="bar">
			<n-text class="title">4. 加群，群里不定期发放积分</n-text>
		</n-h4>
		<div class="img-group-container">
			<NImage
				:src="iten"
				class="group-img"
				:key="iten"
				v-for="iten in model.groupAddress.value"
			/>
		</div>
	</div>

	<n-modal
		v-model:show="model.qrcodeModalShow.value"
		:on-update:show="() => (model.qrcodeModalShow.value = false)"
		style="width: 90%; max-width: 500px"
		preset="card"
	>
		<div class="qrcode-container">
			<n-text class="tips">
				请使用微信扫码支付，或者截图保存二维码后使用微信扫码支付
			</n-text>
			<n-image :width="200" :height="200" :src="model.wechatPayQrCode.value" />
		</div>
	</n-modal>
</template>

<script lang="ts" setup>
import { usePresenter } from "./presenter";

const presenter = usePresenter();
const { model } = presenter;
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
