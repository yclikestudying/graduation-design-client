import {
	request,
	uploadNoText
} from "../../request/request";

/**
 * @description 添加访客记录
 * @param visitorId 我的id
 * @param visitedId 被访问者id
 */
export const addVisitorApi = async (visitorId, visitedId) => {
	return await request("/visitor/addVisitor", "POST", {
		visitorId: visitorId,
		visitedId: visitedId
	})
}


/**
 * @description 查询访客记录
 */
export const queryVisitorApi = async () => {
	return await request("/visitor/queryVisitor", "GET")
}

/**
 * @description 删除当前用户全部访客
 */
export const deleteVisitorApi = async () => {
	return await request("/visitor/deleteVisitor", "DELETE")
}

