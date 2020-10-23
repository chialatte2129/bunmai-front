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
	get_group_option,
	save_scoreboard_setting,
	get_scoreboard_setting,
	show_scoreboard,

	get_match_options,
	create_test_match
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

function get_group_option(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/option/group/get', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function save_scoreboard_setting(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/scoreboard/setting/save', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function get_scoreboard_setting(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/scoreboard/setting/get', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function show_scoreboard(param){
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/scoreboard/show', param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

// 測試活動頁
function get_match_options(){
	var params={}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/test/get_match_options', params).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

function create_test_match(match_name,match_type,is_gen_teams){
	var params={
		"match_name":match_name,
		"match_type":match_type,
		"is_gen_teams":is_gen_teams
	}
    return new Promise((resolve, reject) => {
		axios.post(process.env.VUE_APP_API+'/gaming/v1/event/test/create_new_match', params).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}

