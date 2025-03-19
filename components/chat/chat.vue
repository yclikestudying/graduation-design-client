<template>
	<scroll-view scroll-y="true" class="chat-content">
		<template v-for="(message, index) in messageList" :key="message.id">
			<view class="date">
				<text>{{ message.createTime }}</text>
			</view>
			<view :class="{user: true, me: message.sendUserId === myId}">
				<view class="image">
					<image class="avatar" lazy-load="true" :src="message.userAvatar" mode=""></image>
				</view>
				<view class="message">
					<text>{{ message.messageContent }}</text>
				</view>
				<!-- <view v-else-if="message.type === 'link'" class="message" @click="checkGoods(message.content)">
					<text style="color: blue;">{{ message.content }}</text>
				</view>
				<view v-else class="messageImage"
					@click="toOtherPage('image', role, permission, message.content, 'image')">
					<image lazy-load="true" :src="message.content" mode="widthFix"></image>
				</view> -->
			</view>
		</template>
	</scroll-view>
</template>

<script setup>
	import { ref, defineProps } from "vue"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import { queryMessageApi } from "/pages/api/message/message.js"
	const myId = ref(uni.getStorageSync("user").id)
	const messageList = ref(null)
	const props = defineProps({
		userId: {
			type: Number,
			default: null
		}
	})
	// 更新私聊消息
	const updateDirectMessage = async () => {
		const res = await queryMessageApi(props.userId)
		if (res.data.code === 200) {
			messageList.value = res.data.data
		}
	}
	onLoad((e) => {
		// 查询聊天记录
		updateDirectMessage()
	})
	// 更新私聊消息
	uni.$on('updateDirectMessage', () => {
		updateDirectMessage()
	})
</script>

<style lang="less" scoped>
	.chat-content {
		width: 100%;
		height: 100%;
	
		.date {
			width: 100%;
			text-align: center;
	
			text {
				font-size: 12px;
			}
		}
	
		.user {
			width: 100%;
			display: flex;
			margin-top: 10px;
			padding: 0 10px;
	
			.image {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				overflow: hidden;
	
				.avatar {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
	
			.message {
				border-radius: 5px;
				margin: 0 10px;
				max-width: 250px;
				padding: 10px;
				background-color: white;
			}
	
			.messageImage {
				margin: 0 10px;
				width: 150px;
				border-radius: 5px;
				overflow: hidden;
	
				image {
					width: 100%;
				}
			}
		}
	
		.me {
			display: flex;
			flex-flow: row-reverse;
	
			.message {
				background-color: limegreen;
			}
		}
	}
</style>
