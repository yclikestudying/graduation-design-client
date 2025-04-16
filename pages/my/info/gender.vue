<template>
	<view class="gender">
		<view class="item">
			<uni-data-checkbox v-model="radio" :localdata="sex"></uni-data-checkbox>
		</view>
		<view style="margin: 16px;">
			<van-button :loading="loading" loading-type="spinner" round block type="primary" native-type="submit" color="#4496F9" @click="onSubmit">
				提交
			</van-button>
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
		updateUserApi,
		getUserApi
	} from "/pages/api/user/user.js"
	// 数据
	let loading = ref(false)
	let radio = ref(2)
	const sex = [{
		text: '女',
		value: 0
	}, {
		text: '男',
		value: 1
	}, {
		text: '保密',
		value: 2
	}]
	onLoad((e) => {
		if (e.userGender !== "null") {
			radio.value = Number(e.userGender)
		}
	})
	// 提交
	const onSubmit = async () => {
		loading.value = true
		try {
			const res = await updateUserApi({key: 'userGender', value: sex[radio.value].value})
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
	.gender {
		width: 100vw;
		height: 100vh;

		.item {
			padding: 10px 0 10px 100px;
			width: 100%;
		}
	}
</style>