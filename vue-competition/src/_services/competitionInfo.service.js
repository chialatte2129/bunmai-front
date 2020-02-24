import axios from 'axios'

export const infoService = { 
    get_info_option
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