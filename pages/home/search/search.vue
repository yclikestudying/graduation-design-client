<template>
	<view class="search" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="search-item">
			<uni-data-select class="select" v-model="select" :localdata="range" :clear="false"></uni-data-select>
			<uni-search-bar class="bar" v-model="keyword" placeholder="左侧选择搜索类型" clearButton="always"
				cancelButton="always" @cancel="cancel" @clear="clear" />
		</view>
		<scroll-view scroll-y="true" class="content">
			<template v-for="(item, index) in user" :key="item.id">
				<uni-list-chat :title="item.userName" :avatar="item.userAvatar" clickable :note="item.userProfile"
					@click="toOtherPage('index', item.id)"></uni-list-chat>
			</template>
		</scroll-view>
	</view>
</template>

<script setup>
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
	const keyword = ref('');
	const select = ref(null)
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
			text: "商品"
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
	let user = ref(null);
	watch(keyword, async (newValue) => {
		if (select.value !== null) {
			if (keyword.value !== '') {
				if (range[select.value].text === '用户') {
					const res = await queryUserApi(keyword.value)
					user.value = res.data.data
				}
			} else {
				user.value = null
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