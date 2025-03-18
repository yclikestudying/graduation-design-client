<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="lostList === null"></Loading>
		<Empty v-else-if="lostList?.length === 0"></Empty>
		<template v-else v-for="(lost, index) in lostList" :key="lost.id">
			<template v-if="lost.lostPhoto === null">
				<uni-card :title="lost.userName" :sub-title="lost.createTime"
					:extra="type === '个人寻物' && lost.userId === myId ? '点击删除' : type !== '个人寻物' && lost.userId === myId ? '自己' : '联系我'"
					:thumbnail="lost.userAvatar"
					@click="deleteGoods(type === '个人寻物' && lost.userId === myId ? '点击删除' : type !== '个人寻物' && lost.userId === myId ? '自己' : '联系我', lost.id)">
					<text class="uni-body">{{ lost.lostType+'-'+lost.lostName+'-'+lost.lostDescription }}</text>
				</uni-card>
			</template>
			<template v-else>
				<uni-card class="card" :title="lost.userName" :sub-title="lost.createTime" :thumbnail="lost.userAvatar"
					@click="deleteGoods(type === '个人寻物' && lost.userId === myId ? '点击删除' : type !== '个人寻物' && lost.userId === myId ? '自己' : '联系我', lost.id)"
					:extra="type === '个人寻物' && lost.userId === myId ? '点击删除' : type !== '个人寻物' && lost.userId === myId ? '自己' : '联系我'">
					<van-card :desc="lost.lostDescription" :title="lost.lostType+'-'+lost.lostName"
						:thumb="lost.lostPhoto" @click.stop="check('image', null, lost.lostPhoto)" />
				</uni-card>
			</template>
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
		queryAllLostApi,
		queryLostApi,
		queryLostByKeywordApi,
		deleteLostApi
	} from "/pages/api/lost/lost.js"
	// 变量
	const myId = ref(uni.getStorageSync("user").id)
	const lostList = ref(null)
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
			const res = await queryLostByKeywordApi(value)
			if (res.data.code === 200) {
				lostList.value = res.data.data || []
			}
		} else {
			lostList.value.length = 0
		}
	})
	onLoad(async (e) => {
		let res;
		if (props.type === "个人寻物") {
			res = await queryLostApi(props.currentUserId)

		} else if (props.type === "全部寻物") {
			res = await queryAllLostApi()
		} else {
			lostList.value = []
			return;
		}
		lostList.value = res.data.data ?? []
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
	const deleteGoods = (name, lostId) => {
		if (name === '点击删除') {
			uni.showModal({
				title: '温馨提示',
				content: '确定删除该寻物启事吗？',
				success: async function(res) {
					if (res.confirm) {
						const res1 = await deleteLostApi(lostId)
						if (res1.data.code === 200) {
							uni.showToast({
								title: '删除成功'
							})
							// 当前商品列表进行过滤
							lostList.value = lostList.value.filter(lost => lost.id !== lostId)
							// 个人删除寻物启事成功后，更新首页全部寻物启事列表
							uni.$emit('updateLost')
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
	// 个人上传成功或者删除成功后，更新首页列表
	uni.$on('updateLost', async () => {
		if (props.type === '全部寻物') {
			const res = await queryAllLostApi()
			lostList.value = res.data.data ?? []
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