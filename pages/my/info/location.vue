<template>
	<view class="hometown">
		<view>
			<van-cell title="所在地" is-link :value="hometown" size="large" />
		</view>
		<view class="content">
			<uni-data-picker placeholder="请选择所在地区" popup-title="请选择所在地区" :localdata="dataTree" v-model="hometown">
			</uni-data-picker>
		</view>
		<view style="margin: 16px;">
		  <van-button :loading="loading" loading-type="spinner" round block type="primary" native-type="submit" color="#4496F9" @click="onSubmit">
		    提交
		  </van-button>
		</view>
	</view>
</template>

<script setup>
	import dataTree from "./city.js"
	import { ref } from "vue"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import { updateUserApi, getUserApi } from "/pages/api/user/user.js"
	// 数据
	let hometown = ref('所在家乡')
	const loading = ref(false)
	onLoad((e) => {
		if (e.userHometown !== "null") {
			hometown.value = e.userHometown
		}
	})
	// 提交
	const onSubmit = async () => {
		if (hometown.value === '') {
			uni.showToast({
				title: '家乡不能为空',
				icon: 'none'
			})
			return;
		}
		loading.value = true
		try {
			const res = await updateUserApi({key: 'userLocation', value: hometown.value})
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
	.hometown {
		width: 100vw;
		height: 100vh;
		
		.content {
			padding: 10px;
		}
	} 
</style>
