var log = console.log.bind(console)
var get_grant_fail = function(page) {
		var that = page
		that.setData({
			initial_show: true,   //需要重新去登录
		})
	}

module.exports = {
	get_grant_fail: get_grant_fail,
}