<template>
	<view class="goodsMarket" @click="cancelShow">
		<view class="text">
			<uni-easyinput type="textarea" autoHeight v-model="text" placeholder="内容"></uni-easyinput>
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
	import {
		uploadApi
	} from "/pages/api/express/express.js"
	// 数据
	const text = ref(''); // 文字内容
	const loading = ref(false);
	// 提交
	const onSubmit = async () => {
		const res = await uploadApi(text.value)
		if (res.data.code === 200) {
			uni.navigateBack()
			uni.showToast({
				title: '上传成功'
			})
			// 上传成功，更新首页跑腿任务
			uni.$emit('uploadExpress')
		} else {
			uni.showToast({
				title: res.data.message,
				icon: 'none'
			})
		}
	}
</script>

<style lang="less" scoped>
	.goodsMarket {
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