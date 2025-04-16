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
			<van-cell title="主页隐私保护" style="background-color: #F2F2F2;" />
			<view class="item">
				<van-cell title="动态" icon="star-o">
					<template #value>
						<van-switch v-model="articleSetting" size="22px" />
					</template>
				</van-cell>
				<van-cell title="物品" icon="star-o">
					<template #value>
						<van-switch v-model="goodsSetting" size="22px" />
					</template>
				</van-cell>
				<van-cell title="跑腿" icon="star-o">
					<template #value>
						<van-switch v-model="expressSetting" size="22px" />
					</template>
				</van-cell>
				<van-cell title="寻物启事" icon="star-o">
					<template #value>
						<van-switch v-model="lostSetting" size="22px" />
					</template>
				</van-cell>
				<van-cell title="群聊" icon="star-o">
					<template #value>
						<van-switch v-model="activitySetting" size="22px" />
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
	import {
		ref,
		watch
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		querySettingApi,
		settingApi
	} from "/pages/api/private/private.js"

	const myId = ref(uni.getStorageSync("user").id)
	const userPhone = ref(uni.getStorageSync("user").userPhone); // 手机号
	const userPassword = ref(uni.getStorageSync("user").userPassword); // 密码
	const userAvatar = ref(uni.getStorageSync("user").userAvatar); // 头像
	const articleSetting = ref(false); // 动态隐私设置
	const goodsSetting = ref(false); // 物品隐私设置
	const expressSetting = ref(false); // 跑腿隐私设置
	const lostSetting = ref(false); // 寻物启事隐私设置
	const activitySetting = ref(false); // 群聊隐私设置
	
	onLoad(async (e) => {
		const res = await querySettingApi()
		if (res.data.code === 200) {
			articleSetting.value = res.data.data.articleSetting === 1 ? true : false
			goodsSetting.value = res.data.data.goodsSetting === 1 ? true : false
			expressSetting.value = res.data.data.expressSetting === 1 ? true : false
			lostSetting.value = res.data.data.lostSetting === 1 ? true : false
			activitySetting.value = res.data.data.activitySetting === 1 ? true : false
		}
	})
	
	// 侦听动态隐私设置
	watch(articleSetting, async (newValue, oldValue) => {
		const res = await settingApi('article_setting', newValue === true ? 1 : 0)
	})
	
	// 侦听物品隐私设置
	watch(goodsSetting, async (newValue, oldValue) => {
		const res = await settingApi('goods_setting', newValue === true ? 1 : 0)
	})
	
	// 侦听跑腿隐私设置
	watch(expressSetting, async (newValue, oldValue) => {
		const res = await settingApi('express_setting', newValue === true ? 1 : 0)
	})
	
	// 侦听寻物启事隐私设置
	watch(lostSetting, async (newValue, oldValue) => {
		const res = await settingApi('lost_setting', newValue === true ? 1 : 0)
	})
	
	// 侦听群聊隐私设置
	watch(activitySetting, async (newValue, oldValue) => {
		const res = await settingApi('activity_setting', newValue === true ? 1 : 0)
	})

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