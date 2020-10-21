import axios from 'axios';

export const eventService = {
    get_match_teams,
    change_team_name,
	create_teams,
	get_title,
	create_group_setting,
	get_group_setting,
	get_match_map,
	get_group_score_info,
	update_group_score,
}

function get_match_teams(match_id){
    var param = {
        "match_id":match_id
    }
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/member_manage/get_match_teams', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function change_team_name(match_id,team_id,name,note){
    var param = {
        "match_id":match_id,
        "team_id":team_id,
        "name":name,
        "note":note
    }
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/member_manage/change_team_name', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function create_teams(match_id,input_teams){
    var param = {
        "match_id":match_id,
        "input_teams":input_teams
    }
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/member_manage/create_teams', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_title(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/option/title/get', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function create_group_setting(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/group/setting/create', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_group_setting(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/group/setting/get', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_match_map(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/match/map', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_group_score_info(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/group/score/info', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function update_group_score(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/group/score/update', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

