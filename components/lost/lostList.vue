<template>
	<scroll-view class="page" :scroll-y="isScroll">
		寻物启事
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		defineProps
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	// 变量
	const props = defineProps({
		isScroll: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: ''
		}
	})
	onLoad((e) => {
		
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