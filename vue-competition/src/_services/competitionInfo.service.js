import axios from 'axios'

export const infoService = { 
	get_info_option,
	get_competition_info_table,
	delete_competition_info,
	get_single_competition_info,
	update_competition_info,
}

function get_info_option(option_keys){
    var param = {"option_keys":option_keys}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_info_option', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function get_competition_info_table(filter){
    var param = {"filter":filter}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_competition_info_table', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function delete_competition_info(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/delete_competition_info', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}


function get_single_competition_info(game_id){
    var param = {"game_id":game_id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_single_competition_info', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}


function update_competition_info(type, data){
    var param = {"type":type, "param":data}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/update_competition_info', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}