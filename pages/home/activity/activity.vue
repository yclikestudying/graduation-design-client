<template>
	<view class="activity">
		<view class="text">
			<uni-easyinput v-model="title" placeholder="活动名称"></uni-easyinput>
		</view>
		<view class="text">
			<uni-easyinput type="textarea" autoHeight v-model="text" placeholder="活动描述"></uni-easyinput>
		</view>
		<view class="text">
			<uni-easyinput v-model="max" type="number" placeholder="活动最大人数"></uni-easyinput>
		</view>
		<view class="image">
			<view class="example-body">
				<uni-file-picker limit="1" title="活动图片" @select="onSelect" @delete="onDelete"></uni-file-picker>
			</view>
		</view>
		<view style="margin: 16px;">
			<van-button :loading="loading" loading-type="spinner" round block type="primary" native-type="submit"
				color="#4496F9" @click="onSubmit">
				发布
			</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import { uploadApi } from "/pages/api/activity/activity.js"
	// 数据
	const title = ref(''); // 商品名称
	const text = ref(''); // 文字内容
	const max = ref(null);
	const fileLists = ref(null); // 图片
	const current = ref(null);
	const loading = ref(false); // 加载动画
	// 选择图片后触发
	const onSelect = (event) => {
		fileLists.value = []
		event.tempFiles.forEach(tempFile => {
			fileLists.value.push(tempFile.file.path)
		})
	}
	// 图片从列表中删除
	const onDelete = (event) => {
		fileLists.value.splice(event.index, 1)
		fileLists.value = null
	}
	// 上传内容
	const onSubmit = async () => {
		if (fileLists.value === null || title.value === '' || text.value === '' || max.value === null) {
			uni.showToast({
				title: '请完善信息',
				icon: 'none'
			})
			return;
		}
		try {
			loading.value = true
			const file = fileLists.value.map((file, index) => {
				return {
					name: `file`,
					uri: file
				}
			})
			const res = await uploadApi(file, title.value, text.value, max.value)
			console.log(res)
			if (JSON.parse(res.data).code === 200) {
				uni.navigateBack()
				uni.showToast({
					title: "上传成功"
				})
				uni.$emit('updateActivity')
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
	.activity {
		width: 100vw;
		height: 100vh;

		.text {
			padding: 10px;
		}

		.price {
			padding: 10px;
			--van-cell-value-color: red;
		}

		.image {
			padding: 10px;

			.example-body {
				padding: 10px;
				padding-top: 0;
			}
		}
	}
</style>