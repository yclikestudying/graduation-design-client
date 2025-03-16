<template>
	<view class="loading">
		<van-loading type="spinner" color="#1989fa" />
	</view>
</template>

<script setup>
	
</script>

<style lang="less" scoped>
	.loading {
		position: absolute;
		z-index: 999;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>