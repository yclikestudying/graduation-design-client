<template>
	<view class="problem">
		<van-cell is-link style="display: flex;align-items: center;" @click="toOtherPage('problemList')">
			<template #title>
				<view class="custom-title" style="display: flex;align-items: center;">
					<image style="width:40px;height:40px;border-radius: 50%;" :src="avatar" class="avatar" />
					<text class="name">{{ userName }}</text>
				</view>
			</template>
			<text slot="value">反馈列表</text>
		</van-cell>
		<van-cell title="问题和意见(必填)" />
		<view class="item">
			<uni-easyinput type="textarea" v-model="problemContent" placeholder="请输入你想申诉的内容"></uni-easyinput>
		</view>
		<view class="item">
			<uni-file-picker limit="1" title="图片(必填,提供问题截图)" @select="onSelect" @delete="onDelete"></uni-file-picker>
		</view>
		<van-cell title="联系方式(选填)" />
		<view class="item">
			<uni-easyinput class="uni-mt-5" trim="all" type="number" v-model="contactPhone"
				placeholder="请输入手机号以便联系"></uni-easyinput>
		</view>
		<view class="submit" @click="publish">
			<van-button class="button" :loading="isLoading" round type="primary" loading-type="spinner">提交</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
	import {
		uploadApi
	} from "/pages/api/problem/problem.js"

	// 数据变量
	const userId = ref(uni.getStorageSync("user").id); // 用户id
	const avatar = ref(uni.getStorageSync("user").userAvatar); // 用户头像
	const userName = ref(uni.getStorageSync("user").userName); // 用户名称
	const problemContent = ref(null); //问题和意见
	const files = ref(null); // 图片文件
	const contactPhone = ref(null); // 联系电话
	const isLoading = ref(false); // 加载状态

	// 选择图片后触发
	const onSelect = (event) => {
		files.value = []
		files.value.push(event.tempFiles[0].file.path)
	}

	// 图片从列表中删除
	const onDelete = (event) => {
		files.value = null
	}

	// 提交反馈意见
	const publish = async () => {
		if (problemContent.value === null || problemContent.value === '' || files.value === null) {
			uni.showToast({
				title: "必填信息不能为空",
				icon: "none"
			})
			return;
		}
		const file = files.value.map((file, index) => {
			return {
				name: `file`,
				uri: file
			}
		})
		try {
			isLoading.value = true
			const res = await uploadApi(file, problemContent.value, contactPhone.value)
			if (JSON.parse(res.data).code === 200) {
				uni.showToast({
					title: "提交成功"
				})
			} else {
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
			}
		} finally {
			isLoading.value = false
		}
	}

	// 其他页面
	const toOtherPage = (key) => {
		const routes = {
			'problemList': `/pages/my/problemList/problemList?userId=${userId.value}`,
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
</script>

<style lang="less" scoped>
	.problem {
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