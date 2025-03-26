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
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryVisitApi
	} from "/pages/api/user/user.js"
	// 变量
	const userList = ref(null)
	onLoad(async (e) => {
		const res = await queryVisitApi()
		if (res.data.code === 200) {
			userList.value = res.data.data
		}
	})
</script>

<style lang="less" scoped>
	.visit {
		width: 100vw;
		height: 100vh;
	}
</style>