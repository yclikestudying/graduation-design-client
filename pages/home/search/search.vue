<template>
	<view class="search" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="search-item">
			<uni-data-select class="select" v-model="select" :localdata="range" :clear="false"></uni-data-select>
			<uni-search-bar class="bar" v-model="keyword" placeholder="左侧选择搜索类型" clearButton="always"
				cancelButton="always" @cancel="cancel" @clear="clear" />
		</view>
		<scroll-view scroll-y="true" class="content">
			<!-- 展示查询的用户 -->
			<template v-if="type === '用户'" v-for="(user, index) in userList" :key="user.id">
				<uni-list-chat :title="user.userName" :avatar="user.userAvatar" clickable :note="user.userProfile"
					@click="toOtherPage('index', user.id)"></uni-list-chat>
			</template>
			<!-- 动态组件 -->
			<ArticleList v-if="type === '动态'" :isScroll="true" type="搜索动态" :keyword="keyword"></ArticleList>
			<!-- 集市组件 -->
			<GoodsList v-if="type === '集市'" :isScroll="true" type="搜索商品" :keyword="keyword"></GoodsList>
			<!-- 跑腿组件 -->
			<ExpressList v-if="type === '跑腿'" :isScroll="true" type="搜索跑腿" :keyword="keyword"></ExpressList>
		</scroll-view>
	</view>
</template>

<script setup>
	import ArticleList from "/components/article/articleList.vue"
	import GoodsList from "/components/goods/goodsList.vue"
	import ActivityList from "/components/activity/activityList.vue"
	import ExpressList from "/components/express/expressList.vue"
	import LostList from "/components/lost/lostList.vue"
	import {
		ref,
		watch
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryUserApi
	} from "/pages/api/user/user.js"
	// 变量
	const statusBarHeight = ref(0);
	const keyword = ref(null);
	const select = ref(null)
	const type = ref(null)
	const range = [{
			value: 0,
			text: "用户"
		},
		{
			value: 1,
			text: "动态"
		},
		{
			value: 2,
			text: "集市"
		},
		{
			value: 3,
			text: "跑腿"
		},
		{
			value: 4,
			text: "寻物"
		},
		{
			value: 5,
			text: "活动"
		}
	]
	const userList = ref([]);
	const articleList = ref([]);
	watch([select, keyword], async ([value1, value2]) => {
		type.value = range[value1].text
		keyword.value = value2
		if (type.value === '用户') {
			if (value2 !== '') {
				const res = await queryUserApi(value2)
				userList.value = res.data.data
			} else {
				userList.value.length = 0
			}
		}
	})
	onLoad((e) => {
		const systemInfo = uni.getSystemInfoSync();
		statusBarHeight.value = systemInfo.statusBarHeight;
	})
	// 返回
	const cancel = () => {
		uni.navigateBack()
	}
	// 清除搜索内容
	const clear = () => {
		keyword.value = ''
	}
	// 其他页面
	const toOtherPage = (key, param) => {
		const routes = {
			'index': `/pages/my/myIndex/myIndex?identity=other&userId=${param}`
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
</script>

<style lang="less" scoped>
	.search {
		width: 100vw;
		height: 100vh;

		.search-item {
			display: flex;
			padding-left: 5px;

			.select {
				width: 50px !important;
			}

			.bar {
				width: 300px;
			}
		}

		.content {
			width: 100%;
			height: calc(100% - 56px);
		}
	}
</style>