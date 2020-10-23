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
                <div class="round-8">
                    <div class="cell g5-1" :class="game_result_status('g5_1')">{{show_name('g5_1')}}</div>
                    <div class="space-150"></div>
                    <div class="cell g6-1" :class="game_result_status('g6_1')">{{show_name('g6_1')}}</div>
                    <div class="space"></div>
                    <div class="cell g7-1" :class="game_result_status('g7_1')">{{show_name('g7_1')}}</div>
                    <div class="space-150"></div>
                    <div class="cell g8-1" :class="game_result_status('g8_1')">{{show_name('g8_1')}}</div>

                    <div class="cell g5-2" :class="game_result_status('g5_2')">{{show_name('g5_2')}}</div>
                    <div class="space-150"></div>
                    <div class="cell g6-2" :class="game_result_status('g6_2')">{{show_name('g6_2')}}</div>
                    <div class="space"></div>
                    <div class="cell g7-2" :class="game_result_status('g7_2')">{{show_name('g7_2')}}</div>
                    <div class="space-150"></div>
                    <div class="cell g8-2" :class="game_result_status('g8_2')">{{show_name('g8_2')}}</div>
                </div>
                <div class="round-4">
                    <div class="cell g3-1" :class="game_result_status('g3_1')">{{show_name('g3_1')}}</div>
                    <div class="space-150"></div>
                    <div class="cell g3-2" :class="game_result_status('g3_2')">{{show_name('g3_2')}}</div>
                    <div class="space"></div>
                    <div class="cell g4-1" :class="game_result_status('g4_1')">{{show_name('g4_1')}}</div>
                    <div class="space-150"></div>
                    <div class="cell g4-2" :class="game_result_status('g4_2')">{{show_name('g4_2')}}</div>
                </div>
                <div class="round-final">
                    <div class="cell g1-1" :class="game_result_status('g1_1')">{{show_name('g1_1')}}</div>
                    <div class="space"></div>
                    <div class="cell g1-2" :class="game_result_status('g1_2')">{{show_name('g1_2')}}</div>
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
                // g1_1:{ id: "00001", group_id: "1", name: "team_01", process: "D", is_win: 0, pos_id: "1"},
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
        background: url("board/list-bg2.png") no-repeat top center;
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
    }
    .round-16 {
        /* background-color: rgba(1, 1, 1, 0.5); */
        margin-top:-7.5px;
        position: fixed;
        width: 1700px;
        height: 156px;
        left: 116px;
        top: 767px;
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
    .round-8 {
        /* background-color: rgba(1, 1, 1, 0.5); */
        margin-top:-7.5px;
        position: fixed;
        width: 1700px;
        height: 156px;
        left: 116px;
        top: 569px;
        .space-150 {
            width: 160px;
            height: 67px;
            float: left;
        }
        .space {
            width: 336px + 12;
            height: 67px;
            float: left;
        }
        .cell {
            width: 255px;
            height: 67px;
            margin: 0 0 20px 0;
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
    .round-4 {
        /* background-color: rgba(1, 1, 1, 0.5); */
        margin-top:-7.5px;
        position: fixed;
        width: 1700px;
        height: 70px;
        left: 116px;
        top: 465px;
        .space-150 {
            width: 25px;
            height: 67px;
            float: left;
        }
        .space {
            width: 336px + 12;
            height: 67px;
            float: left;
        }
        .cell {
            width: 323px;
            height: 67px;
            margin: 0 0 20px 0;
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
    .round-final {
        /* background-color: rgba(1, 1, 1, 0.5); */
        margin-top:-7.5px;
        position: fixed;
        width: 1700px;
        height: 70px;
        left: 116px;
        top: 345px;
        .space-150 {
            width: 25px;
            height: 67px;
            float: left;
        }
        .space {
            width: 336px + 12;
            height: 67px;
            float: left;
        }
        .cell {
            width: 672px;
            height: 67px;
            margin: 0 0 20px 0;
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