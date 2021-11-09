<template>
    <div>
        <el-button type="primary" size="large" @click="handleClick">{{$t('btn.proccess')}}</el-button>
        <el-dialog
        v-draggable
        :title="$t('btn.proccess')"
        :visible.sync="dialogVisible"
        :modal="true" :append-to-body="true"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        v-loading="loading"
        :before-close="handleClose">
            <el-form label-position="top">
                <el-form-item :label="$t('work_flow.instructions')">
                    <el-input v-model="instructions" type="textarea" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="large" @click="dialogVisible = false">{{$t("btn.close")}}</el-button>
                <el-button size="large" type="primary" @click="confirmAction">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { workFlowService } from "@/_services";
export default {
    name: "current_stage_reject",
    props: {
        current_stage_id: {
            type: Number,
            default:0
        }
    },
    data(){
        return {
            user_token: localStorage.getItem("ms_user_token"),
            loading:false,
            dialogVisible:false,
            instructions:""
        }
    },

    watch:{
        current_stage_id(){
            this.instructions="";
        }
    },

    created(){},

    computed: {},    
    
    methods: {
        handleClick(){
            if(this.current_stage_id){
                this.dialogVisible = true;
            }else{
                return this.$message.error("Approval Not Found");
            };
        },

        handleClose(){
            this.dialogVisible = false;
        },

        confirmAction(){
            this.loading = true;
            let params = {
                approval_stage_id:this.current_stage_id,
                user_token:this.user_token,
                instructions:this.instructions
            };
            workFlowService
            .approval_stage_review(params)
            .then(res=>{
                this.loading = false;
                this.getData();
                this.handleClose();
                this.beforeClose();
            });
        },

        getData(){
            this.$emit('change',{})
        },

        beforeClose(){
            this.$emit('beforeClose',{})
        },

    }
}
</script>
<style scoped>

</style>