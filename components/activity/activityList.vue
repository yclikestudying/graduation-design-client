<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="activityList === null"></Loading>
		<view v-else-if="activityList?.length === 0">
			<PrivateSetting v-if="activitySetting === 1"></PrivateSetting>
			<Empty v-else></Empty>
		</view>
		<template v-else v-for="(activity, index) in activityList" :key="activity.id">
			<uni-card class="card" extra="详情" :title="activity.activityName" @click="toOtherPage(activity.id)"
				:sub-title="getPeople(activity.currentPeople, activity.activityMaxPeople)"
				:thumbnail="activity.activityPhoto">
				<text class="uni-body">{{ activity.activityDescription }}</text>
			</uni-card>
		</template>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		defineProps,
		watch,
		computed
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryActivityApi,
		queryAllActivityApi,
		queryActivityByKeywordApi
	} from "../../pages/api/activity/activity.js"
	import {
		querySettingApi
	} from "/pages/api/private/private.js"

	// 变量
	const activitySetting = ref(false); // 群聊隐私设置
	const activityList = ref(null)
	const getPeople = (current, total) => {
		return current + "/" + total + "人"
	}
	const props = defineProps({
		isScroll: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: ''
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
			const res = await queryActivityByKeywordApi(value)
			if (res.data.code === 200) {
				activityList.value = res.data.data || []
			}
		} else {
			activityList.value.length = 0
		}
	})
	onLoad(async (e) => {
		// 查询当前用户的隐私设置
		if (props.currentUserId !== null && props.type === '个人群聊') {
			const res2 = await querySettingApi(props.currentUserId)
			activitySetting.value = res2.data.data.activitySetting
		}
		
		let res;
		if (props.type === "个人群聊") {
			res = await queryActivityApi(props.currentUserId)

		} else if (props.type === "全部群聊") {
			res = await queryAllActivityApi()
		}
		
		if (res && res.data.code === 200) {
			activityList.value = res.data.data ?? []
		} else {
			activityList.value = []
		}
	})
	// 查看详情
	const toOtherPage = (activityId) => {
		uni.navigateTo({
			url: `/pages/detail/activity/activity?activityId=${activityId}`
		})
	}
	// 一旦有人加入队伍或发布新活动，更新数据
	uni.$on('updateActivity', async () => {
		if (props.type === '全部活动') {
			const res = await queryAllActivityApi()
			activityList.value = res.data.data ?? []
		}
	})
</script>

<style lang="less" scoped>
	.page {
		width: 100%;
		height: 100%;
	}
</style>