<template>
	<view class="avatar" @click="back">
		<CenterLoading v-if="avatar === null"></CenterLoading>
		<view v-else class="main">
			<image :src="avatar" mode="widthFix"></image>
			<view v-if="identity === 'me'" @click.stop="upload">
				<van-button class="button" :loading="isLoading" type="primary" loading-type="spinner">上传头像</van-button>
			</view>
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
		getAvatarApi,
		uploadAvatarApi,
		getUserApi
	} from "/pages/api/user/user.js"
	// 变量
	const identity = ref(null);
	const userId = ref(null)
	const avatar = ref(null)
	const isLoading = ref(false)
	onLoad(async (e) => {
		identity.value = e.identity
		userId.value = Number(e.userId)
		plus.navigator.setFullscreen(true)
		const res = await getAvatarApi(userId.value)
		if (res.data.code === 200) {
			avatar.value = res.data.data
		}
	})
	// 返回
	const back = () => {
		uni.navigateBack()
	}
	// 上传头像
	const upload = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				isLoading.value = true
				try {
					const res1 = await uploadAvatarApi(userId.value, res.tempFilePaths[0])
					if (JSON.parse(res1.data).code === 200) {
						avatar.value = JSON.parse(res1.data).data
					}
					// 重新更新自己的信息
					const res2 = await getUserApi()
					uni.setStorageSync("user", res2.data.data)
				} finally {
					isLoading.value = false
				}
			}
		});
	}
</script>

<style lang="less" scoped>
	.avatar {
		width: 100vw;
		height: 100vh;
		background-color: black;
		
		.main {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			.button {
				margin-top: 10px;
			}
		}
	}
</style>