<template>
    <div>
        <div v-if="!tableData.length" style="width:100%;">
            <span style="color:grey;">{{$t("work_flow.no_approval_flow")}}</span>
        </div>
        <div v-if="tableData.length"> 
            <el-steps direction="vertical" :active="current_proccess" >
                <el-step :title="$t('work_flow.start')" status="finish" class="mgb10" :description="$t('work_flow.start_at')+':'+approval_info.created_at" icon="el-icon-success"></el-step>
                <el-step v-for="(item, index) in tableData" class="stage-step mgb10" 
                :key="index+1" 
                :title="item.stage_description" 
                :status="handleStageType(item)" 
                :icon="handleStageIcon(item)" 
                @click.native="handleStepClick(item)">
                    <template slot="description">
                        <el-row>
                            <span>{{$t('work_flow.status')}}: {{status_map[item.status]}}</span><br/>
                        </el-row>
                        <el-row v-if="item.status=='D'||item.status=='P'">
                            <span >{{$t('work_flow.allow_approvers')}}: </span><el-tag v-for="member in item.allow_approvers" :key="member.name">{{member.name}}</el-tag>
                        </el-row>
                        <el-row v-if="item.status=='F'||item.status=='A'">
                            <span v-if="item.approver_info">{{$t('work_flow.approver_dept')}}: {{item.approver_info.dept_name}}</span><br/>
                            <span v-if="item.approver_info">{{$t('work_flow.approver_name')}}: {{item.approver_info.name}}</span><br/>
                            <span>{{$t('work_flow.time')}}: {{item.signed_at}}</span><br/>
                        </el-row>
                    </template>
                </el-step>
                <el-step :title="$t('work_flow.finish')" class="mgb10" :status="is_approval_finish()" icon="el-icon-success"></el-step>
            </el-steps>
        </div>
        <el-dialog
        :title="step_info.stage_description"
        :visible.sync="stepInfoVisible"
        :modal="false"
        width="30%"
        :before-close="handleStepClose">
            <el-form label-width="100px">
                <el-form-item :label="$t('work_flow.status')">
                    <span >{{status_map[step_info.status]}}</span>
                </el-form-item>
                <div v-if="step_info.status=='D'||step_info.status=='P'">
                    <el-form-item :label="$t('work_flow.allow_approvers')">
                        <el-tag v-for="member in step_info.allow_approvers" :key="member.name">{{member.name}}</el-tag>
                    </el-form-item>
                </div>
                <div  v-if="step_info.status=='F'||step_info.status=='A'">
                    <el-form-item v-if="step_info.approver_info" :label="$t('work_flow.approver_name')">
                        <span>{{step_info.approver_info.name}}</span>
                    </el-form-item>
                    <el-form-item v-if="step_info.approver_info" :label="$t('work_flow.approver_dept')">
                        <span>{{step_info.approver_info.dept_name}}</span>
                    </el-form-item>
                    <el-form-item v-if="step_info.approver_info" :label="$t('work_flow.approve')">
                        <span>{{step_info.signed_at}}</span>
                    </el-form-item>
                    <el-form-item v-if="step_info.approver_info":label="$t('work_flow.instructions')">
                        <el-input type="textarea" :rows="3" :readonly="true" v-model="step_info.instructions"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stepInfoVisible = false">{{$t("btn.close")}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { accountService } from "@/_services";
import { workFlowService } from "@/_services";
export default {
    name: "work_flow_tree",
    props: {
        related_id: {
            type: String,
            default:""
        },
        type: {
            type: String,
            default:""
        },
        load_key: {
            type: Number,
            default:0
        }
    },
    data(){
        return {
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            username:accountService.get_user_info("ms_username"),
            tree_loading:false,
            tableData:[],
            approval_info:{},
            active:0,
            status_map:{
                "F":this.$t("work_flow.status_options.F"),
                "P":this.$t("work_flow.status_options.P"),
                "A":this.$t("work_flow.status_options.A"),
                "D":this.$t("work_flow.status_options.D"),
            },

            stepInfoVisible:false,
            step_info:{},
            current_proccess:0,
        }
    },

    watch:{
        tableData(){
            this.handleProcessAction();
        },
        load_key(){
            this.getData();
        },
    },

    async created(){
        // await this.getData();
    },

    computed: {
        
    },    
    
    methods: {
        handleProcessAction(){
            var current_stagte_index = this.tableData.findIndex(element => element.is_current_layer==1)
            if(current_stagte_index==-1){ 
                this.current_proccess = this.tableData.length + 2;
            }else{
                this.current_proccess = current_stagte_index + 3;
            }
        },
        handleStepClose(){
            this.stepInfoVisible = false;
            this.step_info={}
        },
        handleStepClick(step_info){
            this.step_info = JSON.parse(JSON.stringify(step_info));
            this.stepInfoVisible = true;
        },
        is_approval_finish(){
            if(this.approval_info.status=="F"){
                return "finish";
            }else{
                return "wait";
            }
        },
        handleStageType(row){
            if(row.status=="F"){
                return "success";
            }else if(row.status=="P"){
                return "proccess";
            }else if(row.status=="A"){
                return "error";
            }else if(row.status=="D"){
                return "wait";
            }else{
                return "wait"
            }
        },
        handleStageIcon(row){
            if(row.status=="F"){
                return "el-icon-success";
            }else if(row.status=="P"){
                return "el-icon-user";
            }else if(row.status=="A"){
                return "el-icon-error";
            }else if(row.status=="D"){
                return "el-icon-user";
            }else{
                return ""
            }
        },
        getData(){
            workFlowService.get_approval_stage_tree({
                "approval_type":this.type,
                "related_id":this.related_id
            }).then(res =>{ 
                console.log(res);
                if(res.code==1){
                    this.tableData = res.approval_stages;
                    this.approval_info = res.approval_info;
                    this.loading=false;
                }else{
                    this.loading=false;
                    console.log(res);
                };             
            })
        },
    }
}
</script>
<style scoped>
    .stage-step{
        cursor:pointer;
    }
    .container{
        background-color:#f0f0f0;
        padding:15px;
    }
    .handle-input{
        width:280px;
        display:inline-block;
    }
    .table{
        width:100%;
        font-size:14px;
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
    .mgt10{
        margin-top:10px;
    }

</style>