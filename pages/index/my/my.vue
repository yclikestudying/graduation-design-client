<template>
	<view class="my">
		<view class="background">
			<image src="/static/my/backgroundImage.jpg" mode=""></image>
			<view class="user" @click="toOtherPage('index')">
				<view class="avatar">
					<image :src="user.userAvatar" mode=""></image>
				</view>
				<view class="right">
					<view class="name">
						<text>{{ user.userName }}</text>
						<view v-if="user.userRole === 'admin'" class="image">
							<van-tag type="primary" size="mini">
								管理员
							</van-tag>
						</view>
					</view>
					<view>
						<uni-icons type="right" size="30" color="#ffffff"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="data">
				<view class="data-item">
					<text>{{ articleCount }}</text>
					<text>动态</text>
				</view>
				<view class="data-item" @click="toOtherPage('userList', '互关')">
					<text>{{ eachCount }}</text>
					<text>互关</text>
				</view>
				<view class="data-item" @click="toOtherPage('userList', '关注')">
					<text>{{ friendCount }}</text>
					<text>关注</text>
				</view>
				<view class="data-item" @click="toOtherPage('userList', '粉丝')">
					<text>{{ fansCount }}</text>
					<text>粉丝</text>
				</view>
				<view class="data-item" @click="toOtherPage('activityList')">
					<text>{{ activityCount }}</text>
					<text>群聊</text>
				</view>
			</view>
			<view class="function">
				<van-cell title="功能" style="background-color: #F2F2F2;" />
				<view class="item" @click="toOtherPage('visit')">
					<van-cell title="访客" icon="eye-o" is-link>
					</van-cell>
				</view>
				<van-cell title="其他" style="background-color: #F2F2F2;" />
				<view class="item" @click="toOtherPage('setting')">
					<van-cell title="系统设置" icon="setting-o" is-link>
					</van-cell>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		articleCountApi
	} from "/pages/api/article/article.js"
	import {
		friendCountApi,
		fansCountApi,
		eachCountApi
	} from "/pages/api/friend/friend.js"
	import {
		queryCountApi
	} from "/pages/api/activity/activity.js"
	// 变量
	const user = ref(uni.getStorageSync("user"))
	const articleCount = ref(0);
	const eachCount = ref(0);
	const friendCount = ref(0);
	const fansCount = ref(0);
	const activityCount = ref(0)
	onShow(async () => {
		user.value = uni.getStorageSync("user")
		// 查询我的动态数量
		const res = await articleCountApi()
		articleCount.value = res.data.data
		// 查询互关数量
		const res1 = await eachCountApi()
		eachCount.value = res1.data.data
		// 查询关注数量
		const res2 = await friendCountApi()
		friendCount.value = res2.data.data
		// 查询粉丝数量
		const res3 = await fansCountApi()
		fansCount.value = res3.data.data
		// 查询活动数量
		const res4 = await queryCountApi()
		activityCount.value = res4.data.data
	})
	// 其他页面
	const toOtherPage = (key, param) => {
		const routes = {
			'index': '/pages/my/myIndex/myIndex?identity=me',
			'userList': `/pages/my/userList/userList?title=${param}`,
			'setting': '/pages/my/setting/setting',
			'activityList': '/pages/my/activityList/activityList',
			'visit': '/pages/my/visit/visit'
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
</script>

<style lang="less" scoped>
	.my {
		width: 100vw;
		height: 100vh;

		.background {
			position: relative;
			width: 100%;
			height: 210px;
			border: 1px solid black;

			image {
				width: 100%;
				height: 100%;
			}

			.user {
				position: absolute;
				left: 0;
				right: 0;
				margin: 0 auto;
				bottom: 60px;
				width: 90%;
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.avatar {
					width: 50px;
					height: 50px;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.right {
					width: calc(100% - 60px);
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.name {
						color: #ffffff;
						display: flex;
						align-items: center;
					}
				}
			}
		}

		.content {
			position: relative;
			width: 100%;
			height: calc(100% - 210px);
			background-color: #F2F2F2;

			.data {
				position: absolute;
				left: 0;
				right: 0;
				margin: 0 auto;
				top: -30px;
				width: 80%;
				height: 60px;
				background-color: #ffffff;
				display: flex;
				border-radius: 10px;
				overflow: hidden;

				.data-item {
					width: 25%;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 14px;
				}
			}

			.function {
				padding-top: 40px;

				.item {
					position: relative;
					left: 2.5%;
					width: 95%;
					border: 1px solid white;
					border-radius: 10px;
					overflow: hidden;
				}
			}
		}
	}
</style>