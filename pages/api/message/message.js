import {
	request,
	uploadNoText
} from "../../request/request";

/**
 * @description 查询聊天记录
 * @param userId 聊天对方的id
 */
export const queryMessageApi = async (userId) => {
	return await request(`/message/queryMessage?userId=${userId}`, "GET")
}

/**
 * @description 未读消息设置为已读消息
 * @param userId 聊天对方的id
 */
export const isReadApi = async (userId) => {
	return await request('/message/isRead', "POST", {
		userId: userId
	})
}

/**
 * @description 查询最新私聊消息列表
 */
export const queryNoReadListApi = async () => {
	return await request('/message/queryNoReadList', "GET")
}

/**
 * @description 查询最新群聊消息列表
 */
export const queryGroupChatLatestMessageApi = async () => {
	return await request('/groupMessage/queryGroupChatLatestMessage', "GET")
}

/**
 * @description 查询未读消息总数
 */
export const queryNoReadTotalApi = async () => {
	return await request('/message/queryNoReadTotal', "GET")
}

/**
 * @description 上传图片
 * @param file 图片
 */
export const uploadImageApi = async (file) => {
	return await uploadNoText('/message/uploadImage', file)
}

/**
 * @description 查询群聊消息
 * @param activityId 群聊id
 */
export const queryGroupMessageApi = async (activityId) => {
	return await request(`/groupMessage/queryGroupMessage/${activityId}`, "GET")
}
