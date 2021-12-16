<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path:'/work_item_cost',query:$route.query}"> {{$t('menus.work_item_cost')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{form.id}}.{{form.name}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-card shadow="hover" class="mgb10" v-loading.lock="loading">
                <div slot="header" class="clearfix">
                    <span>{{$t('menus.work_item_cost')}} - {{form.name}}</span>
                    <el-button type=info size=large icon="el-icon-back" class="card-header-r-btn" @click="handleLeave">{{$t('btn.leave')}}</el-button>
                </div>
                <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
                    <el-collapse v-model="collapseName" @change="handleCollapse()">
                        <el-col :span="24" style="padding-right:10px;padding-left:10px;">
                            <el-collapse-item name="base_info" :title="$t('project.project_info')" >
                                <el-row :gutter="20" style="padding-right:10px;padding-left:10px;">
                                    <el-col :span="10" >
                                        <el-form-item :label="$t('project.id')">
                                            <span>{{form.id}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('project.name')">
                                            <span>{{form.name}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('project.status')">
                                            <span>{{$t('project.status_tag.'+form.status)}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('project.owner')">
                                            <span>{{form.owner}}</span>
                                        </el-form-item>                                        
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item :label="$t('project.extimated_work_hour')">
                                            <el-button v-if="is_project_owner" type="success" icon="el-icon-time" style="float:right;margin-right:20px;" @click="handleUpdatePreTime"> {{$t('project.update')}}</el-button>
                                            <span style="float:right;margin-right:20px;">{{form.pre_work_time}} {{$t('project.hours')}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('project.total_work_hour')">
                                            <el-button v-if="is_project_owner" type="info" icon="el-icon-view" style="float:right;margin-right:20px;" @click="handleViewWorkItem"> {{$t('btn.view')}}</el-button>
                                            <span style="float:right;margin-right:20px;">{{form.total_work_hours}} {{$t('project.hours')}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('cost.work_hour_percent')">
                                            <span v-if="form.work_progress>=80" style="color:red;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress>=50&&form.work_progress<80"  style="color:orange;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress<50" style="color:green;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress=='-'" style="color:gray;">{{form.work_progress}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item :label="$t('cost.predict_net_income')">
                                            <el-tooltip effect="light" :content="$t('cost.predict_net_income_content')" placement="bottom">
                                                <span style="float:right;">{{stateFormat("","",Math.round(totalStandardIncome))}} 元</span>
                                            </el-tooltip>
                                        </el-form-item>
                                        <el-form-item :label="$t('cost.actual_net_income')">
                                            <el-tooltip effect="light" :content="$t('cost.actual_net_income_content')" placement="bottom">+
                                                <div style="cursor:pointer;float:right;" @click="handleIncomeStatement()">
                                                    <span style="text-decoration:underline;color:#0000FF">{{stateFormat("","",Math.round(totalActualIncome))}} 元</span>
                                                    </div>
                                            </el-tooltip>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" :title="$t('cost.project_income')">
                                <el-row  style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <projectCostTable :tbKey_add="tbKey" key="StandardIncome" :item_id="form.id" action="StandardIncome" :is_project_owner="true" :title="$t('cost.predict_income')" table_type="income" cost_type="standard" @total="handleStandardIncomeTotal"></projectCostTable>
                                    </el-col>
                                    <el-col :span="24" style="margin-top:10px;">
                                        <projectCostTable :tbKey_add="tbKey" key="ActualIncome" :item_id="form.id" action="ActualIncome" :is_project_owner="true" :title="$t('cost.actual_income')" table_type="income" cost_type="actual" @total="handleActualIncomeTotal"></projectCostTable>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="cost" :title="$t('cost.project_expense')" style="margin-bottom:50px;">
                                <el-row style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <projectCostTable :tbKey_add="tbKey" key="StandardCost" :item_id="form.id" action="StandardCost" :is_project_owner="true" :title="$t('cost.predict_expense')" table_type="cost" cost_type="standard" @total="handleStandardCostTotal"></projectCostTable>
                                    </el-col>
                                    <el-col :span="24"  style="margin-top:10px;">
                                        <actualCostTable :tbKey_add="tbKey" key="ActualCost" :item_id="form.id" :is_project_owner="true" @total="handleActualCostTotal"/>
                                    </el-col>
                                    <el-col :span="24"  style="margin-top:10px;">
                                        <hrCostTable :tbKey_add="tbKey" key="hrCost" :item_id="form.id" :is_project_owner="true" @total="handleHrCostTotal"/>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-col>
                    </el-collapse>
                </el-form>
            </el-card>
        </div>
        
        <el-dialog title="專案實際淨利" v-draggable :visible.sync="statementVisible" width="600px" :before-close="handleStatementClose" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
           <statementIncome :item_id="form.id" v-if="statementVisible"></statementIncome>
        </el-dialog>

        <el-dialog :title="$t('cost.update_predict_work_time')" :visible.sync="updatePreTimeVisible" width="500px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="preTimeForm" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('cost.org_predict_work_time')">
                            <span>{{preTimeForm.old_setting}} {{$t('cost.hour')}}</span>
                        </el-form-item>
                        <el-form-item :label="$t('cost.new_predict_work_time')">
                            <el-input type="number" v-model.number="preTimeForm.new_setting" style="width:200px;">
                                <template slot="append">{{$t('cost.hour')}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmUpdatePreTime">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="$t('menus.day_item_review')" :visible.sync="workItemView" width="1200px" :before-close="closeViewWorkItem">
            <el-row>
                <el-select size="large" class="mgr10 handle-input" v-model="subFilter.pid" filterable clearable multiple collapse-tags
                :placeholder="$t('employee.name')" @change="subHandleCurrentChange(1)">
                    <el-option-group v-for="group in option.employee" :key="group.id" :label="group.name">
                        <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
                            <span class="mgl10">{{item.name}}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
                <el-date-picker v-model="subFilter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd"
                :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"
                @change="subHandleCurrentChange(1)" class="mgr10" size="large"/>
            </el-row>
            <el-row>
                <div v-loading.lock="false">
                    <el-table :data="subTableData" border class="table mgt10" ref="multipleTable" tooltip-effect="light" height="532" v-loading="table_loading"
                    @sort-change="subHandleSortChange" :cell-style="getCellStyle" :key="tbKey">
                        <el-table-column prop="work_date" :label="$t('employee.work_date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                        <el-table-column prop="p_name" :label="$t('employee.name')" width="100" show-overflow-tooltip/>
                        <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                        <el-table-column prop="work_hours" :label="$t('employee.work_hour')" width="100" align="right" header-align="left"/>
                        <el-table-column type="expand" width="40">
                            <template slot-scope="props">
                                <el-form label-position="left" label-width="85px">
                                    <el-form-item :label="$t('project.tag1')">{{props.row.tag1}}</el-form-item>
                                    <el-form-item :label="$t('employee.description')"><p style="white-space:pre-wrap;word-break:break-all;">{{props.row.description}}</p></el-form-item>
                                </el-form >
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination @size-change="subHandleSizeChange" @current-change="subHandleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                        :current-page="sub_cur_page" :page-sizes="sub_page_size_list" :page-size="sub_page_size" :total="subTotalRow" background/>
                    </div>
                </div>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" style="width:150px;" @click="closeViewWorkItem">{{$t('btn.close')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { accountService } from "@/_services";
import { workItemService } from "@/_services";
import { dayItemService } from "@/_services";
import paymentOrderItem from "./payment_order_item.vue";
import projectCostTable from "./work_item_cost/basic_table.vue";
import actualCostTable from "./work_item_cost/actual_cost_table.vue";
import hrCostTable from "./work_item_cost/hr_cost_table.vue";
import statementIncome from "./work_item_cost/statement_income.vue";
export default {
    name: "work_item_manage",
    components: {
        paymentOrderItem,
        projectCostTable,
        actualCostTable,
        hrCostTable,
        statementIncome
    },
    data(){
        return {
            orderReadOnly:true,
            collapseName:["base_info"],

            username:accountService.get_user_info("ms_username"),
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            item_id:this.$route.query.id,

            total_standard_cost:0,
            total_actual_cost:0,
            total_standard_income:0,
            total_actual_income:0,
            total_hr_cost:0,

            today:"",
            tbKey:0,

            current_order_id:null,

            loading:false,
            deleteID:null,
            deleteView:false,
            updatePreTimeVisible:false,
            workItemView:false,
            statementVisible:false,

            item_form:{
                type:"",
                amount:"",
                date:"",
                content:[]
            },
            item_index:null,
            pay_date:"",
            pay_id:"",

            table_loading:false,
            tbKey:0,
            subTableData:[],
            subTotalRow:0,
            sub_cur_page: 1,
            sub_page_size:10,
            sub_page_size_list:[10, 20, 50],
            sub_start_row:0,
            sub_sort_column:"work_date",
            sub_sort:"desc",
            subFilter:{
                pid:[],
                work_date:[]
            },

            option:{
                employee:[]
            },

            preTimeForm:{
                old_setting:"",
                new_setting:""
            },

            filter:{
               
            },
            
            form:{
                id: "",
                name: "",
                status: "",
                owner: "",
                owner_id: null,
                status_name: "",
                income_amount: "0",
                cost_amount: "0",
                pay_order: 0,
                total_work_hours: 0.0,
                pre_work_time: 0,
                work_progress: 0
            },
            rules: {}
               
        }
    },

    async created(){
        await this.getData();
        await this.getToday();
        await this.get_employee();
    },

    computed: {
        caculatePaiedTotalAmount(){
            var total = 0;
            this.payOrderForm.payment_item.forEach(element => {
                if(element.is_set_paied_date){
                    total+=element.amount
                }
            });
            return total
        },

        totalStandardIncome(){
            return Math.round(this.total_standard_income - this.total_standard_cost);
        },

        totalActualIncome(){
            console.log(this.total_actual_income - this.total_actual_cost - this.total_hr_cost);
            return Math.round(this.total_actual_income - this.total_actual_cost - this.total_hr_cost);
        },

        is_project_owner(){
            return true;
            if(this.form.owner_id == accountService.get_user_info("ms_odoo_employee_id")){
                return true
            }else{
                return false
            }
        },

        sub_count_page(){
            this.sub_start_row=(this.sub_cur_page-1)*this.sub_page_size;
        },
    }, 
    
    methods: {
        handleIncomeStatement(){
            this.statementVisible = true;
        },

        handleStatementClose(){
            this.statementVisible = false;
        },

        handleCollapse(){
            this.tbKey++;
        },

        handleStandardCostTotal(val){
            this.total_standard_cost = val.data;
        },
        handleActualCostTotal(val){
            this.total_actual_cost = val.data;
        },
        handleStandardIncomeTotal(val){
            this.total_standard_income = val.data;
        },
        handleActualIncomeTotal(val){
            this.total_actual_income = val.data;
        },
        handleHrCostTotal(val){
            this.total_hr_cost = val.data;
        },
        
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if(["order_id", "item_name","status","owner","p_name","description","order_date","status_name","total_amount","action"].includes(column.property)){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
        },

        getSpanArr(data){
            this.resetSpanArr();
            for(var i=0;i<data.length;i++){
                if(i===0){ 
                    this.spanArr.push(1);
                    this.pos=0;
                }else{
                    if(data[i].order_id===data[i-1].order_id){
                        this.spanArr[this.pos]+=1;
                        this.spanArr.push(0);
                    }else{ 
                        this.spanArr.push(1); 
                        this.pos=i;
                    }
                }
            }
        },

        resetSpanArr(){
            this.spanArr=[];
            this.pos=null;
        },

        async get_employee(){
            var param = {
                odoo_employee_id:this.odoo_employee_id,
                username:this.username,
            }
            await dayItemService.get_dept_tree(param).then(res =>{ 
                this.tree_data=res.tree_data;
                this.tree_data.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
                this.option.employee = res.tree_data;
            })
        },

        subHandleSortChange({prop, order}){
            this.sub_sort_column = prop;
            this.sub_sort = order;
            this.subHandleCurrentChange(1);
        },
    
        subHandleCurrentChange(currentPage){
            this.sub_cur_page = currentPage;
            this.sub_count_page;
            this.getSubData()
        },

        subHandleSizeChange(size){
            this.sub_page_size = size;
            this.subHandleCurrentChange(1);
        },

        async getSubData(){
            this.table_loading=true;
            var param = {
                action:"table",
                sort_column:this.sub_sort_column,
                sort:this.sub_sort,
                start_row:this.sub_start_row,
                page_size:this.sub_page_size,
                username:this.username,
                odoo_employee_id:this.odoo_employee_id,
                filter:{
                    item_id:[this.item_id],
                    work_date:this.subFilter.work_date,
                    dept_id:[],
                    pid:this.subFilter.pid,
                }
            };
            await dayItemService.review_day_list(param).then(res =>{ 
                this.subTableData=res.day_items;
                this.subTotalRow=res.total;
            });
            this.table_loading=false;
        },

        handleViewWorkItem(){
            this.getSubData();
            this.workItemView = true;
        },

        closeViewWorkItem(){
            this.dlKey++;
            this.subTableData=[]
            this.subTotalRow=0;
            this.sub_cur_page=1;
            this.sub_page_size=10;
            this.sub_count_page;
            this.subFilter={
                pid:[],
                work_date:[]
            };
            this.workItemView = false;
        },

        async getToday(){
            let time =new Date();
            this.today = time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        handleUpdatePreTime(){
            this.preTimeForm={
                old_setting:this.form.pre_work_time,
                new_setting:this.form.pre_work_time
            };
            this.updatePreTimeVisible = true;
        },

        confirmUpdatePreTime(){
            if(this.preTimeForm.old_setting == this.preTimeForm.new_setting){
                this.$message.error("未變更");
            }else{
                workItemService
                .update_pre_time({id:this.item_id,pre_work_time:this.preTimeForm.new_setting})
                .then(res =>{ 
                    if(res.code==1){
                        this.$message.success(res.msg);
                        // this.form.pre_work_time = this.preTimeForm.new_setting;
                        this.getData()
                        this.closeAllDialog();
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            };
            this.updatePreTimeVisible = true;
        },

        closeAllDialog(){
            this.updatePreTimeVisible = false;
            this.current_order_id = null;
        },

        handleLeave(){
            this.$router.push({path:"/work_item_cost",query:this.$route.query});
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
     
        async getData(){
            this.loading=true;
            var param = {
                username:this.username,
                item_id:this.item_id
            }
            await workItemService.get_project_cost_info(param).then(res =>{ 
                if(res.code){
                    this.form = res.data;
                    // this.getCostData();
                }else{
                    this.$message.error(res.msg);
                }
            })
            this.loading=false;
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
