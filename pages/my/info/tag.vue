<template>
	<view class="tag">
		<view class="select">
			<view class="title">
				<text>已选</text>
				<text>{{ tags.length }}/30</text>
			</view>
			<view class="tag">
				<view class="item">
					<template v-if="tags.length !== 0" v-for="(tag, index) in tags">
						<van-tag class="tag-item" closeable size="medium" type="primary"
							@close="close(tag.text, tag.id)">
							{{ tag.text }}
						</van-tag>
					</template>
				</view>
			</view>
		</view>
		<view>
			<van-tree-select v-model:active-id="activeIds" v-model:main-active-index="activeIndex" :items="hobbies" />
		</view>
		<view style="margin: 16px;">
			<van-button :loading="loading" loading-type="spinner" round block type="primary" native-type="submit"
				color="#4496F9" @click="onSubmit">
				提交
			</van-button>
		</view>
	</view>
</template>

<script setup>
	import {
		hobbies,
		getHobbies
	} from "./tag.js";
	import {
		ref,
		watch
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		updateUserApi,
		getUserApi
	} from "/pages/api/user/user.js"
	// 数据
	let activeIds = ref([])
	let activeIndex = ref(0)
	let tags = ref([]); // 用来存放选择好的爱好
	const loading = ref(false)
	watch(activeIds, (value) => {
		tags.value = getHobbies(value)
	})
	onLoad((e) => {
		if (e.userTags) {
			tags.value = JSON.parse(e.userTags)
			activeIds.value = tags.value.map(tag => tag.id)
		}
	})
	// 删除标签
	const close = (name, id) => {
		tags.value = tags.value.filter(tag => tag.text !== name)
		activeIds.value = activeIds.value.filter(activeId => activeId !== id)
	}
	// 提交
	const onSubmit = async () => {
		if (tags.value.length === 0) {
			uni.showToast({
				title: "标签不能为空",
				icon: "none"
			})
			return;
		}
		loading.value = true
		try {
			const res = await updateUserApi({
				key: 'userTags',
				value: JSON.stringify(tags.value)
			})
		if (res.data.code === 200) {
			uni.showToast({
				title: '修改成功'
			})
			const res = await getUserApi()
			uni.setStorageSync("user", res.data.data)
			uni.navigateBack()
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
</script>

<style lang="less" scoped>
	.tag {
		width: 100vw;
		height: 100vh;
		overflow: hidden;

		.select {
			width: 100%;
			height: 160px;

			.title {
				padding: 0 10px;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.tag {
				.item {
					.tag-item {
						margin-left: 3px;
						margin-top: 3px;
					}
				}
			}
		}
	}
</style>