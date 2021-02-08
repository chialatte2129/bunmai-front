import axios from 'axios';

export const reportService = { 
	get_daily_workhour,
}

function get_daily_workhour(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/report/work_hour/daily`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}