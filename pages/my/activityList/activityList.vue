<template>
	<view class="activityList">
		<CenterLoading v-if="activityList === null"></CenterLoading>
		<Empty v-else-if="activityList?.length === 0"></Empty>
		<template v-else v-for="(activity, index) in activityList" :key="activity.id">
			<uni-list-chat clickable :title="activity.activityName" :avatar="activity.activityPhoto"
				:note="activity.activityDescription"
				:time="getPeople(activity.currentPeople, activity.activityMaxPeople)"
				@click="toOtherPage('groupChat', activity.id)"></uni-list-chat>
		</template>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryJoinedActivityApi
	} from "/pages/api/activity/activity.js"
	// 变量
	const activityList = ref(null)
	const getPeople = (current, total) => {
		return current + "/" + total + "人"
	}
	onLoad(async (e) => {
		const res = await queryJoinedActivityApi()
		if (res.data.code === 200) {
			activityList.value = res.data.data
		}
	})
	// 其他页面
	const toOtherPage = (key, activityId) => {
		const routes = {
			'groupChat': `/pages/message/groupChat/groupChat?activityId=${activityId}`
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
</script>

<style lang="less" scoped>
	.activityList {
		width: 100vw;
		height: 100vh;
	}
</style>