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
		padding-top: 40%;
		z-index: 999;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}
</style>