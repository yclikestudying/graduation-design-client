import { request } from "../../request/request";

/**
 * @description 用户登录
 * @param data 登录信息
 */
export const loginApi = async (data) => {
	return await request('/user/login', "POST", data)
}

/**
 * @description 用户注册
 * @param data 注册信息
 */
export const registerApi = async (data) => {
	return await request('/user/register', "POST", data)
}