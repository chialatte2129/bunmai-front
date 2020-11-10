import Vue from "vue";
import { Notification } from 'element-ui';

export function get_today_str(offset) {
    var x = new Date();
    x.setDate(x.getDate() - offset);
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    d.length == 1 && (d = "0" + d);
    m.length == 1 && (m = "0" + m);
    var yyyymmdd = y + "-" + m + "-" + d;
    return yyyymmdd;
  }


export  function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


export function datediff(start, end) {
  return Math.round((end-start)/(1000*60*60*24));
}


export function isMobile() {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}


