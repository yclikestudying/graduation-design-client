<template>
	<scroll-view scroll-y="true" class="chat-content" :scroll-into-view="scrollIntoId">
		<template v-for="(message, index) in messageList">
			<view class="content" :id="index + 1 === messageList?.length ? `message${messageList?.length}` : ''">
				<view class="top">
					<text v-if="index === 0">{{ message.sendTime }}</text>
					<text
						v-else>{{ message.sendTime === messageList[index - 1].sendTime ? '' : message.sendTime }}</text>
				</view>
				<view :class="{bottom: true, me: message.sendUserId === myId}">
					<view class="left">
						<image :src="message.userAvatar" mode=""></image>
					</view>
					<view class="right">
						<view class="right-top">
							<text>{{ message.userName }}</text>
						</view>
						<view v-if="message.messageType === 'text'" class="right-bottom">
							<text>{{ message.messageContent }}</text>
						</view>
						<view v-else-if="message.messageType === 'image'" class="messageImage">
							<image lazy-load="true" :src="message.messageContent" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
		</template>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		defineProps
	} from "vue"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryGroupMessageApi
	} from "/pages/api/message/message.js"
	import {
		formatWeChatTime
	} from "../../pages/util/index.js"
	// 变量
	const activityId = ref(null); // 群聊id
	const messageList = ref(null); // 群消息列表
	const myId = ref(uni.getStorageSync("user").id); // 我的id
	const scrollIntoId = ref(null);
	// 查询方法
	const queryMessageList = async () => {
		const res = await queryGroupMessageApi(activityId.value)
		if (res.data.code === 200) {
			messageList.value = res.data.data
			messageList.value = messageList.value.map(message => {
				message.sendTime = formatWeChatTime(message.sendTime)
				return message
			})
			scrollIntoId.value = `message${messageList?.value?.length}`	
		}
	}
	onLoad((e) => {
		activityId.value = e.activityId
		queryMessageList()
	})
	// 更新群聊消息
	uni.$on('updateGroupMessage', () => {
		queryMessageList()
	})
</script>

<style lang="less" scoped>
	.chat-content {
		width: 100%;
		height: 100%;

		.content {
			position: relative;
			width: 100%;

			.top {
				width: 100%;
				padding-top: 5px;
				text-align: center;
				font-size: 14px;
			}

			.bottom {
				width: 100%;
				padding-left: 10px;
				display: flex;

				.left {
					min-width: 50px;
					height: 50px;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.right {
					height: 100%;

					.right-top {
						width: 100%;
						font-size: 12px;
					}

					.right-bottom {
						width: 100%;
						height: 100%;
						padding: 10px;
						border-radius: 5px;
						border: 1px solid lightgray;
					}
					
					.messageImage {
						width: 150px;
						border-radius: 5px;
						overflow: hidden;
						border: 1px solid lightgray;
					
						image {
							width: 100%;
						}
					}
				}
			}
		}

		.me {
			display: flex;
			flex-flow: row-reverse;

			.right {
				display: flex;
				flex-direction: column;
				align-items: end;

				.right-top {
					display: flex;
					justify-content: right;
				}

				.right-bottom {
					background-color: limegreen;
				}
			}
		}
	}
</style>