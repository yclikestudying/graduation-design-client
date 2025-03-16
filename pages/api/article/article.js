import {
	request,
	upload
} from "../../request/request";

/**
 * @description 发布动态
 * @param files 文件数据
 * @param text 文本内容
 */
export const uploadApi = async (files, text) => {
	return await upload('/article/upload', files, text)
}

/**
 * @description 发布动态（仅仅是文本）
 * @param text 文本内容
 */
export const uploadTextApi = async (text) => {
	return await request(`/article/upload?text=${text}`, "POST")
}

/**
 * @description 查询用户动态
 * @param userId 用户id
 */
export const queryArticleApi = async (userId = null) => {
	let url = userId === null ? '/article/queryArticle' : `/article/queryArticle?userId=${userId}`
	return await request(url, "GET")
}

/**
 * @description 根据id查询动态信息
 * @param articleId 动态id
 */
export const queryOneApi = async (articleId) => {
	return await request(`/article/queryOne?articleId=${articleId}`, "GET")
}

/**
 * @description 根据id删除动态信息
 * @param articleId 动态id
 */
export const deleteArticleApi = async (articleId) => {
	return await request(`/article/deleteArticle?articleId=${articleId}`, "DELETE")
}