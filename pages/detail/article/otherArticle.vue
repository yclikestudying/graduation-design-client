<template>
	<scroll-view scroll-y="true" class="detail">
		<Empty v-if="article === null" description="该动态已经被删除"></Empty>
		<uni-card v-else class="card" :title="article.userName" :sub-title="formatWeChatTime(article.createTime)"
			thumbnail="/static/my/默认头像.jpg" @click="toOtherPage('index')">
			<text class="uni-body">{{ article.articleContent }}</text>
			<view class="photo" @click.stop="toOtherPage('image', null, article.articlePhotos)">
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
	</scroll-view>
</template>

<script setup>
	import {
		onLoad,
		onNavigationBarButtonTap
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	import {
		queryOneApi,
		deleteArticleApi,
		likeApi,
		cancelLikeApi
	} from "/pages/api/article/article.js"
	import {
		formatWeChatTime
	} from '../../util';
	// 变量
	const articleId = ref(''); // 动态id
	const article = ref(null);
	onLoad(async (e) => {
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
	// 点赞
	const onLike = async (like, articleId) => {
		if (like === false) {
			// 进行点赞
			const res = await likeApi(articleId)
			if (res.data.code === 200) {
				article.value.likeCount++;
				article.value.like = true;
			}
		} else {
			// 取消点赞
			const res = await cancelLikeApi(articleId)
			if (res.data.code === 200) {
				article.value.likeCount--;
				article.value.like = false;
			}
		}
		uni.$emit('likeArticle')
	}
</script>

<style lang="less" scoped>
	.detail {
		width: 100vw;
		height: 100vh;

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
</style>