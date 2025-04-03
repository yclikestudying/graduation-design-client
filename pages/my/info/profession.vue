<template>
	<view class="profession">
		<view>
			<van-cell title="职业" is-link :value="userProfession" size="large" />
		</view>
		<van-tree-select class="select" v-model:active-id="activeId" v-model:main-active-index="activeIndex"
			:items="profession" />
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
		ref,
		watch
	} from "vue";
	import {
		profession,
		getProfession
	} from "./data.js"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		updateUserApi,
		getUserApi
	} from "/pages/api/user/user.js"

	// 数据
	const activeId = ref(0);
	const activeIndex = ref(0);
	let userProfession = ref('')
	const loading = ref(false)
	onLoad((e) => {
		if (e.userProfession !== "null") {
			const data = JSON.parse(e.userProfession)
			userProfession.value = data.text
			activeIndex.value = data.activeIndex
			activeId.value = data.activeId
		}
	})
	watch(activeId, (value) => {
		userProfession.value = getProfession(value)
	})
	// 提交
	const onSubmit = async () => {
		if (userProfession.value === '') {
			uni.showToast({
				title: '专业不能为空',
				icon: 'none'
			})
			return;
		}
		loading.value = true
		try {
			const res = await updateUserApi({
				key: 'userProfession',
				value: JSON.stringify({
					'text': userProfession.value,
					'activeIndex': activeIndex.value,
					'activeId': activeId.value
				})
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
	.profession {
		width: 100vw;
		height: 100vh;
	}
</style>