<template>
	<view class="image" @click="back">
		<swiper class="swiper" :current="currentIndex" @change="onSwiperChange">
			<template v-for="(photo, index) in image">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y="true" class="scroll-view">
						<image :src="photo" mode="widthFix"></image>
					</scroll-view>
				</swiper-item>
			</template>
		</swiper>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onHide } from "@dcloudio/uni-app"
	// 变量
	const image = ref(JSON.parse(uni.getStorageSync("image")));
	const currentIndex = ref(0)
	const total = ref(image.value.length)
	onLoad((e) => {
		uni.setNavigationBarTitle({
			title: `${currentIndex.value + 1}/${total.value}`
		})
	})
	// 切换图片
	const onSwiperChange = (event) => {
		currentIndex.value = event.detail.current
		uni.setNavigationBarTitle({
			title: `${currentIndex.value + 1}/${total.value}`
		})
	}
	// 返回
	const back = () => {
		uni.navigateBack()
	}

</script>

<style lang="less" scoped>
	.image {
		width: 100vw;
		height: 100vh;
		
		.swiper {
			width: 100%;
			height: 100%;
			
			.swiper-item {
				width: 100%;
				height: 100%;
				
				.scroll-view {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					
					image {
						width: 100%;
					}
				}
			}
		}
	}
</style>
