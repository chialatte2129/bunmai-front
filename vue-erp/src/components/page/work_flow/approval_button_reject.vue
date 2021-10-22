<template>
    <div>
        <el-button type="danger" size="large" @click="handleClick">{{$t('btn.reject')}}</el-button>
        <el-dialog
        v-draggable
        :title="$t('btn.reject')"
        :visible.sync="dialogVisible"
        :modal="false"
        width="30%"
        :before-close="handleClose">
            <el-form label-position="top">
                <el-form-item label="批示">
                    <el-input v-model="instructions" type="textarea" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="large" @click="dialogVisible = false">{{$t("btn.close")}}</el-button>
                <el-button size="large" type="danger" @click="confirmAction">{{$t('btn.confirm')}}</el-button>
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
        },
    },
    data(){
        return {
            user_token: localStorage.getItem("ms_user_token"),
            
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
            let params = {
                approval_stage_id:this.current_stage_id,
                user_token:this.user_token,
                instructions:this.instructions
            };
            workFlowService
            .approval_stage_reject(params)
            .then(res=>{
                console.log(res);
                this.getData();
                this.handleClose();
            });
        },

        getData(){
            this.$emit('change',{})
        },

    }
}
</script>
<style scoped>

</style>