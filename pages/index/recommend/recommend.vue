<template>
	<view class="allPage">
		<view class="share" style="padding-top: var(--status-bar-height);">
			<view class="title">
				<view class="item">
					<view class="title-item" @click="setCurrentOption(0)">
						<text :class="{'active-optionName': currentOption === 0}">关注</text>
						<view class="underline active-underline"
							:style="{transform: `translateX(${currentOption * 75}px)`}">

						</view>
					</view>
					<view class="title-item" @click="setCurrentOption(1)">
						<text :class="{'active-optionName': currentOption === 1}">推荐</text>
						<view class="underline">

						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<swiper class="swiper" :current="currentOption" @change="onSwiperChange">
					<swiper-item>
						<view class="swiper-item">
							<ArticleList isScroll="true" type="关注动态"></ArticleList>
						</view> 
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<scroll-view scroll-y="true" class="page">
								
							</scroll-view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app"
	import ArticleList from "/components/article/articleList.vue" 
	// 数据
	let currentOption = ref(0); // 当前选项
	// 设置新的currentOption
	const setCurrentOption = (index) => {
		currentOption.value = index
	}
	// 切换页面
	const onSwiperChange = (event) => {
		currentOption.value = event.detail.current
	}
</script>

<style lang="less" scoped>
	.allPage {
		width: 100vw;
		height: 100vh;

		.share {
			width: 100%;
			height: 100%;

			.title {
				position: relative;
				width: 100%;
				height: 50px;

				.item {
					position: absolute;
					left: 0;
					right: 0;
					margin: 0 auto;
					width: 150px;
					height: 100%;
					display: flex;
					justify-content: center;


					.title-item {
						width: 75px;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						text {
							transition: all .2s;
						}

						.underline {
							width: 25px;
							height: 5px;
							background-color: white;
							border-radius: 50px;
							transition: all .2s;
						}

					}
				}
			}

			.content {
				width: 100vw;
				height: calc(100% - 50px);

				.swiper {
					width: 100%;
					height: 100%;

					swiper-item {
						width: 100%;
						height: 100%;

						.swiper-item {
							width: 100%;
							height: 100%;
							
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
						}
					}
				}
			}
		}
	}

	.active-underline {
		background-color: #4496F9 !important;
	}

	.active-optionName {
		font-size: 18px;
		font-weight: bold;
	}

	.active-searchPage {
		transform: translateY(-100vh);
	}
</style>