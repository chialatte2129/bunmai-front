import axios from 'axios';

export const overtimeService = { 
	get_overtime_log,
}

function get_overtime_log(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/overtime/log/get`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}