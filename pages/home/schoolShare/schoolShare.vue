<template>
	<view class="schoolShare">
		<view class="text">
			<uni-easyinput type="textarea" autoHeight v-model="text" placeholder="请输入内容"></uni-easyinput>
		</view>
		<view class="image">
			<view class="example-body">
				<uni-file-picker limit="9" title="最多选择9张图片" @select="onSelect" @delete="onDelete"></uni-file-picker>
			</view>
		</view>
		<view style="margin: 16px;">
			<van-button :loading="isLoading" type="primary" loading-type="spinner" round block native-type="submit"
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
	import { uploadApi, uploadTextApi } from "/pages/api/article/article.js"
	// 数据
	let fileLists = ref([])
	let text = ref('')
	let isLoading = ref(false)
	// 选择图片后触发
	const onSelect = (event) => {
		event.tempFiles.forEach(tempFile => {
			fileLists.value.push(tempFile.file.path)
		})
	}
	// 图片从列表中删除
	const onDelete = (event) => {
		fileLists.value.splice(event.index, 1)
	}
	// 上传文件
	const onSubmit = async () => {
		isLoading.value = true
		try {
			// 单独上传文本
			if (fileLists.value.length === 0) {
				const res = await uploadTextApi(text.value)
				if (res.data.code === 200) {
					uni.navigateBack()
					uni.showToast({
						title: "上传成功"
					})
					text.value = ''
				}
				return;
			}
			// 上传图片或上传文本和图片
			const files = fileLists.value.map((file, index) => {
				return {
					name: `file${index}`,
					uri: file
				}
			})
			const res = await uploadApi(files, text.value)
			if (JSON.parse(res.data).code === 200) {		
				uni.navigateBack()
				uni.showToast({
					title: "上传成功"
				})
				fileLists.value.length = 0
				text.value = ''
			}
		} finally {
			isLoading.value = false
		}
	}
</script>

<style lang="less" scoped>
	.schoolShare {
		width: 100vw;
		height: 100vh;

		.text {
			padding: 10px;
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