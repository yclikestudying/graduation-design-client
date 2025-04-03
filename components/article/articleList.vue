<template>
	<scroll-view class="page" :scroll-y="isScroll">
		<Loading v-if="articleList === null"></Loading>
		<Empty v-else-if="articleList?.length === 0"></Empty>
		<template v-else v-for="(article, index) in articleList" :key="article.id">
			<uni-card class="card" :title="article.userName" :sub-title="formatWeChatTime(article.createTime)"
				thumbnail="/static/my/默认头像.jpg"
				@click="toOtherPage((props.type === '个人动态' && props.currentUserId === null) ? 'article' : 'otherArticle', article.id)">
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
		likeApi,
		cancelLikeApi
	} from "/pages/api/article/article.js"
	import {
		formatWeChatTime
	} from '../../pages/util';
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
		}
		if (res && res.data.code === 200) {
			articleList.value = res.data.data
		} else {
			articleList.value = []
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
	
	// 自己删除动态之后，更新所有的动态列表
	uni.$on('updateArticle', (articleId) => {
		articleList.value = articleList.value.filter(article => article.id !== articleId)
	})
	// 点赞或取消点赞之后更新动态
	uni.$on('likeArticle', async () => {
		if (props.type === '个人动态') {
			const res = await queryArticleApi(props.currentUserId)
			articleList.value = res.data.data
		}
		if (props.type === '校园动态') {
			const res = await queryArticleOfSchoolApi()
			articleList.value = res.data.data
		}
	})
	// 添加关注时，更新关注动态
	uni.$on('addFriend', async () => {
		if (props.type === '关注动态') {
			const res = await queryArticleOfAttentionApi()
			articleList.value = res.data.data
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