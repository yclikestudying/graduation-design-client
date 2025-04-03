<template>
	<scroll-view scroll-y="true" class="detail">
		<Empty v-if="article === null"></Empty>
		<uni-card v-else class="card" :title="article.userName" :sub-title="formatWeChatTime(article.createTime)"
			:thumbnail="article.userAvatar" @click="toOtherPage('index')">
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
import articleListVue from "../../../components/article/articleList.vue";
	// 变量
	const articleId = ref(''); // 动态id
	const article = ref(null);
	onLoad(async (e) => {
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
						// 自己的动态删除成功，那么就更新一下自己主页的动态列表
						uni.$emit('updateArticle', articleId.value)
					}
				}
			}
		});
	})
	// 其他页面
	const toOtherPage = (key, param, data) => {
		const routes = {
			'index': '/pages/my/myIndex/myIndex?identity=me',
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