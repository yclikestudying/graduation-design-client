<template>
	<view class="setting">
		<view class="function">
			<view class="item" @click="logout">
				<van-cell title="退出当前账号" icon="exchange" is-link>
				</van-cell>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	const myId = ref(uni.getStorageSync("user").id)
	// 退出登录
	const logout = () => {
		uni.showModal({
			title: '温馨提示',
			content: '确认退出？',
			success: function(res) {
				if (res.confirm) {
					const socket = getApp().globalData[`${myId.value}`]
					socket.close()
					delete getApp().globalData[`${myId.value}`]	
					uni.clearStorageSync("user")
					uni.clearStorageSync("token")
					uni.reLaunch({
						url: "/pages/login/login"
					})
				}
			}
		})
	}
</script>

<style lang="less" scoped>
	.setting {
		width: 100vw;
		height: 100vh;
		background-color: #F2F2F2;

		.function {
			width: 100%;
			height: 100%;

			.item {
				position: relative;
				left: 2.5%;
				top: 10px;
				width: 95%;
				border: 1px solid white;
				border-radius: 10px;
				overflow: hidden;
			}
		}
	}
</style>