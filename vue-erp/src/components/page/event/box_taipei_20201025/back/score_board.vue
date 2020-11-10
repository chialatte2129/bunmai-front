<template>
    <div>
        <el-card shadow="hover" body-style="padding:10px 5px" style="height:251px;">
            <div slot="header" class="clearfix">
                <span style="font-size:16px;">顯示記分板設定 {{screen}}</span>
                <el-button type="primary" size="large" icon="el-icon-files" class="card-header-r-btn" :disabled="disabledScoreBoard()" @click="saveScoreBoard(false)"> {{$t('btn.save')}}</el-button>
                <el-button type="info" size="large" plain icon="el-icon-connection" class="card-header-btn" @click="getLink('scoreboard')"> 取得記分板連結</el-button>
                <el-button type="success" size="large" plain class="card-header-btn" @click="saveScoreBoard(true)"> 重置</el-button>
            </div>
            <div style="padding:10px;">
                <el-form ref="show_scoreboard_form" :model="show_scoreboard_form" label-position="right" label-width="auto">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="記分板標題" prop="title">
                                <el-select v-model="show_scoreboard_form.title" clearable placeholder="中文翻譯 - 顯示頁面標題" style="width:90%;" @change="scoreboardChange">
                                    <el-option v-for="option in options.title" :label="`${option.note} - ${option.label}`" :value="option.id" :key="option.id"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="show_scoreboard_form.status=='N'" label="左方組別">
                                <el-select v-model="select_scoreboard.left" style="width:90%;" @change="selectScoreboardChange('left')">
                                    <el-option v-for="option in options.group" :label="`${option.label}`" :value="option.id" :key="option.id" :disabled="selectGroupDisabled(option.id)||selectGroup_disabled"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="show_scoreboard_form.status=='N'" label="右方組別">
                                <el-select v-model="select_scoreboard.right" style="width:90%;" @change="selectScoreboardChange('right')">
                                    <el-option v-for="option in options.group" :label="`${option.label}`" :value="option.id" :key="option.id" :disabled="selectGroupDisabled(option.id)||selectGroup_disabled"/>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="show_scoreboard_form.status=='F'" label="中央組別">
                                <el-select v-model="select_scoreboard.center" style="width:90%;" @change="selectScoreboardChange('center')">
                                    <el-option v-for="option in options.group" :label="`${option.label}`" :value="option.id" :key="option.id" :disabled="selectGroupDisabled(option.id)||selectGroup_disabled"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="show_scoreboard_form.title" style="text-align:center;">
                            <div class="scoreboard-stauts-N" v-if="show_scoreboard_form.status=='N'">
                                <el-col :span="11" class="bg-blue">
                                    <el-select class="team-selector-N" v-model="show_scoreboard_form.left.top" placeholder="左上隊伍" disabled>
                                        <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                    </el-select>
                                    <el-divider class="division"/>
                                    <el-select class="team-selector-N" v-model="show_scoreboard_form.left.btm" placeholder="左下隊伍" disabled>
                                        <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                    </el-select>
                                </el-col>
                                <el-col :span="1">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11" class="bg-red">
                                    <el-select class="team-selector-N" v-model="show_scoreboard_form.right.top" placeholder="右上隊伍" disabled>
                                        <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                    </el-select>
                                    <el-divider class="division"/>
                                    <el-select class="team-selector-N" v-model="show_scoreboard_form.right.btm" placeholder="右下隊伍" disabled>
                                        <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                    </el-select>
                                </el-col>
                            </div>
                            <div class="scoreboard-stauts-F" v-else-if="show_scoreboard_form.status=='F'">
                                <el-row class="bg-blue">
                                    <el-select class="team-selector-F" v-model="show_scoreboard_form.center.top" placeholder="上方隊伍" disabled>
                                        <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                    </el-select>
                                </el-row>
                                <el-divider class="division"/>
                                <el-row class="bg-red">
                                    <el-select class="team-selector-F" v-model="show_scoreboard_form.center.btm" placeholder="下方隊伍" disabled>
                                        <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
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
</template>
<script>
import { eventService } from "@/_services";
export default {
    name:"scoreboard",
    components: {

    },
    props: {
        match_id: String,
        screen: String,
    },
    data(){
        return {
            selectGroup_disabled:false,
            unknown_value:[null, "", undefined], 
            show_scoreboard_form:{
                title:"",
                status:"",
                left:{ top:"", btm:"", },
                right:{ top:"", btm:"", },
                center:{ top:"", btm:"", }
            },
            select_scoreboard:{
                left:"",
                right:"",
                center:"",
            },
            options:{
                group:{
                    // "1":{"id":"1","label":"Group 1", "top":"01","btm":"02"},
                },
                title:{},
            },
        }
    },
    computed: {
        
    },

    watch: {
        
    },

    created(){
        this.getScoreBoard();
        this.getTitle();
    },

    methods:{
        async getTitle(){
            await eventService.get_title({match_id:this.match_id}).then(res => {
                if(res.code==1){
                    this.options.title = res.title;
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        getLink(content){
			this.$copyText(`${process.env.VUE_APP_HOST}public/event/box_taipei/${content}/${this.match_id}/${this.screen}`).then(
                res => {
				    this.$message.success(`${this.$i18n.t('common_msg.copy_ok')} ${process.env.VUE_APP_HOST}public/event/box_taipei/${content}/${this.match_id}`);
			    }, 
				err => { 
                    this.$message.error(err);
                } 
			)
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

        async getScoreBoard(){
            await eventService.get_scoreboard_setting({match_id:this.match_id, screen:this.screen}).then(res => {
                if(res.code==1){
                    this.show_scoreboard_form = res.scoreboard;
                    this.select_scoreboard = res.select;
                    if(!this.unknown_value.includes(this.show_scoreboard_form.title)){
                        this.getGroups();
                    }
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        saveScoreBoard(status){
            eventService.save_scoreboard_setting({match_id:this.match_id, screen:this.screen, scoreboard:this.show_scoreboard_form, is_reset:status}).then(res => {
                if(res.code==1){
                    this.$message.success(res.msg);
                    if(status){
                        this.resetScoreboard();
                        this.show_scoreboard_form.title = "";
                        this.show_scoreboard_form.status = "";
                    }
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        resetScoreboard(){
            this.show_scoreboard_form.left = { top:"", btm:"" };
            this.show_scoreboard_form.right = { top:"", btm:"" };
            this.show_scoreboard_form.center = { top:"", btm:"" };
            this.select_scoreboard = {
                left:"",
                right:"",
                center:"",
            };
        },

        async scoreboardChange(){
            this.resetScoreboard();
            this.show_scoreboard_form.status = (this.unknown_value.includes(this.show_scoreboard_form.title))?"":this.options.title[this.show_scoreboard_form.title].status;
            if(!this.unknown_value.includes(this.show_scoreboard_form.title)){
                await this.getGroups();
            }
        },

        async getGroups(){
            this.selectGroup_disabled=true;
            await eventService.get_group_option({match_id:this.match_id, title_id:this.show_scoreboard_form.title}).then(res => {
                if(res.code==1){
                    this.options.group = res.group;
                }else{
                    this.$message.warning(res.msg);
                }
            })
            this.selectGroup_disabled=false;
        },

        selectScoreboardChange(pos){
            if(pos=="left"){
                this.show_scoreboard_form.left.top = this.options.group[this.select_scoreboard.left].top;
                this.show_scoreboard_form.left.btm = this.options.group[this.select_scoreboard.left].btm;
            }else if(pos=="right"){
                this.show_scoreboard_form.right.top = this.options.group[this.select_scoreboard.right].top;
                this.show_scoreboard_form.right.btm = this.options.group[this.select_scoreboard.right].btm;
            }else if(pos=="center"){
                this.show_scoreboard_form.center.top = this.options.group[this.select_scoreboard.center].top;
                this.show_scoreboard_form.center.btm = this.options.group[this.select_scoreboard.center].btm;
            }
        },

        selectGroupDisabled(id){
            if(id==this.select_scoreboard.left) return true;
            if(id==this.select_scoreboard.right) return true;
            if(id==this.select_scoreboard.center) return true;
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
    .bg-red{
        background:rgba(255, 140, 140, 0.3);
    }
    .bg-blue{
        background:rgba(140, 206, 255, 0.3);
    }
</style>