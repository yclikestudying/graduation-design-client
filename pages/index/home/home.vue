<template>
	<scroll-view scroll-y="true" class="home" @scroll="scroll">
		<view class="title">
			<view class="title-item">
				<view class="image">
					<image src="/static/home/重庆文理学院校徽.png" mode=""></image>
				</view>
				<view class="text">
					<view class="name">
						<text>校园集市</text>
					</view>
					<view class="number">
						<text>99动态</text>
						<text>&emsp;</text>
						<text>20吃瓜群众</text>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="top">
				<view class="option">
					<view class="option-item" @click="setCurrentOption(0)">
						<text :class="{'active-optionName': currentOption === 0}">动态</text>
						<view class="underline active-underline"
							:style="{transform: `translateX(${currentOption * 85/5}vw)`}"></view>
					</view>
					<view class="option-item" @click="setCurrentOption(1)">
						<text :class="{'active-optionName': currentOption === 1}">物品</text>
						<view class="underline"></view>
					</view>
					<view class="option-item" @click="setCurrentOption(2)">
						<text :class="{'active-optionName': currentOption === 2}">跑腿</text>
						<view class="underline"></view>
					</view>
					<view class="option-item" @click="setCurrentOption(3)">
						<text :class="{'active-optionName': currentOption === 3}">寻物</text>
						<view class="underline"></view>
					</view>
					<view class="option-item" @click="setCurrentOption(4)">
						<text :class="{'active-optionName': currentOption === 4}">群聊</text>
						<view class="underline"></view>
					</view>
				</view>
				<view class="search">
					<image class="image1" src="/static/home/搜索.svg" mode="" @click="toOtherPage('search')"></image>
					<image class="image2" src="/static/home/刷新.svg" mode="" @click="refresh"></image>
				</view>
			</view>
			<view class="share">
				<swiper class="swiper" :current="currentOption" @change="onSwiperChange">
					<swiper-item>
						<view class="swiper-item">
							<!-- 动态组件 -->
							<ArticleList :key="articleKey" :isScroll="isScroll" type="校园动态"></ArticleList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 集市组件 -->
							<GoodsList :isScroll="isScroll" type="全部商品"></GoodsList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 跑腿组件 -->
							<ExpressList :isScroll="isScroll" type="全部跑腿"></ExpressList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 寻物组件 -->
							<LostList :isScroll="isScroll" type="全部寻物"></LostList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 活动组件 -->
							<ActivityList :isScroll="isScroll" type="全部群聊"></ActivityList>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</scroll-view>
	<uni-fab class="uni-fab" :popMenu="isExtend" :pattern="pattern" :content="content" :horizontal="horizontal"
		:vertical="vertical" :direction="direction" @trigger="trigger" @fabClick="fabClick" />
</template>

<script setup>
	import ArticleList from "/components/article/articleList.vue"
	import GoodsList from "/components/goods/goodsList.vue"
	import ActivityList from "/components/activity/activityList.vue"
	import ExpressList from "/components/express/expressList.vue"
	import LostList from "/components/lost/lostList.vue"
	import {
		onShow,
		onLoad,
		onPullDownRefresh
	} from "@dcloudio/uni-app"
	import {
		ref,
		computed,
		watch
	} from "vue"
	// 变量
	let currentOption = ref(0); // 当前选项
	const isScroll = ref(false); // 是否允许内容滚动
	let isExtend = ref(false)
	let horizontal = ref('right')
	let vertical = ref('bottom')
	let direction = ref('horizontal')
	let pattern = ref({
		color: '#7A7E83',
		backgroundColor: '#fff',
		selectedColor: '#007AFF',
		buttonColor: '#4496F9',
		iconColor: '#fff'
	})
	let content = ref([{
			iconPath: '/static/home/校园动态.png',
			text: '校园动态',
			active: false
		},
		{
			iconPath: '/static/home/二手集市.png',
			text: '二手集市',
			active: false
		},
		{
			iconPath: '/static/home/跑腿服务.png',
			text: '跑腿服务',
			active: false
		},
		{
			iconPath: '/static/home/寻物启事.png',
			text: '寻物启事',
			active: false
		},
		{
			iconPath: '/static/home/组队活动.png',
			text: '组队活动',
			active: false
		}
	])
	const articleKey = ref(0)
	watch(currentOption, (newValue) => {
		let title
		if (currentOption.value === 0) {
			title = '校园动态'
		} else if(currentOption.value === 1) {
			title = '二手集市'
		} else if(currentOption.value === 2) {
			title = '跑腿服务'
		} else if(currentOption.value === 3) {
			title = '寻物启事'
		} else {
			title = '组队活动'
		}
		uni.setNavigationBarTitle({
			title: title
		})
	})
	// 设置新的currentOption
	const setCurrentOption = (index) => {
		currentOption.value = index
	}
	// 切换页面
	const onSwiperChange = (event) => {
		currentOption.value = event.detail.current
	}
	// 监听整个页面的滚动
	const scroll = (event) => {
		if (event.detail.scrollTop >= 152) {
			isScroll.value = true
		} else {
			isScroll.value = false
		}
	}
	// 其他页面
	const toOtherPage = (key) => {
		const routes = {
			'search': '/pages/home/search/search'
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
	// 点击浮动图标
	const fabClick = () => {
		isExtend.value = true
	}
	
	// 点击浮动图标里面的选项
	const trigger = (event) => {
		const routes = {
			0: "/pages/home/schoolShare/schoolShare",
			1: "/pages/home/goodsMarket/goodsMarket",
			2: "/pages/home/express/express",
			3: "/pages/home/lost/lost",
			4: "/pages/home/activity/activity"
		}
		const url = routes[event.index]
	
		uni.navigateTo({
			url: url
		})
	};
	// 点击刷新
	const refresh = () => {
		if (currentOption.value === 0) {
			articleKey.value++
		}	
	}
</script>

<style lang="less" scoped>
	.home {
		width: 100vw;
		height: 100vh;

		.title {
			width: 100%;
			height: 200px;
			background: linear-gradient(to right, rgb(179, 86, 5), rgb(236, 130, 38));
			display: flex;
			flex-direction: column;
			justify-content: center;

			.title-item {
				width: 100%;
				height: 50px;
				display: flex;
				padding-left: 15px;

				.image {
					width: 50px;
					height: 50px;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					display: flex;
					flex-direction: column;
					color: white;
					margin-left: 10px;

					.name {
						font-size: 20px;
						font-weight: bold;
					}

					.number {
						font-size: 14px;
					}
				}
			}
		}

		.content {
			position: relative;
			bottom: 15px;
			width: 100%;
			height: calc(100vh - 200px + 15px + 152px);
			border-top-right-radius: 10px;
			border-top-left-radius: 10px;
			background-color: white;

			.top {
				display: flex;

				.option {
					width: 85%;
					height: 60px;
					display: flex;

					.option-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						padding: 0 10px;
						width: 100px;

						text {
							margin-bottom: 5px;
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

				.search {
					width: 15%;
					height: 60px;
					display: flex;
					align-items: center;
					justify-content: center;

					.image1 {
						width: 50%;
						height: 50%;
						object-fit: contain;
					}
					
					.image2 {
						position: relative;
						bottom: 2px;
						width: 50%;
						height: 50%;
						object-fit: contain;
					}
				}
			}

			.share {
				width: 100vw;
				height: calc(100vh - 200px + 15px - 60px + 152px);
				display: flex;

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

	/* 已关注 */
	.active-buttom {
		background-color: #e0e0e0 !important;
	}
</style>