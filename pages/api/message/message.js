import {
	request
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
 * @description 查询最新消息列表
 */
export const queryNoReadListApi = async () => {
	return await request('/message/queryNoReadList', "GET")
}

/**
 * @description 查询未读消息总数
 */
export const queryNoReadTotalApi = async () => {
	return await request('/message/queryNoReadTotal', "GET")
}

