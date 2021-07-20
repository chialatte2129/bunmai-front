import axios from 'axios';

export const dayItemService = { 
    person_day_list,
    review_day_list,
    get_option_list,
    update_day_item,
	get_dept_tree,
	get_project_totals,
	get_project_dept_totals,
	downlaod_cost_sample,
	upload_worktime_cost,
	get_project_worktime_cost,
	update_cost_data,
}

function get_option_list(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/day_item/options`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function person_day_list(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/day_item/person/table`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function update_day_item(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/day_item/person/update`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_dept_tree(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/day_item/dept/tree`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function review_day_list(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/day_item/review/table`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_project_totals(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project_report/get_totals`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_project_dept_totals(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project_report/get_dept_totals`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function downlaod_cost_sample(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/worktime/cost_template/download`, param,{responseType: 'blob'}).then((response) => {
			resolve(response)}).catch((error) => {
				reject(error)
			}
		)		
	})
}

function upload_worktime_cost(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/worktime/cost/upload`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_project_worktime_cost(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/worktime/cost/table`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function update_cost_data(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/worktime/cost/update`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}
