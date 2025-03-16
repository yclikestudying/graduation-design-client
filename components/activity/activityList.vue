<template>
	<scroll-view class="page" :scroll-y="isScroll">
		组队活动
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		defineProps
	} from 'vue';
	// 变量
	const prop = defineProps({
		isScroll: {
			type: Boolean,
			default: false
		}
	})
</script>

<style lang="less" scoped>
	.page {
		width: 100%;
		height: 100%;

		.card {

			.card-actions {
				display: flex;
				justify-content: space-around;
			}

			.photo {

				image {
					margin-right: 1px;
					width: 95px !important;
					height: 95px;
				}
			}
		}
	}
</style>