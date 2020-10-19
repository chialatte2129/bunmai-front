<template>
    <body id="board-score">
        <div class="board-bg">
            <div class="top-line"></div>
            <div class="top-champion-image"></div>
            <div class="match-logo"></div>
            <div v-if="table.status=='F'">
                <div class="list-bg-f">
                    <div class="match-name">{{show_table_name()}}</div>
                    <div class="score-group">
                        <div class="player player-1">{{show_name('center', 'top', 'name')}}</div>
                        <div class="score score-1-1" :class="game_result_status('center', 'top', 0)">{{show_score('center', 'top', 'score', 0)}}</div>
                        <div class="score score-1-2" :class="game_result_status('center', 'top', 1)">{{show_score('center', 'top', 'score', 1)}}</div>
                        <div class="score score-1-3" :class="game_result_status('center', 'top', 2)">{{show_score('center', 'top', 'score', 2)}}</div>
                        <div class="score score-1-4" :class="game_result_status('center', 'top', 3)">{{show_score('center', 'top', 'score', 3)}}</div>
                        <div class="score score-1-5" :class="game_result_status('center', 'top', 4)">{{show_score('center', 'top', 'score', 4)}}</div>
                        <div class="player player-2">{{show_name('center', 'btm', 'name')}}</div>
                        <div class="score score-2-1" :class="game_result_status('center', 'btm', 0)">{{show_score('center', 'btm', 'score', 0)}}</div>
                        <div class="score score-2-2" :class="game_result_status('center', 'btm', 1)">{{show_score('center', 'btm', 'score', 1)}}</div>
                        <div class="score score-2-3" :class="game_result_status('center', 'btm', 2)">{{show_score('center', 'btm', 'score', 2)}}</div>
                        <div class="score score-2-4" :class="game_result_status('center', 'btm', 3)">{{show_score('center', 'btm', 'score', 3)}}</div>
                        <div class="score score-2-5" :class="game_result_status('center', 'btm', 4)">{{show_score('center', 'btm', 'score', 4)}}</div>
                    </div>
                </div>
            </div>
            <div v-else-if="table.status=='N'">
                <div class="list-bg">
                    <div class="match-name">{{show_table_name()}}</div>
                    <div class="score-group score-group-left">
                        <div class="player left-player-1">{{show_name('left', 'top', 'name')}}</div>
                        <div class="score left-score-1-1" :class="game_result_status('left', 'top', 0)">{{show_score('left', 'top', 'score', 0)}}</div>
                        <div class="score left-score-1-2" :class="game_result_status('left', 'top', 1)">{{show_score('left', 'top', 'score', 1)}}</div>
                        <div class="score left-score-1-3" :class="game_result_status('left', 'top', 2)">{{show_score('left', 'top', 'score', 2)}}</div>
                        <div class="player left-player-2">{{show_name('left', 'btm', 'name')}}</div>
                        <div class="score left-score-2-1" :class="game_result_status('left', 'btm', 0)">{{show_score('left', 'btm', 'score', 0)}}</div>
                        <div class="score left-score-2-2" :class="game_result_status('left', 'btm', 1)">{{show_score('left', 'btm', 'score', 1)}}</div>
                        <div class="score left-score-2-3" :class="game_result_status('left', 'btm', 2)">{{show_score('left', 'btm', 'score', 2)}}</div>
                    </div>
                    <div class="score-group score-group-right">
                        <div class="player left-player-1">{{show_name('right', 'top', 'name')}}</div>
                        <div class="score left-score-1-1" :class="game_result_status('right', 'top', 0)">{{show_score('right', 'top', 'score', 0)}}</div>
                        <div class="score left-score-1-2" :class="game_result_status('right', 'top', 1)">{{show_score('right', 'top', 'score', 1)}}</div>
                        <div class="score left-score-1-3" :class="game_result_status('right', 'top', 2)">{{show_score('right', 'top', 'score', 2)}}</div>
                        <div class="player left-player-2">{{show_name('right', 'btm', 'name')}}</div>
                        <div class="score left-score-2-1" :class="game_result_status('right', 'btm', 0)">{{show_score('right', 'btm', 'score', 0)}}</div>
                        <div class="score left-score-2-2" :class="game_result_status('right', 'btm', 1)">{{show_score('right', 'btm', 'score', 1)}}</div>
                        <div class="score left-score-2-3" :class="game_result_status('right', 'btm', 2)">{{show_score('right', 'btm', 'score', 2)}}</div>
                    </div>
                </div>
            </div>
            <div v-else>
            </div>
            <div class="bottom-line"></div>
            <div class="bottom-logo"></div>
        </div>
    </body>
</template>
<script>
import {eventService} from "@/_services";
export default {
    name:"box_taipei_20201025_score",
    components:{

    },
    data(){
        return{
            table:{
                status:"",
                name:"",
                center:{
                    top:{name:"", score:[]},
                    btm:{name:"", score:[]}
                },
                left:{
                    top:{name:"", score:[]},
                    btm:{name:"", score:[]}
                },
                right:{
                    top:{name:"", score:[]},
                    btm:{name:"", score:[]}
                },
            },
        }
    },

    created(){
        this.getData();
    },

    computed:{
        
    },

    methods:{
        getData(){

        },

        show_table_name(){
            if("name" in this.table) return this.table.name;
            return "";
        },

        show_name(pos1, pos2, field){
            if(pos1 in this.table&&pos2 in this.table[pos1]&&field in this.table[pos1][pos2]) return this.table[pos1][pos2][field];
            return "";
        },

        show_score(pos1, pos2, field, idx){
            if(pos1 in this.table&&pos2 in this.table[pos1]&&field in this.table[pos1][pos2]) return this.table[pos1][pos2][field][idx];
            return "";
        },

        game_result_status(pos1, pos2 ,idx){
            var result = true;
            if(pos1 in this.table&&"top" in this.table[pos1]&&"btm" in this.table[pos1]){
                var scores = this.table[pos1];
                result = (pos2=="top")?scores["top"]["score"][idx]>scores["btm"]["score"][idx]:scores["btm"]["score"][idx]>scores["top"]["score"][idx];
                return {win:result, lose:!result};
            }
            return ;
        }
    }
};
</script>

<style scoped lang="scss">
#board-score {
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
        // background: url("board/bg.jpg") no-repeat top center;
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
        background: url("board/list-bg3.png") no-repeat top center;
        background-size: contain;
        width: 1920px;
        height: 700px;
        position: fixed;
        top: 295px;
        .match-name {
            font-family: "PingFangTC", Arial, serif;
            font-size: 75px;
            font-weight: bold;
            color: white;
            text-align: center;
            width: 1920px;
            height: 85px;
            left: 0;
            top: 400px;
            position: fixed;
            border-bottom: 1px solid white;
        }
        .score-group {
            position: fixed;
            width: 820px;
            height: 155px;
            top: 570px;
            .player, .score {
                color: white;
                // background-color: lightgrey;
                padding: 0;
                margin: 0 6px 12px 0;
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
                font-size: 39px;
                font-family: "PingFangTC", Arial, serif;
                float: left;
                height: 74px;
            }
            .player {
                width: 252px;
            }
            .score {
                width: 170px;
                font-weight: bold;
            }
            .score.lose {
                color: lightgrey;
            }
            .score.win {
                // background: linear-gradient(90deg, rgba(236, 255, 0, 0) 0%, rgba(255, 188, 0, 0.65) 35%, rgba(255, 188, 0, 0.65) 65%, rgba(236, 255, 0, 0) 100%);
                color: white;
            }
        }
        .score-group-left {
            left: 45px;
        }
        .score-group-right {
            left: 1029px;
        }
    }
    .list-bg-f {
        background: url("board/list-bg4.png") no-repeat top center;
        background-size: contain;
        width: 1920px;
        height: 700px;
        position: fixed;
        top: 295px;
        .match-name {
            font-family: "PingFangTC", Arial, serif;
            font-size: 75px;
            font-weight: bold;
            color: white;
            text-align: center;
            width: 1920px;
            height: 85px;
            left: 0;
            top: 400px;
            position: fixed;
            border-bottom: 1px solid white;
        }
        .score-group {
            position: fixed;
            left: 428px;
            width: 1200px;
            top: 570px;
            .player, .score {
                color: white;
                // background-color: lightgrey;
                padding: 0;
                margin: 0 9px 12px 0;
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
                font-size: 39px;
                font-family: "PingFangTC", Arial, serif;
                float: left;
                height: 74px;
            }
            .player {
                width: 252px;
            }
            .score {
                width: 170px;
                font-weight: bold;
            }
            .score.lose {
                color: lightgrey;
            }
            .score.win {
                // background: linear-gradient(90deg, rgba(236, 255, 0, 0) 0%, rgba(255, 188, 0, 0.65) 35%, rgba(255, 188, 0, 0.65) 65%, rgba(236, 255, 0, 0) 100%);
                color: white;
            }
        }
    }
}
</style>