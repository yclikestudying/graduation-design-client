<template>
	<view class="message">
		<view class="title">
			<view class="title-item" @click="setCurrentOption(0)">
				<text :class="{'active-title-item-text': currentOption === 0}">用户私信</text>
				<view class="underline active-underline" :style="{transform: `translateX(${currentOption * 50}vw)`}">

				</view>
			</view>
			<view class="title-item" @click="setCurrentOption(1)">
				<text :class="{'active-title-item-text': currentOption === 1}">群聊通知</text>
				<view class="underline">

				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="content">
			<swiper class="swiper" :current="currentOption" @change="onSwiperChange">
				<swiper-item>
					<view class="swiper-item">
						<scroll-view scroll-y="true" class="userList">
							<Loading v-if="messageList === null"></Loading>
							<Empty v-else-if="messageList?.length === 0"></Empty>
							<template v-else v-for="(message, index) in messageList" :key="message.id">
								<uni-list-chat clickable :title="message.userName" :avatar="message.userAvatar"
									:note="getMessage(message.messageContent, message.messageType, message.sendUserId)"
									:time="formatWeChatTime(message.createTime)" :badge-text="message.noReadMessageCount"
									@click="toOtherPage('chat', myId === message.sendUserId ? message.acceptUserId : message.sendUserId, message.userName)"></uni-list-chat>
							</template>
						</scroll-view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<scroll-view scroll-y="true" class="userList">
							<Loading v-if="groupMessageList === null"></Loading>
							<Empty v-else-if="groupMessageList?.length === 0"></Empty>
							<template v-else v-for="(message, index) in groupMessageList">
								<uni-list-chat clickable :title="message.activityName" :avatar="message.activityPhoto"
									:note="getGroupMessage(message.messageContent, message.messageType, message.userName, message.sendUserId)"
									:time="formatWeChatTime(message.sendTime)"
									@click="toOtherPage('groupChat', message.activityId, message.sendUserId)"
									>
									</uni-list-chat>
							</template>
						</scroll-view>
					</view>
				</swiper-item>
			</swiper>
		</scroll-view>
	</view>
	
	<!-- :badge-text="message.noReadMessageCount" -->
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
		queryNoReadTotalApi,
		queryGroupChatLatestMessageApi
	} from "/pages/api/message/message.js"
	import { formatWeChatTime } from '../../util';
	// 数据
	const currentOption = ref(0)
	const messageList = ref(null); // 私聊消息列表
	const groupMessageList = ref(null); // 群聊消息列表
	const myId = ref(uni.getStorageSync("user").id)
	onLoad(async (e) => {
		// 查询最新私聊消息列表
		const res = await queryNoReadListApi()
		if (res.data.code === 200) {
			messageList.value = res.data.data || []
		}
		
		// 查询最新群聊消息列表
		const res2 = await queryGroupChatLatestMessageApi()
		if (res2.data.code === 200) {
			groupMessageList.value = res2.data.data || []
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
	const getMessage = (content, type, userId) => {
		if (myId.value === userId) {
			// 我发的
			if (type === 'image') {
				return '我:[图片]'
			}
			return `我:${content}`
		} else {
			// 别人发的
			if (type === 'image') {
				return '[图片]'
			}
			return content
		}
	}
	
	// 判断最新消息是我发的还是别人发的
	const getGroupMessage = (content, type, userName, userId) => {
		if (myId.value === userId) {
			// 我发的
			if (type === 'image') {
				return '我:[图片]'
			}
			return `我:${content}`
		} else {
			// 别人发的
			if (type === 'image') {
				return `${userName}:[图片]`
			}
			return `${userName}:${content}`
		}
	}
	
	// 其他页面
	const toOtherPage = (key, param1, param2) => {
		const routes = {
			'chat': `/pages/message/chat/chat?userId=${param1}&userName=${param2}`,
			'groupChat': `/pages/message/groupChat/groupChat?activityId=${param1}`
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}

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