import {
	request,
	upload
} from "../../request/request";

/**
 * @description 查询用户是否被关注
 * @param userId 用户id
 */
export const queryFriendApi = async (userId) => {
	return await request(`/friend/queryFriend?userId=${userId}`, "GET")
}

/**
 * @description 添加关注
 * @param userId 用户id
 */
export const addApi = async (userId) => {
	return await request('/friend/add', "POST", {followeeId: userId})
}

/**
 * @description 取消关注
 * @param userId 用户id
 */
export const cancelApi = async (userId) => {
	return await request('/friend/cancel', "POST", {followeeId: userId})
}

/**
 * @description 查询互关数量
 * @param userId 用户id
 */
export const eachCountApi = async (userId = null) => {
	let url = userId ? `/friend/eachCount?userId=${userId}` : '/friend/eachCount'
	return await request(url, "GET")
}

/**
 * @description 查询关注数量
 * @param userId 用户id
 */
export const friendCountApi = async (userId = null) => {
	let url = userId ? `/friend/friendCount?userId=${userId}` : '/friend/friendCount'
	return await request(url, "GET")
}

/**
 * @description 查询粉丝数量
 * @param userId 用户id
 */
export const fansCountApi = async (userId = null) => {
	let url = userId ? `/friend/fansCount?userId=${userId}` : '/friend/fansCount'
	return await request(url, "GET")
}