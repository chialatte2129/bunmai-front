<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-aim"></i> {{$t("menus.event_box_taipei_20201025")}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t("menus.DT_setting")}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-card shadow="hover" body-style="padding:10px" class="mgb10">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">對陣圖與分數設定</span>
                    <el-button type="warning" size="large" icon="el-icon-refresh" class="card-header-r-btn" @click="refreshMatchData"> 重整</el-button>
                    <el-button type="info" size="large" plain icon="el-icon-connection" class="card-header-btn" @click="getLink('match')"> 取得對陣圖連結</el-button>
                </div>
                <div style="padding:10px;text-align:center;">
                    <el-form ref="edit_scoreboard_form" :model="edit_scoreboard_form" label-position="right" label-width="auto">
                        <el-row class="match-final mgb10">
                            <el-col :span="10" style="background:rgba(140, 206, 255, 0.3);">
                                <span class="match-final-name" :class="result_status('g15_1')">{{show_name('g15_1')}}</span>
                            </el-col>
                            <el-col :span="4">
                                <el-divider>FINAL</br>決賽</el-divider>
                            </el-col>
                            <el-col :span="10" style="background:rgba(255, 140, 140, 0.3);">
                                <span class="match-final-name" :class="result_status('g15_2')">{{show_name('g15_2')}}</span>
                            </el-col>
                        </el-row>
                        <el-row class="match-semifinal mgb10">
                            <el-col :span="10">
                                <el-col :span="11" style="background:rgba(140, 206, 255, 0.3);">
                                    <span class="match-final-name" :class="result_status('g13_1')">{{show_name('g13_1')}}</span>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11" style="background:rgba(140, 206, 255, 0.3);">
                                    <span class="match-final-name" :class="result_status('g13_2')">{{show_name('g13_2')}}</span>
                                </el-col>
                            </el-col>
                            <el-col :span="4">
                                <el-divider>SEMIFINALS</br>4 強賽</el-divider>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="11" style="background:rgba(255, 140, 140, 0.3);">
                                    <span class="match-final-name" :class="result_status('g14_1')">{{show_name('g14_1')}}</span>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11" style="background:rgba(255, 140, 140, 0.3);">
                                    <span class="match-final-name" :class="result_status('g14_2')">{{show_name('g14_2')}}</span>
                                </el-col>
                            </el-col>
                        </el-row>
                        <el-row>
                        </el-row>
                        <el-row>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <el-card shadow="hover" body-style="padding:10px">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">顯示記分板設定</span>
                    <el-button type="primary" size="large" icon="el-icon-files" class="card-header-r-btn" :disabled="disabledScoreBoard()" @click="saveScoreBoard"> {{$t('btn.save')}}</el-button>
                    <el-button type="info" size="large" plain icon="el-icon-connection" class="card-header-btn" @click="getLink('score')"> 取得記分板連結</el-button>
                </div>
                <div style="padding:10px;">
                    <el-form ref="show_scoreboard_form" :model="show_scoreboard_form" label-position="right" label-width="auto">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="記分板標題" prop="title">
                                    <el-select v-model="show_scoreboard_form.title" placeholder="中文翻譯 - 顯示頁面標題" clearable style="width:250px;" @change="scoreboardChange">
                                        <el-option v-for="option in options.title" :label="`${option.note} - ${option.label}`" :value="option.id" :key="option.id"/>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="18" v-if="show_scoreboard_form.title" style="text-align:center;">
                                <div class="scoreboard-stauts-N" v-if="show_scoreboard_form.status=='N'">
                                    <el-col :span="11" style="background:rgba(140, 206, 255, 0.3);">
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.left.top" placeholder="左上隊伍" clearable>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                        </el-select>
                                        <el-divider class="division"/>
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.left.btm" placeholder="左下隊伍" clearable>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="1">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="background:rgba(255, 140, 140, 0.3);">
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.right.top" placeholder="右上隊伍" clearable>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                        </el-select>
                                        <el-divider class="division"/>
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.right.btm" placeholder="右下隊伍" clearable>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                        </el-select>
                                    </el-col>
                                </div>
                                <div class="scoreboard-stauts-F" v-else-if="show_scoreboard_form.status=='F'">
                                    <el-row style="background:rgba(140, 206, 255, 0.3);">
                                        <el-select class="team-selector-F" v-model="show_scoreboard_form.center.top" placeholder="上方隊伍" clearable>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                        </el-select>
                                    </el-row>
                                    <el-divider class="division"/>
                                    <el-row style="background:rgba(255, 140, 140, 0.3);">
                                        <el-select class="team-selector-F" v-model="show_scoreboard_form.center.btm" placeholder="下方隊伍" clearable>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                        </el-select>
                                    </el-row>
                                </div>
                                <div v-else>Unknown Status</div>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    name:"DT_setting",
    components: {

    },

    data(){
        return {
            match_id:"MATCH-DT-2020-10-25",
            unknown_value:[null, "", undefined], 
            show_scoreboard_form:{
                title:"",
                status:"",
                left:{ top:"", btm:"", },
                right:{ top:"", btm:"", },
                center:{ top:"", btm:"", }
            },
            edit_scoreboard_form:{
                g1_1:{id:"", name:"", is_win:false, process:"D"},
                g1_2:{id:"", name:"", is_win:false, process:"D"},
                g2_1:{id:"", name:"", is_win:false, process:"D"},
                g2_2:{id:"", name:"", is_win:false, process:"D"},
                g3_1:{id:"", name:"", is_win:false, process:"D"},
                g3_2:{id:"", name:"", is_win:false, process:"D"},
                g4_1:{id:"", name:"", is_win:false, process:"D"},
                g4_2:{id:"", name:"", is_win:false, process:"D"},
                g5_1:{id:"", name:"", is_win:false, process:"D"},
                g5_2:{id:"", name:"", is_win:false, process:"D"},
                g6_1:{id:"", name:"", is_win:false, process:"D"},
                g6_2:{id:"", name:"", is_win:false, process:"D"},
                g7_1:{id:"", name:"", is_win:false, process:"D"},
                g7_2:{id:"", name:"", is_win:false, process:"D"},
                g8_1:{id:"", name:"", is_win:false, process:"D"},
                g8_2:{id:"", name:"", is_win:false, process:"D"},
                g9_1:{id:"", name:"", is_win:false, process:"D"},
                g9_2:{id:"", name:"", is_win:false, process:"D"},
                g10_1:{id:"", name:"", is_win:false, process:"D"},
                g10_2:{id:"", name:"", is_win:false, process:"D"},
                g11_1:{id:"", name:"", is_win:false, process:"D"},
                g11_2:{id:"", name:"", is_win:false, process:"D"},
                g12_1:{id:"", name:"", is_win:false, process:"D"},
                g12_2:{id:"", name:"", is_win:false, process:"D"},
                g13_1:{id:"", name:"", is_win:false, process:"D"},
                g13_2:{id:"", name:"", is_win:false, process:"D"},
                g14_1:{id:"", name:"", is_win:false, process:"D"},
                g14_2:{id:"", name:"", is_win:false, process:"D"},
                g15_1:{id:"", name:"", is_win:false, process:"D"},
                g15_2:{id:"", name:"", is_win:false, process:"D"},                
            },
            options:{
                title:{
                    "01":{"id":"01","label":"FINAL","note":"冠軍賽","status":"F"},
                    "02":{"id":"02","label":"THIRD","note":"季軍賽","status":"F"},
                    "03":{"id":"03","label":"SEMIFINALS","note":"4 強賽","status":"N"},
                    "04":{"id":"04","label":"QUARTERFINALS","note":"8 強賽","status":"N"},
                    "05":{"id":"05","label":"ROUND OF SIXTEEN","note":"16 強賽","status":"N"}
                },
                teams:[
                    {"id":"01","name":"team-01"},
                    {"id":"02","name":"team-02"},
                    {"id":"03","name":"team-03"},
                    {"id":"04","name":"team-04"},
                    {"id":"05","name":"team-05"},
                    {"id":"06","name":"team-06"},
                    {"id":"07","name":"team-07"},
                    {"id":"08","name":"team-08"},
                    {"id":"09","name":"team-09"},
                    {"id":"10","name":"team-10"},
                    {"id":"11","name":"team-11"},
                    {"id":"12","name":"team-12"},
                    {"id":"13","name":"team-13"},
                    {"id":"14","name":"team-14"},
                    {"id":"15","name":"team-15"},
                    {"id":"16","name":"team-16"}
                ],
            },
        }
    },
    computed: {

    },
    watch: {
        
    },

    created(){
        this.getBaseOptions();
        this.getData();
    },

    methods:{
        getBaseOptions(){
            // title
            // teams
        },

        getData(){

        },

        refreshMatchData(){

        },

        getLink(content){
			this.$copyText(`${process.env.VUE_APP_HOST}public/event/box_taipei/${content}/${this.match_id}`).then(
                res => {
				    this.$message.success(`${this.$i18n.t('common_msg.copy_ok')} ${process.env.VUE_APP_HOST}public/event/box_taipei/${content}/${this.match_id}`);
			    }, 
				err => { 
                    this.$message.error(err);
                } 
			)
        },

        show_name(game){
            if(this.edit_scoreboard_form[game]!=undefined&&"name" in this.edit_scoreboard_form[game]) return this.edit_scoreboard_form[game].name;
            return "";
        },

        result_status(game){
            if(this.edit_scoreboard_form[game]!=undefined&&"is_win" in this.edit_scoreboard_form[game]&&"process" in this.edit_scoreboard_form[game]){
                return {win:this.edit_scoreboard_form[game].is_win&&this.edit_scoreboard_form[game].process=="F", lose:!this.edit_scoreboard_form[game].is_win&&this.edit_scoreboard_form[game].process=="F"};
            }
            return ;
        },

        disabledScoreBoard(){
            if(this.unknown_value.includes(this.show_scoreboard_form.title)) return true;
            if(this.show_scoreboard_form.status=="N"){
                if(this.unknown_value.includes(this.show_scoreboard_form.left.top)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.left.btm)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.right.top)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.right.btm)) return true;
            }
            if(this.show_scoreboard_form.status=="F"){
                if(this.unknown_value.includes(this.show_scoreboard_form.center.top)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.center.btm)) return true;
            }
            return false;
        },

        saveScoreBoard(){

        },

        scoreboardChange(){
            this.show_scoreboard_form.status = (this.unknown_value.includes(this.show_scoreboard_form.title))?"":this.options.title[this.show_scoreboard_form.title].status;
            this.show_scoreboard_form = {
                title:this.show_scoreboard_form.title,
                status:this.show_scoreboard_form.status,
                left:{ top:"", btm:"", },
                right:{ top:"", btm:"", },
                center:{ top:"", btm:"", }
            };
        },

        teamSelectDisabled(id){
            if(id==this.show_scoreboard_form.left.top) return true
            if(id==this.show_scoreboard_form.left.btm) return true
            if(id==this.show_scoreboard_form.right.top) return true
            if(id==this.show_scoreboard_form.right.btm) return true
            if(id==this.show_scoreboard_form.center.top) return true
            if(id==this.show_scoreboard_form.center.btm) return true
            return false;
        },
    }
}
</script>
<style scoped>
    .mgb10{
        margin-bottom:10px;
    }
    .mgr10{
        margin-right:10px;
    }
    .mgl10{
        margin-left:10px;
    }
    .container{
        background-color:#f0f0f0;
        padding:25px;
    }
    .crumbs >>> .el-breadcrumb{
        font-size: 20px;
        height: 25px;
    }
    .clearfix{
        line-height:1.23;
    }
    .card-header-r-btn{
        position:relative;
        float:right;
        margin:-10px -10px 0 0;
    }
    .card-header-btn{
        position:relative;
        float:right;
        margin:-10px 10px 0 0;
    }
    .scoreboard-stauts-N >>> .el-divider--vertical{
        width:1px;
        height:105px;
    }
    .scoreboard-stauts-N >>> .el-divider--horizontal{
        margin:0;
    }
    .scoreboard-stauts-F >>> .el-divider--horizontal{
        margin:0;
    }
    .team-selector-N{
        width:90%;
        margin:10px 0;
    }
    .team-selector-F{
        width:80%;
        margin:10px 0;
    }
    .match-final >>> .el-col{
        padding:2px;
        height:50px;
    }
    .match-final >>> .match-final-name{
        line-height:49px;
    }
    .match-semifinal >>> .el-col{
        height:50px;
    }
    .match-semifinal >>> .match-final-name{
        line-height:49px;
    }
    .match-semifinal >>> .el-divider--vertical{
        width:1px;
        height:50px;
    }
    .match-final-name.win{
        color:black;
        font-size:22px;
    }
    .match-final-name.lose{
        color:#858585;
        font-size:18px;
    }
</style>