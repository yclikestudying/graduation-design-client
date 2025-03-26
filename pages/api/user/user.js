import {
	request,
	uploadNoText
} from "../../request/request";

/**
 * @description 修改用户个人信息
 * @param data 修改数据
 */
export const updateUserApi = async (data) => {
	return await request('/user/updateUser', "PUT", data)
}

/**
 * @description 获取用户信息
 * @param userId 用户id
 */
export const getUserApi = async (userId = null) => {
	let url = userId === null ? '/user/getUser' : `/user/getUser?userId=${userId}`
	return await request(url, "GET")
}

/**
 * @description 模糊查询用户
 * @param keyword 搜索关键字
 */
export const queryUserApi = async (keyword) => {
	return await request(`/user/queryUser?keyword=${keyword}`, "GET")
}

/**
 * @description 查询用户头像
 * @param userId 用户id
 */
export const getAvatarApi = async (userId) => {
	return await request(`/user/getAvatar?userId=${userId}`, "GET")
}

/**
 * @description 上传头像
 * @param userId 用户id
 * @param filePath 文件路径
 */
export const uploadAvatarApi = async (userId, filePath) => {
	return await uploadNoText(`/user/uploadAvatar?userId=${userId}`, filePath)
}

/**
 * @description 查询关注用户
 * @param userId 用户id
 */
export const queryFriendApi = async (userId = null) => {
	let url = userId ? `/user/queryFriend?userId=${userId}` : '/user/queryFriend'
	return await request(url, "GET")
}

/**
 * @description 查询粉丝用户
 * @param userId 用户id
 */
export const queryFansApi = async (userId = null) => {
	let url = userId ? `/user/queryFans?userId=${userId}` : '/user/queryFans'
	return await request(url, "GET")
}

/**
 * @description 查询互关用户
 * @param userId 用户id
 */
export const queryEachApi = async (userId) => {
	let url = userId ? `/user/queryEach?userId=${userId}` : '/user/queryEach'
	return await request(url, "GET")
}

/**
 * @description 添加访客记录
 * @param visitorId 我的id
 * @param visitedId 被访问者id
 */
export const addVisitApi = async (visitorId, visitedId) => {
	return await request("/user/addVisit", "POST", {
		visitorId: visitorId,
		visitedId: visitedId
	})
}

/**
 * @description 查询访客记录
 */
export const queryVisitApi = async () => {
	return await request("/user/queryVisit", "GET")
}