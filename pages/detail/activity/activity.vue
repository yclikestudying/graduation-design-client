<template>
	<CenterLoading v-if="activity === null"></CenterLoading>
	<view v-else class="activity">
		<view class="info">
			<view class="avatar">
				<image :src="activity?.activityPhoto" mode=""></image>
			</view>
			<view class="right">
				<view class="top">
					{{ activity?.activityName }}
				</view>
				<view class="bottom">
					{{ activity?.currentPeople + "/" + activity?.activityMaxPeople + "人"}}
				</view>
			</view>
		</view>
		<view>
			<van-cell-group inset>
				<van-cell title="创建人" style="display: flex;align-items: center;">
					<template #right-icon>
						<image style="width: 50px;height: 50px;border-radius: 50%;" :src="activity?.userAvatar" mode="">
						</image>
					</template>
				</van-cell>
				<van-cell title="创建时间" :value="activity?.createTime" />
			</van-cell-group>
		</view>
		<view class="button">
			<van-button class="item" :loading="loading" loading-type="spinner" block type="primary" native-type="submit"
				color="#4496F9" @click="onSubmit">
				加入组队
			</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		queryActivityByIdApi,
		addActivityApi
	} from "/pages/api/activity/activity.js"
	// 变量
	const loading = ref(false)
	const activityId = ref(null)
	const activity = ref(null)
	onLoad(async (e) => {
		activityId.value = Number(e.activityId)
		const res = await queryActivityByIdApi(activityId.value)
		if (res.data.code === 200) {
			activity.value = res.data.data
		}	
	})
	// 加入组队
	const onSubmit = async () => {
		try {
			loading.value = true
			const res = await addActivityApi(activityId.value)
			if (res.data.code === 200) {
				uni.showToast({
					title: "加入成功"
				})
				uni.$emit('updateActivity')
			} else {
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
			}
		} finally {
			loading.value = false
		}
	}
	// 一旦有人加入队伍，更新数据
	uni.$on('updateActivity',async () => {
		const res = await queryActivityByIdApi(activityId.value)
		if (res.data.code === 200) {
			activity.value = res.data.data
		}	
	})
</script>

<style lang="less" scoped>
	.activity {
		position: relative;
		width: 100vw;
		height: 100vh;

		.info {
			padding: 0 20px;
			width: 100%;
			display: flex;

			.avatar {
				width: 100px;
				height: 100px;
				border-radius: 50%;
				overflow: hidden;
				border: 1px solid lightgray;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.right {
				margin-left: 10px;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.top {
					font-size: 18px;
				}

				.bottom {
					font-size: 12px;
					color: darkgray;
				}
			}
		}

		.button {
			width: 100%;
			position: fixed;
			bottom: 0;
			display: flex;
			justify-content: center;

			.item {
				width: 200px;
			}
		}
	}
</style>