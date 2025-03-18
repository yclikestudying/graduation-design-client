<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="activityList === null"></Loading>
		<Empty v-else-if="activityList?.length === 0"></Empty>
		<template v-else v-for="(activity, index) in activityList" :key="activity.id">
			<uni-card class="card" :extra="getPeople(activity.currentPeople, activity.activityMaxPeople)" :title="activity.activityName"
				:sub-title="activity.createTime"
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
	// 变量
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
		let res;
		if (props.type === "个人活动") {
			res = await queryActivityApi(props.currentUserId)

		} else if (props.type === "全部活动") {
			res = await queryAllActivityApi()
		} else {
			activityList.value = []
			return;
		}
		activityList.value = res.data.data ?? []
	})
</script>

<style lang="less" scoped>
	.page {
		width: 100%;
		height: 100%;
	}
</style>