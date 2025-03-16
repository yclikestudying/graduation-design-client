<template>
	<scroll-view scroll-y="true" class="info">
		<scroll-view class="scrollView" scroll-y="true">
			<view class="function">
				<van-cell title="基本信息" style="background-color: #F2F2F2;" />
				<view class="item">
					<van-cell title="用户名" size="large" :is-link="identity === 'me'" :value="user?.userName" @click="toOtherPage('username')" />
					<van-cell title="性别" size="large" :is-link="identity === 'me'" :value="user?.userGender === 1 ? '男' : user?.userGender === 0 ? '女' : '保密'" @click="toOtherPage('gender')" />
					<van-cell title="生日" size="large" :is-link="identity === 'me'" :value="user?.userBirthday" @click="toOtherPage('birthday')" />
					<van-cell title="简介" size="large" :is-link="identity === 'me'" :value="user?.userProfile" @click="toOtherPage('profile')" />
				</view>
				<van-cell title="地区" style="background-color: #F2F2F2;" />
				<view class="item">
					<van-cell title="所在地" size="large" :is-link="identity === 'me'" :value="user?.userLocation" @click="toOtherPage('location')" />
					<van-cell title="家乡" size="large" :is-link="identity === 'me'" :value="user?.userHometown" @click="toOtherPage('hometown')" />
				</view>
				<van-cell title="专业" style="background-color: #F2F2F2;" />
				<view class="item">
					<van-cell title="专业" size="large" :is-link="identity === 'me'" :value="JSON.parse(user?.userProfession)?.text" @click="toOtherPage('profession')" />
				</view>
				<van-cell title="个性标签" style="background-color: #F2F2F2;" />
				<view class="item">
					<van-cell title="编辑" size="large" :is-link="identity === 'me'" arrow-direction="down" :value="!JSON.parse(user?.userTags)?.length ? 0 + '/30' : `${JSON.parse(user?.userTags)?.length}/30`" @click="toOtherPage('tag')" />
				</view>
				<view class="tag" v-if="user?.userTags">
					<template v-for="(tag, index) in JSON.parse(user?.userTags)">
						<view class="tag-item">
							<van-tag type="primary" size="large">
								{{ tag.text }}
							</van-tag>
						</view>
					</template>
				</view>
			</view>
		</scroll-view>
	</scroll-view>
</template>

<script setup>
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue"
	import {
		getUserApi
	} from "/pages/api/user/user.js"
	// 变量
	const identity = ref(''); // 身份
	const currentUserId = ref(null); // 当前用户id
	const user = ref(uni.getStorageSync("user"))
	
	onLoad((e) => {
		identity.value = e.identity
		currentUserId.value = Number(e.userId)
	})
	onShow(async () => {
		if (identity.value === 'me') {
			user.value = uni.getStorageSync("user")
		} else {
			const res = await getUserApi(currentUserId.value)
			user.value = res.data.data
		}
	})
	// 其他页面
	const toOtherPage = (key) => {
		if (identity.value === 'me') {
			const routes = {
				'username': `/pages/my/info/username?userName=${user.value.userName}`,
				'profile': `/pages/my/info/profile?userProfile=${user.value.userProfile}`,
				'gender': `/pages/my/info/gender?userGender=${user.value.userGender}`,
				'birthday': `/pages/my/info/birthday?userBirthday=${user.value.userBirthday}`,
				'location': `/pages/my/info/location?userLocation=${user.value.usreLocation}`,
				'hometown': `/pages/my/info/hometown?userHometown=${user.value.userHometown}`,
				'profession': `/pages/my/info/profession?userProfession=${user.value.userProfession}`,
				'tag': `/pages/my/info/tag?userTags=${user.value.userTags}`
			}
			const url = routes[`${key}`]
			uni.navigateTo({
				url: url
			})
		}
	}
</script>

<style lang="less" scoped>
	.info {
		width: 100vw;
		height: 100vh;
		background-color: #F2F2F2;

		.scrollView {
			width: 100%;
			height: 100%;

			.tag {
				display: flex;
				flex-wrap: wrap;
				padding: 5px;

				.tag-item {
					margin-bottom: 5px;
					margin-left: 5px;
				}
			}

			.function {
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

	.popup-content {
		align-items: center;
		justify-content: center;
		padding: 15px;
		height: 50px;
		background-color: #fff;
	}

	.popup-height {
		width: 100%;
		height: auto;
	}
</style>