const baseURL = "http://192.168.113.28:8080"

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
 * @param textContent 文本（可有可无）
 */
export const upload = async (url, files, textContent = null) => {
	return await uni.uploadFile({
		url: `${baseURL}${url}`,
		files: files,
		formData: {
			"text": textContent // 文本内容
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