import axios from 'axios'

export const accountService = {
  login,
  check_token,
  change_password,
  list_by_page,
  update_account,
  delete_account,
  clean_login_info,
  redirect_login,

  get_user_info,
  get_user_menus,
  get_user_actions
}

function get_user_info(key=""){
  
  var user_info_str = localStorage.getItem("ms_user_info");
  if(user_info_str){
    var user_info = JSON.parse(atob(atob(user_info_str)));
    if(key!=""){
      if(key in user_info){
        return user_info[key]
      }else{
        return null
      }
    }else{
      return user_info
    }
  }
}

function get_user_menus(){
  var user_menu = localStorage.getItem("ms_user_menus");
  if(user_menu){
    return atob(atob(user_menu)).split(",");
  }else{
    return []
  }
  
}

function get_user_actions(){
  var user_actions = localStorage.getItem("ms_user_actions");
  if(user_actions){
    return atob(atob(user_actions)).split(",");
  }else{
    return []
  }
}


function redirect_login(uname,token) {  
  var param = {       
      'username': uname,
      'token' : token
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/redirect_login', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}

function clean_login_info(localStorage,router) {  
  console.log('call clean login');
  localStorage.removeItem("ms_user_token");
  localStorage.removeItem("ms_username");
  localStorage.removeItem("ms_is_admin");
  router.push("/login");
}

function login (uname,passwd) {  
  var param = {       
      'username': uname,
      'passwd' : passwd
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/login', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}

function change_password (token_id,old_pass,new_pass) {
  
  var param = {       
      'token_id': token_id,
      'old_pass' : old_pass,
      'new_pass' : new_pass
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/change_password', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}


function check_token (token_id) {
  
  var param = {       
      'token_id': token_id
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/check_token', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}



function list_by_page (token_id, page_count, account_filter, last_name_filter, roles_filter){  
  var param = {       
    'token_id': token_id,
    'page_count':page_count,
    "filter":{
      "user_name":account_filter,
      "last_name":last_name_filter,
      "roles_id":roles_filter
    }
  }
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/list_account', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

function update_account (token_id,is_new,username,email,roles,last_name,info,new_pass) {  
  var param = {       
      'token_id': token_id,
      'is_new':is_new,
      'username':username,
      'email': email,
      'roles' : roles,
      'last_name':last_name,
      'info': info,
      'new_pass': new_pass
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/save_account', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}

function delete_account(token_id,username) {  
  var param = {       
      'token_id': token_id,
      'username':username
  }    
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/delete_account', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}