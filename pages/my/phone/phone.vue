<template>
	<view class="phone">
		<van-cell title="手机号" :value="userPhone" icon="phone-o">
		</van-cell>
		<van-cell title="请补充完整手机号" />
		<view class="item">
			<uni-easyinput type="number" class="uni-mt-5" trim="all" v-model="phone"></uni-easyinput>
		</view>
		<van-cell title="请输入新手机号" />
		<view class="item">
			<uni-easyinput type="number" class="uni-mt-5" trim="all" v-model="newPhone"></uni-easyinput>
		</view>
		<view class="submit" @click="publish">
			<van-button class="button" :loading="isLoading" round type="primary"
				loading-type="spinner">更改手机</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		editPhoneApi
	} from "/pages/api/user/user.js"

	const userPhone = ref(uni.getStorageSync("user").userPhone); // 手机号
	const phone = ref(''); // 输入的完整手机号
	const newPhone = ref(''); // 新的手机号
	const isLoading = ref(false); // 加载状态
	
	// 更换手机
	const publish = async () => {
		if (phone.value === '' || newPhone.value === '') {
			uni.showToast({
				title: '请完善信息',
				icon: 'none'
			})
			return;
		}
		const res = await editPhoneApi(phone.value, newPhone.value)
		console.log(res)
		if (res.data.code === 200) {
			uni.showToast({
				title: '更换成功'
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
	.phone {
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