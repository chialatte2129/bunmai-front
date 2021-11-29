<template>
    <div class="table">
        <div>
            <div class="mgb10">
                <el-select size="large" class="mgr10 handle-input" v-model="filter.item_id" filterable clearable multiple collapse-tags
                :placeholder="$t('project.name')" :disabled="loading" @change="search">
                    <el-option v-for="item in option.projects" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                </el-select>
                <el-input v-model="filter.name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('reimburse.information_key_word')" :disabled="loading" @change="search"/>
                <el-button size="large" type="info" class="mgr10" plain :disabled="loading" @click="cancelSearch">{{$t('btn.clean')}}</el-button>
                <el-checkbox v-model="filter.is_wait_allocate"  class="mgr10" @change="search">待撥款</el-checkbox>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey" :span-method="objectSpanMethod">
                <el-table-column prop="display_order_id" :label="$t('reimburse.order_id')" width="160" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="item_name" :label="$t('reimburse.project_name')" min-width="150px"  width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="owner" :label="$t('reimburse.project_owner')" width="140" align="center" show-overflow-tooltip/>
                <el-table-column prop="applicant_name" :label="$t('reimburse.applicant_name')" width="140" align="center" show-overflow-tooltip/>
                <el-table-column prop="p_name"  :label="$t('reimburse.filler')" width="140" align="center" show-overflow-tooltip/>
                <el-table-column prop="description" :label="$t('reimburse.description')" min-width="150px"  width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="order_date" :label="$t('reimburse.order_date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="status_name" :label="$t('reimburse.status')" width="100" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='D'" style="color:grey">{{$t('reimburse.status_tag.D')}}</span>
                        <span v-if="scope.row.status=='P'" style="color:blue">{{$t('reimburse.status_tag.P')}}</span>
                        <span v-if="scope.row.status=='F'" style="color:green">{{$t('reimburse.status_tag.F')}}</span>
                        <span v-if="scope.row.status=='A'" style="color:red">{{$t('reimburse.status_tag.A')}}</span>
                        <span v-if="scope.row.status=='C'" style="color:green">{{$t('reimburse.status_tag.C')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payment_note" :label="$t('reimburse.payment_note')" width="100" align="left" :formatter="stateFormat" show-overflow-tooltip/>
                <el-table-column prop="act_payment_date" :label="$t('reimburse.act_payment_date')" width="100" align="center" />
                <el-table-column prop="amount" :label="$t('reimburse.amount')" width="110" align="right" :formatter="stateFormat" show-overflow-tooltip/>
                <el-table-column prop="total_amount" :label="$t('reimburse.total_amount')" width="110" align="right" :formatter="stateFormat" show-overflow-tooltip/>
                <el-table-column prop="action" :label="$t('btn.action')" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        <el-dialog :title="$t('reimburse.create_reimburse')" :visible.sync="createView" width="400px" center :before-close="cancelCreate">
            <div>
                <el-form label-width="auto">
                    <el-form-item :label="$t('reimburse.project_name')">
                        <el-select v-model="createForm.project_id" filterable :placeholder="$t('reimburse.select_project_name')">
                            <el-option
                            v-for="item in option.projects" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  :label="$t('reimburse.filler')">
                        <span>{{user_info}}</span>
                    </el-form-item>
                    <el-form-item  :label="$t('reimburse.applicant_withcomment')">
                        <el-select class="mgr10" v-model="createForm.applicant_id" filterable collapse-tags
                        :placeholder="$t('reimburse.applicant_name')" :disabled="loading">
                            <el-option-group v-for="group in option.members" :key="group.id" :label="group.name">
                                <el-option v-for="item in group.members" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
                                    <span v-if="item.id==-100" class="mgl10">{{$t(item.name)}}</span>
                                    <span v-else class="mgl10">{{item.name}}</span>
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreate">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmCreate">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="$t('reimburse.edit_reimburse')" v-if="updateView" :visible.sync="updateView" width="1100px" :key="tbKey" :before-close="cancelDialog" top="8%" 
        :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog" >
            <paymentOrderItem v-if="updateView" :order_id="current_order_id" @close="cancelDialog"></paymentOrderItem>
        </el-dialog>
    </div>
</template>
<script>
import { workItemService } from "@/_services";
import { payOrderService } from "@/_services";
import { dayItemService } from "@/_services";
import { partnerService } from "@/_services";
import { accountService } from "@/_services";
import paymentOrderItem from "../payment_order_item.vue";
export default {
    name: "pay_order",
    components: {
        paymentOrderItem
    },
    data(){
        return {
            tbKey:0,
            tableData: [],
            spanArr:[],
            pos:0,

            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10],
            start_row:0,
            sort_column:"",
            sort:"",
            
            action_list:accountService.get_user_actions(),
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            username:accountService.get_user_info("ms_username"),
            user_info:localStorage.getItem("ms_user_fullname"),

            loading:false,
            dialog_loading:false,
            
            createView:false,
            updateView:false,

            filter:{
                name:"",
                status:[],
                only_mine:false,
                only_accountant:true,
                is_wait_allocate:true,
                item_id:[],
            },
            
            createForm:{
                project_id:"",
                applicant_id:"",
            },
            current_order_id:"",
            pay_order_history:[],

            option:{
                projects:[],
                members:[],
                status:[
                    {label:this.$t("reimburse.status_tag.D"),value:"D"},
                    {label:this.$t("reimburse.status_tag.P"),value:"P"},
                    {label:this.$t("reimburse.status_tag.F"),value:"F"},
                    {label:this.$t("reimburse.status_tag.C"),value:"C"},
                    {label:this.$t("reimburse.status_tag.A"),value:"A"}
                ],
            },
           
            rules: {
                payment_method: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ]
                
            },
        }
    },

    async created(){
        // await this.get_dept_employee();
        await this.getOption();
        await this.getData();
    },

    computed: {
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        today(){
            let time =new Date();
            return time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        is_accountant(){
            if(accountService.get_user_menus().includes("accountant")){
                return true
            }else{
                return false
            }
        },

    }, 
    
    methods: {
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if(["display_order_id", "item_name","owner","p_name","description","applicant_name","order_date","status_name","total_amount","action"].includes(column.property)){
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

        create_UUID(len) {
            let text = ""
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            for( let i=0; i < len; i++ ) {
                text += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            // console.log(text);
			return text
		},

        stateFormat(row, column, cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
		},
 
        confirmCreate(){
            if(!this.createForm.project_id){
                return this.$message.error("請選擇專案")
            }else{
                var param = {
                    action:"create",
                    form:{
                        odoo_employee_id:this.odoo_employee_id,
                        item_id: this.createForm.project_id,
                        applicant_id: this.createForm.applicant_id
                    }
                };
                payOrderService.update_pay_orders(param).then(res =>{ 
                    // console.log(res);
                    if(res.code>0){
                        // this.$message.success("OK")
                        this.getData();
                        this.createForm.project_id = "";
                        this.createForm.applicant_id = "";
                        this.createView = false;
                        this.handleEdit(0, {order_id:res.create_id})
                    }else{
                        this.$message.error(res.msg)
                    }
                        
                })
            }
        },
        cancelCreate(){
            this.createForm={project_id:""};
            this.createView = false;
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
            this.createView=true;
            // console.log(typeof this.odoo_employee_id);
            this.createForm = {
                applicant_id: parseInt(this.odoo_employee_id,10),
                filler_id: parseInt(this.odoo_employee_id,10),
                project_id: ""
            }
        },

        async handleEdit(index, row){
            this.tbKey++;
            this.current_order_id = row.order_id;
            this.updateView = true;
        },
     
        cancelDialog(){
            this.getData();
            this.updateView = false;
            this.current_order_id = 0;
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
                action:"tableaccountant",
                filter:{
                    odoo_employee_id:this.odoo_employee_id,
                    sort_column:this.sort_column,
                    sort:this.sort,
                    start_row:this.start_row,
                    page_size:this.page_size,
                    key_word:this.filter.name,
                    status:this.filter.status,
                    only_mine:this.filter.only_mine,
                    only_accountant:this.filter.only_accountant,
                    is_wait_allocate:this.filter.is_wait_allocate,
                    item_id:this.filter.item_id,
                    username:this.username
                }
            }
            await payOrderService.get_pay_orders(param).then(res =>{ 
                if(res.code==1){
                    this.tableData=res.data;
                    this.totalRow=res.total;
                    this.getSpanArr(this.tableData);
                    this.loading=false;
                }else{
                    this.loading=false;
                    this.$message.error(res.msg)
                };             
            })
        },

        async getOption(){
            await dayItemService.get_option_list({action:["work_item_now"]}).then(res =>{ 
                this.option.projects=res.work_item_now;
            });
            await workItemService.get_dept_employee({}).then(res =>{ 
                this.option.members=res.tree_data;
                // console.log(res.tree_data);
                this.option.members.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
            })
            await partnerService.get_supplier_account({action:"table",filter:{start_row:0, page_size:1000, key_word:"" }}).then(res =>{
                // console.log(res);
                this.option.partner=res.data;
            });
            
        },

        search(){
            this.handleCurrentChange(1);
        },

        cancelSearch(){
            this.filter={
                name:"",
                status:[],
                category:[],
                owner:[],
            };
            this.handleCurrentChange(1);
        },
    }
}
</script>
<style scoped>
    .handle-input{
        width:200px;
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