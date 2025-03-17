<template>
	<scroll-view scroll-y="true" class="detail">
		<Loading v-if="article === null"></Loading>
		<uni-card v-else class="card" :title="article.userName" :sub-title="article.createTime"
			thumbnail="/static/my/默认头像.jpg" @click="toOtherPage('index')">
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
	</scroll-view>
</template>

<script setup>
	import { onLoad, onNavigationBarButtonTap } from "@dcloudio/uni-app"
	import { ref } from "vue";
	import { queryOneApi, deleteArticleApi } from "/pages/api/article/article.js"
	// 变量
	const articleId = ref(''); // 动态id
	const article = ref(null);
	onLoad(async(e) => {
		articleId.value = Number(e.articleId)
		const res = await queryOneApi(articleId.value)
		article.value = res.data.data
	})
	// 其他页面
	const toOtherPage = (key, param, data) => {
		const routes = {
			'index': `/pages/my/myIndex/myIndex?identity=other&userId=${article.value.userId}`,
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
</script>

<style lang="less" scoped>
	.detail {
		width: 100vw;
		height: 100vh;
		
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
