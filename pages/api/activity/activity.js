import {
	request,
	uploadAboutActivity
} from "../../request/request";

/**
 * @description 创建活动
 * @param file 图片
 * @param title 活动名称
 * @param description 活动描述
 * @param max 活动最大人数
 */
export const uploadApi = async (file, title, text, max) => {
	return await uploadAboutActivity('/activity/upload', file, title, text, max)
}

/**
 * @description 查询用户创建的活动
 * @param userId id
 */
export const queryActivityApi = async (userId = null) => {
	let url = userId ? `/activity/queryActivity?userId=${userId}` : '/activity/queryActivity'
	return await request(url, "GET")
}

/**
 * @description 查询所有活动
 */
export const queryAllActivityApi = async () => {
	return await request('/activity/queryAllActivity', "GET")
}

/**
 * @description 关键字模糊查询活动
 */
export const queryActivityByKeywordApi = async (keyword) => {
	return await request(`/activity/queryActivityByKeyword?keyword=${keyword}`, "GET")
}

/**
 * @description 根据id删除活动
 */
export const deleteActivityApi = async (activityId) => {
	return await request(`/activity/deleteActivity?activityId=${activityId}`, "DELETE")
}