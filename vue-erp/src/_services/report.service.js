import axios from 'axios';

export const reportService = { 
	get_daily_workhour,
	handle_work_hour_blacklist,
}

function get_daily_workhour(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_hour/daily/get`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function handle_work_hour_blacklist(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_hour/blacklist/handle`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}