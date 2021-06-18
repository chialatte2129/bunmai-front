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
                <el-select size="large" v-model="filter.category" class="mgr10" multiple collapse-tags filterable clearable v-if="false"
                placeholder="審核狀態" :disabled="loading" @change="search">
                    <el-option v-for="category in option.categories" :key="category.name" :label="category.name" :value="category.name"/>
                </el-select>
                <el-select class="mgr10" size="large" v-model="filter.status" multiple collapse-tags filterable clearable :placeholder="$t('project.status')"
                :disabled="loading" @change="search">
                    <el-option v-for="item in option.status" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
                <el-input v-model="filter.name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('project.keyword')" :disabled="loading" @change="search"/>
                <el-button size="large" type="info" class="mgr10" plain :disabled="loading" @click="cancelSearch">{{$t('btn.clean')}}</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="id" label="請款單號" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="item_name" label="專案名稱" width="300px" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="owner" label="專案管理人"  width="150" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="description" label="請款說明" min-width="300px"  width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="order_date" label="請款日期" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="status_name" label="請款單狀態" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="order_amount" label="申請金額" width="150" align="center" sortable="custom" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status=='D'" type="warning" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
                        <el-button v-if="scope.row.status=='D' || scope.row.status=='A'" type="danger" size="mini" icon="el-icon-delete" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.delete')}}</el-button>
                        <el-button v-if="scope.row.status=='P' || scope.row.status=='F'" type="info" size="mini" icon="el-icon-view" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.view')}}</el-button>
                        <el-button v-if="scope.row.status=='F'" type="info" size="mini" icon="el-icon-document" @click="handleEdit(scope.$index, scope.row)">列印</el-button>
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
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="1100px" :before-close="cancelDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-card shadow="always" class="mgb10" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>基本資料</span>
                        </div>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="請款單號">
                                    <span>{{form.id}}</span>
                                </el-form-item>
                                <el-form-item label="專案名稱">
                                    <span>{{form.item_id}}</span>
                                </el-form-item>
                                <el-form-item label="申請日期">
                                    <span>{{form.order_date}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="申請單位">
                                    <span>{{form.dept_name}}</span>
                                </el-form-item>
                                <el-form-item label="請款人">
                                    <span>{{form.applicant}}</span>
                                </el-form-item>
                                <el-form-item label="請款單狀態">
                                    <span>{{form.status}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="請款說明">
                                <el-input type="textarea" :rows="4" v-model="form.description" style="width:500px;"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" class="mgb10" style="padding-bottom:20px;" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>請款內容</span>
                            <el-button type=success size=large icon="el-icon-plus" class="card-header-r-btn" @click="handleAddItem">{{$t('btn.new')}}</el-button>
                        </div>
                        <el-row v-for="item in form.order_content" :key="item.id" >
                            <el-card shadow="always" style="margin:5px;">
                                <el-col :span="3">
                                    <span>{{item.type}}</span>
                                </el-col>
                                <el-col :span="5">
                                    <el-form ref="form" label-width="auto">
                                        <el-form-item label="日期">
                                            <el-date-picker v-model="item.date" style="width:155px" type="date" align="right" unlink-panels value-format="yyyy-MM-dd"  />
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :span="11">
                                    <div>
                                        <el-col v-for="data in item.content" :key="data.id" :span="12" style="padding-left:10px;">
                                            <el-form ref="form" label-width="auto">
                                                <el-form-item :label="data.title">
                                                    <el-input v-model="data.result" :placeholder="'請輸入'+data.title" clearable @change="handleContentChange"></el-input>
                                                </el-form-item>
                                            </el-form>
                                        </el-col>
                                    </div>
                                </el-col>
                                <el-col :span="5" style="float:right;padding-left:10px;text-align:right;">
                                    <el-input type="number" v-model.number="item.amount"  @change="handleContentChange"><template slot="append">元</template></el-input>
                                </el-col>
                            </el-card>
                        </el-row>
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",handleCaculateTotalAmount)}} 元</h2></span>
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" v-loading.lock="loading">
                        <el-form ref="form" label-width="auto">
                        <div slot="header" class="clearfix">
                            <span>付款方式</span>
                        </div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="付款方式">
                                        <el-radio-group v-model="form.payment_method" size="mini">
                                            <el-radio label="transfer" border>匯款</el-radio>
                                            <el-radio label="cash" border>現金</el-radio>
                                            <el-radio label="check" border>支票</el-radio>
                                        </el-radio-group>
                                        <!-- <span>{{form.payment_method}}</span> -->
                                    </el-form-item>
                                    <el-form-item label="匯款選項">
                                        <el-radio-group v-model="form.transfer_options" :disabled="form.payment_method!='transfer'" size="mini">
                                            <el-radio label="deduct" border>跨行扣匯費</el-radio>
                                            <el-radio label="no_deduct" border>跨行不扣匯費</el-radio>
                                        </el-radio-group>
                                        <!-- <span>{{form.payment_method}}</span> -->
                                    </el-form-item>
                                    <el-form-item label="付款日期">
                                        <el-date-picker v-model="form.remittance_date" type="date" align="right" unlink-panels value-format="yyyy-MM-dd" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="匯款銀行/分行">
                                        <el-input type="text" style="width:200px;" v-model="form.remittance_bank" ></el-input>
                                    </el-form-item>
                                    <el-form-item label="匯款帳號">
                                        <el-input type="text" style="width:200px;" v-model="form.remittance_account" ></el-input>
                                    </el-form-item>
                                    <el-form-item label="支付對象/戶名">
                                        <el-input type="text" style="width:200px;" v-model="form.acount_name" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-card>
                </el-row>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="large" @click="cancelDialog">{{$t('btn.cancel')}}</el-button>
                <el-button size="large" type="primary" @click="confirmDialog">{{$t('btn.save')}}</el-button>
                <el-button size="large" type="success" style="width:120px;" @click="confirmDialog">送審</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import { workItemService } from "@/_services";
export default {
    name: "pay_order",
    components: {
    },
    data(){
        return {
            activeNames:"",
            itemKey:0,
            tbKey:0,
            tableData: [
                {
                    "id":"P0001-ASUDE","item_name":"BLOCKADE Steam v1.0.0.00",
                    "item_id":"1000102","owner":"蕭掰司","description":"請款單內文",
                    "order_date":"2021-06-16",
                    "status":"D","status_name":"草稿",
                    "order_amount":10000
                },
                {
                    "id":"P0001-ASUDE","item_name":"BLOCKADE Steam v1.0.0.00",
                    "item_id":"1000102","owner":"蕭掰司","description":"請款單內文",
                    "order_date":"2021-06-16",
                    "status":"P","status_name":"待審",
                    "order_amount":10000
                },
                {
                    "id":"P0001-ASUDE","item_name":"BLOCKADE Steam v1.0.0.00",
                    "item_id":"1000102","owner":"蕭掰司","description":"請款單內文",
                    "order_date":"2021-06-16",
                    "status":"F","status_name":"過審",
                    "order_amount":10000
                },
                {
                    "id":"P0001-ASUDE","item_name":"BLOCKADE Steam v1.0.0.00",
                    "item_id":"1000102","owner":"蕭掰司","description":"請款單內文",
                    "order_date":"2021-06-16",
                    "status":"F","status_name":"過審",
                    "order_amount":10000
                },
                {
                    "id":"P0001-ASUDE","item_name":"BLOCKADE Steam v1.0.0.00",
                    "item_id":"1000102","owner":"蕭掰司","description":"請款單內文",
                    "order_date":"2021-06-16",
                    "status":"A","status_name":"退回",
                    "order_amount":10000
                }
            ],

            totalRow:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10],
            start_row:0,
            sort_column:"id",
            sort:"desc",
            
            action_list:localStorage.getItem("ms_user_actions"),
            loading:false,
            
            deleteID:null,
            deleteView:false,
            createView:false,
            updateView:false,
            
            
           
           
            filter:{
                name:"",
                status:[],
                category:[],
                owner:[],
            },
            tree_data:[],
            
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
                remittance_account:"",
                acount_name:"",

                order_content:[
                    {
                        id:1,
                        type:"交通費請款",
                        amount:1200,
                        date:"2021-06-18",
                        content:[
                            {id:1,title:"起訖地點",type:"input",result:"高雄-台北"},
                            {id:2,title:"票種",type:"input",result:"高鐵一般席"},
                            {id:3,title:"票種",type:"input",result:"高鐵一般席"}
                        ]
                    },
                    {
                        id:2,
                        type:"住宿費請款",
                        amount:2000,
                        date:"2021-06-18",
                        content:[
                            {id:1,title:"地點",type:"input",result:"台北市"}
                        ]
                    },
                    {
                        id:3,
                        type:"生活費(膳食)",
                        amount:500,
                        date:"2021-06-18",
                        content:[]
                    },
                    {
                        id:4,
                        type:"生活費(膳食)",
                        amount:500,
                        date:"2021-06-18",
                        content:[]
                    }
                ],
                

            },

            option:{
                status:[]
            },
           
            rules: {
                name: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                id: [
                    {pattern: /^[\u4e00-\u9fa5A-Za-z0-9. ()-]+$/, message: this.$t("rules.project_id"), trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                status: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                category: [
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
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else return false;
        },
        handleCaculateTotalAmount(){
            var total = 0;
            this.form.order_content.forEach(element => {
                total+=element.amount
            });
            return total
        }

    }, 
    
    methods: {
        stateFormat(row, column, cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
		},
        handleContentChange(){
            console.log(this.form.order_content)
        },
        handleAddItem(){

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

        handleClose(tag){
            this.tag_form.tags.splice(this.tag_form.tags.indexOf(tag), 1);
        },

        handleInputConfirm(){
            let inputValue=this.tagValue;
            if(inputValue){
                if(!this.tag_form.tags.includes(inputValue)){
                    this.tag_form.tags.push(inputValue);
                };
            };
            this.tagVisible=false;
            this.tagValue="";
        },

        // showInput(){
        //     this.tagVisible=true;
        //     this.$nextTick(_ => {
        //         this.$refs.saveTagInput.$refs.input.focus();
        //     });
        // },

        // async get_dept_employee(){
        //     this.loading=true;
        //     await workItemService.get_dept_employee({}).then(res =>{ 
        //         this.tree_data=res.tree_data;
        //         this.tree_data.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
        //     })
        // },
        
        

        handleCreate(){
            this.createView=true;
        },
       
        handleEdit(index, row){
            // this.form=Object.assign({}, row);
            // this.form.employ_id = localStorage.getItem("ms_odoo_employee_id");
            
            this.updateView=true;
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
                type:"delete",
                form:this.form
            }
            this.update_work_items(param);
        },

        update_work_items(param){ 
            workItemService.update_work_items(param).then(res =>{ 
                if(res.success){ 
                    this.$message.success("success"); 
                    if(param.type=="create"){
                        this.handleCurrentChange(1);
                        this.cancelDialog();
                    }else if(param.type=="update"){
                        this.getData();
                        this.cancelDialog();
                    }else if(param.type=="delete"){
                        // console.log("finish delete");
                        this.cancelDelete();
                        this.getData();
                    }else{
                        this.getData();
                    }
                    
                
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.form);
                    var temp_tag_form = Object.assign({}, this.tag_form);
                    temp_tag_form.item_id = temp_form.id;
                    var param = {
                        type:this.createView?"create":"update",
                        form:temp_form,
                        tag_form:temp_tag_form,
                    }
                    this.update_work_items(param);
                }
            })
        },

        cancelDialog(){
            this.createView=false;
            this.updateView=false;
            this.resetForm();
        },

        resetForm(){
            this.form.date_period = [];
            this.form={
                type:"create",
                id:"",
                name:"",
                category:"",
                status:"",
                is_project:"",
                start_date:"",
                end_date:"",
                description:"",
                owner:"",
                employ_id:localStorage.getItem("ms_odoo_employee_id"),
                is_open_tags:false,
            };
            this.$refs.form.clearValidate();
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
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                pagesize:this.page_size,
                key_word:this.filter.name,
                status:this.filter.status
            }
            // await workItemService.get_work_items(param).then(res =>{ 
            //     this.tableData=res.data;
            //     this.totalRow=res.total;
            // })
            this.loading=false;
        },
        
        async getOption(){
            // await workItemService.get_options({}).then(res =>{ 
            //     this.option.categories=res.categories; 
            //     this.option.status=res.status; 
            // }) 
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