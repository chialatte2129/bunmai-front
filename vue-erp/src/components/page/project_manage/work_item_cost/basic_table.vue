<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix" style="padding:0px;position:relative;">
                <span>{{title}}</span>
                <el-input v-model="filter.key_word" clearable class="mgr10 handle-input" style="position:absolute;top:-7px;right:100px;" :placeholder="$t('btn.key_word')" @change="search" />
                <el-button  v-if="is_project_owner" type="success" size="large" icon="el-icon-plus" style="position:absolute;top:-12px;right:10px;"   @click="handleCreate">{{$t('btn.new')}}</el-button>
            </div>
            <div>
                <el-table :data="tableData" height="400" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                    <el-table-column prop="date" :label="$t('project.date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                    <el-table-column prop="description" :label="$t('project.cost_description')" width="auto" sortable="custom" show-overflow-tooltip/>
                    <el-table-column prop="amount" :label="$t('project.amount')" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                    <el-table-column v-show="is_project_owner" :label="$t('btn.action')" width="200" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="is_project_owner" type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index,scope.row)">{{$t('btn.edit')}}</el-button>
                            <el-button v-if="is_project_owner"  type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)">{{$t('btn.delete')}}</el-button>
                            <span  v-if="!is_project_owner" style="color:#aaa">--</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top:10px;margin-bottom:10px;float:right;color:red;">
                    <span><h2>{{title}}合計 {{stateFormat("","",total)}} 元</h2></span>
                </div>
            </div>
        </el-card>

        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('cost.confirm_delete')}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="title" :visible.sync="editVisible" width="500px" :before-close="closeDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('reimburse.date')" prop="date">
                            <el-date-picker v-model="form.date" type="date" align="right" value-format="yyyy-MM-dd"/>
                        </el-form-item>
                        <el-form-item :label="$t('cost.expense_type')" >
                            <span v-if="form.recorded_type=='actual'">實際</span>
                            <span v-if="form.recorded_type=='standard'">預估</span>
                        </el-form-item>
                        <el-form-item :label="$t('cost.amount')" prop="amount">
                            <el-input type="number" v-model.number="form.amount" style="width:200px"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('cost.description')" prop="description">
                            <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { accountService } from "@/_services";
import { workItemService } from "@/_services";
export default {
    name: "work_item_cost_table",
    components: {
        
    },
    props: {
        action: String,
        title: String,
        item_id: String,
        is_project_owner: {
            type:Boolean,
            default:false
        },
        table_type: String,
        cost_type: String,
        tbKey_add:Number,
    },
    data(){
        return {
            username:accountService.get_user_info("ms_username"),
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),

            today:"",
            tbKey:0,

            sort_column:"date",
            sort:"desc",
            tableData:[],
            total:0,
            
            loading:false,
            deleteID:null,
            deleteView:false,
            editVisible:false,

            table_loading:false,
           
            pagesize:10,
            pagesize_list:[10, 20, 50],
            
            form:{
                type:this.table_type,
                actionType:"create",
                recorded_type:null,
                date:"",
                description:"",
                amount:""
            },

            filter:{
                key_word:""
            },
                       
            rules: {
                description: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                recorded_type: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                
                amount: [
                    {pattern: /^[0-9.]+$/, message: `${this.$t('rules.only_numbers')} [0123456789.]`, trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
            },
        }
    },

    async created(){
        await this.handleInit();
        await this.getToday();
    },

    computed: {}, 

    watch:{
        item_id(val){
            if(val){
                this.getCostData();
            }
        },
        tbKey_add(val){
            this.tbKey++;
        }
    },
    
    methods: {
        handleInit(){
            if(this.item_id){
                this.getCostData()
            }
        }, 
        async getToday(){
            let time =new Date();
            this.today = time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        closeDialog(){
            this.editVisible=false;
            this.deleteView=false;
            this.$refs.form.clearValidate();
        },


        stateFormat(row, column, cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
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
      
        handleCreate(){
            this.form={
                actionType:"create",
                type:this.table_type,
                username:this.username,
                work_item_id:this.item_id,
                recorded_type:this.cost_type,
                date:this.today,
                description:"",
                amount:0
            }
            this.editVisible=true;
        },

        handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.username = accountService.get_user_info("ms_username");
            this.form.actionType="update";
            this.editVisible=true;
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.form);
                    var param = {
                        action:temp_form.actionType,
                        form:temp_form
                    };
                    this.confirmUpdate(param);
                }
            })
        },

        confirmUpdate(param){ 
            workItemService.update_cost_record(param).then(res =>{ 
                if(res.code==1){ 
                    this.$message.success(this.$t(res.msg)); 
                    this.getCostData();
                    this.closeDialog();
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
        },

        handleDelete(index, row){
            this.deleteID=row.id;
            this.deleteView=true;
        },

        cancelDelete(){
            this.deleteID=null;
            this.deleteView=false;
        },

        confirmDelete(){
            this.form.id = this.deleteID; 
            var param = {
                action:"delete",
                form:this.form
            }
            this.confirmUpdate(param);
        },

        handleSortChange({prop, order}){
            this.sort_column = prop;
            this.sort = order;
            this.getCostData();
        },

        async getCostData(){
            this.loading=true;
            await workItemService.get_project_cost_records({
                action:this.action,
                item_id:this.item_id,
                type:"income",
                sort:this.sort,
                sort_column:this.sort_column,
                key_word:this.filter.key_word
            }).then(res =>{ 
                if(res.code==1){
                    this.tableData = res.data;
                    this.total = res.total;
                    this.returnTotal();
                }else{
                    this.$message.error(res.msg);
                }
            });
            this.loading=false;
        },
     
        search(){
            this.getCostData();
        },

        returnTotal(){
            this.$emit('total',{data:this.total});
        },
    }
}
</script>
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
    .container{
        background-color:#f0f0f0;
        padding:10px;
    }
   
    .w100pa{
        width:100%;  
    }
    .w90pa{
        width:90%;  
    }
    .clearfix{
        line-height:1.23;
    }
    .card-header-r-btn{
        position:relative;
        float:right;
        margin-top:-10px;
    }
    .container >>> .el-card__header{
        padding-right:10px;
    }
    .container >>> .el-collapse-item__header{
        font-size:15px;
        background-color:#e4e4e4;
        padding:0px 20px;
    }
    .container >>> .el-collapse-item__header.is-active{
        margin-bottom:20px;
    }
    .container >>> .el-collapse-item__content{
        padding-bottom:0px;
    }
    .container>>>.el-collapse-item.is-disabled .el-collapse-item__header{
        color:#303133;
        cursor:default;
    }
    .container>>>.el-collapse-item__arrow{
        display:None;
    }
    .container >>> .el-collapse {
        border-top:0px solid #EBEEF5;
        border-bottom:0px solid #EBEEF5;
    }
    .container >>> .el-collapse-item__wrap{
        border-bottom:0px solid #EBEEF5;
    }
    .upload-demo>>>.el-upload{
        width:100%;
    }
    .upload-demo>>>.el-upload-list--picture .el-upload-list__item-thumbnail{
        width:auto;
        margin-right:10px;
    }
    .image-btn>>>.el-form-item__label{
        height:42px;
    }
    .dl-class>>>.el-dialog{
        background:none;
        border-radius:0px;  
        box-shadow:none;
        padding:0px;
    }
    .dl-class>>>.el-dialog__header{
        padding:0px;
    }
    .dl-class>>>.el-dialog__body{
        padding:0px;
    }
    .dl-class>>>.el-dialog__headerbtn{
        top:-25px;
        right:0px;
    }
    .el-backtop, .el-calendar-table td.is-today{
        color:#008800;
    }
</style>
