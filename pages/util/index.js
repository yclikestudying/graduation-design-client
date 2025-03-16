/**
 * 计算用户信息的完善情况
 */
export const userInfoProgress = () => {
	const user = uni.getStorageSync("user")
	const totle = Object.keys(user).length - 6;
	let count = 0;
	for (let item in user) {
		if (item === 'userGender' && user[`${item}`] !== null) {
			count++;
			continue;
		}
		if (item !== "createTime" && item !== 'id' && item !== 'userAvatar' && item !== 'userRole' && item !==
			'userPhone' && item !== "userPassword" && user[`${item}`] !== null) {
			count++;
		}
	}

	return Math.round((count / totle) * 100) + "%";
};