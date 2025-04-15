<template>
	<view class="problemList">
		<CenterLoading v-if="problemList === null"></CenterLoading>
		<Empty v-else-if="problemList?.length === 0"></Empty>
		<template v-for="(problem, index) in problemList">
			<uni-card :title="getStatus(problem.status)" :sub-title="problem.createTime"
				:thumbnail="problem.problemPhoto">
				<text class="uni-body">{{ problem.problemContent }}</text>
			</uni-card>
		</template>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onNavigationBarButtonTap
	} from "@dcloudio/uni-app"
	import {
		queryProblemApi,
		deleteAllApi
	} from "/pages/api/problem/problem.js"

	const problemList = ref(null); // 问题和意见列表

	onLoad(async (e) => {
		const res = await queryProblemApi()
		if (res.data.code === 200) {
			problemList.value = res.data.data
		}
	})

	const getStatus = (status) => {
		if (status === 0) {
			return "未处理"
		} else {
			return "已处理"
		}
	}

	// 监听页面删除按钮
	onNavigationBarButtonTap(() => {
		uni.showModal({
			title: '温馨提示',
			content: '确认清空全部反馈记录吗？',
			success: async function(res) {
				if (res.confirm) {
					const res2 = await deleteAllApi()
					if (res2.data.code === 200) {
						problemList.value.length = 0
					}
				}
			}
		})
	})
</script>

<style lang="less" scoped>
	.problemList {
		width: 100vw;
		height: 100vh;
	}
</style>