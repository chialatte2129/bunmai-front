import axios from 'axios';

export const dayItemService = { 
    person_day_list,
    get_option_list
}

function get_option_list(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/api/v1/day_item/options', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function person_day_list(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/api/v1/day_item/person/table', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}