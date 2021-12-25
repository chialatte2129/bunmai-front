import axios from 'axios'

export const redirectService = {
  get_redirect_url
}



function get_redirect_url(params) {
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/redirect/get_url', params).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}
