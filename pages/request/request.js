const baseURL = "http://192.168.194.28:8080" // 开发环境

/**
 * @description 普通请求
 * @param url 请求路径
 * @param method 请求方法
 * @param data 数据
 */
export const request = async (url, method, data = {}) => {
	try {
		return await uni.request({
			url: `${baseURL}${url}`,
			method: method,
			data: data,
			header: {
				"Authorization": uni.getStorageSync("token")
			}
		})
	} catch (err) {
		console.log(err)
	}
}

/**
 * @description 上传文件
 * @param url 请求路径
 * @param files 文件数据
 * @param text 文本（可有可无）
 * @param oldPrice
 * @param price
 */
export const upload = async (url, files, text = null, title = null, oldPrice = null, price = null) => {
	return await uni.uploadFile({
		url: `${baseURL}${url}`,
		files: files,
		formData: {
			"text": text, // 文本内容
			"title": title,
			"oldPrice": oldPrice,
			"price": price
		},
		header: {
			"Authorization": uni.getStorageSync("token")
		}
	})
}

/**
 * @description 上传不带内容的文件
 * @param url 请求路径
 * @param filePath 文件路径
 */
export const uploadNoText = async (url, filePath) => {
	return await uni.uploadFile({
		url: `${baseURL}${url}`,
		filePath: filePath,
		name: "file",
		header: {
			"Authorization": uni.getStorageSync("token")
		}
	});
}

/**
 * 寻物启事模块
 * @description 上传文件
 * @param url 请求路径
 * @param files 文件数据
 * @param type 类型
 * @param title 名称
 * @param description 描述
 */
export const uploadAboutLost = async (url, files, type, title, description) => {
	return await uni.uploadFile({
		url: `${baseURL}${url}`,
		files: files,
		formData: {
			"type": type, // 文本内容
			"title": title,
			"description": description
		},
		header: {
			"Authorization": uni.getStorageSync("token")
		}
	})
}

/**
 * 活动模块
 * @description 上传文件
 * @param url 请求路径
 * @param files 文件数据
 * @param type 类型
 * @param title 名称
 * @param description 描述
 */
export const uploadAboutActivity = async (url, files, title, text, max) => {
	return await uni.uploadFile({
		url: `${baseURL}${url}`,
		files: files,
		formData: {
			"title": title, // 文本内容
			"text": text,
			"max": max
		},
		header: {
			"Authorization": uni.getStorageSync("token")
		}
	})
}

/**
 * @description 问题和意见
 * @param url 请求路径
 * @param files 文件数据
 * @param content 内容
 * @param phone 联系电话
 */
export const uploadAboutProblem = async (url, files, content, phone) => {
	return await uni.uploadFile({
		url: `${baseURL}${url}`,
		files: files,
		formData: {
			"content": content, // 内容
			"phone": phone // 联系电话
		},
		header: {
			"Authorization": uni.getStorageSync("token")
		}
	})
}