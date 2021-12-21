import axios from 'axios';

export const payOrderService = { 
	get_pay_orders,
	update_pay_orders,
	get_project_pay_orders,
	downlaod_pay_order,
	group_create_payment_order
}

function get_pay_orders(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/pay_orders/get`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function update_pay_orders(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/pay_orders/update`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_project_pay_orders(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/pay_orders/project/get`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function downlaod_pay_order(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/pay_orders/download`, param,{responseType: 'blob'}).then((response) => {
			resolve(response)}).catch((error) => {
				reject(error)
			}
		)		
	})
}

function group_create_payment_order(params){
	return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/pay_orders/group_create`, params).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}