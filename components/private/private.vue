<template>
	<view class="empty">
		<van-empty image-size="80" :description="description" />
	</view>
</template>

<script setup>
	import {
		ref,
		defineProps
	} from 'vue';
	// 变量
	const props = defineProps({
		description: {
			type: String,
			default: '用户设置了私密'
		}
	})
</script>

<style lang="less" scoped>
	.empty {
		width: 100%;
		height: 100%;
	}
</style>