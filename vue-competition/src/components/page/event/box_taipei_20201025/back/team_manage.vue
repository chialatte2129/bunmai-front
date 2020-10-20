<template>
    <div style="margin-top:10px">
        <el-card shadow="hover" body-style="padding:10px">
            <div slot="header" class="clearfix">
                <span style="font-size:16px;">隊伍管理</span>
                <el-button type="success" size="large" icon="el-icon-plus" class="card-header-r-btn" @click="handleInputTeam"> 新增隊伍</el-button>
            </div>
            <div style="padding:10px;">
                <el-table 
                :data="teamData" 
                border class="table" 
                ref="multipleTable">
                    <el-table-column prop="id" label="團隊ID" align="left" width="100px"></el-table-column>    
                    <el-table-column prop="name" label="團隊名稱" align="left" width="400px"></el-table-column>  
                    <el-table-column prop="name" label="備註" align="left" width="auto"></el-table-column>  
                    <el-table-column :label="$t('btn.action')" width="200px" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" size="mini"  @click="handleChangeName(scope.$index, scope.row)">隊伍更名</el-button>
                        </template>
                    </el-table-column>                
                </el-table>
            </div>
        </el-card>
        <el-dialog title="新增隊伍" :visible.sync="teamInputView" width="50%" center>
            <div class="del-dialog-cnt">
                <div><span style="color:red;">隊伍名稱需以" ; "隔開，隊名不可為空，且必須要有16組隊伍。 例:"team_1;team_2;team_3;team......team_16"</span></div>
                <div style="margin-top:10px;">
                    <el-form>
                        <el-form-item label="">
                            <el-input type="textarea" :rows="3" v-model="input_teams"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelInputTeam">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmInputTeam">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog title="隊伍更名" :visible.sync="teamRenameView" width="500px" center>
            <div style="margin-top:10px;">
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="原始隊名">
                        <span>{{old_name}}</span>
                    </el-form-item>
                    <el-form-item label="更新隊名">
                        <el-input type="text" v-model="new_name"></el-input>
                    </el-form-item>
                    <el-form-item label="隊伍備註">
                        <el-input type="textarea" :rows="2" v-model="team_note"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelChangeName">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmChangeName">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Vue from "vue";
export default {
    name:"DT_setting",
    components: {

    },
    props: {
        match_id: String
    },
    data(){
        return {
            teamData:[
                {"id":"1","name":"team_1","note":""}
            ],
            teamRenameView:false,
            teamInputView:false,
            input_teams:"",

            old_name:"",
            new_name:"",
            team_note:"",
        }
    },
    computed: {

    },
    watch: {
        
    },

    created(){
        this.getData();
    },

    methods:{
        handleInputTeam(){
            this.input_teams="";
            this.teamInputView=true;
        },
        cancelInputTeam(){
            this.teamInputView=false;
        },
        confirmInputTeam(){
            this.result_change();
            this.teamInputView=false;
        },

        handleChangeName(){
            this.teamRenameView=true;
        },
        cancelChangeName(){
            this.teamRenameView=false;
        },
        confirmChangeName(){
            this.result_change();
            this.teamRenameView=false;
        },

        getData(){
            console.log(this.match_id);
        },
        result_change(){
            this.$emit('change',{"status":true})
        },
    }
}
</script>
<style scoped>
    .container{
        background-color:#f0f0f0;
        padding:25px;
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