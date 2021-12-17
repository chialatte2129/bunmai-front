<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix" style="padding:0px;position:relative;">
                <span>{{$t('cost.hr_expense')}}</span>
                <el-input v-model="filter.key_word" clearable class="mgr10 handle-input" style="position:absolute;top:-7px;right:10px;" :placeholder="$t('btn.key_word')" @change="search" />
            </div>
            <div>
                <el-table :data="tableData" height="400" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                    <el-table-column prop="date" :label="$t('project.date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                    <el-table-column prop="normal_hours_cost" :label="$t('cost.normal_worktime')" width="180" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip/>
                    <el-table-column prop="overtime_hours_cost" :label="$t('cost.overtime_worktime')" width="180" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip/>
                    <el-table-column prop="amount" :label="$t('project.amount')" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip/>
                    <el-table-column v-show="is_project_owner" :label="$t('btn.action')" width="100" align="center" >
                        <template slot-scope="scope">
                            <el-button v-if="is_project_owner" type="info" size="mini" icon="el-icon-view" @click="handleEdit(scope.$index,scope.row)">{{$t('btn.view')}}</el-button>
                            <span  v-if="!is_project_owner" style="color:#aaa">--</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top:10px;margin-bottom:10px;float:right;color:red;">
                    <span><h2>{{$t('cost.hr_expense_total')}} {{stateFormat("","",total)}} 元</h2></span>
                </div>
            </div>
        </el-card>
        <el-dialog title="人事支出" :visible.sync="editVisible" width="400px" :before-close="closeDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form ref="form" label-position="right" label-width="150px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="日期" prop="date">
                            <div style="width:180px;text-align:right;">
                                <span ><b>{{form.date}}</b></span>
                            </div>
                        </el-form-item>
                        <el-form-item label="一般工時" prop="date">
                            <div style="width:180px;text-align:right;">
                                <span >{{form.normal_hours}} 小時</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="一般工時成本" prop="date">
                            <div style="width:180px;text-align:right;">
                                <span >{{stateFormat("","",form.normal_hours_cost)}} 元</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="加班工時" >
                            <div style="width:180px;text-align:right;">
                                <span >{{form.overtime_hours}} 小時</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="加班工時成本" >
                            <div style="width:180px;text-align:right;">
                                <span >{{stateFormat("","",form.overtime_hours_cost)}} 元</span>
                            </div>
                        </el-form-item>

                        <el-form-item label="工時成本合計" >
                            <div style="width:180px;text-align:right;">
                                <span style="color:red;font-weight:bolder;">{{stateFormat("","",form.overtime_hours_cost+form.normal_hours_cost)}} 元</span>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">{{$t('btn.close')}}</el-button>
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
        item_id: String,
        is_project_owner: {
            type:Boolean,
            default:false
        },
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
            editVisible:false,
            table_loading:false,
           
            pagesize:10,
            pagesize_list:[10, 20, 50],

            form:{},
            
            filter:{
                key_word:""
            }
        }
    },

    async created(){
        await this.handleInit();
    },

    computed: {
        
    }, 

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
        closeDialog(){
            this.editVisible=false;
        },

        handleEdit(index,row){
            this.form=Object.assign({}, row);
            this.editVisible = true;
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

        handleSortChange({prop, order}){
            this.sort_column = prop;
            this.sort = order;
            this.getCostData();
        },

        handleInit(){
            if(this.item_id){
                this.getCostData()
            }
        },

        async getCostData(){
            this.loading=true;
            await workItemService.get_project_cost_records({
                action:"HumanPowerCost",
                item_id:this.item_id,
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
