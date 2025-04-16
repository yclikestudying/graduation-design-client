import {
	request,
} from "../../request/request";

/**
 * @description 查询系统隐私设置
 * @param userId 用户id
 */
export const querySettingApi = async (userId = null) => {
	let url
	url = userId === null ? '/privateSetting/querySetting' : `/privateSetting/querySetting?userId=${userId}`
	return await request(url, "GET")
}

/**
 * @description 设置隐私
 */
export const settingApi = async (key, value) => {
	return await request('/privateSetting/setting', "PUT", {'key': key, 'value': value})
}