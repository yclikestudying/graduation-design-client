<template>
	<view class="goodsMarket" @click="cancelShow">
		<view class="text">
			<uni-easyinput v-model="title" placeholder="商品名称"></uni-easyinput>
		</view>
		<view class="text">
			<uni-easyinput type="textarea" autoHeight v-model="text" placeholder="商品描述"></uni-easyinput>
		</view>
		<view class="price" @touchstart="show = true">
			<van-cell title="原价格" is-link :value="`￥${oldPrice}`" size="large" @click="changeCurrent('原价格')"/>
			<van-cell title="新价格" is-link :value="`￥${price}`" size="large" @click="changeCurrent('新价格')"/>
		</view>
		<view class="image">
			<view class="example-body">
				<uni-file-picker limit="1" title="选择1张图片" @select="onSelect" @delete="onDelete"></uni-file-picker>
			</view>
		</view>
		<view style="margin: 16px;">
			<van-button :loading="loading" loading-type="spinner" round block type="primary" native-type="submit"
				color="#4496F9" @click="onSubmit">
				发布
			</van-button>
		</view>
	</view>
	<van-number-keyboard :show="show" theme="custom" extra-key="." close-button-text="完成" @input="onInputNumber"
		@delete="onDeleteNumber" @blur="show = false">
		<template #delete>
			<van-icon name="delete" />
		</template>
	</van-number-keyboard>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import { uploadApi } from "/pages/api/goods/goods.js"
	// 数据
	const title = ref(''); // 商品名称
	const text = ref(''); // 文字内容
	const oldPrice = ref('0')
	const price = ref('0'); // 价格
	const fileLists = ref([]); // 图片
	const current = ref(null);
	const loading = ref(false); // 加载动画
	const show = ref(false);

	const changeCurrent = (status) => {
		current.value = status
	}
	// 数字键盘输入内容
	const onInputNumber = (value) => {
		if (current.value === '新价格') {
			price.value === '0' ? price.value = `${value}` : price.value += value
		} else {
			oldPrice.value === '0' ? oldPrice.value = `${value}` : oldPrice.value += value
		}
		
	}
	// 数字键盘删除内容
	const onDeleteNumber = () => {
		if (current.value === '新价格') {
			price.value = price.value.substring(0, price.value.length - 1)
			if (price.value.length === 0) {
				price.value = '0'
			}
		} else {
			oldPrice.value = oldPrice.value.substring(0, oldPrice.value.length - 1)
			if (oldPrice.value.length === 0) {
				oldPrice.value = '0'
			}
		}
	}
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
	// 上传内容
	const onSubmit = async () => {
		if (title.value === '' || text.value === '' || fileLists.value.length === 0) {
			uni.showToast({
				title: '内容或者图片不能为空',
				icon: 'none'
			})
			return;
		}
		const files = fileLists.value.map((file, index) => {
			return {
				name: `file`,
				uri: file
			}
		})
		loading.value = true
		try {
			const res = await uploadApi(files, text.value, title.value, oldPrice.value, price.value)
			if (JSON.parse(res.data).code === 200) {
				uni.navigateBack()
				uni.showToast({
					title: "上传成功"
				})
				// 上传成功，更新首页集市列表
				uni.$emit('uploadGoods')
			}
		} finally {
			loading.value = false
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