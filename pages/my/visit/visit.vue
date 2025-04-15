<template>
	<view class="visit">
		<CenterLoading v-if="userList === null"></CenterLoading>
		<Empty v-else-if="userList?.length === 0"></Empty>
		<template v-else v-for="(user, index) in userList" :key="user.id">
			<uni-list-chat clickable :title="user.userName" :avatar="user.userAvatar" :note="user.userProfile"
				:time="user.visitTime"></uni-list-chat>
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
		queryVisitorApi
	} from "/pages/api/visitor/visitor.js"
	import {
		deleteVisitorApi
	} from "/pages/api/visitor/visitor.js"
	// 变量
	const userList = ref(null)
	onLoad(async (e) => {
		const res = await queryVisitorApi()
		if (res.data.code === 200) {
			userList.value = res.data.data
		}
	})
	
	// 监听页面删除按钮
	onNavigationBarButtonTap(() => {
		uni.showModal({
			title: '温馨提示',
			content: '确认清空全部访问记录吗？',
			success: async function(res) {
				if (res.confirm) {
					const res2 = await deleteVisitorApi()
					if (res2.data.code === 200) {
						userList.value.length = 0
					}
				}
			}
		})
	})
</script>

<style lang="less" scoped>
	.visit {
		width: 100vw;
		height: 100vh;
	}
</style>