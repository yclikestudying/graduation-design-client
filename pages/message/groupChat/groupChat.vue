<template>
	<view class="chat">
		<view :class="{content: true, 'content-active': moreFunction}">
			<!-- 聊天内容展示组件 -->
			<GroupChat></GroupChat>
		</view>
		<view :class="{send: true, 'send-active': moreFunction}">
			<view class="input">
				<uni-easyinput class="uni-mt-5" v-model="content" trim="all" placeholder="请输入内容"></uni-easyinput>
				<van-button v-if="content !== ''" class="button" type="primary" size="small"
					@click="send">发送</van-button>
				<van-icon v-else name="plus" size="25" :class="{icon: true, 'icon-active': moreFunction}"
					@click="more" />
			</view>
			<view v-if="moreFunction" class="more">
				<view class="item" @click="sendImage">
					<uni-icons type="image" size="40"></uni-icons>
					<text class="text">图片</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import GroupChat from "/components/chat/groupChat.vue"
	import {
		ref
	} from "vue";
	import {
		onLoad,
		onNavigationBarButtonTap
	} from "@dcloudio/uni-app"
	import {
		queryMessageApi,
		isReadApi,
		uploadImageApi
	} from "/pages/api/message/message.js"
	import { queryNameAndCountApi } from "/pages/api/activity/activity.js"
	// 变量
	const moreFunction = ref(false)
	const content = ref(''); //消息内容
	const activityId = ref(null); // 群id
	const activityName = ref(null); // 群名称
	const personCount = ref(null); // 群人数
	const myId = ref(uni.getStorageSync('user').id)
	const myScoket = getApp().globalData[`${myId.value}`]
	onLoad(async (e) => {
		activityId.value = e.activityId
		const res = await queryNameAndCountApi(activityId.value)
		if (res.data.code === 200) {
			activityName.value = res.data.data.activityName
			personCount.value = res.data.data.personCount
		}
		uni.setNavigationBarTitle({
			title: `${activityName.value}(${personCount.value})`
		})
	})
	onNavigationBarButtonTap(() => {
		uni.navigateTo({
			url: '/pages/message/groupChatInfo/groupChatInfo'
		})
	})
	// 发送消息
	const send = () => {
		moreFunction.value = false
		myScoket.send('groupMessage', JSON.stringify({
			sendUserId: myId.value, // 发送者id（我的id）
			activityId: activityId.value, // 群聊id
			messageContent: content.value, // 消息内容
			messageType: 'text' // 消息类型
		}))
		content.value = ''
	}
	const more = () => {
		moreFunction.value = !moreFunction.value
	}
	// 发送图片
	const sendImage = async () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				try {
					// 获取图片的临时路径
					const tempFilePath = res.tempFilePaths[0];
					const res1 = await uploadImageApi(tempFilePath)
					console.log(res1)
					if (JSON.parse(res1.data).code === 200) {
						const messageContent = JSON.parse(res1.data).data
						myScoket.send('groupMessage', JSON.stringify({
							sendUserId: myId.value, // 发送者id（我的id）
							activityId: activityId.value, // 群聊id
							messageContent: messageContent, // 消息内容
							messageType: 'image' // 消息类型
						}))
						moreFunction.value = false
					}
				} catch (err) {
					console.log(err);
				}
			}
		});
	};
</script>

<style lang="less" scoped>
	.chat {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	
		.content {
			width: 100%;
			height: 93%;
			transition: all .5s;
		}
	
		.send {
			padding: 0 20px;
			width: 100%;
			height: 7%;
	
			.input {
				margin-top: 5px;
				width: 100%;
				display: flex;
				align-items: center;
	
				.button {
					width: 60px;
					margin-left: 10px;
				}
	
				.icon {
					margin-left: 10px;
					transition: all .5s;
				}
			}
	
			.more {
				width: 100%;
				height: 340px;
	
				.item {
					width: 50px;
					height: 50px;
					display: flex;
					flex-direction: column;
					align-items: center;
	
					.text {
						font-size: 12px;
					}
				}
			}
		}
	}
	
	.icon-active {
		transform: rotate(-45deg);
	}
	
	.send-active {
		height: 340px !important;
	}
	
	.content-active {
		height: calc(100% - 340px) !important;
	}
</style>
