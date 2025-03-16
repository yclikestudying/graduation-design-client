<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<template v-for="item in 8">
			<uni-card class="card" title="用户名" sub-title="发布时间" thumbnail="/static/my/默认头像.jpg">
				<van-card num="2" tag="标签" price="2.00" desc="描述信息" title="商品标题"
					thumb="/static/my/默认头像.jpg"
					origin-price="10.00" />
			</uni-card>		
		</template>
	</scroll-view>
</template>

<script setup>
	import { ref, defineProps } from 'vue';
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
