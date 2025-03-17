<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="goodsList === null"></Loading>
		<Empty v-else-if="goodsList?.length === 0"></Empty>
		<template v-else v-for="(goods, index) in goodsList" :key="goods.id">
			<uni-card class="card" :title="goods.userName" :sub-title="goods.createTime"
				:extra="type === '个人商品' && goods.userId === myId ? '点击删除' : type !== '个人商品' && goods.userId === myId ? '自己' : '联系我'"
				:thumbnail="goods.userAvatar"
				@click="deleteGoods(type === '个人商品' && goods.userId === myId ? '点击删除' : type !== '个人商品' && goods.userId === myId ? '自己' : '联系我', goods.id)">
				<van-card :price="goods.goodsPrice" :desc="goods.goodsContent" :title="goods.goodsTitle"
					:thumb="goods.goodsPhotos" :origin-price="goods.goodsOldPrice"
					@click.stop="check('image', null, goods.goodsPhotos)" />
			</uni-card>
		</template>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		defineProps,
		watch
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryGoodsApi,
		queryAllGoodsApi,
		queryGoodsByKeywordApi,
		deleteGoodsApi
	} from "/pages/api/goods/goods.js"
	// 变量
	const myId = ref(uni.getStorageSync("user").id)
	const goodsList = ref(null);
	const extra = ref(null);
	const props = defineProps({
		isScroll: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: null
		},
		currentUserId: {
			type: Number,
			default: null
		},
		keyword: {
			type: String,
			default: null
		}
	})
	watch(() => props.keyword, async (value) => {
		if (value !== '') {
			const res = await queryGoodsByKeywordApi(value)
			if (res.data.code === 200) {
				goodsList.value = res.data.data || []
			}
		} else {
			goodsList.value.length = 0
		}
	})
	onLoad(async (e) => {
		let res;
		if (props.type === "个人商品") {
			res = await queryGoodsApi(props.currentUserId)

		} else if (props.type === "全部商品") {
			res = await queryAllGoodsApi()
		} else {
			goodsList.value = []
			return;
		}
		goodsList.value = res.data.data ?? []
	})
	// 查看图片
	const check = (key, param, data) => {
		const routes = {
			'image': '/pages/detail/image/image'
		}
		if (key === 'image') {
			const image = ref([])
			image.value.push(data)
			uni.setStorageSync("image", JSON.stringify(image.value))
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
	// 删除商品
	const deleteGoods = (name, goodsId) => {
		if (name === '点击删除') {
			uni.showModal({
				title: '温馨提示',
				content: '确定删除该商品吗？',
				success: async function(res) {
					if (res.confirm) {
						const res1 = await deleteGoodsApi(goodsId)
						if (res1.data.code === 200) {
							uni.showToast({
								title: '删除成功'
							})
							// 当前商品列表进行过滤
							goodsList.value = goodsList.value.filter(goods => goods.id !== goodsId)
							// 首页全部商品中的列表进行过滤
							uni.$emit('deleteGoods')
						} else {
							uni.showToast({
								title: res1.data.message,
								icon: 'none'
							})
						}
					}
				}
			})
		}
	}
	// 上传成功，更新首页集市列表
	uni.$on('uploadGoods', async () => {
		if (props.type === '全部商品') {
			const res = await queryAllGoodsApi()
			goodsList.value = res.data.data ?? []
		}
	})
	// 用户删除商品时，更新首页商品列表
	uni.$on('deleteGoods', async () => {
		if (props.type === '全部商品') {
			const res = await queryAllGoodsApi()
			goodsList.value = res.data.data ?? []
		}
	})
</script>

<style lang="less" scoped>
	.page {
		width: 100%;
		height: 100%;

		.card {

			.card-actions {
				display: flex;
				justify-content: space-around;
			}

			.photo {

				image {
					margin-right: 1px;
					width: 95px !important;
					height: 95px;
				}
			}
		}
	}
</style>