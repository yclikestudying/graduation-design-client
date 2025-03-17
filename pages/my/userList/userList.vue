<template>
	<scroll-view scroll-y="true" class="userList">
		<CenterLoading v-if="userList === null"></CenterLoading>
		<Empty v-else-if="userList?.length === 0"></Empty>
		<template v-else v-for="(user, index) in userList" :key="user.id">
			<uni-list-chat clickable :title="user.userName"
				:avatar="user.userAvatar"
				:note="user.userProfile" @click="toOtherPage('index', user.id)"></uni-list-chat>
		</template>
	</scroll-view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from "@dcloudio/uni-app"
	import { queryFriendApi, queryFansApi, queryEachApi } from "/pages/api/user/user.js"
	// 变量
	const title = ref(null);
	const userList = ref(null)
	onLoad(async(e) => {
		title.value = e.title
		uni.setNavigationBarTitle({
			title: title.value
		})
		let res;
		if (title.value === '关注') {
			res = await queryFriendApi()
		} else if (title.value === '粉丝') {
			res = await queryFansApi()
		} else {
			res = await queryEachApi()
		}
		userList.value = res.data.data ?? []
	})
	// 其他页面
	const toOtherPage = (key, param) => {
		const routes = {
			'index': `/pages/my/myIndex/myIndex?identity=other&userId=${param}`,
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
	// 取消关注时，更新关注和互关列表
	uni.$on('userList', (userId) => {
		if (title.value === '关注' || title.value === '互关') {
			userList.value = userList.value.filter(user => user.id !== userId)
		}
	})
</script> 

<style lang="less" scoped>
	.userList {
		width: 100vw;
		height: 100vh;
	}
</style>
