import {
	request,
	upload
} from "../../request/request";

/**
 * @description 发布商品
 * @param files 文件数据
 * @param text 文本内容
 */
export const uploadApi = async (files, text, title, oldPrice, price) => {
	return await upload('/goods/upload', files, text, title, oldPrice, price)
}

/**
 * @description 查询个人商品
 * @param userId 用户id
 */
export const queryGoodsApi = async (userId = null) => {
	let url = userId ? `/goods/queryGoods?userId=${userId}` : '/goods/queryGoods'
	return await request(url, "GET")
}

/**
 * @description 查询全部商品
 */
export const queryAllGoodsApi = async () => {
	return await request('/goods/queryAllGoods', "GET")
}

/**
 * @description 关键字模糊查询商品
 * @param keyword 关键字
 */
export const queryGoodsByKeywordApi = async (keyword) => {
	return await request(`/goods/queryGoodsByKeyword?keyword=${keyword}`, "GET")
}

/**
 * @description 根据id删除商品
 * @param goodsId 商品id
 */
export const deleteGoodsApi = async (goodsId) => {
	return await request(`/goods/deleteGoods?goodsId=${goodsId}`, "DELETE")
}