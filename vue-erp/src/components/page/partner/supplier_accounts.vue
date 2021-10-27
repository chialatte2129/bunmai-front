<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-user"></i> {{$t('menus.partner_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.supplier_accounts')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <!-- <el-button size="large" type="success" class="mgr10" icon="el-icon-plus" :disabled="loading" 
                @click="handleCreate()">
                    {{$t('btn.new')}}
                </el-button> -->
                <addNewPartner :btnTitle="$t('btn.new')" @finish="handleFinishCreate"></addNewPartner>
                <el-input v-model="filter.key_word" clearable size="large" class="mgr10 handle-input" placeholder="關鍵字搜尋" :disabled="loading" @change="getData()"/>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="name" label="紀錄名稱" width="auto" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="account_name" label="帳戶名稱" width="auto" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="bank" label="銀行"  width="auto" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="branch" label="分行"  width="auto" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="account" label="帳號" width="auto" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('btn.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>

        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="300px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('common_msg.ask_for_delete')}} ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t("btn.cancel")}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t("btn.confirm")}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="700px" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="left" label-width="150px">
                    <el-form-item label="紀錄名稱" >
                        <el-input v-model="form.name" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="帳戶名稱" >
                        <el-input v-model="form.account_name" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="銀行" >
                        <el-input v-model="form.bank" style="width:400px;"></el-input>
                    </el-form-item>
                    <el-form-item label="分行" >
                        <el-input v-model="form.branch" style="width:400px;"></el-input>
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
import addNewPartner from "./add_new_partner";
export default {
    name: "pay_order",
    components: {
        addNewPartner
    },
    data(){
        return {
            tbkey:0,
            activeNames:"",
            itemKey:0,
            tbKey:0,
            tableData: [],

            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10, 20],
            start_row:0,
            sort_column:"name",
            sort:"asc",
            
            action_list:accountService.get_user_actions(),
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            username:accountService.get_user_info("ms_username"),

            loading:false,
            dialog_loading:false,
            
            dlKey:0,
            deleteID:null, 
            deleteView:false,
            createView:false,
            updateView:false,
            copyView:false,

            uploadVisible:false,
            
            filter:{
                key_word:''
            },
            
         
            form:{
                name:"",
                account_name:"",
                bank:"",
                branch:"",
                account:""
            },

            option:{
            
            },
           
            rules: {
              
            },
        }
    },

    async created(){
        // await this.get_dept_employee();
        await this.getOption();
        await this.getData();
    },

    computed: {
        showTitle(){
            if(this.createView) return "新增供應商帳戶";
            else if(this.updateView) return "更新供應商帳戶";
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else return false;
        },
        
        today(){
            let time =new Date();
            return time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },
    }, 
    
    methods: {
        handleFinishCreate(){
            this.getData();
        },
        async handleCreate(){
            this.form = {
                name:"",
                account_name:"",
                bank:"",
                branch:"",
                account:"",
                odoo_employee_id: this.odoo_employee_id
            };
            this.createView=true;
        },

        async handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.odoo_employee_id = this.odoo_employee_id;
            this.edit_idx=index;
            this.updateView=true;
        },
        handleDelete(index, row){
            this.deleteInfo={
                id:row.id
            };
            this.deleteView=true;
        },

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){ this.start_row-=this.page_size }
            this.getData();
        },

        cancelDelete(){
            this.deleteInfo={
                id:null
            };
            this.deleteView=false;
        },

        confirmDelete(){
            var param = {
                action:"delete",
                form:this.deleteInfo
            }
            this.update_supplier_account(param);
        },

        async update_supplier_account(param){ 
            this.dialog_loading=true;
            await partnerService.update_supplier_account(param).then(res =>{ 
                console.log(res);
                if(res.code==1){ 
                    this.$message.success(this.$t(res.msg)); 
                    if(["create", "copy", "update"].includes(param.action)){
                        console.log("Finish");
                        this.tbKey++;
                        this.getData();
                        this.cancelDialog();
                    }else if(param.action=="delete"){
                        this.cancelDelete()
                        this.handleDeleteChange();
                    }
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
            this.updateView=false;
            this.copyView=false;
        },

        resetForm(){
            this.dlKey++;
            this.form={};
            this.edit_idx=null;
            this.$refs.form.clearValidate();
        },

        getCellStyle({row, column}){
            const tempWidth=column.realWidth||column.width;
            var return_dict = {};
            if(column.showOverflowTooltip){
                return_dict["minWidth"]=`${tempWidth}px`;
                return_dict["maxWidth"]=`${tempWidth}px`;
            };
            return return_dict;
        },

        handleCurrentChange(currentPage){
            this.cur_page = currentPage;
            this.count_page;
            this.getData()
        },

        handleSizeChange(size){
            this.page_size = size;
            this.handleCurrentChange(1);
        },

        handleSortChange({prop, order}){
            this.sort_column = prop;
            this.sort = order;
            this.handleCurrentChange(1);
        },
        
        async getData(){
            this.loading=true;
            var param = {
                action:"table",
                filter:{
                    sort_column:this.sort_column,
                    sort:this.sort,
                    start_row:this.start_row,
                    page_size:this.page_size,
                    key_word:this.filter.key_word
                }
            }
            await partnerService.get_supplier_account(param).then(res =>{
                console.log(res); 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
            this.loading=false;
        },
        
        async getOption(){
            
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