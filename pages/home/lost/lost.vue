<template>
	<view class="publish">
		<van-cell title="发布类型" />
		<view class="item">
			<uni-data-select v-model="type" :localdata="range"></uni-data-select>
		</view>
		<van-cell title="物品名称" />
		<view class="item">
			<uni-easyinput class="uni-mt-5" trim="all" v-model="name" placeholder="请输入物品名称"></uni-easyinput>
		</view>
		<van-cell title="描述" />
		<view class="item">
			<uni-easyinput type="textarea" v-model="des" placeholder="丢失或者拾到过程描述"></uni-easyinput>
		</view>
		<van-cell title="上传图片" />
		<view class="item">
			<uni-file-picker limit="1" title="物品相关图片" @select="onSelect" @delete="onDelete"></uni-file-picker>
		</view>
		<view class="submit" @click="publish">
			<van-button class="button" :loading="isLoading" round type="primary" loading-type="spinner"
				:disabled="disabled">上传</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
	import {
		uploadApi,
		uploadNoFileApi
	} from "/pages/api/lost/lost.js"
	// 数据
	let type = ref(null); // 发布物品信息类型
	let files = ref(null); // 图片文件
	let name = ref(null); // 物品名称
	let des = ref(null); // 丢失或者拾到过程描述
	let isLoading = ref(false); // 上传时按钮加载动画
	let disabled = ref(true); // 内容不完整，按钮禁止点击
	let baseURL = 'http://192.168.180.28:8080'
	let url = '/express/publish'
	const range = [{
			value: 0,
			text: "失物招领"
		},
		{
			value: 1,
			text: "寻物启事"
		}
	]

	// 侦听器，发布内容完善，按钮允许点击
	watch([type, name, des], ([newType, newName, newDes]) => {
		if (newType === null || newType === '' || newName === null || newName === '' || newDes === null ||
			newDes === '') {
			disabled.value = true
		} else {
			disabled.value = false
		}
	})

	// 选择图片后触发
	const onSelect = (event) => {
		files.value = []
		files.value.push(event.tempFiles[0].file.path)
	}
	// 图片从列表中删除
	const onDelete = (event) => {
		files.value = null
	}
	// 上传
	const publish = async () => {
		if (files.value === null) {
			try {
				isLoading.value = true
				const res = await uploadNoFileApi(range[type.value].text, name.value, des.value)
				if (res.data.code === 200) {
					uni.navigateBack()
					uni.showToast({
						title: '上传成功'
					})
					uni.$emit('updateLost')
				} else {
					uni.showToast({
						title: res.data.message,
						icon: 'none'
					})
				}
			} finally {
				isLoading.value = false
			}
		} else {
			const file = files.value.map((file, index) => {
				return {
					name: `file`,
					uri: file
				}
			})
			try {
				isLoading.value = true
				const res = await uploadApi(file, range[type.value].text, name.value, des.value)
				if (JSON.parse(res.data).code === 200) {
					uni.navigateBack()
					uni.showToast({
						title: "上传成功"
					})
					uni.$emit('updateLost')
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
	}
</script>

<style lang="less" scoped>
	.publish {
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