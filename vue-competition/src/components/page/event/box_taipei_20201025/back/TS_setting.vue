<template>
    <div class="setting-page">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-aim"></i> {{$t("menus.event_box_taipei_20201025")}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t("menus.TS_setting")}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <el-select v-model="match_id" placeholder="請選擇 Match ID" @change="handleSelectMatch">
                    <el-option
                    v-for="item in options.matchs"
                    :key="item.keystr"
                    :label="item.keystr+' , '+item.description"
                    :value="item.keystr">
                    </el-option>
                </el-select>
                <el-button class="mgl10" type="warning" @click="handleClean">
                    清除
                </el-button>
                <el-button class="mgl10" type="success" @click="handleCreate">
                    新增
                </el-button>
            </div>
            <div class="mgt10">
                <testTree16 v-if="team_count==16" :match_id="match_id"></testTree16>
                <testTree32 v-if="team_count==32" :match_id="match_id" ></testTree32>
            </div>
        </div>
        <el-dialog title="新增競賽" :visible.sync="createView" width="500px" center :close-on-click-modal="false" class="edit-Dialog">
            <div style="margin-top:10px;">
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="競賽名稱">
                        <el-input type="text" v-model="form.match_name"></el-input>
                    </el-form-item>
                    <el-form-item label="賽制">
                        <el-select v-model="form.match_type" placeholder="請選擇">
                            <el-option :key="32" label="32組" :value="32"></el-option>
                            <el-option :key="16" label="16組" :value="16"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createView=false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="handleConfirmCreate()">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import testTree16 from "./TS_setting_SUB16.vue";
import testTree32 from "./TS_setting_SUB32.vue";
import { eventService } from "@/_services";
export default {
    name:"TS_setting",
    components: {
        testTree16,
        testTree32
    },

    data(){
        return {
            createView:false,
            match_id:"",
            team_count:0,
            options:{
                matchs:[]
            },
            form:{
                match_type:"",
                match_name:""
            }
        }
    },
    computed: {
        
    },

    watch: {
        
    },

    created(){
        this.getOptions();
    },

    methods:{
        handleConfirmCreate(){
            console.log(this.form.match_name);
            console.log(this.form.match_type);
            if(this.form.match_name==""){
                return this.$message.warning("請輸入競賽名稱");
            };
            if(this.form.match_type==""||this.form.match_type==null){
                return this.$message.warning("請輸入選擇賽制");
            };
            eventService
            .create_test_match(this.form.match_name,this.form.match_type)
            .then(res => {
                if(res.code==1){
                    this.match_id = res.match_name;
                    this.team_count = res.match_type;
                    this.getOptions();
                    this.createView=false;
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },
        handleClean(){
            this.team_count = 0;
            this.match_id = "";
        },
        handleCreate(){
            this.form.match_name="";
            this.form.match_type="";
            this.createView=true;
        },
        handleSelectMatch(){
            console.log("change");
            var select_index = this.options.matchs.map(function(e) { return e.keystr }).indexOf(this.match_id);
            this.team_count = this.options.matchs[select_index].content.max_teams;
        },
        getOptions(){
            eventService
            .get_match_options()
            .then(res => {
                if(res.code==1){
                    this.options.matchs = res.data;
                }else{
                    this.$message.warning(res.msg);
                }
            })
        }
    }
}
</script>
<style scoped>
    .mgt10{
        margin-top:10px;
    }
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
</style>