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
 * @description 修改手机
 * @param oldPhone 旧手机
 * @param newPhone 新手机
 */
export const editPhoneApi = async (oldPhone, newPhone) => {
	return await request(`/user/editPhone`, "PUT", {
		'oldPhone': oldPhone,
		'newPhone': newPhone
	})
}

/**
 * @description 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @param checkPassword 确认密码
 */
export const editPasswordApi = async (oldPassword, newPassword, checkPassword) => {
	return await request(`/user/editPassword`, "PUT", {
		'oldPassword': oldPassword,
		'newPassword': newPassword,
		'checkPassword': checkPassword
	})
}