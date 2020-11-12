import axios from 'axios'

export const dictService = { 
  get_category_tree,
  get_setting_by_key,
  update_dict_content,
  delete_dict_by_key
}



function get_category_tree() {  
  var param = {       
      'action': 'get_dict_category_tree'
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/dict_tree', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}

function update_dict_content(token,dict_content) {  
  var param = {       
      'token_id':token,
      'content': dict_content
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/save_dictionary', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}

function delete_dict_by_key(token,keystr) {  
  var param = {   
      'token_id':token,    
      'keystr' : keystr
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/delete_dictionary', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}


function get_setting_by_key(keystr) {  
  var param = {   
      'keystr' : keystr
  }  
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/v1/get_dictionary', param).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}