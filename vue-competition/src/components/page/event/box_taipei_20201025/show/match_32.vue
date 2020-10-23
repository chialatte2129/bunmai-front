<template>
    <body id="board-index">
        <div class="board-bg">
            <div class="top-line"></div>
            <div class="top-champion-image"></div>
            <div class="match-logo"></div>
            <div class="list-bg">
                <div class="round-16">
                    <div class="cell g9-1" :class="game_result_status('g9_1')">{{show_name('g9_1')}}</div>
                    <div class="cell g10-1" :class="game_result_status('g10_1')">{{show_name('g10_1')}}</div>
                    <div class="cell g11-1" :class="game_result_status('g11_1')">{{show_name('g11_1')}}</div>
                    <div class="cell g12-1" :class="game_result_status('g12_1')">{{show_name('g12_1')}}</div>
                    <div class="space"></div>
                    <div class="cell g13-1" :class="game_result_status('g13_1')">{{show_name('g13_1')}}</div>
                    <div class="cell g14-1" :class="game_result_status('g14_1')">{{show_name('g14_1')}}</div>
                    <div class="cell g15-1" :class="game_result_status('g15_1')">{{show_name('g15_1')}}</div>
                    <div class="cell g16-1" :class="game_result_status('g16_1')">{{show_name('g16_1')}}</div>

                    <div class="cell g9-2" :class="game_result_status('g9_2')">{{show_name('g9_2')}}</div>
                    <div class="cell g10-2" :class="game_result_status('g10_2')">{{show_name('g10_2')}}</div>
                    <div class="cell g11-2" :class="game_result_status('g11_2')">{{show_name('g11_2')}}</div>
                    <div class="cell g12-2" :class="game_result_status('g12_2')">{{show_name('g12_2')}}</div>
                    <div class="space"></div>
                    <div class="cell g13-2" :class="game_result_status('g13_2')">{{show_name('g13_2')}}</div>
                    <div class="cell g14-2" :class="game_result_status('g14_2')">{{show_name('g14_2')}}</div>
                    <div class="cell g15-2" :class="game_result_status('g15_2')">{{show_name('g15_2')}}</div>
                    <div class="cell g16-2" :class="game_result_status('g16_2')">{{show_name('g16_2')}}</div>
                </div>
                <div class="round-32 round-32-up">
                    <div class="cell g17-1" :class="game_result_status('g17_1')">{{show_name('g17_1')}}</div>
                    <div class="cell g18-1" :class="game_result_status('g18_1')">{{show_name('g18_1')}}</div>
                    <div class="space-s"></div>
                    <div class="cell g21-1" :class="game_result_status('g21_1')">{{show_name('g21_1')}}</div>
                    <div class="cell g22-1" :class="game_result_status('g22_1')">{{show_name('g22_1')}}</div>
                    <div class="space-l"></div>
                  
                    <div class="cell g27-1" :class="game_result_status('g27_1')">{{show_name('g27_1')}}</div>
                    <div class="cell g28-1" :class="game_result_status('g28_1')">{{show_name('g28_1')}}</div>
                    <div class="space-s"></div>
                  
                          <div class="cell g31-1" :class="game_result_status('g31_1')">{{show_name('g31_1')}}</div>
                    <div class="cell g32-1" :class="game_result_status('g32_1')">{{show_name('g32_1')}}</div>
                    <div style="clear: both;"></div>
                    <div class="cell g17-2" :class="game_result_status('g17_2')">{{show_name('g17_2')}}</div>
                    <div class="cell g18-2" :class="game_result_status('g18_2')">{{show_name('g18_2')}}</div>
                    <div class="space-s"></div>
                    <div class="cell g21-2" :class="game_result_status('g21_2')">{{show_name('g21_2')}}</div>
                    <div class="cell g22-2" :class="game_result_status('g22_2')">{{show_name('g22_2')}}</div>
                    <div class="space-l"></div>
                    <div class="cell g27-2" :class="game_result_status('g27_2')">{{show_name('g27_2')}}</div>
                    <div class="cell g28-2" :class="game_result_status('g28_2')">{{show_name('g28_2')}}</div>
                    
                    <div class="space-s"></div>
                  
                        <div class="cell g31-2" :class="game_result_status('g31_2')">{{show_name('g31_2')}}</div>
                     <div class="cell g32-2" :class="game_result_status('g32_2')">{{show_name('g32_2')}}</div>
                </div>
                <div class="round-32 round-32-down">
                    <div class="cell g19-1" :class="game_result_status('g19_1')">{{show_name('g19_1')}}</div>
                    <div class="cell g20-1" :class="game_result_status('g20_1')">{{show_name('g20_1')}}</div>
                    <div class="space-s"></div>
                    <div class="cell g23-1" :class="game_result_status('g23_1')">{{show_name('g23_1')}}</div>
                    <div class="cell g24-1" :class="game_result_status('g24_1')">{{show_name('g24_1')}}</div>
                    <div class="space-l"></div>
                      <div class="cell g25-1" :class="game_result_status('g25_1')">{{show_name('g25_1')}}</div>
                       <div class="cell g26-1" :class="game_result_status('g26_1')">{{show_name('g26_1')}}</div>
                   
                    <div class="space-s"></div>
                <div class="cell g29-1" :class="game_result_status('g29_1')">{{show_name('g29_1')}}</div>
                    <div class="cell g30-1" :class="game_result_status('g30_1')">{{show_name('g30_1')}}</div>
                    <div style="clear: both;"></div>
                    <div class="cell g19-2" :class="game_result_status('g19_2')">{{show_name('g19_2')}}</div>
                    <div class="cell g20-2" :class="game_result_status('g20_2')">{{show_name('g20_2')}}</div>
                    <div class="space-s"></div>
                    <div class="cell g23-2" :class="game_result_status('g23_2')">{{show_name('g23_2')}}</div>
                    <div class="cell g24-2" :class="game_result_status('g24_2')">{{show_name('g24_2')}}</div>
                    <div class="space-l"></div>
                    
                    <div class="cell g25-2" :class="game_result_status('g25_2')">{{show_name('g25_2')}}</div>
                    <div class="cell g26-2" :class="game_result_status('g26_2')">{{show_name('g26_2')}}</div>
                    <div class="space-s"></div>
                  <div class="cell g29-2" :class="game_result_status('g29_2')">{{show_name('g29_2')}}</div>
                  <div class="cell g30-2" :class="game_result_status('g30_2')">{{show_name('g30_2')}}</div>
                   
                </div>
            </div>
            <div class="bottom-line"></div>
            <div class="bottom-logo"></div>
        </div>
    </body>
</template>

<script>
import {eventService} from "@/_services";
export default {
    name:"box_taipei_20201025_match",
    components:{
        
    },
    data(){
        return{
            table:{
                // g1_1:{ id: "00001", group_id: "1", name: "team_01", process: "D", is_win: 0, pos_id: "top"},
            },
            reload_time:60000,
        }
    },

    created(){
        this.getData();
        this.connect_websocket();
        this.refresh();
    },

    computed:{
        
    },

    methods:{
        connect_websocket(){ 
            try{ 
                const ws = new WebSocket(process.env.VUE_APP_WS);
                this.setSocket(ws);
            }catch(err){ 
                console.log(err);
            }
        },

        setSocket(websocket){
            var heartCheck = {
                timeout: 5000, //重連時間
                timeoutObj: null,
                start: ()=>{
                    this.timeoutObj = setTimeout(()=>{
                        console.log("斷線重連");
                        this.connect_websocket(); //重新創建連線 websocket
                    }, this.timeout)
                }
            }
            websocket.onopen = function(evnt) {
                console.log('連線建立');
            };
            websocket.onmessage = ({data}) => { 
                console.log("new message");
                this.getData();
            }
            websocket.onerror = function(evnt) {
                console.log('錯誤');
            };
            websocket.onclose = function(evnt) {
                console.log('斷線');
                //連接關閉啟動定時任務 五秒後在創建
                heartCheck.start();
            }
        },
        
        async getData(){
            if(this.$route.params.match_id){
                await eventService.get_match_map({match_id:this.$route.params.match_id}).then(res => {
                    if(res.code==1){
                        this.table = res.match_form;
                        this.reload_time = res.reload_time;
                    }
                })
            }
        },

        refresh(){
            setInterval(() => {
                console.log("refresh");
                this.getData()
            }, this.reload_time);
        },    

        show_name(game){
            if(this.table[game]!=undefined&&"name" in this.table[game]) return this.table[game].name;
            return "";
        },

        game_result_status(game){
            if(this.table[game]!=undefined&&"is_win" in this.table[game]&&"process" in this.table[game]){
                return {win:this.table[game].is_win&&this.table[game].process=="F", lose:!this.table[game].is_win&&this.table[game].process=="F"};
            }
            return ;
        }
    }
};
</script>
<style scoped lang="scss">
#board-index {
    padding: 0;
    margin: 0;
    background-color: transparent;
    div {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .board-bg {
        padding: 0;
        margin: 0;
        width: 1920px;
        height: 1080px;
        background: url("board/bg.jpg") no-repeat top center;
        background-size: contain;
        background-position: center;
        display: block;
    }
    .match-logo {
        background: url("board/match-logo.png") no-repeat top center;
        background-size: contain;
        width: 800px;
        height: 180px;
        position: fixed;
        top: 20px;
        left: 50px;
    }
    .top-champion-image {
        background: url("board/top-champion-image.png") no-repeat top center;
        background-size: contain;
        width: 600px;
        height: 450px;
        position: fixed;
        top: -130px;
        left: 1920-600px;
    }
    .top-line {
        background: url("board/top-line.png") no-repeat top center;
        background-size: contain;
        width: 1920px;
        height: 38px;
        position: fixed;
        top: 230px;
    }
    .bottom-line {
        background: url("board/bottom-line.png") no-repeat top center;
        background-size: contain;
        width: 1920px;
        height: 25px;
        position: fixed;
        top: 700+250+15px;
    }
    .bottom-logo {
        background: url("board/bottom-logo.png") no-repeat top center;
        background-size: contain;
        width: 1920px;
        height: 60px;
        position: fixed;
        top: 700+250+50px;
    }
    .list-bg {
        background: url("board/list-bg5.png") no-repeat top center;
        background-size: contain;
        width: 1920px;
        height: 700px;
        position: fixed;
        top: 290px;
        .cell {
            border-radius: 10px;
            background-color: white;
            padding: 0;
            display: flex;
            text-align: center;
            justify-content: center;
            align-items: center;
            font-size: 22px;
            font-family: "PingFangTC-Medium", Arial, serif;
            text-shadow: 1px 2px 3px rgb(223, 187, 187);
            float: left;
        }
        .round-32 {
            // background-color: rgba(0, 0, 0, 0.5);
            margin-top:-7.5px;
            position: fixed;
            width: 1850px;
            height: 156px;
            left: 52px;
            top: 597px;
            .space-s {
                width: 45px;
                height: 67px;
                float: left;
            }
            .space-l {
                width: 558px;
                height: 67px;
                float: left;
            }
            .cell {
                width: 118px;
                height: 50px;
                margin: 0 31px 16px 0;
            }
            .cell.win {
                background: linear-gradient(0deg, rgba(200, 197, 52, 1) 0%, rgba(255, 221, 131, 1) 100%);
                text-shadow: 1px 2px 3px rgb(255, 255, 255);
            }
            .cell.lose {
                background: gray;
                color: #444;
                text-shadow: none;
            }
        }
        .round-32-down {
            top: 778px;
            left: 223px;
            .space-l {
                width: 218px;
            }
        }
    }
    .round-16 {
        /* background-color: rgba(1, 1, 1, 0.5); */
        margin-top:-7.5px;
        position: fixed;
        width: 1700px;
        height: 156px;
        left: 116px;
        top: 345px;
        .space {
            width: 336px;
            height: 67px;
            float: left;
        }
        .cell {
            width: 158px;
            height: 67px;
            margin: 0 12px 20px 0;
        }
        .cell.win {
            background: linear-gradient(0deg, rgba(200, 197, 52, 1) 0%, rgba(255, 221, 131, 1) 100%);
            text-shadow: 1px 2px 3px rgb(255, 255, 255);
        }
        .cell.lose {
            background: gray;
            color: #444;
            text-shadow: none;
        }
    }
}
</style>