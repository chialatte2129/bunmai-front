import axios from 'axios'

export const eventService = { 
    get_match_teams,
    change_team_name,
    create_teams
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
