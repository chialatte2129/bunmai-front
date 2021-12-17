<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix" style="padding:0px;position:relative;">
                <span>{{$t('cost.actual_expense')}}</span>
                <el-select v-model="filter.status" multiple clearable class="mgr10 handle-input" style="position:absolute;top:-7px;right:280px;" :placeholder="$t('reimburse.status')" @change="search" >
                    <el-option
                    v-for="item in options.status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="filter.key_word" clearable class="mgr10 handle-input" style="position:absolute;top:-7px;right:10px;" :placeholder="$t('btn.key_word')" @change="search" />
            </div>
            <div>
                <el-table :data="tableData" height="400" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading" :span-method="objectSpanMethod"
                @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                    <el-table-column prop="order_date" :label="$t('reimburse.order_date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                    <el-table-column prop="display_id" :label="$t('reimburse.order_id')" width="200" sortable="custom" align="left" show-overflow-tooltip/>
                    <el-table-column prop="description" :label="$t('project.cost_description')" width="auto" sortable="custom" show-overflow-tooltip/>
                    <el-table-column prop="status" :label="$t('reimburse.status')" width="150" align="center" sortable="custom" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.status=='P'" style="color:blue">{{$t('reimburse.status_tag.P')}}</span>
                            <span v-if="scope.row.status=='F'" style="color:blue">{{$t('reimburse.status_tag.F')}}</span>
                            <span v-if="scope.row.status=='C'" style="color:green">{{$t('reimburse.status_tag.C')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" :label="$t('reimburse.payment_date')" width="160" sortable="custom" align="center" show-overflow-tooltip/>
                    <el-table-column prop="amount" :label="$t('project.amount')" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="action" v-show="is_project_owner" :label="$t('btn.action')" width="100" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="is_project_owner" type="info" size="mini" icon="el-icon-view" @click="handleEdit(scope.$index,scope.row)">{{$t('btn.view')}}</el-button>
                            <span  v-if="!is_project_owner" style="color:#aaa">--</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top:10px;margin-bottom:10px;float:right;color:red;">
                    <span><h2>{{$t('cost.actual_expense_total')}} {{stateFormat("","",total)}} 元</h2></span>
                </div>
            </div>
        </el-card>

        <el-dialog :title="$t('cost.actual_expense')" :visible.sync="editVisible" width="1200px" :before-close="closeDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <paymentOrderItem v-if="editVisible" :order_id="current_order_id" @close="closeDialog"></paymentOrderItem>
        </el-dialog>
    </div>
</template>
<script>
import { accountService } from "@/_services";
import { workItemService } from "@/_services";
import paymentOrderItem from "../payment_order_item.vue";
export default {
    name: "work_item_cost_table",
    components: {
        paymentOrderItem
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
            spanArr:[],
            pos:null,
            total:0,
            
            loading:false,
            deleteID:null,
            deleteView:false,
            editVisible:false,

            table_loading:false,
            current_order_id:null,
           
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
            options:{
                status:[
                    {label:this.$t("reimburse.status_tag.P"),value:"P"},
                    {label:this.$t("reimburse.status_tag.F"),value:"F"},
                    {label:this.$t("reimburse.status_tag.C"),value:"C"}
                ],
            },
                       
            rules: {
               
            },
        }
    },

    async created(){
        await this.handleInit();
        await this.getToday();
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
        handleInit(){
            if(this.item_id){
                this.getCostData()
            }
        },

        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if(["display_id", "description", "action"].includes(column.property)){
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

        async getToday(){
            let time =new Date();
            this.today = time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        closeDialog(){
            this.editVisible=false;
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
      
  
        handleEdit(index, row){
            this.current_order_id=row.order_id;
            this.editVisible=true;
        },

        handleSortChange({prop, order}){
            this.sort_column = prop;
            this.sort = order;
            this.getCostData();
        },

        async getCostData(){
            this.loading=true;
            await workItemService.get_project_cost_records({
                action:"ActualCost",
                item_id:this.item_id,
                sort:this.sort,
                sort_column:this.sort_column,
                status:this.filter.status,
                key_word:this.filter.key_word
            }).then(res =>{ 
                if(res.code==1){
                    this.tableData = res.data;
                    this.getSpanArr(this.tableData);
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
        width:250px;
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
