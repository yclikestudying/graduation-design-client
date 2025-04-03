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

// 工具函数：格式化时间为微信风格
export function formatWeChatTime(dateStr) {
    const inputDate = new Date(dateStr);
    const now = new Date();

    // 获取日期的年、月、日、时、分
    const inputYear = inputDate.getFullYear();
    const inputMonth = inputDate.getMonth() + 1; // 月份从 0 开始，需要加 1
    const inputDay = inputDate.getDate();
    const inputHours = inputDate.getHours();
    const inputMinutes = inputDate.getMinutes();

    // 获取当前日期的年、月、日
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    const nowDay = now.getDate();

    // 判断是否是今天
    if (inputYear === nowYear && inputMonth === nowMonth && inputDay === nowDay) {
        return `${padZero(inputHours)}:${padZero(inputMinutes)}`;
    }

    // 判断是否是昨天
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
        inputYear === yesterday.getFullYear() &&
        inputMonth === yesterday.getMonth() + 1 &&
        inputDay === yesterday.getDate()
    ) {
        return `昨天 ${padZero(inputHours)}:${padZero(inputMinutes)}`;
    }

    // 判断是否是今年
    if (inputYear === nowYear) {
        return `${padZero(inputMonth)}-${padZero(inputDay)} ${padZero(inputHours)}:${padZero(inputMinutes)}`;
    }

    // 其他情况，显示完整日期
    return `${inputYear}-${padZero(inputMonth)}-${padZero(inputDay)} ${padZero(inputHours)}:${padZero(inputMinutes)}`;
}

// 工具函数：补零
function padZero(num) {
    return num < 10 ? `0${num}` : num;
}