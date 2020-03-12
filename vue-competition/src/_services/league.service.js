import axios from 'axios'

export const leagueService = { 
	get_league_team,
	delete_league_team,
	get_single_league_team,
	update_league_team_info,
	
	get_league_player,
	delete_league_player,
	get_single_league_player,
	update_league_player,
	member_valid,

	get_option_league_teams,
	get_league_match_list,
	delete_league_match_list,
	update_league_match_list,
	
}
function get_league_team(type, game_id, filter){
	var param = {"type":type, "game_id":game_id, "filter":filter}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_league_team', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function delete_league_team(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/delete_league_team', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function get_single_league_team(team_id){
    var param = {"team_id":team_id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_single_league_team', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}

function update_league_team_info(type, data){
    var param = {"type":type, "param":data}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/update_league_team_info', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}

function get_league_player(type, team_id, filter){
	var param = {"type":type, "team_id":team_id, "filter":filter}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_league_player', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function delete_league_player(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/delete_league_player', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function get_single_league_player(team_id, member_id){
    var param = {"team_id":team_id, "member_id":member_id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_single_league_player', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}

function update_league_player(type, data){
    var param = {"type":type, "param":data}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/update_league_player', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}

function member_valid(mid){
    var param = {"member_id":mid}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/member_valid', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_option_league_teams(id){
    var param = {"game_id":id}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_option_league_teams', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_league_match_list(id, filter){
	var param = {"game_id":id, "filter":filter}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/get_league_match_list', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function delete_league_match_list(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/delete_league_match_list', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})		
}

function update_league_match_list(type, data){
    var param = {"type":type, "param":data}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/update_league_match_list', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})	
}
