<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="articleList === null"></Loading>
		<Empty v-else-if="articleList?.length === 0"></Empty>
		<template v-else v-for="(article, index) in articleList" :key="article.id">
			<uni-card class="card" :title="article.userName" :sub-title="article.createTime"
				thumbnail="/static/my/默认头像.jpg" @click="toOtherPage((props.type === '个人动态' && props.currentUserId === null) ? 'article' : 'otherArticle', article.id)">
				<text class="uni-body">{{ article.articleContent }}</text>
				<view class="photo" @click.stop="toOtherPage('image', null, article.articlePhotos)">
					<template v-for="(photo, index) in JSON.parse(article.articlePhotos)">
						<image slot='cover' style="width: 100%;" :src="photo"></image>
					</template>
				</view>
				<view slot="actions" class="card-actions">
					<view class="card-actions-item" @click="actionsClick('分享')">
						<uni-icons type="redo" size="18" color="#999"></uni-icons>
						<text class="card-actions-item-text">分享</text>
					</view>
					<view class="card-actions-item" @click="actionsClick('点赞')">
						<uni-icons type="heart" size="18" color="#999"></uni-icons>
						<text class="card-actions-item-text">点赞 10</text>
					</view>
					<view class="card-actions-item" @click="actionsClick('评论')">
						<uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
						<text class="card-actions-item-text">评论 10</text>
					</view>
				</view>
			</uni-card>
		</template>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		defineProps,
		watch
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryArticleApi,
		queryArticleOfSchoolApi,
		queryArticleOfAttentionApi,
		queryArticleByKeywordApi
	} from "/pages/api/article/article.js"
	// 变量
	const articleList = ref(null);
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
			const res = await queryArticleByKeywordApi(value)
			if (res.data.code === 200) {
				articleList.value = res.data.data || []
			}
		} else {
			articleList.value.length = 0
		}
	})
	onLoad(async (e) => {
		let res;
		if (props.type === '个人动态') {
			res = await queryArticleApi(props.currentUserId)
		} else if (props.type === '校园动态') {
			res = await queryArticleOfSchoolApi()
		} else if (props.type === '关注动态') {
			res = await queryArticleOfAttentionApi()
		} else {
			articleList.value = []
			return;
		}
		if (res.data.code === 200) {
			articleList.value = res.data.data || []
		}
	})
	// 其他页面
	const toOtherPage = (key, param, data) => {
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
	// 上传成功，更新首页动态
	uni.$on('addArticle', async () => {
		if (props.type === '校园动态') {
			const res = await queryArticleOfSchoolApi()
			articleList.value = res.data.data ?? []
		}	
	})
	// 用户删除动态时，清除这个组件里面的相关动态
	uni.$on('deleteArticle', (articleId) => {
		articleList.value = articleList.value.filter(article => article.id !== articleId)
	})
	// 取消关注用户时，关注用户的动态进行删除
	uni.$on('cancelFriend', (userId) => {
		if (props.type === '关注动态') {
			articleList.value = articleList.value.filter(article => article.userId !== userId)
		}
	})
	// 添加关注时，更新关注动态
	uni.$on('addFriend', async () => {
		if (props.type === '关注动态') {
			const res = await queryArticleOfAttentionApi()
			articleList.value = res.data.data ?? []
		}
	})
</script>

<style lang="less" scoped>
	.page {
		width: 100%;
		height: 100%;

		.card {

			.card-actions {
				display: flex;
				justify-content: space-around;
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
</style>