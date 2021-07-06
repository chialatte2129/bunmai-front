<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.work_item_pay')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button size="large" type="success" class="mgr10" icon="el-icon-circle-plus-outline" :disabled="loading" 
                @click="handleCreate">
                    {{$t('btn.new')}}
                </el-button>
                <el-select class="mgr10" size="large" v-model="filter.status" multiple collapse-tags filterable clearable :placeholder="$t('reimburse.status')"
                :disabled="loading" @change="search">
                    <el-option v-for="item in option.status" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
                <el-input v-model="filter.name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('btn.key_word')" :disabled="loading" @change="search"/>
                <el-button size="large" type="info" class="mgr10" plain :disabled="loading" @click="cancelSearch">{{$t('btn.clean')}}</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="order_id" :label="$t('reimburse.order_id')" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="item_name" :label="$t('reimburse.project_name')" width="300px" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="owner" :label="$t('reimburse.project_owner')"  width="140" align="center" show-overflow-tooltip/>
                <el-table-column prop="description" :label="$t('reimburse.description')" min-width="300px"  width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="order_date" :label="$t('reimburse.order_date')" width="140" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="status_name" :label="$t('reimburse.status')" width="120" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='D'" style="color:grey">草稿</span>
                        <span v-if="scope.row.status=='P'" style="color:blue">待審</span>
                        <span v-if="scope.row.status=='F'" style="color:green">通過</span>
                        <span v-if="scope.row.status=='A'" style="color:red">退回</span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_paied" :label="$t('reimburse.reimburse_status')" width="110" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='F'&&scope.row.is_paied==1" style="color:green">已撥款</span>
                        <span v-if="scope.row.status=='F'&&scope.row.is_paied==0" style="color:red">未撥款</span>
                        <span v-if="scope.row.status!='F'" style="color:grey">--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total_amount" :label="$t('reimburse.total_amount')" width="110" align="right" :formatter="stateFormat" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="280" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status=='D'" type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <el-button v-if="scope.row.status=='P' || scope.row.status=='F' || scope.row.status=='A'" type="info" size="mini" icon="el-icon-view" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.view')}}</el-button>
                        <el-button v-if="scope.row.status=='A' || scope.row.status=='P'" type="success" size="mini" icon="el-icon-refresh-right" @click="handleRestore(scope.row)">{{$t('btn.draft')}}</el-button>
                        <el-button v-if="scope.row.status=='D' || scope.row.status=='A' " type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">{{$t('btn.abandon')}}</el-button>
                        <el-button v-if="scope.row.status=='F'" type="primary" size="mini" icon="el-icon-document" @click="handleDownload(scope.row)">{{$t('btn.download')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('project.ask_delete')}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('reimburse.create_item')" :visible.sync="addItemVisible" width="600px" center :before-close="cancelAddItem">
            <el-row>
                <el-col v-for="type in option.item_types" :key="type.title" :span="8">
                    <div style="padding:5px;">
                        <el-button type="primary" style="height:100px;width:100%;font-size:24px;" @click="confirmAddItem(type.content)">{{type.title}}</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

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
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreate">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmCreate">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="$t('reimburse.edit_reimburse')" :visible.sync="updateView" width="1100px" :before-close="cancelDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-card shadow="always" class="mgb10" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>{{$t('reimburse.basic_info')}}</span>
                        </div>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="$t('reimburse.order_id')" >
                                    <span>{{form.order_id}}</span>
                                </el-form-item>
                                <el-form-item :label="$t('reimburse.project_name')">
                                    <span>{{form.item_id}} - {{form.item_name}}</span>
                                </el-form-item>
                                <el-form-item :label="$t('reimburse.order_date')">
                                    <span>{{form.order_date}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="$t('reimburse.order_dept')">
                                    <span>{{form.dept_name}}</span>
                                </el-form-item>
                                <el-form-item :label="$t('reimburse.applicant_name')">
                                    <span>{{form.p_name}}</span>
                                </el-form-item>
                                <el-form-item :label="$t('reimburse.status')">
                                    <span v-if="form.status=='D'" style="color:grey">{{$t('reimburse.status_tag.D')}}</span>
                                    <span v-if="form.status=='P'" style="color:blue">{{$t('reimburse.status_tag.P')}}</span>
                                    <span v-if="form.status=='F'" style="color:green">{{$t('reimburse.status_tag.F')}}</span>
                                    <span v-if="form.status=='A'" style="color:red">{{$t('reimburse.status_tag.A')}}</span>
                                    <!-- <span>{{form.status}}</span> -->
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item :label="$t('reimburse.description')">
                                <el-input :readonly="orderReadOnly" type="textarea" :rows="4" v-model="form.description" style="width:500px;"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" class="mgb10" style="padding-bottom:20px;" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>{{$t('reimburse.content')}}</span>
                            <el-button v-if="!orderReadOnly" type=success size=large icon="el-icon-plus" class="card-header-r-btn" @click="handleAddItem">{{$t('btn.new')}}</el-button>
                        </div>
                        <el-row v-for="(item,index) in form.content_json" :key="item.id" >
                            <el-card shadow="always" style="margin:5px;">
                                <el-col :span="3">
                                    <span>{{item.type}}</span>
                                </el-col>
                                <el-col :span="5">
                                    <el-form ref="form" label-width="auto">
                                        <el-form-item label="日期">
                                            <el-date-picker :readonly="orderReadOnly" v-model="item.date" style="width:155px" type="date" align="right" unlink-panels value-format="yyyy-MM-dd"  />
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :span="11">
                                    <div>
                                        <el-col v-for="data in item.content" :key="data.id+item.id" :span="data.width" style="padding-left:10px;">
                                            <el-form ref="form" label-width="auto">
                                                <el-form-item :label="data.title">
                                                    <el-input type="text" :readonly="orderReadOnly" v-model="data.result" :placeholder="'請輸入'+data.title" clearable @change="handleContentChange"></el-input>
                                                </el-form-item>
                                            </el-form>
                                        </el-col>
                                    </div>
                                </el-col>
                                <el-col :span="1" style="float:right;padding-left:10px;text-align:right;">
                                    <el-button v-if="!orderReadOnly" type="text" style="" @click="handleDeleteItem(index)">{{$t('btn.delete')}}</el-button>
                                </el-col>
                                <el-col :span="4" style="float:right;padding-left:10px;text-align:right;">
                                    <el-input 
                                    :readonly="orderReadOnly" 
                                    type="number"  
                                    v-model.number="item.amount" 
                                    @keyup.native="prevent($event)"
                                    @mousewheel.native.prevent
                                    @change="handleContentChange"
                                    ><template slot="append">元</template>
                                    </el-input>
                                </el-col>
                            </el-card>
                        </el-row>
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",handleCaculateTotalAmount)}} 元</h2></span>
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" class="mgb10" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>{{$t('reimburse.payment_setting')}}</span>
                        </div>
                        <el-form ref="form" label-width="auto">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item :label="$t('reimburse.payment_method')">
                                        <el-radio-group v-model="form.payment_method" :disabled="orderReadOnly" size="mini">
                                            <el-radio label="transfer" border>{{$t('reimburse.remit')}}</el-radio>
                                            <el-radio label="cash" border>{{$t('reimburse.cash')}}</el-radio>
                                            <el-radio label="check" border>{{$t('reimburse.check')}}</el-radio>
                                        </el-radio-group>
                                        <!-- <span>{{form.payment_method}}</span> -->
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.remit_options')">
                                        <el-radio-group v-model="form.remittance_setting" :disabled="form.payment_method!='transfer' || orderReadOnly" size="mini">
                                            <el-radio label="deduct" border>{{$t('reimburse.deduct')}}</el-radio>
                                            <el-radio label="no_deduct" border>{{$t('reimburse.no_deduct')}}</el-radio>
                                        </el-radio-group>
                                        <!-- <span>{{form.payment_method}}</span> -->
                                    </el-form-item>
                                    <!-- <el-form-item label="付款日期">
                                        <el-date-picker v-model="form.remittance_date" :readonly="orderReadOnly" type="date" align="right" unlink-panels value-format="yyyy-MM-dd" />
                                    </el-form-item> -->
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="$t('reimburse.beneficiary_bank')">
                                        <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="form.remittance_bank" ></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.swift_code')">
                                        <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="form.remittance_account" ></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.beneficiary')">
                                        <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="form.account_name" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>{{$t('reimburse.status_history')}}</span>
                        </div>
                        <div>
                            <el-table
                            :data="pay_order_history"
                            style="width: 100%">
                            <el-table-column
                                prop="recorded_at"
                                :label="$t('reimburse.recorded_at')"
                                align="center"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="employee_name"
                                :label="$t('reimburse.employee_name')"
                                align="center"
                                width="180">
                            </el-table-column>
                           <el-table-column
                                prop="prev_status"
                                :label="$t('reimburse.action')"
                                align="center"
                                width="200">
                                <template slot-scope="scope">
                                    {{scope.row.prev_status}} → {{scope.row.current_status}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="note"
                                :label="$t('reimburse.note')">
                            </el-table-column>
                            </el-table>
                        </div>
                            
                    </el-card>
                </el-row>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="orderReadOnly==false"  size="large" @click="cancelDialog">{{$t('btn.cancel')}}</el-button>
                <el-button v-if="orderReadOnly==false" size="large" type="primary" @click="confirmDialog">{{$t('btn.save')}}</el-button>
                <el-button v-if="orderReadOnly==false" size="large" type="success" style="width:120px;" @click="handleHandIn">{{$t('reimburse.submit')}}</el-button>
            </div>
        </el-dialog>

         <el-dialog :title="$t('reimburse.confirm_restore')" :visible.sync="restoreVisible" width="300px" center :before-close="cancelQuestDialog">
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelQuestDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmRestore">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

         <el-dialog :title="$t('reimburse.confirm_download')" :visible.sync="downloadVisible" width="300px" center :before-close="cancelQuestDialog" v-loading="dialog_loading">
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelQuestDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDownload">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

         <el-dialog :title="$t('reimburse.confirm_abandon')" :visible.sync="deleteVisible" width="300px" center :before-close="cancelQuestDialog">
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelQuestDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { payOrderService } from "@/_services";
import { dayItemService } from "@/_services";

export default {
    name: "pay_order",
    components: {
    },
    data(){
        return {
            activeNames:"",
            itemKey:0,
            tbKey:0,
            tableData: [],

            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10],
            start_row:0,
            sort_column:"order_date",
            sort:"desc",
            
            action_list:localStorage.getItem("ms_user_actions"),
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            username:localStorage.getItem("ms_username"),

            loading:false,
            dialog_loading:false,
            
            deleteID:null,
            deleteView:false,
            createView:false,
            updateView:false,
            
            addItemVisible:false,
            
            restoreVisible:false,
            downloadVisible:false,
            deleteVisible:false,
            restore_id:"",
            download_id:"",
            delete_id:"",
           
            filter:{
                name:"",
                status:[],
            },
            
            createForm:{
                project_id:""
            },
            
            form:{
                order_id:"",
                item_id:"",
                dept_name:"",
                dept_id:"",
                applicant:"",
                order_date:"",
                description:"",
                status:"",
                status_name:"",

                payment_method:"",
                remittance_date:"",
                remittance_bank:"",
                remittance_account:"",
                remittance_setting:"",
                acount_name:"",

                content_json:[]
            },

            pay_order_history:[],

            option:{
                projects:[],
                status:[
                    {label:"草稿",value:"D"},
                    {label:"待審",value:"P"},
                    {label:"過審",value:"F"},
                    {label:"退回",value:"A"}
                ],
                item_types:[
                    {
                        title:"一般",
                        content:{
                            type:"一般請款",
                            amount:0,
                            date:"",
                            content:[
                                {id:"1",title:"摘要",width:24,type:"textarea",result:""}
                            ]
                        }
                    },
                    {
                        title:"交通費",
                        content:{
                            type:"交通費請款",
                            amount:0,
                            date:"",
                            content:[
                                {id:"1",title:"起訖地點",width:12,type:"text",result:""},
                                {id:"2",title:"票種",width:12,type:"text",result:""}
                            ]
                        }
                    },
                    {
                        title:"住宿費",
                        content:{
                            type:"住宿費請款",
                            amount:0,
                            date:"",
                            content:[
                                {id:"1",title:"地點",width:24,type:"text",result:""}
                            ]
                        }
                    },
                    {
                        title:"生活費",
                        content:{
                            type:"生活費(膳食)",
                            amount:0,
                            date:"",
                            content:[]
                        }
                    },
                    {
                        title:"辦公費",
                        content:{
                            type:"辦公費(郵電/交際/車資等)",
                            amount:0,
                            date:"",
                            content:[]
                        }
                    },
                ]
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

        showTitle(){
            if(this.createView) return "新增請款單";
            else if(this.updateView) return "編輯請款單";
            else return "";
        },

        showVisible(){
            if(this.updateView) return this.updateView;
            else return false;
        },
        handleCaculateTotalAmount(){
            var total = 0;
            this.form.content_json.forEach(element => {
                total+=element.amount
            });
            return total
        },
        async checkContent(){
            await this.form.content_json.forEach(element => {
                console.log(element.amount);
                if(element.amount==0 || element.amount==null || element.amount==""){
                    console.log("false");
                    return false

                }
            });
        },
        today(){
            let time =new Date();
            return time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },
        orderReadOnly(){
            if(this.form.status == "D"){
                return false
            }else{
                return true 
            }
        }

    }, 
    
    methods: {
        prevent(e){
        var keynum = window.event ? e.keyCode : e.which;   //获取键盘码
            if (keynum ==189|| keynum==190||keynum == 109 ||keynum == 110 ) {
                this.$message.warning('禁止輸入小數及負數')
                e.target.value = 0
            }
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
        cancelQuestDialog(){
            this.restoreVisible = false;
            this.downloadVisible = false;
            this.deleteVisible = false;
        },
        handleDelete(row){
            this.delete_id = row.order_id;
            this.deleteVisible = true;
        },
        handleRestore(row){
            this.restore_id = row.order_id;
            this.restoreVisible = true;
        },
        handleDownload(row){
            this.download_id = row.order_id;
            this.downloadVisible = true;
        },

        confirmDelete(){
            var param = {
                action:"delete",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.delete_id
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("Success") 
                    this.getData();
                    this.cancelQuestDialog();
                }else{
                    this.$message.error(res.msg)
                } 
            })
        },
        confirmRestore(){
            var param = {
                action:"restore",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.restore_id
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("Success") 
                    this.getData();
                    this.cancelQuestDialog();
                }else{
                    this.$message.error(res.msg)
                } 
            })
        },
       
        confirmDownload(){
            var param = {order_id: this.download_id};
            this.dialog_loading = true;
            payOrderService.downlaod_pay_order(param).then(response => {
                // console.log(response);
                const link = document.createElement('a');
                let blob = new Blob([response.data], {type: 'application/pdf'});
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);//创建url对象
                link.download = this.today+'-'+this.download_id+".pdf"
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);//销毁url对象
                this.cancelQuestDialog();
                this.dialog_loading = false;
            }).catch(err => {
                console.log(err);
                this.cancelQuestDialog();
                this.dialog_loading = false;
            })
            this.dialog_loading = true;
        },

        handleContentChange(){
            console.log(this.form.content_json)
        },
        handleAddItem(){
            console.log("add Item");
            this.addItemVisible = true;

        },
        cancelAddItem(){
            this.addItemVisible = false;
        },
        async confirmAddItem(content){
            var temp_content = JSON.parse(JSON.stringify(content));
            var new_uuid = this.create_UUID(8);
            temp_content.id = new_uuid
            // await temp_content.content.forEach(element => {
            //     console.log(element);
            //     element.id = element.id + new_uuid
            // });
            await this.form.content_json.push(temp_content);
            console.log(this.form.content_json);
            this.addItemVisible = false;
        },
        handleDeleteItem(index){
            console.log(index);
            this.form.content_json.splice(index,1);
        },
        
        confirmCreate(){
            if(!this.createForm.project_id){
                return this.$message.error("請選擇專案")
            }else{
                var param = {
                    action:"create",
                    form:{
                        odoo_employee_id:this.odoo_employee_id,
                        item_id: this.createForm.project_id
                    }
                };
                payOrderService.update_pay_orders(param).then(res =>{ 
                    console.log(res);
                    if(res.code>0){
                        // this.$message.success("OK")
                        this.getData();
                        this.createForm.project_id = "";
                        this.createView = false;
                        this.handleEdit(0, {order_id:res.create_id})
                    }else{
                        this.$message.error(res.msg)
                    }
                        
                })
            }
            // this.createView = false;
            // this.handleEdit(0, {row:"order_id"})
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
        },
       
        async handleEdit(index, row){
            var param = {
                action:"info",
                filter:{
                    order_id:row.order_id
                }
            };
            await payOrderService.get_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    // this.$message.success("OK")
                    this.form=res.data;
                    this.pay_order_history=res.histories;
                    this.updateView=true;
                }else{
                    this.$message.error(res.msg)
                }
            })
        },

        cancelDelete(){
            this.deleteID=null;
            this.deleteView=false;
        },

        update_pay_order(param){ 
            payOrderService.update_pay_orders(param).then(res =>{ 
                if(res.code > 0){ 
                    this.$message.success("success"); 
                    this.getData();
                    this.cancelDialog();
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
        },

        
        confirmDialog(){
            var temp_form = Object.assign({}, this.form);
            var param = {
                action:"update",
                form:temp_form
            };
            param.form.odoo_employee_id = this.odoo_employee_id;
            param.form.total_amount = this.handleCaculateTotalAmount;
            this.update_pay_order(param);
        },

        async handInOrder(){
            console.log("GOGOGO");
            var temp_form = Object.assign({}, this.form);
            var param = {
                action:"update",
                form:temp_form
            };
            param.form.odoo_employee_id = this.odoo_employee_id;
            param.form.total_amount = this.handleCaculateTotalAmount;
            this.update_pay_order_handin(param);
        },

        update_pay_order_handin(param){ 
            payOrderService.update_pay_orders(param).then(res =>{ 
                if(res.code > 0){ 
                    var handin_form = {
                        action:"handin",
                        form:{
                            odoo_employee_id:this.odoo_employee_id,
                            order_id:this.form.order_id,
                            order_date:this.today
                        }
                    };
                    payOrderService.update_pay_orders(handin_form).then(res =>{
                        if(res.code > 0){ 
                            this.getData();
                            this.cancelDialog();
                        }else{
                            this.$message.error(this.$t(res.msg)); 
                        }
                    })

                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
        },

        async handleHandIn(){
            if(!this.form.content_json.length){
                return this.$message.error("未設定請款內容");
            }
            await this.form.content_json.forEach(element => {
                console.log(element.amount);
                if(element.amount==0 || element.amount==null || element.amount==""){
                    return this.$message.error("請款單細項未正確設定金額");
                }
            });
            if(this.form.description==""||this.form.description==null){
                return this.$message.error("請填寫請款說明");
            };
            if(this.form.payment_method=="transfer"){
                console.log("transfer");
                if(this.form.remittance_setting==""||this.form.remittance_setting==null){
                    return this.$message.error("未設定匯款方式");
                };
                // if(this.form.remittance_date==""||this.form.remittance_date==null){
                //     return this.$message.error("未設定預計付款日期");
                // };
                if(this.form.remittance_bank==""||this.form.remittance_bank==null){
                    return this.$message.error("未設定匯款銀行/分行");
                };
                if(this.form.remittance_account==""||this.form.remittance_account==null){
                    return this.$message.error("未設定匯款帳號");
                };
                if(this.form.account_name==""||this.form.account_name==null){
                    return this.$message.error("未設定支付對象/戶名");
                };
            };
            
            await this.handInOrder();

        },

        

        cancelDialog(){
            this.updateView=false;
            this.resetForm();
        },

        resetForm(){
            this.form={
                order_id:"",
                item_id:"",
                dept_name:"",
                dept_id:"",
                applicant:"",
                order_date:"",
                description:"",
                status:"",
                status_name:"",
                payment_method:"",
                remittance_date:"",
                remittance_bank:"",
                remittance_account:"",
                remittance_setting:"",
                acount_name:"",
                content_json:[]
            };
            // this.$refs.form.clearValidate();
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
                    odoo_employee_id:this.odoo_employee_id,
                    sort_column:this.sort_column,
                    sort:this.sort,
                    start_row:this.start_row,
                    page_size:this.page_size,
                    key_word:this.filter.name,
                    status:this.filter.status
                }
            }
            await payOrderService.get_pay_orders(param).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
            })
            this.loading=false;
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["work_item_now"]}).then(res =>{ 
                this.option.projects=res.work_item_now;
                // console.log(res.work_item_now);
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
        resultChange(result){
            console.log(data);
            console.log(result);
        }
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
    .card-header-r-btn{
        position:relative;
        float:right;
        margin-top:-10px;
    }
</style>