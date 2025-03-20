<template>
	<view class="message">
		<view class="title">
			<view class="title-item" @click="setCurrentOption(0)">
				<text :class="{'active-title-item-text': currentOption === 0}">用户私信</text>
				<view class="underline active-underline" :style="{transform: `translateX(${currentOption * 50}vw)`}">

				</view>
			</view>
			<view class="title-item" @click="setCurrentOption(1)">
				<text :class="{'active-title-item-text': currentOption === 1}">活动通知</text>
				<view class="underline">

				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="content">
			<swiper class="swiper" :current="currentOption" @change="onSwiperChange">
				<swiper-item>
					<view class="swiper-item">
						<scroll-view scroll-y="true" class="userList">
							<template v-for="(message, index) in messageList" :key="message.id">
								<uni-list-chat clickable :title="message.userName" :avatar="message.userAvatar"
									:note="getMessage(message.messageContent, message.sendUserId)"
									:time="message.createTime" :badge-text="message.noReadMessageCount"
									@click="toOtherPage('chat', myId === message.sendUserId ? message.acceptUserId : message.sendUserId, message.userName)"></uni-list-chat>
							</template>
						</scroll-view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<scroll-view scroll-y="true" class="userList">
							<uni-list-chat title="uni-app"
								avatar="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png"
								note="您收到一条新的消息" time="2020-02-02 20:20" badge-text="12"></uni-list-chat>
						</scroll-view>
					</view>
				</swiper-item>
			</swiper>
		</scroll-view>
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
	import {
		queryNoReadListApi,
		queryNoReadTotalApi
	} from "/pages/api/message/message.js"
	// 数据
	const currentOption = ref(0)
	const messageList = ref(null)
	const myId = ref(uni.getStorageSync("user").id)
	onLoad(async (e) => {
		const res = await queryNoReadListApi()
		if (res.data.code === 200) {
			messageList.value = res.data.data
		}
	})
	// 设置新的currentOption
	const setCurrentOption = (index) => {
		currentOption.value = index
	}
	// 切换页面
	const onSwiperChange = (event) => {
		currentOption.value = event.detail.current
	}
	// 判断最新消息是我发的还是别人发的
	const getMessage = (content, userId) => {
		if (myId.value === userId) {
			// 我发的
			return `我:${content}`
		} else {
			// 别人发的
			return content
		}
	}
	// 其他页面
	const toOtherPage = (key, param1, param2) => {
		const routes = {
			'chat': `/pages/message/chat/chat?userId=${param1}&userName=${param2}`
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
	// 把消息列表中该用户给我发的未读消息清空
	// 把未读总消息数更新
	uni.$on('updateNoReadCount', async (userId) => {
		// 获取该用户发我消息的未读总数
		messageList.value = messageList.value.map(message => {
			if (message.sendUserId === userId) {
				message.noReadMessageCount = 0
			}
			return message
		})
		// 更新总的角标
		// const res = await queryNoReadTotalApi()
		// if (res.data.data > 0) {
		// 	uni.setTabBarBadge({
		// 		index: 2,
		// 		text: res.data.data
		// 	})
		// } else {
		// 	uni.removeTabBarBadge({
		// 		index: 2
		// 	})
		// }
	})
	// 更新消息列表
	uni.$on('updateMessageList', async () => {
		const res = await queryNoReadListApi()
		if (res.data.code === 200) {
			messageList.value = res.data.data
		}
	});
</script>

<style lang="less" scoped>
	.message {
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		.title {
			border-bottom: 1px solid #f5f4f1;
			height: 40px;
			display: flex;
			justify-content: space-around;

			.title-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.underline {
					width: 25px;
					height: 5px;
					background-color: white;
					border-radius: 50px;
					transition: all .2s;
				}
			}
		}

		.content {
			width: 100%;
			height: calc(100% - 40px);

			.swiper {
				width: 100%;
				height: 100%;

				swiper-item {
					width: 100%;
					height: 100%;

					.swiper-item {
						width: 100%;
						height: 100%;

						.userList {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}

	.active-underline {
		background-color: #4496F9 !important;
	}

	.active-title-item-text {
		font-weight: bold;
	}
</style>