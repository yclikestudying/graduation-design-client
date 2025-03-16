<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="articleList === null"></Loading>
		<template v-else v-for="(article, index) in articleList" :key="article.id">
			<uni-card class="card" :title="article.userName" :sub-title="article.createTime"
				thumbnail="/static/my/默认头像.jpg" @click="toOtherPage('article', article.id)">
				<text class="uni-body">{{ article.articleContent }}</text>
				<view class="photo">
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
		defineProps
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryArticleApi
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
		}
	})
	onLoad(async (e) => {
		if (props.type === '主页动态') {
			const res = await queryArticleApi()
			articleList.value = res.data.data
			return;
		}
		if (props.type === '首页动态') {

		}
	})
	// 其他页面
	const toOtherPage = (key, param) => {
		const routes = {
			'article': `/pages/detail/article/article?articleId=${param}`
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
	uni.$on('deleteArticle', (articleId) => {
		articleList.value = articleList.value.filter(article => article.id !== articleId)
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