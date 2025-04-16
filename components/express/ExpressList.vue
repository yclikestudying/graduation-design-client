<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="expressList === null"></Loading>
		<view v-else-if="expressList?.length === 0">
			<PrivateSetting v-if="expressSetting === 1"></PrivateSetting>
			<Empty v-else></Empty>
		</view>
		<template v-else v-for="(express, index) in expressList" :key="express.id">
			<uni-card :title="express.userName"
				:extra="type === '个人跑腿' && express.userId === myId ? '点击删除' : type !== '个人跑腿' && express.userId === myId ? '自己' : '联系我'"
				:sub-title="express.createTime" :thumbnail="express.userAvatar"
				@click="deleteExpress(type === '个人跑腿' && express.userId === myId ? '点击删除' : type !== '个人跑腿' && express.userId === myId ? '自己' : '联系我', express.id)">
				<text class="uni-body">{{ express.expressContent }}</text>
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
		queryExpressApi,
		queryAllExpressApi,
		queryExpressByKeywordApi,
		deleteExpressApi
	} from "/pages/api/express/express.js"
	import {
		querySettingApi
	} from "/pages/api/private/private.js"

	// 变量
	const expressSetting = ref(false); // 跑腿隐私设置
	const myId = ref(uni.getStorageSync("user").id)
	const expressList = ref(null);
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
			const res = await queryExpressByKeywordApi(value)
			if (res.data.code === 200) {
				expressList.value = res.data.data || []
			}
		} else {
			expressList.value.length = 0
		}
	})
	onLoad(async (e) => {
		// 查询当前用户的隐私设置
		if (props.currentUserId !== null && props.type === '个人跑腿') {
			const res2 = await querySettingApi(props.currentUserId)
			expressSetting.value = res2.data.data.expressSetting
		}
		let res;
		if (props.type === '个人跑腿') {
			if (expressSetting.value !== 1) {
				res = await queryExpressApi(props.currentUserId)
			}
		} else if (props.type === '全部跑腿') {
			res = await queryAllExpressApi()
		}
		if (res && res.data.code === 200) {
			expressList.value = res.data.data ?? []
		} else {
			expressList.value = []
		}
	})
	// 删除跑腿任务
	const deleteExpress = (name, expressId) => {
		if (name === '点击删除') {
			uni.showModal({
				title: '温馨提示',
				content: '确定删除该跑腿任务吗？',
				success: async function(res) {
					if (res.confirm) {
						const res1 = await deleteExpressApi(expressId)
						if (res1.data.code === 200) {
							uni.showToast({
								title: '删除成功'
							})
							// 当前跑腿任务列表进行过滤
							expressList.value = expressList.value.filter(express => express.id !==
								expressId)
							// 首页全部跑腿任务中的列表进行过滤
							uni.$emit('deleteExpress')
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
	// 上传成功，更新首页跑腿任务
	uni.$on('uploadExpress', async () => {
		if (props.type === '全部跑腿') {
			const res = await queryAllExpressApi()
			expressList.value = res.data.data || []
		}
	})
	// 删除成功，首页全部跑腿任务中的列表进行过滤
	uni.$on('deleteExpress', async () => {
		if (props.type === '全部跑腿') {
			const res = await queryAllExpressApi()
			expressList.value = res.data.data || []
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