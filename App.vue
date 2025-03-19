<template>

</template>
<script>
	export default {
		onLaunch() {
			// 将 globalData 挂载到全局
			const app = getApp();
			if (!app.globalData) {
				app.globalData = {};
			}

			// 统一处理服务器消息
			uni.$on('serverMessage', (message) => {
				const res = JSON.parse(message)
				if (res.type === 'directMessage') {
					const msg = JSON.parse(res.data)
					// 判断消息接收者是否连接服务器
					let socket = getApp().globalData[`${msg.acceptUserId}`]
					if (socket && socket.getIsConnected()) {
						// 连接服务器，那么判断接收者是否在与发送者的聊天页面
						if (socket.getDirectMessage() !== msg.sendUserId) {
							// 不在就进行消息推送
							uni.showToast({
							  title: msg.userName + ":" +msg.messageContent,
							  icon: 'none',
							  position: 'top', // 将提示框显示在屏幕顶部
							  duration: 2000 // 显示时长，单位毫秒
							});
						}
					}
					// 更新私聊消息
					uni.$emit('updateDirectMessage');
				}
			});
		}
	};
</script>

<style>
	/*每个页面公共css */
	view {
		box-sizing: border-box;
	}
</style>