import axios from 'axios'

export const accountService = {
  login,
  check_token,
  change_password,
  list_by_page,
  update_account,
  delete_account,
  clean_login_info
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



function list_by_page (token_id,page_count,filter) {  
  var param = {       
      'token_id': token_id,
      'page_count':page_count,
      'account':filter.account,
      'alias':filter.alias
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