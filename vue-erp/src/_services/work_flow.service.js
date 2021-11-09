import axios from 'axios'

export const workFlowService = {
  get_approval_stage_tree,
  approval_stage_reject,
  approval_stage_review
}

function get_approval_stage_tree(param){
  return new Promise((resolve, reject) => {
  axios.post(`${process.env.VUE_APP_API}/api/v1/approval/get_stage_tree`, param).then((resp) => {
    resolve(resp.data)}).catch((error) => {
      reject(error)
    }
  )
})
}

function approval_stage_reject(param){
  return new Promise((resolve, reject) => {
  axios.post(`${process.env.VUE_APP_API}/api/v1/approval/reject`, param).then((resp) => {
    resolve(resp.data)}).catch((error) => {
      reject(error)
    }
  )
})
}

function approval_stage_review(param){
  return new Promise((resolve, reject) => {
  axios.post(`${process.env.VUE_APP_API}/api/v1/approval/sign`, param).then((resp) => {
    resolve(resp.data)}).catch((error) => {
      reject(error)
    }
  )
})
}