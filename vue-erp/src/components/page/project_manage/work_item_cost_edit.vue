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
                <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="200px">
                    <el-collapse v-model="collapseName">
                        <el-col :span="24" style="padding-right:10px;padding-left:10px;">
                            <el-collapse-item name="base_info" :title="$t('project.project_info')" disabled>
                                <el-row :gutter="20" style="padding-right:10px;padding-left:10px;">
                                    <el-col :span="12" >
                                        <el-form-item :label="$t('project.id')">
                                            <span>{{form.id}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('project.name')">
                                            <span>{{form.name}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('project.status')">
                                            <span>{{form.status_name}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('project.owner')">
                                            <span>{{form.owner}}</span>
                                        </el-form-item>                                        
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item :label="$t('project.extimated_work_hour')">
                                            <span>{{form.pre_work_time}} {{$t('project.hours')}}</span>
                                            <el-button v-if="is_project_owner" type="success" icon="el-icon-time" style="margin-left:20px;" @click="handleUpdatePreTime"> {{$t('project.update')}}</el-button>
                                            <!-- <span>{{form.pre_work_time}} 小時</span> -->
                                        </el-form-item>
                                        <el-form-item :label="$t('project.total_work_hour')">
                                            <span>{{form.total_work_hours}} {{$t('project.hours')}}</span>
                                        </el-form-item>
                                        <el-form-item label="執行工時比">
                                            <span v-if="form.work_progress>=80" style="color:red;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress>=50&&form.work_progress<80"  style="color:orange;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress<50" style="color:green;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress=='-'" style="color:gray;">{{form.work_progress}}</span>
                                        </el-form-item>
                                        <el-form-item label="預估淨利">
                                            <el-tooltip effect="light" content="預估收入 - 預估支出 ＝ 預估淨利" placement="bottom">
                                                <span>{{stateFormat("","",totalStandardIncome)}} 元</span>
                                            </el-tooltip>
                                        </el-form-item>
                                        <el-form-item label="實際淨利">
                                            <el-tooltip effect="light" content="實際收入 - 實際支出 ＝ 實際淨利" placement="bottom">
                                                <span>{{stateFormat("","",totalActualIncome)}} 元</span>
                                            </el-tooltip>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" title="請款單" disabled>
                                <el-row  style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <el-table :data="tableData_pay_order" height="300" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handleIncomeSortChange" :cell-style="getCellStyle" :key="tbKey1">
                                            <el-table-column prop="order_id" label="單號" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="status_name" label="狀態" width="150" sortable="custom" align="center" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.status=='P'" style="color:blue">待審</span>
                                                    <span v-if="scope.row.status=='F'" style="color:green">通過</span>
                                                    <span v-if="scope.row.status=='A'" style="color:red">退回</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="order_date" label="日期" width="150" sortable="custom" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="description" label="說明" width="auto" sortable="custom" show-overflow-tooltip/>
                                            <el-table-column prop="is_paied" label="撥款狀態" width="150" align="center" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.status=='F'&&scope.row.is_paied==1" style="color:green">已撥款</span>
                                                    <span v-if="scope.row.status=='F'&&scope.row.is_paied==0" style="color:red">未撥款</span>
                                                    <span v-if="scope.row.status!='F'" style="color:grey">--</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="total_amount" label="金額" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column :label="$t('btn.action')" width="260" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button v-if="is_accountant && scope.row.status=='F' && scope.row.is_paied==0" type="warning" size="mini" icon="el-icon-money" @click="handlePay(scope.row)">撥款</el-button>
                                                    <el-button v-if="is_accountant && scope.row.status=='F' && scope.row.is_paied==0" type="danger" size="mini" icon="el-icon-money" @click="handleRejectAc(scope.row)">退回</el-button>
                                                    <el-button v-if="scope.row.status=='P' && is_project_owner" type="primary" size="mini" icon="el-icon-document" @click="handleViewPayOrder(scope.row)">審核</el-button>
                                                    <el-button type="info" size="mini" icon="el-icon-document" @click="handleViewPayOrder(scope.row)">檢視</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" title="專案收益" disabled>
                                <el-row  style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <span style="float:right;padding:10px;">
                                            <el-input v-model="filter.incomeKeyWord" class="mgr10 handle-input" placeholder="關鍵字搜尋" @change="search" />
                                            <el-button  v-if="is_project_owner" type="success" size="large" icon="el-icon-plus"   @click="handleIncomeCreate">{{$t('btn.new')}}</el-button>
                                        </span>
                                    </el-col>
                                   
                                    <el-col :span="24">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>預估收益</span>
                                            </div>
                                            <div>
                                                <el-table :data="tableData_standard_income" height="250" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                                @sort-change="handleIncomeSortChange" :cell-style="getCellStyle" :key="tbKey1">
                                                    <el-table-column prop="date" :label="$t('project.date')" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                                    <el-table-column prop="description" :label="$t('project.cost_description')" width="auto" sortable="custom" show-overflow-tooltip/>
                                                    <el-table-column prop="amount" :label="$t('project.amount')" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                                    <el-table-column v-show="is_project_owner" :label="$t('btn.action')" width="200" align="center" fixed="right">
                                                        <template slot-scope="scope">
                                                            <el-button v-if="is_project_owner" type="warning" size="mini" icon="el-icon-edit" @click="handleIncomeEdit(scope.$index,scope.row)">{{$t('btn.edit')}}</el-button>
                                                            <el-button v-if="is_project_owner" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)">{{$t('btn.delete')}}</el-button>
                                                            <span  v-if="!is_project_owner" style="color:#aaa">--</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div style="float:right;color:red;">
                                                    <span><h2>預估收益合計 {{stateFormat("","",total_standard_income)}} 元</h2></span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </el-col>
                                    <el-col :span="24" style="margin-top:10px;">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>實際收益</span>
                                            </div>
                                            <div>
                                                <el-table :data="tableData_actual_income" height="250" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                                @sort-change="handleIncomeSortChange" :cell-style="getCellStyle" :key="tbKey2">
                                                    <el-table-column prop="date" :label="$t('project.date')" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                                    <el-table-column prop="description" :label="$t('project.cost_description')" width="auto" sortable="custom" show-overflow-tooltip/>
                                                    <el-table-column prop="amount" :label="$t('project.amount')" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                                    <el-table-column v-show="is_project_owner" :label="$t('btn.action')" width="200" align="center" fixed="right">
                                                        <template slot-scope="scope">
                                                            <el-button v-if="is_project_owner" type="warning" size="mini" icon="el-icon-edit" @click="handleIncomeEdit(scope.$index,scope.row)">{{$t('btn.edit')}}</el-button>
                                                            <el-button v-if="is_project_owner"  type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)">{{$t('btn.delete')}}</el-button>
                                                            <span  v-if="!is_project_owner" style="color:#aaa">--</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div style="float:right;color:red;">
                                                    <span><h2>實際收益合計 {{stateFormat("","",total_actual_income)}} 元</h2></span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="cost" title="專案支出" disabled>
                                <el-row style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <span style="float:right;padding:10px;">
                                            <el-input v-model="filter.costKeyWord" class="mgr10 handle-input" placeholder="關鍵字搜尋" @change="search" />
                                            <el-button v-if="is_project_owner" type="success" size="large" icon="el-icon-plus" @click="handleCostCreate">{{$t('btn.new')}}</el-button>
                                        </span>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>預估支出</span>
                                            </div>
                                            <div>
                                                <el-table :data="tableData_standard_cost" height="250" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                                @sort-change="handleCostSortChange" :cell-style="getCellStyle" :key="tbKey3">
                                                    <el-table-column prop="date" :label="$t('project.date')" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                                    <el-table-column prop="description" :label="$t('project.cost_description')" width="auto" sortable="custom" show-overflow-tooltip/>
                                                    <el-table-column prop="amount" :label="$t('project.amount')" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                                    <el-table-column :label="$t('btn.action')" width="200" align="center" fixed="right">
                                                        <template slot-scope="scope">
                                                            <el-button v-if="is_project_owner" type="warning" size="mini" icon="el-icon-edit" @click="handleCostEdit(scope.$index,scope.row)">{{$t('btn.edit')}}</el-button>
                                                            <el-button v-if="is_project_owner" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index,scope.row)">{{$t('btn.delete')}}</el-button>
                                                            <span  v-if="!is_project_owner" style="color:#aaa">--</span>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div style="float:right;color:red;">
                                                    <span><h2>預估支出合計 {{stateFormat("","",total_standard_cost)}} 元</h2></span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </el-col>
                                    <el-col :span="24"  style="margin-top:10px;">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>實際支出</span>
                                            </div>
                                            <div>
                                                <el-table :data="tableData_actual_cost" height="250" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                                @sort-change="handleCostSortChange" :cell-style="getCellStyle" :key="tbKey4">
                                                    <el-table-column prop="date" :label="$t('project.date')" width="150" sortable="custom" align="left" show-overflow-tooltip/>
                                                    <el-table-column prop="description" :label="$t('project.cost_description')" width="auto" sortable="custom" show-overflow-tooltip/>
                                                    <el-table-column prop="amount" :label="$t('project.amount')" width="150" align="right" sortable="custom" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                                    <el-table-column :label="$t('btn.action')" width="200" align="center" fixed="right">
                                                        <template slot-scope="scope">
                                                            <el-button v-if="is_project_owner" type="info" size="mini" icon="el-icon-view" @click="handleCostEdit(scope.$index,scope.row)">{{$t('btn.view')}}</el-button>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                                <div style="float:right;color:red;">
                                                    <span><h2>實際支出合計 {{stateFormat("","",total_actual_cost)}} 元</h2></span>
                                                </div>
                                            </div>
                                        </el-card>
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
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        

        <el-dialog title="請款單" :visible.sync="viewPayOrderVisible" width="1100px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="payOrderForm" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-card shadow="always" class="mgb10" v-loading.lock="loading">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="請款單號">
                                    <span>{{payOrderForm.order_id}}</span>
                                </el-form-item>
                                <el-form-item label="申請日期">
                                    <span>{{payOrderForm.order_date}}</span>
                                </el-form-item>
                                <el-form-item label="狀態">
                                    <span v-if="payOrderForm.status=='D'" style="color:grey">草稿</span>
                                    <span v-if="payOrderForm.status=='P'" style="color:blue">待審</span>
                                    <span v-if="payOrderForm.status=='F'" style="color:green">過審</span>
                                    <span v-if="payOrderForm.status=='A'" style="color:red">退回</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="請款人">
                                    <span>{{payOrderForm.p_name}}</span>
                                </el-form-item>
                                <el-form-item label="申請單位">
                                    <span>{{payOrderForm.dept_name}}</span>
                                </el-form-item>
                                <el-form-item label="撥款狀態">
                                    <span v-if="payOrderForm.status=='F'&&payOrderForm.is_paied==0" style="color:red">未撥款</span>
                                    <span v-if="payOrderForm.status=='F'&&payOrderForm.is_paied==1" style="color:green">已撥款</span>
                                    <span v-if="payOrderForm.status!='F'" style="color:grey">--</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="請款說明">
                                <el-input type="textarea" :readonly="true"  :rows="4" v-model="payOrderForm.description"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" class="mgb10" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>請款內容</span>
                        </div>
                        <el-row v-for="item in payOrderForm.content_json" :key="item.id" >
                            <el-card shadow="always" style="margin:5px;">
                                <el-col :span="3">
                                    <span>{{item.type}}</span>
                                </el-col>
                                <el-col :span="5">
                                    <el-form ref="form" label-width="auto">
                                        <el-form-item label="日期">
                                            <el-date-picker :readonly="true" v-model="item.date" style="width:155px" type="date" align="right" unlink-panels value-format="yyyy-MM-dd"  />
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :span="11">
                                    <div>
                                        <el-col v-for="data in item.content" :key="data.id+item.id" :span="data.width" style="padding-left:10px;">
                                            <el-form ref="form" label-width="auto">
                                                <el-form-item :label="data.title">
                                                    <el-input type="text" :rows="4" :readonly="true" v-model="data.result" ></el-input>
                                                </el-form-item>
                                            </el-form>
                                        </el-col>
                                    </div>
                                </el-col>
                                <el-col :span="4" style="float:right;padding-left:10px;text-align:right;">
                                    <el-form ref="form" label-width="auto">
                                        <el-form-item label="金額">
                                            <span> {{stateFormat("","",item.amount)}}</span>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-card>
                        </el-row>
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",payOrderForm.total_amount)}} 元</h2></span>
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always"  class="mgb10" v-loading.lock="loading" >
                        <div slot="header" class="clearfix">
                            <span>付款方式</span>
                        </div>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="付款方式">
                                    <el-radio-group v-model="payOrderForm.payment_method" :disabled="true" size="mini">
                                        <el-radio label="transfer" border>匯款</el-radio>
                                        <el-radio label="cash" border>現金</el-radio>
                                        <el-radio label="check" border>支票</el-radio>
                                    </el-radio-group>
                                    <!-- <span>{{form.payment_method}}</span> -->
                                </el-form-item>
                                <el-form-item label="匯款選項">
                                    <el-radio-group v-model="payOrderForm.remittance_setting" :disabled="true" size="mini">
                                        <el-radio label="deduct" border>跨行扣匯費</el-radio>
                                        <el-radio label="no_deduct" border>跨行不扣匯費</el-radio>
                                    </el-radio-group>
                                    <!-- <span>{{form.payment_method}}</span> -->
                                </el-form-item>
                                <el-form-item label="付款日期">
                                    <el-date-picker v-model="payOrderForm.remittance_date" :readonly="true" type="date" align="right" unlink-panels value-format="yyyy-MM-dd" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="匯款銀行/分行">
                                    <el-input :readonly="true" type="text" style="width:200px;" v-model="payOrderForm.remittance_bank" ></el-input>
                                </el-form-item>
                                <el-form-item label="匯款帳號">
                                    <el-input :readonly="true" type="text" style="width:200px;" v-model="payOrderForm.remittance_account" ></el-input>
                                </el-form-item>
                                <el-form-item label="支付對象/戶名">
                                    <el-input :readonly="true" type="text" style="width:200px;" v-model="payOrderForm.account_name" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>歷程紀錄</span>
                        </div>
                        <div>
                            <el-table
                            :data="pay_order_history"
                            style="width: 100%">
                            <el-table-column
                                prop="recorded_at"
                                label="更動時間"
                                align="center"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="employee_name"
                                label="操作人員"
                                align="center"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="prev_status"
                                label="操作"
                                align="center"
                                width="200">
                                <template slot-scope="scope">
                                    {{scope.row.prev_status}} → {{scope.row.current_status}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="note"
                                label="備註">
                            </el-table-column>
                            </el-table>
                        </div>
                            
                    </el-card>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" size="large" @click="closeAllDialog">關閉</el-button>
                <el-button v-if="is_project_owner && payOrderForm.status=='P'" type="danger" size="large" style="width:150px;" @click="handleReject">退回</el-button>
                <el-button v-if="is_project_owner && payOrderForm.status=='P'" type="primary" size="large" style="width:150px;" @click="handlePass">審核</el-button>
            </div>
        </el-dialog>

        

        <el-dialog title="更新預估工時" :visible.sync="updatePreTimeVisible" width="500px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="preTimeForm" ref="form" :rules="rules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="原預估工時">
                            <span>{{preTimeForm.old_setting}} 小時</span>
                        </el-form-item>
                        <el-form-item label="新預估工時">
                            <el-input type="number" v-model.number="preTimeForm.new_setting" style="width:200px;"><template slot="append">小時</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmUpdatePreTime">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog title="專案支出" :visible.sync="costEditVisible" width="500px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="costForm" ref="costForm" :rules="costRules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="日期" prop="date">
                            <el-date-picker :readonly="costForm.recorded_type=='actual'" v-model="costForm.date" type="date" align="right" value-format="yyyy-MM-dd"/>
                        </el-form-item>
                        <el-form-item label="支出類型" prop="recorded_type">
                            <span v-if="costForm.recorded_type=='standard'">預估支出</span>
                            <span v-if="costForm.recorded_type=='actual'">實際支出</span>
                            <!-- <el-radio :disabled="costForm.recorded_type=='actual'" v-model="costForm.recorded_type" label="standard">預估支出</el-radio>
                            <el-radio :disabled="true" v-model="costForm.recorded_type" label="actual">實際支出</el-radio> -->
                        </el-form-item>
                        <el-form-item label="金額" prop="amount">
                            <el-input :readonly="costForm.recorded_type=='actual'" type="number" v-model.number="costForm.amount" style="width:200px"></el-input>
                        </el-form-item>
                        <el-form-item label="項目說明" prop="description">
                            <el-input :readonly="costForm.recorded_type=='actual'" type="textarea" :rows="3" v-model="costForm.description"></el-input>
                        </el-form-item>
                        <el-form-item v-if="costForm.related_id" label="關聯請購單" prop="">
                             <el-button type="text" @click="handleViewPayOrder({order_id:costForm.related_id})">{{costForm.related_id}}</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button v-if="costForm.recorded_type!='actual'" type="primary" @click="confirmCostDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog title="專案收益" :visible.sync="incomeEditVisible" width="500px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="incomeForm" ref="incomeForm" :rules="incomeRules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="日期" prop="date">
                            <el-date-picker v-model="incomeForm.date" type="date" align="right" value-format="yyyy-MM-dd"/>
                        </el-form-item>
                        <el-form-item label="支出類型" prop="recorded_type">
                            <el-radio v-model="incomeForm.recorded_type" label="standard">預估收入</el-radio>
                            <el-radio v-model="incomeForm.recorded_type" label="actual">實際收入</el-radio>
                        </el-form-item>
                        <el-form-item label="金額" prop="amount">
                            <el-input type="number" v-model.number="incomeForm.amount" style="width:200px"></el-input>
                        </el-form-item>
                        <el-form-item label="項目說明" prop="description">
                            <el-input type="textarea" :rows="3" v-model="incomeForm.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAllDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmIncomeDialog">{{$t('btn.confirm')}}</el-button>
            </div>
        </el-dialog>

        <el-dialog title="確認審核" :visible.sync="passVisible" width="300px" center :before-close="cancelPayOrderDialog">
            <div style="text-align:center;">
                <span>是否允許此請款單？</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPass">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog title="確認退回" :visible.sync="rejectVisible" width="300px" center :before-close="cancelPayOrderDialog">
            <div style="text-align:left;">
                <span>是否退回此請款單？</span>
            </div>
            <div style="margin-top:10px;text-align:center;">
                <el-input type="textarea" v-model="reject_note" :rows="3" placeholder="退回原因"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmReject">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog title="確認撥款" :visible.sync="payVisible" width="300px" center :before-close="cancelPayOrderDialog">
            <div style="text-align:center;">
                <span>請選擇撥款日期</span>
            </div>
            <div style="margin-top:10px;text-align:center;">
               <el-date-picker v-model="pay_date" type="date" align="right" value-format="yyyy-MM-dd" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPay">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { workItemService } from "@/_services";
import { payOrderService } from "@/_services";

export default {
    name: "work_item_manage",
    data(){
        return {
            collapseName:["base_info", "income", "cost"],

            username:localStorage.getItem("ms_username"),
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            item_id:this.$route.query.id,

            total_standard_cost:0,
            total_actual_cost:0,
            total_standard_income:0,
            total_actual_income:0,

            today:"",

            tbKey1:1,
            tbKey2:2,
            tbKey3:3,
            tbKey4:4,
            
            cost_sort_column:"date",
            cost_sort:"desc",

            income_sort_column:"date",
            income_sort:"desc",

            action_list:localStorage.getItem("ms_user_actions"),
            
            loading:false,
            deleteID:null,
            deleteView:false,

            viewPayOrderVisible:false,
            checkPayOrderVisible:false,
            
            incomeEditVisible:false,
            costEditVisible:false,

            updatePreTimeVisible:false,

            payVisible:false,
            passVisible:false,
            rejectVisible:false,
            reject_note:"",
            pay_date:"",
            pay_id:"",

            preTimeForm:{
                old_setting:"",
                new_setting:""
            },

            incomeForm:{
                type:"income",
                actionType:"create",
                recorded_type:null,
                date:"",
                description:"",
                amount:""
            },
            costForm:{
                type:"cost",
                actionType:"create",
                recorded_type:null,
                date:"",
                description:"",
                amount:""
            },

            payOrderForm:{},
            pay_order_history:[],

            filter:{
                costKeyWord:"",
                incomeKeyWord:""
            },
            
            tableData_standard_cost: [],
            tableData_actual_cost: [],
            tableData_standard_income: [],
            tableData_actual_income: [],

            tableData_pay_order: [],
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
            rules: {},
            costRules: {
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
            incomeRules: {
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
            }
               
        }
    },

    async created(){
        // await this.get_dept_employee();
        // await this.getOption();
        await this.getData();
        await this.getToday();
    },

    computed: {
        totalStandardIncome(){
            return this.total_standard_income - this.total_standard_cost
        },
        totalActualIncome(){
            return this.total_actual_income - this.total_actual_cost
        },
        is_project_owner(){
            if(this.form.owner_id == localStorage.getItem("ms_odoo_employee_id")){
                return true
            }else{
                return false
            }
        },
        is_accountant(){
            if(localStorage.getItem("ms_user_menus").includes("accountant")){
                return true
            }else{
                return false
            }
        }
    }, 
    
    methods: {
        cancelPayOrderDialog(){
            this.payVisible=false;
            this.passVisible=false;
            this.rejectVisible=false;
        },
        handlePass(){
            this.passVisible=true;
        },
        handlePay(row){
            this.pay_id = row.order_id;
            // this.pay_date = this.today;
            this.payVisible=true;
        },
        handleReject(){
            this.reject_note = "";
            this.rejectVisible=true;
        },
        handleRejectAc(row){
            this.payOrderForm.order_id = row.order_id;
            this.reject_note = "";
            this.rejectVisible=true;
        },
        confirmPass(){
            var param = {
                action:"review",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.payOrderForm.order_id,
                    status:"F"
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("Success") 
                    this.getCostData();
                    this.closeAllDialog();
                    this.cancelPayOrderDialog();
                }else{
                    this.$message.error(res.msg)
                }
                    
            })
        },
        confirmPay(){
            if (!this.pay_date){
                return this.$message.error("請選擇撥款日期")
            };
            var param = {
                action:"pay",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.pay_id,
                    pay_date:this.pay_date
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("Success") 
                    this.getCostData();
                    this.cancelPayOrderDialog();
                    this.closeAllDialog();
                }else{
                    this.$message.error(res.msg)
                }
                    
            })
        },
        confirmReject(){
            var param = {
                action:"review",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.payOrderForm.order_id,
                    status:"A",
                    review_note:this.reject_note
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("Success") 
                    this.getCostData();
                    this.closeAllDialog();
                    this.cancelPayOrderDialog();
                }else{
                    this.$message.error(res.msg)
                }
                    
            })
        },

        async getToday(){
            let time =new Date();
            this.today = time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },
        async handleViewPayOrder(row){
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
                    this.payOrderForm=res.data;
                    this.pay_order_history=res.histories;
                    this.viewPayOrderVisible=true;
                }else{
                    this.$message.error(res.msg)
                }
                    
            })
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
                    // console.log(res);
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
            this.viewPayOrderVisible=false;
            // this.checkPayOrderVisible=false;
            this.incomeEditVisible=false;
            this.costEditVisible=false;
            this.updatePreTimeVisible = false;

            this.deleteView=false;
            
            this.$refs.form.clearValidate();
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

        // Cost Record        
        handleCostCreate(){
            this.costForm={
                actionType:"create",
                type:"cost",
                username:this.username,
                work_item_id:this.item_id,
                recorded_type:"standard",
                date:this.today,
                description:"",
                amount:null
            }
            this.costEditVisible=true;
        },
        handleCostEdit(index, row){
            this.costForm=Object.assign({}, row);
            this.costForm.username = localStorage.getItem("ms_username");
            this.costForm.actionType="update";
            this.costEditVisible=true;
        },
        confirmCostDialog(){
            this.$refs.costForm.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.costForm);
                    var param = {
                        action:temp_form.actionType,
                        form:temp_form
                    };
                    this.confirmCostUpdate(param);
                }
            })
        },

        confirmCostUpdate(param){ 
            // console.log(param);
            workItemService.update_cost_record(param).then(res =>{ 
                console.log(res);
                if(res.code==1){ 
                    this.$message.success(this.$t(res.msg)); 
                    if(param.action=="create"){
                        this.getCostData();
                        this.closeAllDialog();
                    }else if(param.action=="update"){
                        this.getCostData();
                        this.closeAllDialog();
                    }else if(param.action=="delete"){
                        this.closeAllDialog();
                        // this.cancelDelete();
                        this.getCostData();
                    }else{
                        this.getCostData();
                    }
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
        },
        resetPayOrderForm(){
            this.payOrderForm={};
        },
        resetCostForm(){
            this.costForm={
               
            };
            
            this.$refs.form.clearValidate();
        },

        // Income Record
        handleIncomeCreate(){
            this.incomeForm={
                actionType:"create",
                type:"income",
                username:this.username,
                work_item_id:this.item_id,
                recorded_type:null,
                date:this.today,
                description:"",
                amount:null
            }
            this.incomeEditVisible=true;
        },
        handleIncomeEdit(index, row){
            this.incomeForm=Object.assign({}, row);
            this.incomeForm.username = localStorage.getItem("ms_username");
            this.incomeForm.actionType="update";
            this.incomeEditVisible=true;
        },

        confirmIncomeDialog(){
            this.$refs.incomeForm.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.incomeForm);
                    var param = {
                        action:temp_form.actionType,
                        form:temp_form
                    };
                    this.confirmCostUpdate(param);
                }
            })
        },
        
        resetIncomeForm(){
           
            this.incomeForm={
               
            };
            this.$refs.form.clearValidate();
        },

        //  Handle Delete

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
            this.confirmCostUpdate(param);
        },

        //  Other Data

        handleCostSortChange({prop, order}){
            this.income_sort_column = prop;
            this.income_sort = order;
            this.getCostData();
        },
        handleIncomeSortChange({prop, order}){
            this.income_sort_column = prop;
            this.income_sort = order;
            this.getCostData();
        },
        
        async getData(){
            this.loading=true;
            // console.log(this.$route.query);
            var param = {
                username:this.username,
                item_id:this.item_id
            }
            await workItemService.get_project_cost_info(param).then(res =>{ 
                // console.log(res);
                if(res.code){
                    this.form = res.data;
                    this.getCostData();
                }else{
                    this.$message.error(res.msg);
                }
            })
            this.loading=false;
        },

        async getCostData(){
            this.loading=true;
            await workItemService.get_project_cost_records({
                item_id:this.item_id,
                type:"income",
                sort:this.income_sort,
                sort_column:this.income_sort_column,
                key_word:this.filter.incomeKeyWord
            }).then(res =>{ 
                // console.log(res);
                if(res.success){
                    this.tableData_standard_income = res.data.standard;
                    this.total_standard_income = res.total.standard;

                    this.tableData_actual_income = res.data.actual;
                    this.total_actual_income = res.total.actual;

                }else{
                    this.$message.error(res.msg);
                }
            });
            await workItemService.get_project_cost_records({
                item_id:this.item_id,
                type:"cost",
                sort:this.cost_sort,
                sort_column:this.cost_sort_column,
                key_word:this.filter.costKeyWord
            }).then(res =>{ 
                // console.log(res);
                if(res.success){
                    this.tableData_standard_cost = res.data.standard;
                    this.total_standard_cost = res.total.standard;

                    this.tableData_actual_cost = res.data.actual;
                    this.total_actual_cost = res.total.actual;
                }else{
                    this.$message.error(res.msg);
                }
            });
            await payOrderService.get_project_pay_orders({
                filter:{item_id:this.item_id}
                
            }).then(res =>{ 
                // console.log(res);
                if(res.code > 0){
                    this.tableData_pay_order= res.data;
                     
                    // console.log(this.tableData_pay_order);
                }else{
                    this.$message.error(res.msg);
                }
            })
            this.loading=false;
        },
     
        search(){
            this.getCostData();
        },
        
        cancelSearch(){
            this.filter={
                
            };
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
