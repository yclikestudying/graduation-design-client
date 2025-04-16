<template>
	<view class="password">
		<van-cell title="密码" :value="userPassword" icon="edit">
		</van-cell>
		<van-cell title="请输入旧密码" />
		<view class="item">
			<uni-easyinput type="password" class="uni-mt-5" trim="all" v-model="oldPassword"></uni-easyinput>
		</view>
		<van-cell title="请输入新密码" />
		<view class="item">
			<uni-easyinput type="password" class="uni-mt-5" trim="all" v-model="newPassword"></uni-easyinput>
		</view>
		<van-cell title="确认密码" />
		<view class="item">
			<uni-easyinput type="password" class="uni-mt-5" trim="all" v-model="checkPassword"></uni-easyinput>
		</view>
		<view class="submit" @click="publish">
			<van-button class="button" :loading="isLoading" round type="primary"
				loading-type="spinner">修改密码</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		editPasswordApi
	} from "/pages/api/user/user.js"

	const userPassword = ref(uni.getStorageSync("user").userPassword); // 密码
	const oldPassword = ref(''); // 旧密码
	const newPassword = ref(''); // 新密码
	const checkPassword = ref(''); // 确认密码
	const isLoading = ref(false); // 加载状态

	// 修改密码
	const publish = async () => {
		if (oldPassword.value === '' || newPassword.value === '' || checkPassword.value === '') {
			uni.showToast({
				title: '请完善信息',
				icon: 'none'
			})
			return;
		}
		const res = await editPasswordApi(oldPassword.value, newPassword.value, checkPassword.value)
		if (res.data.code === 200) {
			uni.showToast({
				title: '修改成功'
			})
			uni.reLaunch({
				url: "/pages/login/login"
			})
		} else {
			uni.showToast({
				title: res.data.message,
				icon: 'none'
			})
		}
	}
</script>

<style lang="less" scoped>
	.password {
		width: 100vw;
		height: 100vh;

		.item {
			padding: 0 15px;
		}

		.submit {
			padding: 15px;

			.button {
				width: 100%;
			}
		}
	}
</style>