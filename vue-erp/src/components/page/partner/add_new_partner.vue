<template>
    <div style="float:left">
        <el-button size="large" type="success" class="mgr10" icon="el-icon-plus" :disabled="loading" 
        @click="handleCreate()">
            {{btnTitle}}
        </el-button>
        <el-dialog title="新增供應商帳戶" v-if="createView" :visible.sync="createView" width="700px" :modal="true" :append-to-body="true" :before-close="cancelDialog" v-draggable
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" >
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="left" label-width="150px">
                    <el-form-item label="紀錄名稱" >
                        <el-input v-model="form.name" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="帳戶名稱" >
                        <el-input v-model="form.account_name" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="銀行" >
                        <el-autocomplete
                        class="inline-input"
                        style="width:400px;"
                        v-model="form.bank"
                        :fetch-suggestions="querySearchBank"
                        :placeholder="$t('common_msg.input_string')"
                        @select="handleBankSelect"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="分行" >
                        <el-autocomplete
                        class="inline-input"
                        style="width:400px;"
                        v-model="form.branch"
                        :fetch-suggestions="querySearchBranch"
                        :placeholder="$t('common_msg.input_string')"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="SWIFT Code" >
                        <el-input v-model="form.swift_code" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="帳號" >
                        <el-input v-model="form.account" style="width:400px;"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer-loading">
                    <el-button @click="cancelDialog">{{$t("btn.cancel")}}</el-button>
                    <el-button type="primary" @click="confirmDialog">{{$t("btn.confirm")}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { partnerService } from "@/_services";
import { accountService } from "@/_services";
export default {
    name: "pay_order",
    components: {

    },
    props: {
        btnTitle: {
            type: String,
            default:"新增常用聯絡人"
        }
    },
    data(){
        return {
            tbKey:0,
            tableData: [],
         
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),

            loading:false,
            dialog_loading:false,
            
            
            createView:false,

            form:{
                name:"",
                account_name:"",
                bank:"",
                branch:"",
                swift_code:"",
                account:""
            },

            option:{
                bank_list:[],
                branch_list:[],
            },

            rules: {
              
            },
        }
    },

    async created(){
        this.getOption();
    },

    computed: {}, 
    watch: {
        "form.bank"(val){
            this.init_branch(val)
        }
    },
    
    methods: {
        querySearchBank(queryString, cb) {
            var banks = this.option.bank_list;
            var results = queryString ? banks.filter(this.createFilter(queryString)) : banks;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },

        querySearchBranch(queryString, cb) {
            var branches = this.option.branch_list;
            var results = queryString ? branches.filter(this.createFilter(queryString)) : branches;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },

        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
            };
        },

        handleBankSelect(item) {
            this.option.branch_list = item.branch_json;
        },

        handleBranchSelect(item) {
            console.log(item);
        },

        init_branch(bank){
            var index = this.option.bank_list.findIndex(element => element.value==bank)
            if(index>=0){
                this.option.branch_list = this.option.bank_list[index].branch_json;
            }else{
                this.option.branch_list=[];
            }
        },

        async handleCreate(){
            this.form = {
                name:"",
                account_name:"",
                bank:"",
                branch:"",
                swift_code:"",
                account:"",
                odoo_employee_id: this.odoo_employee_id
            };
            this.createView=true;
        },

        async update_supplier_account(param){ 
            this.dialog_loading=true;
            await partnerService.update_supplier_account(param).then(res =>{ 
                if(res.code==1){ 
                    this.form.id = res.data.id;
                    this.finishCreate();
                    this.$message.success(this.$t(res.msg)); 
                    this.tbKey++;
                    this.cancelDialog();
                }else if(res.code==0){ 
                    this.$message.warning(this.$t(res.msg)); 
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
            this.dialog_loading=false;
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.form);
                    var param = {
                        action:this.createView?"create":(this.updateView?"update":"copy"),
                        form:temp_form
                    };
                    this.update_supplier_account(param);
                }
            })
        },

        cancelDialog(){
            this.resetForm();
            this.createView=false;
        },

        resetForm(){
            this.form={};
            this.edit_idx=null;
            this.$refs.form.clearValidate();
        },

        finishCreate(){
            // console.log(this.form);
            this.$emit('finish', {data:this.form});
        },

        async getOption(){
            console.log("Get Options");
            var params = {
                action:"table"
            }
            await partnerService.get_bank_list(params).then(res=>{
                this.option.bank_list = res.data;
            })
        }
    }
}
</script>
<style>
    .el-upload {
        border: none;
        background-color: transparent;
        height: 40px;
        width: 150px;
    }
    .el-upload-dragger{
        height: 40px;
        width: 150px;
    }
    .el-upload--text{
        height: 40px;
        width: 150px;
    }
</style>
<style scoped>
    .handle-input{
        width:300px;
        display:inline-block;
    }
    .del-dialog-cnt{
        font-size:16px;
        text-align:center;
        color:#FF4242;
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
    .crumbs >>> .el-breadcrumb{
        font-size:20px;
        height:25px;
    }
    .wd80pa{
        width:90%;
    }
    .tag-collapse >>> .el-divider--horizontal{
        margin:10px 0 5px 0;
    }
    .container{
        margin-right:10px;
    }
    .card-header-r-btn{
        position:relative;
        float:right;
        margin-top:-10px;
    }
    
</style>