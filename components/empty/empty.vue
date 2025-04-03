<template>
	<view class="empty">
		<van-empty image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" image-size="80"
			:description="description" />
	</view>
</template>

<script setup>
	import { ref, defineProps } from 'vue';
	// 变量
	const props = defineProps({
		description: {
			type: String,
			default: '这里空空如也~'
		}
	})
</script>

<style lang="less" scoped>
	.empty {
		width: 100%;
		height: 100%;
	}
</style>