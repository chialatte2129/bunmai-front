<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item> {{$t('menus.work_items_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item @click="handleLeave"> {{$t('menus.work_item_cost')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{form.item_name}}</b></el-breadcrumb-item>
            </el-breadcrumb>
            <span style="float:right;margin:-37px 0px 0px 250px;">
                <el-button type="info" icon="el-icon-back" size="large" @click="handleLeave">{{$t('btn.leave')}}</el-button>
            </span>
        </div>
        <div class="container">
            <el-card shadow="hover" class="mgb10" v-loading.lock="loading">
                <div slot="header" class="clearfix">
                    <span>專案成本 - {{form.item_name}}</span>
                    <el-button type=primary size=large icon="el-icon-files" class="card-header-r-btn" @click="handleUpdate"> {{$t('btn.save')}}</el-button>
                </div>
                <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="150px">
                    <el-collapse v-model="collapseName">
                        <el-col :span="24" style="padding-right:10px;">
                            <el-collapse-item name="base_info" title="專案資訊" disabled>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="專案編號">
                                            <span>{{form.id}}</span>
                                        </el-form-item>
                                        <el-form-item label="專案名稱">
                                            <span>{{form.name}}</span>
                                        </el-form-item>
                                        <el-form-item label="專案狀態">
                                            <span>{{form.status}}</span>
                                        </el-form-item>
                                        <el-form-item label="負責人">
                                            <span>{{form.owner}}</span>
                                        </el-form-item>                                        
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="預估工時">
                                            <el-input type="number" v-model.number="form.pre_work_time" style="width:200px;"><template slot="append">小時</template></el-input>
                                            <!-- <span>{{form.pre_work_time}} 小時</span> -->
                                        </el-form-item>
                                        <el-form-item label="執行工時">
                                            <span>{{form.work_time}} 小時</span>
                                        </el-form-item>
                                        <el-form-item label="執行比例">
                                            <span v-if="workprogess>=80" style="color:red;">{{workprogess}} %</span>
                                            <span v-if="workprogess>=50&&workprogess<80"  style="color:orange;">{{workprogess}} %</span>
                                            <span v-if="workprogess<50" style="color:green;">{{workprogess}} %</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" title="請款單" disabled>
                                <el-row  style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <el-table :data="tableData_pay_order" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey1">
                                            <el-table-column prop="id" label="單號" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="status" label="狀態" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="date" label="日期" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="description" label="說明" width="auto" sortable="custom" show-overflow-tooltip/>
                                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column :label="$t('btn.action')" width="100" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button v-if="scope.row.status=='待審'" type="primary" size="mini" icon="el-icon-check" @click="checkPayOrderVisible=true">審核</el-button>
                                                    <el-button v-if="scope.row.status!='待審'" type="info" size="mini" icon="el-icon-view" @click="viewPayOrderVisible=true">檢視</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" title="預計收入" disabled>
                                <el-row  style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <span style="float:right;padding:10px;">
                                            <el-button type="success" icon="el-icon-plus"  @click="incomeCreateVisible=true">{{$t('btn.new')}}</el-button>
                                        </span>
                                        <el-table :data="tableData_income" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey1">
                                            <el-table-column prop="date" label="日期" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                            <el-table-column prop="description" label="項目" width="auto" sortable="custom" show-overflow-tooltip/>
                                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column :label="$t('btn.action')" width="180" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button type="warning" size="mini" icon="el-icon-edit" @click="incomeEditVisible=true">{{$t('btn.edit')}}</el-button>
                                                    <el-button  type="danger" size="mini" icon="el-icon-delete" @click="deleteView=true">{{$t('project.delete')}}</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div style="float:right;color:red;">
                                            <span><h2>Total {{stateFormat("","",form.total_income)}} 元</h2></span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="cost" title="預計支出" disabled>
                                <el-row style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <span style="float:right;padding:10px;">
                                            <el-button type="success" icon="el-icon-plus" @click="costCreateVisible=true">{{$t('btn.new')}}</el-button>
                                        </span>
                                        <el-table :data="tableData_cost" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey2">
                                            <el-table-column prop="date" label="日期" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                            <el-table-column prop="description" label="項目" width="auto" sortable="custom" show-overflow-tooltip/>
                                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column :label="$t('btn.action')" width="180" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button type="warning" size="mini" icon="el-icon-edit" @click="costEditVisible=true">{{$t('btn.edit')}}</el-button>
                                                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteView=true">{{$t('project.delete')}}</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div style="float:right;color:red;">
                                            <span><h2>Total {{stateFormat("","",form.total_cost)}} 元</h2></span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-col>
                    </el-collapse>
                </el-form>
            </el-card>
        </div>

        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> 刪除後不可恢復,您要刪除這筆紀錄嗎？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="closeAllDialog">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        

        <el-dialog :title="showTitle" :visible.sync="viewPayOrderVisible" width="900px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="payOrderForm" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="請款單號">
                            <span>{{payOrderForm.id}}</span>
                        </el-form-item>
                        <el-form-item label="申請日期">
                            <span>{{payOrderForm.order_date}}</span>
                        </el-form-item>
                        <el-form-item label="狀態">
                            <span>{{payOrderForm.status}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公司名稱">
                            <span>{{payOrderForm.company_name}}</span>
                        </el-form-item>
                        <el-form-item label="請款人">
                            <span>{{payOrderForm.owner}}</span>
                        </el-form-item>
                        <el-form-item label="申請單位">
                            <span>{{payOrderForm.order_dept}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="請款說明">
                            <el-input type="textarea" :rows="4" v-model="payOrderForm.description"></el-input>
                        </el-form-item>
                        <el-table :data="payOrderForm.content" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading">
                            <el-table-column prop="type" label="項目" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                            <el-table-column prop="description" label="請款資訊" width="auto" sortable="custom" show-overflow-tooltip>
                                <template slot-scope="content">
                                    <div v-for="item in content.row.content" :key="item.title"><span >{{item.title}} : {{item.result}}</span></div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                        </el-table>
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",payOrderForm.amount)}} 元</h2></span>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" @click="closeAllDialog">關閉</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="showTitle" :visible.sync="checkPayOrderVisible" width="900px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="payOrderForm" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="請款單號">
                            <span>{{payOrderForm.id}}</span>
                        </el-form-item>
                        <el-form-item label="申請日期">
                            <span>{{payOrderForm.order_date}}</span>
                        </el-form-item>
                        <el-form-item label="狀態">
                            <span>{{payOrderForm.status}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公司名稱">
                            <span>{{payOrderForm.company_name}}</span>
                        </el-form-item>
                        <el-form-item label="請款人">
                            <span>{{payOrderForm.owner}}</span>
                        </el-form-item>
                        <el-form-item label="申請單位">
                            <span>{{payOrderForm.order_dept}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="請款說明">
                            <el-input type="textarea" :rows="4" v-model="payOrderForm.description"></el-input>
                        </el-form-item>
                        <el-table :data="payOrderForm.content" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading">
                            <el-table-column prop="type" label="項目" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                            <el-table-column prop="description" label="請款資訊" width="auto" sortable="custom" show-overflow-tooltip>
                                <template slot-scope="content">
                                    <div v-for="item in content.row.content" :key="item.title"><span >{{item.title}} : {{item.result}}</span></div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                        </el-table>
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",payOrderForm.amount)}} 元</h2></span>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" size="large" @click="closeAllDialog">退回</el-button>
                <el-button type="success" size="large" @click="closeAllDialog">通過</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="showTitle" :visible.sync="costCreateVisible" width="900px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        
                    </el-col>
                    <el-col :span="12">
                       
                    </el-col>
                </el-row>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="closeAllDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="showTitle" :visible.sync="costEditVisible" width="900px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        
                    </el-col>
                    <el-col :span="12">
                       
                    </el-col>
                </el-row>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="closeAllDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="showTitle" :visible.sync="incomeCreateVisible" width="900px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        
                    </el-col>
                    <el-col :span="12">
                       
                    </el-col>
                </el-row>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="closeAllDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="showTitle" :visible.sync="incomeEditVisible" width="900px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        
                    </el-col>
                    <el-col :span="12">
                       
                    </el-col>
                </el-row>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="closeAllDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

       
    </div>
</template>
<script>
import { workItemService } from "@/_services";
export default {
    name: "work_item_manage",
    data(){
        return {
            collapseName:["base_info", "income", "cost"],

            activeNames:"",
            tbKey1:0,
            tbKey2:0,
            tbKey3:0,
            
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
            tagVisible:false,

            viewPayOrderVisible:false,
            checkPayOrderVisible:false,
            incomeCreateVisible:false,
            incomeEditVisible:false,
            costCreateVisible:false,
            costEditVisible:false,

            incomeForm:{
                date:"",
                description:"",
                amount:""
            },
            costForm:{
                date:"",
                description:"",
                amount:""
            },
            payOrderForm:{
                id:"P0001-ASUDE",
                status:"待審",
                company_name:"維亞娛樂股份有限公司",
                order_dept:"技術支援",
                order_date:"2021-04-21",
                owner:"陳嘉甫",
                project_name:"BLOCKADE Steam v1.0.0.00",
                amount:3700,
                description:"研討會",
                content:[
                    {
                        type:"交通費請款",
                        amount:1200,
                        content:[
                            {title:"日期",result:"2021-02-05"},
                            {title:"起訖地點",result:"高雄-台北"},
                            {title:"票種",result:"高鐵一般席"}
                        ]
                    },
                    {
                        type:"住宿費請款",
                        amount:2000,
                        content:[
                            {title:"日期",result:"2021-02-05"},
                            {title:"地點",result:"台北市"}
                        ]
                    },
                    {
                        type:"生活費(膳食)",
                        amount:500,
                        content:[
                            {title:"日期",result:"2021-02-05"}
                        ]
                    }
                ]

            },

            tagValue:"",
            check_start_time:"",
            check_end_time:"",
            filter:{
                name:"",
                status:[],
                category:[],
                owner:[],
            },
            
            tableData_cost: [
                {date:"2021-05-31",description:"支出項目ㄧ",amount:1000},
                {date:"2021-05-31",description:"支出項目二",amount:30000},
                {date:"2021-05-31",description:"支出項目三",amount:340},
                {date:"2021-05-31",description:"支出項目四",amount:1430},
                {date:"2021-05-31",description:"支出項目五",amount:500}
            ],
            tableData_income: [
                {date:"2021-05-31",description:"收入項目一",amount:100000},
                {date:"2021-05-31",description:"收入項目二",amount:20000},
                {date:"2021-05-31",description:"收入項目三",amount:3000000},
                {date:"2021-05-31",description:"收入項目四",amount:30000},
                {date:"2021-05-31",description:"收入項目五",amount:4000}
            ],
            tableData_pay_order: [
                {id:"P0001-ASUDE",date:"2021-04-21",status:"待審",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-LIEKD",date:"2021-04-20",status:"待審",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-IUYRJ",date:"2021-04-19",status:"通過",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-SKEID",date:"2021-04-18",status:"通過",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-POEIS",date:"2021-04-20",status:"通過",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-RUEJD",date:"2021-04-16",status:"退回",description:"請款說明內容一",owner:"王家得",amount:2000},
                {id:"P0001-IEKWE",date:"2021-04-17",status:"退回",description:"請款說明內容一",owner:"王家得",amount:2000},
            ],
            form:{
                item_name:"VAR APP v2.3.0",
                id:"P0009527",
                name:"VAR APP v2.3.0",
                status:"進行中",
                owner:"梁鴻騰",
                pre_work_time:1000,
                work_time:540,
                work_progress:54,
                total_cost:33270,
                total_income:3154000
                
            },

            option:{
                categories:[],
                status:[]
            },
            tree_data:[],
           
            rules: {}
               
        }
    },

    async created(){
        // await this.get_dept_employee();
        // await this.getOption();
        await this.getData();
    },

    computed: {
        
        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        showTitle(){
            if(this.createView && this.form.is_project) return this.$t("project.create_outter_project");
            else if(this.createView && !this.form.is_project) return this.$t("project.create_inner_project");
            else if(this.updateView && this.form.is_project) return this.$t("project.edit_project");
            else if(this.updateView && !this.form.is_project) return this.$t("project.edit_inner_project");
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else return false;
        },

        allowProjectCreate(){
            if (this.action_list.includes("create_outer_project")){
                return true
            }else{
                return false
            }
        },

        allowCreate(){
            // if (this.action_list.includes("create_inner_project")){
            //     return true
            // }else{
            //     return false
            // }
            return false
        },

        setReadOnly(){
            if (this.form.is_project==1 && this.action_list.includes("edit_outer_project")){
                return false
            }else if (this.form.is_project==0 && this.action_list.includes("edit_inner_project")){
                return false
            }else{
                return true
            }
        },

        allowEdit(){
            if (this.action_list.includes("edit_outer_project")){
                return true
            }else{
                return false
            }
        },

        workprogess(){

            return ((this.form.work_time/this.form.pre_work_time )*100).toFixed(2)
        }
        
    }, 
    
    methods: {
        closeAllDialog(){
            this.viewPayOrderVisible=false;
            this.checkPayOrderVisible=false;
            this.incomeCreateVisible=false;
            this.incomeEditVisible=false;
            this.costCreateVisible=false;
            this.costEditVisible=false;

            this.deleteView=false;
        },
        handleUpdate(){
            this.$router.push("/work_item_cost");
        },
        handleLeave(){
            this.$router.push("/work_item_cost");
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

        

        

        showInput(){
            this.tagVisible=true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        async get_dept_employee(){
            this.loading=true;
            await workItemService.get_dept_employee({}).then(res =>{ 
                this.tree_data=res.tree_data;
                this.tree_data.sort((a, b) => a.complete_name.localeCompare(b.complete_name));
            })
        },
        
        allowDelete(row){
            if(row.status == 'A'){
                return true
            };
            if (row.is_project==1 && this.action_list.includes("delete_outer_project")){
                return false
            }else if (row.is_project==0 && this.action_list.includes("delete_inner_project")){
                return false
            }else{
                return true
            }
        },

        handleCreate(){
            this.form.is_project = 0;
            this.createView=true;
        },

        handleProjectCreate(){
            console.log(this.tree_data);
            this.form.is_project = 1;
            this.form.category = "預設";
            this.form.status = "D";
            this.createView=true;
        },

        handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.employ_id = localStorage.getItem("ms_odoo_employee_id");
            this.tag_form=Object.assign({}, {
                item_id:this.form.id,
                pid:"",
                
            });
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
            this.resetTagForm();
        },

        resetForm(){
            this.form.date_period = [];
            this.form={
               
            };
            this.$refs.form.clearValidate();
        },

        resetTagForm(){
            this.activeNames="";
            this.tag_form={
                item_id:"",
                pid:"",
                
            };
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
            // var param = {
            //     sort_column:this.sort_column,
            //     sort:this.sort,
            //     start_row:this.start_row,
            //     pagesize:this.page_size,
            //     key_word:this.filter.name,
            //     status:this.filter.status,
            //     category:this.filter.category,
            //     owner:this.filter.owner,
            // }
            // await workItemService.get_work_items(param).then(res =>{ 
            //     this.tableData=res.data;
                
            //     this.totalRow=res.total;
            // })

            
            this.loading=false;
        },
        
        async getOption(){
            await workItemService.get_options({}).then(res =>{ 
                this.option.categories=res.categories; 
                this.option.status=res.status; 
            }) 
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
        margin-right:150px;
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
