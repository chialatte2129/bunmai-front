import { accountService } from '@/_services'

const getDefaultState = () => {
  return {
   msg:"",
   user_id:"",
   user_name:"",
   token:""  
  }
}

const state = {
  msg:"",
  user_id:"",
  user_name:"",
  token:"",
  expire:43200  
}

const actions = {
  actionLogin ({commit},param) {    
    commit('commitLogin',param)
  }
}

const mutations = {
  commitLogin (state,param) {  
    const rs = accountService.login(param.param1,param.param2)
    rs.then(function (result) {   
      if (result.msg==undefined)
      {
        state.user_id= result.data.user_id
        state.user_name = result.data.user_name
        state.token = result.data.token       
        state.expire = result.data.expire 
      }else{
        state.msg = result.msg
      }               
    })
  }
}

export const account= {
  namespaced: true,
  state,
  actions,
  mutations
}
