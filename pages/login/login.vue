<template>
	<view class="login">
		<view class="form">
			<input class="input" type="text" v-model="userPhone" placeholder="输入账号" />
			<input class="input" type="password" v-model="userPassword" placeholder="输入密码" />
			<input v-if="currentState === '注册'" class="input" type="password" v-model="checkPassword"
				placeholder="确认密码" />
			<van-button v-if="currentState === '登录'" :loading="loading" loading-type="spinner"
				style="width: 100%;background-color: #4496F9;" type="primary" @click="onLogin">登录</van-button>
			<van-button v-else :loading="loading" loading-type="spinner" style="width: 100%;background-color: #4496F9;"
				type="primary" @click="onRegister">注册</van-button>
			<view style="text-align: right;">
				<text @click="onChange">{{ currentState === '登录' ? '去注册' : '去登录' }}</text>
			</view>
		</view>
		<view class="method">
			<view class="method-title">
				<text>第三方登录</text>
			</view>
			<view>
				<uni-icons type="weixin" size="40" style="color: seagreen;"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		loginApi,
		registerApi
	} from "/pages/api/login/login.js"
	import { queryNoReadTotalApi } from "/pages/api/message/message.js"
	import WebSocketClient from "/pages/util/socket.js"
	// 变量
	const currentState = ref('登录')
	const loading = ref(false)
	const userPhone = ref('17823257046');
	const userPassword = ref('11111111');
	const checkPassword = ref('');
	// 方法
	const onChange = () => {
		currentState.value = currentState.value === '登录' ? currentState.value = '注册' : currentState.value = '登录'
		uni.setNavigationBarTitle({
			title: currentState.value
		})
	}
	// 登录
	const onLogin = async () => {
		loading.value = true
		try {
			const res = await loginApi({userPhone: userPhone.value, userPassword: userPassword.value})
			const data = res.data
			if (data.code === 200) {
				uni.setStorageSync("token", data.data.token)
				uni.setStorageSync("user", data.data.user)
				uni.switchTab({
					url: "/pages/index/home/home"
				})
				// 连接服务器
				const userId = data.data.user.id
				const socket = new WebSocketClient(userId)
				socket.connect()
				// 把这个实例存储到本地
				const app = getApp()
				app.globalData[`${userId}`] = socket
				// 查询未读消息总数
				const res = await queryNoReadTotalApi()
				if (res.data.data > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: res.data.data
					})
				}
			} else {
				uni.showToast({
					title: data.message,
					icon: "none"
				})
			}
		} finally {
			loading.value = false
		}
	}
	// 注册
	const onRegister = async () => {
		loading.value = true
		try {
			const res = await registerApi({
				userPhone: userPhone.value,
				userPassword: userPassword.value,
				checkPassword: checkPassword.value
			})
			const data = res.data
			if (data.code === 200) {
				uni.showToast({
					title: "注册成功"
				})
				currentState.value = "登录"
			} else {
				uni.showToast({
					title: data.message,
					icon: "none"
				})
			}
		} finally {
			loading.value = false
		}
	}
</script>

<style lang="less" scoped>
	.login {
		position: relative;
		width: 100vw;
		height: 100vh;
		background-color: #F7F7F7;

		// 登录表单
		.form {
			position: absolute;
			left: 0;
			right: 0;
			margin: 180px auto;
			width: 80%;
			height: 50%;

			// 输入框
			.input {
				margin-bottom: 20px;
				width: 100%;
				height: 45px;
				background-color: #ffffff;
				text-align: center;
				caret-color: #4496F9;
				border-radius: 5px;
			}
		}

		// 第三方登录
		.method {
			position: fixed;
			bottom: 10px;
			width: 100%;
			height: 60px;
			display: flex;
			flex-direction: column;
			align-items: center;

			// 三方登录 title
			.method-title {
				font-size: 14px;
			}
		}
	}
</style>