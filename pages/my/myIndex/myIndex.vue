<template>
	<scroll-view scroll-y="true" class="myIndex" @scroll="scroll">
		<view class="background">
			<image src="/static/my/backgroundImage.jpg" mode=""></image>
		</view>
		<view class="content">
			<view class="info">
				<view class="avatar">
					<view class="left" @click="toOtherPage('avatar')">
						<image :src="user.userAvatar" mode=""></image>
					</view>
					<view v-if="identity === 'me'" class="right" @click="toOtherPage('info')">
						<van-icon name="edit" size="20" />
						<text>资料待完善<text style="color: #4496F9;">{{ userInfoProgress() }}</text></text>
					</view>
					<view v-else class="right">
						<van-button style="width: 50px;background-color: #4496F9;border: none;" type="primary"
							size="mini" @click="toOtherPage('info')">资料展示</van-button>
						<van-button v-if="isFriend" style="width: 40px;background-color: #4496F9;border: none;"
							type="primary" size="mini" @click="cancel">已关注</van-button>
						<van-button v-else style="width: 40px;background-color: #4496F9;border: none;" type="primary"
							size="mini" @click="add">关注</van-button>
						<uni-icons type="chat" size="30"></uni-icons>
					</view>
				</view>
				<view class="name">
					<text>{{ user.userName }}</text>
					<view v-if="user.userRole === 'admin'" class="image">
						<van-tag type="primary" size="mini">
							管理员
						</van-tag>
					</view>
				</view>
				<view class="data">
					<view class="data-item">
						<text>{{ friendCount }}</text>
						<text>关注</text>
					</view>
					<view class="data-item">
						<text>{{ fansCount }}</text>
						<text>粉丝</text>
					</view>
				</view>
				<view class="tag">
					<text>标签:</text>
					<template v-for="(tag, index) in JSON.parse(user.userTags)">
						<view class="tag-item">
							<van-tag type="primary" size="mini">
								{{ tag.text }}
							</van-tag>
						</view>
					</template>
				</view>
				<view class="date">
					<text>注册时间:{{ user.createTime }}</text>
				</view>
				<view class="IP">
					<text>IP属地:重庆</text>
				</view>
				<view class="profile">
					<text>简介:{{ user.userProfile }}</text>
				</view>
			</view>
			<view class="option">
				<view class="option-item" @click="setCurrentOption(0)">
					<text :class="{'active-option-name': currentOption === 0}">动态</text>
					<view class="underline active-underline" :style="{transform: `translateX(${currentOption * (100 / 5)}vw)`}"></view>
				</view>
				<view class="option-item" @click="setCurrentOption(1)">
					<text :class="{'active-option-name': currentOption === 1}">集市</text>
					<view class="underline"></view>
				</view>
				<view class="option-item" @click="setCurrentOption(2)">
					<text :class="{'active-option-name': currentOption === 2}">跑腿</text>
					<view class="underline"></view>
				</view>
				<view class="option-item" @click="setCurrentOption(3)">
					<text :class="{'active-option-name': currentOption === 3}">寻物</text>
					<view class="underline"></view>
				</view>
				<view class="option-item" @click="setCurrentOption(4)">
					<text :class="{'active-option-name': currentOption === 4}">活动</text>
					<view class="underline"></view>
				</view>
			</view>
			<view scroll-y="true" class="detail">
				<swiper class="swiper" :current="currentOption" @change="onSwiperChange">
					<swiper-item>
						<view class="swiper-item">
							<!-- 动态组件 -->
							<ArticleList :isScroll="isScroll" type="个人动态" :currentUserId="currentUserId"></ArticleList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 集市组件 -->
							<GoodsList :isScroll="isScroll" type="个人商品" :currentUserId="currentUserId"></GoodsList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 跑腿组件 -->
							<ExpressList :isScroll="isScroll" type="个人跑腿" :currentUserId="currentUserId"></ExpressList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 寻物组件 -->
							<LostList :isScroll="isScroll" type="个人寻物" :currentUserId="currentUserId"></LostList>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item">
							<!-- 活动组件 -->
							<ActivityList :isScroll="isScroll" type="个人活动" :currentUserId="currentUserId"></ActivityList>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</scroll-view>
</template>
<script setup>
	import ArticleList from "/components/article/articleList.vue"
	import GoodsList from "/components/goods/goodsList.vue"
	import ActivityList from "/components/activity/activityList.vue"
	import ExpressList from "/components/express/expressList.vue"
	import LostList from "/components/lost/lostList.vue"
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	import {
		userInfoProgress
	} from "/pages/util/index.js"
	import {
		getUserApi
	} from "/pages/api/user/user.js"
	import {
		queryFriendApi,
		addApi,
		cancelApi,
		friendCountApi,
		fansCountApi
	} from "/pages/api/friend/friend.js"
	// 变量
	const currentOption = ref(0)
	const isScroll = ref(false); // 是否允许内容滚动
	const identity = ref(''); // 身份
	const currentUserId = ref(null); // 当前用户id
	const user = ref(uni.getStorageSync("user"))
	const isFriend = ref(null)
	const friendCount = ref(null); // 关注数量
	const fansCount = ref(null); // 粉丝数量
	onLoad((e) => {
		identity.value = e.identity
		if (e.userId) {
			currentUserId.value = Number(e.userId)
		}
	})
	onShow(async () => {
		if (identity.value === 'me') {
			user.value = uni.getStorageSync("user")
		} else {
			// 查询当前用户信息
			const res = await getUserApi(currentUserId.value)
			user.value = res.data.data
			// 查询当前用户是否被我关注
			const res1 = await queryFriendApi(currentUserId.value)
			isFriend.value = res1.data.data
		}
		// 查询关注数量
		const res2 = await friendCountApi(currentUserId.value)
		friendCount.value = res2.data.data ?? 0
		// 查询粉丝数量
		const res3 = await fansCountApi(currentUserId.value)
		fansCount.value = res3.data.data ?? 0
		// 设置title为用户名
		uni.setNavigationBarTitle({
			title: user.value.userName
		})
		// 把当前用户头像存入本地缓存
		uni.setStorageSync("avatar", user.value.userAvatar)
	})
	// 设置新的currentOption
	const setCurrentOption = (index) => {
		currentOption.value = index
	}
	// 切换页面
	const onSwiperChange = (event) => {
		currentOption.value = event.detail.current
	}
	// 监听整个页面的滚动事件
	const scroll = (event) => {
		if (event.detail.scrollTop >= 325) {
			isScroll.value = true
		} else {
			isScroll.value = false
		}
	}
	// 添加关注
	const add = async () => {
		const res = await addApi(currentUserId.value)
		if (res.data.code === 200) {
			isFriend.value = true
			fansCount.value++
			uni.showToast({
				title: '关注成功'
			})
			// 添加关注时，更新关注动态
			uni.$emit('addFriend')
		} else {
			uni.showToast({
				title: res.data.message,
				icon: 'none'
			})
		}
	}
	// 取消关注
	const cancel = () => {
		uni.showModal({
			title: '温馨提示',
			content: '确定取消关注吗？',
			success: async function(res) {
				if (res.confirm) {
					const res1 = await cancelApi(currentUserId.value)
					if (res1.data.code === 200) {
						isFriend.value = false
						fansCount.value--
						uni.showToast({
							title: '取消成功'
						})
						// 取消关注时，更新关注动态
						uni.$emit('cancelFriend', currentUserId.value)
						// 取消关注时，更新关注和互关列表
						uni.$emit('userList', currentUserId.value)
					} else {
						uni.showToast({
							title: res1.data.message,
							icon: 'none'
						})
					}
				}
			}
		})
	}
	// 其他页面
	const toOtherPage = (key) => {
		const routes = {
			'info': `/pages/my/info/info?identity=${identity.value}&userId=${currentUserId.value}`,
			'avatar': `/pages/detail/avatar/avatar?identity=${identity.value}&userId=${currentUserId.value}`
		}
		const url = routes[`${key}`]
		uni.navigateTo({
			url: url
		})
	}
</script>
<style lang="less" scoped>
	.myIndex {
		width: 100vw;
		height: 100vh;

		.background {
			width: 100%;
			height: 180px;
			border: 1px solid black;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.content {
			width: 100%;
			height: calc(100% - 180px);

			.info {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;

				.avatar {
					position: relative;
					width: 90%;
					height: 50px;

					.left {
						position: absolute;
						bottom: 0;
						width: 90px;
						height: 90px;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.right {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 200px;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: right;
					}
				}

				.name {
					width: 90%;
					height: 40px;
					font-weight: bold;
					display: flex;
					align-items: center;
				}

				.data {
					width: 90%;
					height: 40px;
					display: flex;

					.data-item {
						width: 60px;
						height: 100%;
						display: flex;
						align-items: center;

						text:nth-child(1) {
							font-size: 18px;
							font-weight: bold;
						}

						text:nth-child(2) {
							font-size: 14px;
						}
					}
				}

				.tag {
					padding: 5px 0;
					width: 90%;
					font-size: 12px;
					color: gray;
					display: flex;
					flex-wrap: wrap;

					.tag-item {
						margin-right: 2px;
					}
				}

				.date {
					padding: 5px 0;
					width: 90%;
					font-size: 12px;
					color: gray;
				}

				.IP {
					padding: 5px 0;
					width: 90%;
					font-size: 12px;
					color: gray;
				}

				.profile {
					padding: 5px 0;
					width: 90%;
					font-size: 12px;
					color: gray;
				}
			}

			.option {
				display: flex;
				align-items: center;
				padding: 5px 0;
				border-top: 1px solid gainsboro;
				border-bottom: 1px solid gainsboro;

				.option-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.underline {
						width: 25px;
						height: 5px;
						background-color: white;
						border-radius: 50px;
						transition: all .2s;
					}
				}
			}

			.detail {
				width: 100%;
				height: 680px;
				background-color: #F2F2F2;

				.swiper {
					width: 100%;
					height: 100%;

					swiper-item {
						width: 100%;
						height: 100%;

						.swiper-item {
							width: 100%;
							height: 100%;

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
						}
					}
				}
			}
		}
	}

	.active-underline {
		background-color: #4496F9 !important;
	}

	.active-option-name {
		font-weight: bold;
	}
</style>