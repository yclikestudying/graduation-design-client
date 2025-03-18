import {
	request,
	uploadAboutLost
} from "../../request/request";

/**
 * @description 上传（携带图片）
 * @param files 文件
 * @param type 类型
 * @param title 名称
 * @param description 描述
 */
export const uploadApi = async (files, type, title, description) => {
	return await uploadAboutLost('/lost/upload', files, type, title, description)
}

/**
 * @description 上传（不携带图片）
 * @param type 类型
 * @param title 名称
 * @param description 描述
 */
export const uploadNoFileApi = async (type, title, description) => {
	return await request('/lost/uploadNoFile', "POST", {
		lostType: type,
		lostName: title,
		lostDescription: description
	})
}

/**
 * @description 查询用户寻物启事
 * @param userId 用户id
 */
export const queryLostApi = async (userId = null) => {
	let url = userId ? `/lost/queryLost?userId=${userId}` : '/lost/queryLost'
	return await request(url, "GET")
}

/**
 * @description 查询所有寻物启事
 */
export const queryAllLostApi = async () => {
	return await request('/lost/queryAllLost', "GET")
}

/**
 * @description 关键字模糊查询寻物启事
 * @param keyword 关键字
 */
export const queryLostByKeywordApi = async (keyword) => {
	return await request(`/lost/queryLostByKeyword?keyword=${keyword}`, "GET")
}

/**
 * @description 根据id删除寻物启事
 * @param lostId id
 */
export const deleteLostApi = async (lostId) => {
	return await request(`/lost/deleteLost?lostId=${lostId}`, "DELETE")
}