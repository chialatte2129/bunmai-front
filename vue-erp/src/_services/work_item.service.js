import axios from 'axios';

export const workItemService = { 
	get_work_items,
	get_options,
	update_work_items,
	get_dept_employee, 
	get_tree,
	downlaod_data,
	downlaod_cost_data
}

function get_work_items(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project/get/work_items`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_options(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project/get_options`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function update_work_items(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project/update/work_items`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_dept_employee(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/dept/employee/list`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_tree(){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project/get/tree`, {}).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function downlaod_data(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project/downlaod/data`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function downlaod_cost_data(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_time/classifier/download`, param,{responseType: 'blob'}).then((response) => {
			resolve(response)}).catch((error) => {
				reject(error)
			}
		)		
	})
}


