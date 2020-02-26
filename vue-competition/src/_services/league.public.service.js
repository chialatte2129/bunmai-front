import axios from 'axios'

export const publicService = { 
	get_match_game,
	get_standing_game,
	get_channel_game,
	get_detail_match
}

function get_match_game(game_id){
    var param = {"game_id":game_id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_match_game', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function get_standing_game(game_id){
    var param = {"game_id":game_id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_standing_game', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function get_channel_game(game_id){
    var param = {"game_id":game_id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_channel_game', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function get_detail_match(game_id, main_team_id){
    var param = {"game_id":game_id, "main_team_id":main_team_id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_detail_match', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}