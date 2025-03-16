<template>
	<view class="username">
		<view class="content">
			<uni-easyinput v-model="userName" :placeholder="placeholder"></uni-easyinput>
		</view>
		<view style="margin: 16px;">
			<van-button :loading="loading" loading-type="spinner" round block type="primary" native-type="submit"
				color="#4496F9" @click="onSubmit">
				提交
			</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	import {
		updateUserApi,
		getUserApi
	} from "/pages/api/user/user.js"
	// 变量
	const userName = ref('');
	const placeholder = ref('请输入新的用户名')
	const loading = ref(false)
	onLoad((e) => {
		if (e.userName) {
			placeholder.value = e.userName
		}
	})
	// 提交
	const onSubmit = async () => {
		if (userName.value === '') {
			uni.showToast({
				title: '用户名不能为空',
				icon: 'none'
			})
			return;
		}
		loading.value = true
		try {
			const res = await updateUserApi({
				key: 'userName',
				value: userName.value
			})
			if (res.data.code === 200) {
				uni.showToast({
					title: '修改成功'
				})
				const res = await getUserApi()
				uni.setStorageSync("user", res.data.data)
				uni.navigateBack()
			} else {
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
			}
		} finally {
			loading.value = false
		}
	}
</script>

<style lang="less" scoped>
	.username {
		width: 100vw;
		height: 100vh;

		.content {
			padding: 10px;
		}
	}
</style>