import axios from 'axios'


export const roleService = { 
  list_by_page,
  list_all_roles,
  save_role,
  delete_role
}


function list_by_page(token_id,page_count, filter) {
  
  var param = {       
      'token_id': token_id,
      'page_count':page_count,
      'role_id':filter.role,
      'description':filter.description,
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/list_role', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}

function list_all_roles(token_id) {  
  var param = {       
      'token_id': token_id
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/list_role', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}


function save_role(token_id,is_new,role_id,description,menus_id,actions_id) {  
  var param = {       
      'token_id': token_id,
      'is_new':is_new,
      'role_id':role_id,
      'description':description,
      'menus_id':menus_id,
      'actions_id':actions_id
  }   
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/save_role', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}

function delete_role(token_id,role_id) {  
  var param = {       
      'token_id': token_id,
      'role_id':role_id
  }    
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/delete_role', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}