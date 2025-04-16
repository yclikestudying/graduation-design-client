<template>
	<view class="birthday">
		<view>
			<van-cell title="出生日期" is-link :value="birthday" size="large" />
		</view>
		<view class="example-body">
			<uni-datetime-picker type="date" v-model="birthday" start="1908-1-1" end="2030-1-1" />
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
		onLoad
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	import { updateUserApi, getUserApi } from "/pages/api/user/user.js"
	// 数据
	let birthday = ref('');
	const loading = ref(false)
	onLoad((e) => {
		if (e.userBirthday !== "null") {
			birthday.value = e.userBirthday
		}
	})
	// 提交
	const onSubmit = async () => {
		if (birthday.value === '') {
			uni.showToast({
				title: '生日不能为空',
				icon: 'none'
			})
			return;
		}
		loading.value = true
		try {
			const res = await updateUserApi({key: 'userBirthday', value: birthday.value})
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
	.birthday {
		width: 100vw;
		height: 100vh;

		.example-body {
			background-color: #fff;
			padding: 10px;
		}
	}
</style>