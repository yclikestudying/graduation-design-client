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
 * @description 查询所参加的活动
 */
export const queryJoinedActivityApi = async () => {
	return await request('/activity/queryJoinedActivity', "GET")
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

/**
 * @description 根据活动id查询活动
 */
export const queryActivityByIdApi = async (activityId) => {
	return await request(`/activity/queryActivityById?activityId=${activityId}`, "GET")
}

/**
 * @description 加入组队
 */
export const addActivityApi = async (activityId) => {
	return await request(`/activityRelation/addActivity`, "POST", {
		activityId: activityId
	})
}

/**
 * @description 查询活动数量
 */
export const queryCountApi = async () => {
	return await request(`/activityRelation/queryCount`, "GET")
}

/**
 * @description 查询群名称和群人数
 * @param activityId 群id
 */
export const queryNameAndCountApi = async (activityId) => {
	return await request(`/activity/queryNameAndCount/${activityId}`, "GET")
}