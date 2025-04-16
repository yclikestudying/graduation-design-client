<template>
	<view class="setting">
		<view class="function">
			<van-cell title="账号与安全" style="background-color: #F2F2F2;" />
			<view class="item">
				<van-cell title="手机号" :value="userPhone" icon="phone-o" is-link @click="toOtherPage('phone')">
				</van-cell>
				<van-cell title="修改密码" :value="userPassword" icon="edit" is-link @click="toOtherPage('password')">
				</van-cell>
			</view>
			<van-cell title="主页隐私" style="background-color: #F2F2F2;" />
			<view class="item">
				<van-cell title="动态" icon="closed-eye">
					<template #value>
					  <van-switch v-model="checked" size="22px" />
					</template>
				</van-cell>
				<van-cell title="物品" icon="closed-eye">
					<template #value>
					  <van-switch v-model="checked" size="22px" />
					</template>
				</van-cell>
				<van-cell title="跑腿" icon="closed-eye">
					<template #value>
					  <van-switch v-model="checked" size="22px" />
					</template>
				</van-cell>
				<van-cell title="寻物启事" icon="closed-eye">
				    <template #value>
				      <van-switch v-model="checked" size="22px" />
				    </template>
				  </van-cell>
				<van-cell title="群聊" icon="closed-eye">
					<template #value>
					  <van-switch v-model="checked" size="22px" />
					</template>
				</van-cell>
			</view>
			<van-cell title="退出" style="background-color: #F2F2F2;" />
			<view class="item" @click="logout">
				<van-cell class="van-cell" title="退出当前账号" icon="exchange">
					<template #value>
					  <image :src="userAvatar" mode="" style="width: 30px;height: 30px;border-radius: 50%;"></image>
					</template>
				</van-cell>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	
	const myId = ref(uni.getStorageSync("user").id)
	const userPhone = ref(uni.getStorageSync("user").userPhone); // 手机号
	const userPassword = ref(uni.getStorageSync("user").userPassword); // 密码
	const userAvatar = ref(uni.getStorageSync("user").userAvatar); // 头像
	const checked = ref(false)
	
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
	
	// 其他页面
	const toOtherPage = (key) => {
		const routes = {
			'phone': `/pages/my/phone/phone`,
			'password': '/pages/my/password/password'
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
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
				width: 95%;
				border: 1px solid white;
				border-radius: 10px;
				overflow: hidden;
				
				.van-cell {
					display: flex;
					align-items: center;
				}
			}
		}
	}
</style>