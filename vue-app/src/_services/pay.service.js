import axios from 'axios'

export const payService = {
  handle_pay
}



function handle_pay(params) {
  return new Promise((resolve, reject) => {
    axios.post(process.env.VUE_APP_API+ '/api/sale_info/record', params).then((resp) => {
      resolve(resp.data)
    }).catch((error) => {
      reject(error)
    })
   })

}
