import axios from 'axios';

export const calendarService = { 
	get_calendar_event,
	update_public_holiday
}

function get_calendar_event(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/calendar/get_events`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}


function update_public_holiday(param){
    return new Promise((resolve, reject) => {
		axios.post(`${process.env.VUE_APP_API}/api/v1/calendar/public_holiday/update`, param).then((resp) => {
			resolve(resp.data)}).catch((error) => {
				reject(error)
			}
		)
	})
}


