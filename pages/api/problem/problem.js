import {
	request,
	uploadAboutProblem
} from "../../request/request";

/**
 * @description 问题和意见
 * @param files 文件
 * @param content 内容
 * @param phone 联系电话
 */
export const uploadApi = async (files, content, phone) => {
	return await uploadAboutProblem('/problem/upload', files, content, phone)
}

/**
 * @description 查询问题和意见
 */
export const queryProblemApi = async () => {
	return await request('/problem/queryProblem', "GET")
}

/**
 * @description 清空全部反馈记录
 */
export const deleteAllApi = async () => {
	return await request('/problem/deleteAll', "DELETE")
}

