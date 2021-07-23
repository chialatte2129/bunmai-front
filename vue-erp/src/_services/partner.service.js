import axios from 'axios';

export const partnerService = { 
    
	get_supplier_account,
	update_supplier_account,
}

function get_supplier_account(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/supplier/account/table`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function update_supplier_account(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/supplier/account/update`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}
