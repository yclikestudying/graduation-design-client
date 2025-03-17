import {
	request
} from "../../request/request";

/**
 * @description 发布跑腿任务
 * @param text 内容
 */
export const uploadApi = async (text) => {
	return await request('/express/upload', "POST", {"text": text})
}

/**
 * @description 查询自己的跑腿任务
 * @param userId 用户id
 */
export const queryExpressApi = async (userId = null) => {
	let url = userId ? `/express/queryExpress?userId=${userId}` : '/express/queryExpress'
	return await request(url, "GET")
}

/**
 * @description 查询所有跑腿任务
 */
export const queryAllExpressApi = async () => {
	return await request('/express/queryAllExpress', "GET")
}

/**
 * @description 根据id删除跑腿任务
 * @param expressId 跑腿任务id
 */
export const deleteExpressApi = async (expressId) => {
	return await request(`/express/deleteExpress?expressId=${expressId}`, "DELETE")
}

/**
 * @description queryExpressByKeyword
 * @param keyword 关键字
 */
export const queryExpressByKeywordApi = async (keyword) => {
	return await request(`/express/queryExpressByKeyword?keyword=${keyword}`, "GET")
}

