<template>
	<view class="chat">
		<view :class="{content: true, 'content-active': moreFunction}">
			<!-- 聊天内容展示组件 -->
			<Chat :userId="userId"></Chat>
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
	import Chat from "/components/chat/chat.vue"
	import {
		ref
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryMessageApi,
		isReadApi
	} from "/pages/api/message/message.js"
	// 变量
	const moreFunction = ref(false)
	const content = ref(''); //消息内容
	const userId = ref(null); // 对方id
	const userName = ref(null); // 对方名称
	const myId = ref(uni.getStorageSync('user').id)
	const myScoket = getApp().globalData[`${myId.value}`]
	onLoad(async (e) => {
		userId.value = Number(e.userId)
		// 保存当前聊天页面用户的id，为了弹窗消息时判断
		myScoket.setDirectMessage(userId.value)
		userName.value = e.userName
		uni.setNavigationBarTitle({
			title: userName.value
		})
		// 把未读消息设置成已读消息
		await isReadApi(userId.value)
		// 把消息列表中该用户给我发的未读消息清空
		// 把未读总消息数更新
		uni.$emit('updateNoReadCount', userId.value)
	})
	const send = () => {
		moreFunction.value = false
		myScoket.send('directMessageText', JSON.stringify({
			userName: uni.getStorageSync("user").userName,
			sendUserId: myId.value,
			acceptUserId: userId.value,
			messageContent: content.value,
			messageType: 'text'
		}))
		content.value = ''
	}
	const more = () => {
		moreFunction.value = !moreFunction.value
	}
	// 发送图片
	// const sendImage = () => {
	// 	uni.chooseImage({
	// 		count: 1,
	// 		sizeType: ['original', 'compressed'],
	// 		sourceType: ['album', 'camera'],
	// 		success: async (res) => {
	// 			try {
	// 				// 获取图片的临时路径
	// 				const tempFilePath = res.tempFilePaths[0];

	// 				// 将图片转换为 ArrayBuffer
	// 				const arrayBuffer = await getArrayBuffer(tempFilePath);

	// 				// 通过 WebSocket 发送二进制数据
	// 				const message = {
	// 					userName: uni.getStorageSync("user").userName,
	// 					sendUserId: myId.value,
	// 					acceptUserId: userId.value,
	// 					messageType: 'image',
	// 					fileName: 'image.jpg' // 可以动态获取文件名
	// 				};
	// 				// 先发送元数据（JSON）
	// 				myScoket.send(JSON.stringify(message));
	// 				// 再发送二进制数据
	// 				myScoket.send(arrayBuffer);
	// 			} catch (err) {
	// 				console.log(err);
	// 			}
	// 		}
	// 	});
	// };
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