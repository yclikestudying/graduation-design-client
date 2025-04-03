<template>
	<view class="search" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="search-item">
			<uni-data-select class="select" v-model="select" :localdata="range" :clear="false"></uni-data-select>
			<uni-search-bar class="bar" v-model="keyword" placeholder="左侧选择搜索类型" clearButton="always"
				cancelButton="always" @cancel="cancel" @clear="clear" />
		</view>
		<scroll-view scroll-y="true" class="content">
			<view v-if="type === '用户'">
				<!-- 展示查询的用户 -->
				<Loading v-if="userList === null"></Loading>
				<Empty v-else-if="userList?.length === 0"></Empty>
				<template v-else v-if="type === '用户'" v-for="(user, index) in userList" :key="user.id">
					<uni-list-chat :title="user.userName" :avatar="user.userAvatar" clickable :note="user.userProfile"
						@click="toOtherPage('index', user.id)"></uni-list-chat>
				</template>
			</view>
			<view v-if="type === '动态'">
				<!-- 展示查询的动态 -->
				<Loading v-if="articleList === null"></Loading>
				<Empty v-else-if="articleList?.length === 0"></Empty>
				<template v-else v-for="(article, index) in articleList" :key="article.id">
					<uni-card class="card" :title="article.userName" :sub-title="formatWeChatTime(article.createTime)"
						thumbnail="/static/my/默认头像.jpg"
						@click="articleDetail('otherArticle', article.id)">
						<text class="uni-body">{{ article.articleContent }}</text>
						<view class="photo" @click.stop="articleDetail('image', null, article.articlePhotos)">
							<template v-for="(photo, index) in JSON.parse(article.articlePhotos)">
								<image slot='cover' style="width: 100%;" :src="photo"></image>
							</template>
						</view>
						<view slot="actions" class="card-actions">
							<view class="card-actions-item" @click.stop="onLike(article.like, article.id)">
								<uni-icons v-if="article.like === true" type="hand-up-filled" size="25" color="#ff0000"></uni-icons>
								<uni-icons v-else type="hand-up" size="25" color="#999"></uni-icons>
								<text class="card-actions-item-text">{{ article.likeCount === 0 ? '' : article.likeCount }}</text>
							</view>
							<view class="card-actions-item">
								<uni-icons type="chat" size="25" color="#999"></uni-icons>
								<text class="card-actions-item-text">10</text>
							</view>
						</view>
					</uni-card>
				</template>
			</view>
			<!-- 集市组件 -->
			<GoodsList v-if="type === '集市'" :isScroll="true" type="搜索商品" :keyword="keyword"></GoodsList>
			<!-- 跑腿组件 -->
			<ExpressList v-if="type === '跑腿'" :isScroll="true" type="搜索跑腿" :keyword="keyword"></ExpressList>
			<!-- 跑腿组件 -->
			<LostList v-if="type === '寻物'" :isScroll="true" type="搜索寻物" :keyword="keyword"></LostList>
			<!-- 活动组件 -->
			<ActivityList v-if="type === '活动'" :isScroll="true" type="搜索活动" :keyword="keyword"></ActivityList>
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
	import {
		queryArticleByKeywordApi,
		likeApi,
		cancelLikeApi
	} from "/pages/api/article/article.js"
	import {
		formatWeChatTime
	} from '../../util';
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
				userList.value = res.data.data || []
			} else {
				userList.value.length = 0
			}
		} else if (type.value === '动态') {
			if (value2 !== '') {
				const res = await queryArticleByKeywordApi(value2)
				articleList.value = res.data.data || []
			} else {
				articleList.value.length = 0
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
	// 其他页面
	const articleDetail = (key, param, data) => {
		const routes = {
			'article': `/pages/detail/article/article?articleId=${param}`,
			'otherArticle': `/pages/detail/article/otherArticle?articleId=${param}`,
			'image': '/pages/detail/image/image'
		}
		if (key === 'image') {
			uni.setStorageSync("image", data)
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
	// 点赞
	const onLike = async (like, articleId) => {
		if (like === false) {
			// 进行点赞
			const res = await likeApi(articleId)
			if (res.data.code === 200) {
				articleList.value = articleList.value.map(article => {
					if (article.id === articleId) {
						article.likeCount++;
						article.like = true;
					}
					return article
				})
			}
		} else {
			// 取消点赞
			const res = await cancelLikeApi(articleId)
			if (res.data.code === 200) {
				articleList.value = articleList.value.map(article => {
					if (article.id === articleId) {
						article.likeCount--;
						article.like = false;	
					}
					return article
				})
			}
		}
	}
	uni.$on('likeArticle', async () => {
		const res = await queryArticleByKeywordApi(keyword.value)
		articleList.value = res.data.data || []
	})
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
			
			.card {
			
				.card-actions {
					display: flex;
					justify-content: right;
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
	}
</style>