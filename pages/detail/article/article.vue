<template>
	<scroll-view scroll-y="true" class="detail">
		<Loading v-if="article === null"></Loading>
		<uni-card v-else class="card" :title="article.userName" :sub-title="article.createTime"
			thumbnail="/static/my/默认头像.jpg">
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
	onNavigationBarButtonTap(() => {
		uni.showModal({
			title: '温馨提示',
			content: '确定删除该动态吗？',
			success: async function(res) {
				if (res.confirm) {
					const res1 = await deleteArticleApi(articleId.value)
					if (res1.data.code === 200) {
						uni.navigateBack()
						uni.showToast({
							title: '删除成功'
						})
						uni.$emit('deleteArticle', articleId.value)
					}
				}
			}
		});
	})
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
