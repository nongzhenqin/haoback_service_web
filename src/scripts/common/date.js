// 时间处理器
let dateUtils = {
	padLeftZero: (str) => {
		return ('00' + str).substr(str.length);
	},

	// 时间格式化
	formatDate: (date, fmt) => {
		if(typeof date == 'number'){
			date = new Date(date);
		}
		if (/(y+)/.test(fmt)) {
	        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	    }
	    let o = {
	        'M+': date.getMonth() + 1,
	        'd+': date.getDate(),
	        'h+': date.getHours(),
	        'm+': date.getMinutes(),
	        's+': date.getSeconds()
	    };
	    for (let k in o) {
	        if (new RegExp(`(${k})`).test(fmt)) {
	            let str = o[k] + '';
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : dateUtils.padLeftZero(str));
	        }
	    }
	    return fmt;
	}
}

export default dateUtils;