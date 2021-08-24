import axios from 'axios';

export const workItemService = { 
	get_work_items,
	get_options,
	update_work_items,
	get_dept_employee, 
	get_tree,
	downlaod_data,
	downlaod_cost_data,
	downlaod_cost_data_v2,
	work_item_cost_teble,
	get_project_cost_records,
	get_project_cost_info,
	update_pre_time,
	update_cost_record,
	get_project_status_record
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

function downlaod_cost_data_v2(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v2/work_time/classifier/download`, param,{responseType: 'blob'}).then((response) => {
			resolve(response)}).catch((error) => {
				reject(error)
			}
		)		
	})
}


// 專案成本管理
function work_item_cost_teble(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_item_cost/table`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

//支出/收入明細
function get_project_cost_records(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_item_cost/cost_records`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}
//專案收支資訊＋權限驗證
function get_project_cost_info(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_item_cost/info`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

//更新預估時間
function update_pre_time(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_item_cost/pre_time/update`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

//更新收入/支出
function update_cost_record(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/work_item_cost/cost/update`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}


// 專案狀態更新歷程
function get_project_status_record(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/project/status/get`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

