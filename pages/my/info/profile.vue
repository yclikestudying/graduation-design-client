<template>
	<view class="profile">
		<view class="content">
			<uni-easyinput type="textarea" v-model="userProfile" :placeholder="placeholder"></uni-easyinput>
		</view>
		<view style="margin: 16px;">
		  <van-button :loading="loading" loading-type="spinner" round block type="primary" native-type="submit" color="#4496F9" @click="onSubmit">
		    提交
		  </van-button>
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import { updateUserApi, getUserApi } from "/pages/api/user/user.js"
	// 数据
	let userProfile = ref('')
	let placeholder = ref('请输入简介')
	let loading = ref(false)
	onLoad((e) => {
		if (e.userProfile) {
			placeholder.value = e.userProfile
		}	
	})
	// 提交
	const onSubmit = async () => {
		if (userProfile.value === '') {
			uni.showToast({
				title: '简介不能为空',
				icon: 'none'
			})
			return;
		}
		loading.value = true
		try {
			const res = await updateUserApi({key: 'userProfile', value: userProfile.value})
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
	.profile {
		width: 100vw;
		height: 100vh;
		
		.content {
			padding: 10px;
		}
	} 
</style>
