<template>
	<view class="groupChatInfo">
		<view class="function">
			<van-cell title="群聊信息" style="background-color: #F2F2F2;" />
			<view class="item">
				<van-cell title="群聊成员" is-link>
				</van-cell>
				<van-cell title="群聊名称" is-link>
				</van-cell>
				<van-cell title="群公告" is-link>
				</van-cell>
				<van-cell title="我的本群昵称" is-link>
				</van-cell>
				<van-cell title="群聊备注" is-link>
				</van-cell>
			</view>
			<van-cell title="其他" style="background-color: #F2F2F2;" />
			<view class="item">
				<van-cell style="color: red;text-align: center;" title="退出该群">
				</van-cell>
			</view>
		</view>
	</view>
</template>

<script setup>
	
</script>

<style lang="less" scoped>
	.groupChatInfo {
		width: 100vw;
		height: 100vh;
		background-color: #F2F2F2;
		
		.function {
			width: 100%;
			height: 100%;
			
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
</style>
