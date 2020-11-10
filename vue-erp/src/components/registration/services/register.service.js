import axios from 'axios'
import rsa_encypted from './rsa_encrypted.js'
export const registerService = {
	get_registraion_form,
	get_registraion_lang,
	confirm_registraion,
}

function get_registraion_form(url){
    var param = {
        "register_url":url
    }
	return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/api/v1/get_registraion_form', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}

function get_registraion_lang(url){
    var param = {
        "register_url":url
    }
	return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/api/v1/get_registraion_lang', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}


function confirm_registraion(cipher){
	var param = {
		"cipher":cipher
	}
	return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/api/v1/confirm_registraion', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}


