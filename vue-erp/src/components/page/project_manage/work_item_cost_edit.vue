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
                    <el-collapse v-model="collapseName" >
                        <el-col :span="24" style="padding-right:10px;padding-left:10px;">
                            <el-collapse-item name="base_info" :title="$t('project.project_info')" >
                                <el-row :gutter="20" style="padding-right:10px;padding-left:10px;">
                                    <el-col :span="12" >
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
                                    <el-col :span="10">
                                        <el-form-item :label="$t('project.extimated_work_hour')">
                                            <span>{{form.pre_work_time}} {{$t('project.hours')}}</span>
                                            <el-button v-if="is_project_owner" type="success" icon="el-icon-time" style="margin-left:20px;" @click="handleUpdatePreTime"> {{$t('project.update')}}</el-button>
                                            <!-- <span>{{form.pre_work_time}} 小時</span> -->
                                        </el-form-item>
                                        <el-form-item :label="$t('project.total_work_hour')">
                                            <span>{{form.total_work_hours}} {{$t('project.hours')}}</span>
                                            <el-button v-if="is_project_owner" type="info" icon="el-icon-view" style="margin-left:20px;" @click="handleViewWorkItem"> {{$t('btn.view')}}</el-button>
                                        </el-form-item>
                                        <el-form-item :label="$t('cost.work_hour_percent')">
                                            <span v-if="form.work_progress>=80" style="color:red;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress>=50&&form.work_progress<80"  style="color:orange;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress<50" style="color:green;">{{form.work_progress}} %</span>
                                            <span v-if="form.work_progress=='-'" style="color:gray;">{{form.work_progress}}</span>
                                        </el-form-item>
                                        <el-form-item :label="$t('cost.predict_net_income')">
                                            <el-tooltip effect="light" :content="$t('cost.predict_net_income_content')" placement="bottom">
                                                <span>{{stateFormat("","",Math.round(totalStandardIncome * 100) / 100)}} 元</span>
                                            </el-tooltip>
                                        </el-form-item>
                                        <el-form-item :label="$t('cost.actual_net_income')">
                                            <el-tooltip effect="light" :content="$t('cost.actual_net_income_content')" placement="bottom">
                                                <span>{{stateFormat("","",Math.round(totalActualIncome * 100) / 100)}} 元</span>
                                            </el-tooltip>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="payment" :title="$t('cost.reimbursement')">
                                <el-row  style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <el-table :data="tableData_pay_order" height="500" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
                                        @sort-change="handlePaySortChange" :cell-style="getCellStyle" :key="tbKey1" :span-method="objectSpanMethod">
                                            <el-table-column prop="order_id" :label="$t('reimburse.order_id')" width="200" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="status" :label="$t('reimburse.status')" width="150" align="center" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.status=='P'" style="color:blue">{{$t('reimburse.status_tag.P')}}</span>
                                                    <span v-if="scope.row.status=='F'" style="color:green">{{$t('reimburse.status_tag.F')}}</span>
                                                    <span v-if="scope.row.status=='A'" style="color:red">{{$t('reimburse.status_tag.A')}}</span>
                                                    <span v-if="scope.row.status=='C'" style="color:green">{{$t('reimburse.status_tag.C')}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="order_date" :label="$t('reimburse.order_date')" width="150" align="center" show-overflow-tooltip/>
                                            <el-table-column prop="description" :label="$t('reimburse.description')" min-width="120px" width="auto" show-overflow-tooltip/>
                                            <el-table-column prop="payment_note" :label="$t('reimburse.payment_note')" width="150px" show-overflow-tooltip/>
                                            <el-table-column prop="pre_payment_date" :label="$t('reimburse.pre_payment_date')" width="120px" align="center" />
                                            <el-table-column prop="act_payment_date" :label="$t('reimburse.act_payment_date')" width="120px" align="center" />
                                            <el-table-column prop="amount" :label="$t('reimburse.amount')" width="150" align="right" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column prop="total_amount" :label="$t('reimburse.total_amount')" width="150" align="right" :formatter="stateFormat" show-overflow-tooltip></el-table-column>
                                            <el-table-column prop="action" :label="$t('btn.action')" width="110" align="center" fixed="right">
                                                <template slot-scope="scope">
                                                    <el-button v-if="scope.row.type=='pay_order'" type="warning" size="mini" icon="el-icon-document" @click="handleViewPayOrder(scope.row)">{{$t('btn.edit')}}</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="income" :title="$t('cost.project_income')">
                                <el-row  style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <span style="float:right;padding:10px;">
                                            <el-input v-model="filter.incomeKeyWord" class="mgr10 handle-input" :placeholder="$t('btn.key_word')" @change="search" />
                                            <el-button  v-if="is_project_owner" type="success" size="large" icon="el-icon-plus"   @click="handleIncomeCreate">{{$t('btn.new')}}</el-button>
                                        </span>
                                    </el-col>
                                   
                                    <el-col :span="24">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>{{$t('cost.predict_income')}}</span>
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
                                                    <span><h2>{{$t('cost.predict_income_total')}} {{stateFormat("","",total_standard_income)}} 元</h2></span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </el-col>
                                    <el-col :span="24" style="margin-top:10px;">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>{{$t('cost.actual_income')}}</span>
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
                                                    <span><h2>{{$t('cost.actual_income_total')}} {{stateFormat("","",total_actual_income)}} 元</h2></span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="cost" :title="$t('cost.project_expense')" style="margin-bottom:50px;">
                                <el-row style="padding-bottom:20px;">
                                    <el-col :span="24">
                                        <span style="float:right;padding:10px;">
                                            <el-input v-model="filter.costKeyWord" class="mgr10 handle-input" :placeholder="$t('btn.key_word')" @change="search" />
                                            <el-button v-if="is_project_owner" type="success" size="large" icon="el-icon-plus" @click="handleCostCreate">{{$t('btn.new')}}</el-button>
                                        </span>
                                    </el-col>
                                    <el-col :span="24">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>{{$t('cost.predict_expense')}}</span>
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
                                                    <span><h2>{{$t('cost.predict_expense_total')}} {{stateFormat("","",Math.round(total_standard_cost * 100) / 100)}} 元</h2></span>
                                                </div>
                                            </div>
                                        </el-card>
                                    </el-col>
                                    <el-col :span="24"  style="margin-top:10px;">
                                        <el-card class="box-card">
                                            <div slot="header" class="clearfix">
                                                <span>{{$t('cost.actual_expense_total')}}</span>
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
                                                    <span><h2>{{$t('cost.actual_expense_total')}} {{stateFormat("","",Math.round(total_actual_cost * 100) / 100)}} 元</h2></span>
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
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('cost.confirm_delete')}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="$t('reimburse.edit_reimburse')" v-if="viewPayOrderVisible" :visible.sync="viewPayOrderVisible" width="1100px" :key="tbKey" :before-close="closeAllDialog" top="8%" 
        :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog" >
            <paymentOrderItem v-if="viewPayOrderVisible" :order_id="current_order_id" @close="closeAllDialog"></paymentOrderItem>
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

        <el-dialog :title="$t('cost.project_expense')" :visible.sync="costEditVisible" width="500px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="costForm" ref="costForm" :rules="costRules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('reimburse.date')" prop="date">
                            <el-date-picker :readonly="costForm.recorded_type=='actual'" v-model="costForm.date" type="date" align="right" value-format="yyyy-MM-dd"/>
                        </el-form-item>
                        <el-form-item :label="$t('cost.expense_type')" prop="recorded_type">
                            <span v-if="costForm.recorded_type=='standard'">{{$t('cost.predict_expense')}}</span>
                            <span v-if="costForm.recorded_type=='actual'">{{$t('cost.actual_expense')}}</span>
                            <!-- <el-radio :disabled="costForm.recorded_type=='actual'" v-model="costForm.recorded_type" label="standard">預估支出</el-radio>
                            <el-radio :disabled="true" v-model="costForm.recorded_type" label="actual">實際支出</el-radio> -->
                        </el-form-item>
                        <el-form-item :label="$t('cost.amount')" prop="amount">
                            <el-input :readonly="costForm.recorded_type=='actual'" type="number" v-model.number="costForm.amount" style="width:200px"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('cost.description')" prop="description">
                            <el-input :readonly="costForm.recorded_type=='actual'" type="textarea" autosize v-model="costForm.description"></el-input>
                        </el-form-item>
                        <el-form-item v-if="costForm.related_id" :label="$t('cost.related')" prop="">
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

        <el-dialog :title="$t('cost.project_income')" :visible.sync="incomeEditVisible" width="500px" :before-close="closeAllDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
            <el-form :model="incomeForm" ref="incomeForm" :rules="incomeRules" label-position="right" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('reimburse.date')" prop="date">
                            <el-date-picker v-model="incomeForm.date" type="date" align="right" value-format="yyyy-MM-dd"/>
                        </el-form-item>
                        <el-form-item :label="$t('cost.expense_type')" prop="recorded_type">
                            <el-radio v-model="incomeForm.recorded_type" label="standard">{{$t('cost.predict_income')}}</el-radio>
                            <el-radio v-model="incomeForm.recorded_type" label="actual">{{$t('cost.actual_income')}}</el-radio>
                        </el-form-item>
                        <el-form-item :label="$t('cost.amount')" prop="amount">
                            <el-input type="number" v-model.number="incomeForm.amount" style="width:200px"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('cost.description')" prop="description">
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
import { payOrderService } from "@/_services";
import { dayItemService } from "@/_services";
import paymentOrderItem from "./payment_order_item.vue";
export default {
    name: "work_item_manage",
    components: {
        paymentOrderItem
    },
    data(){
        return {
            orderReadOnly:true,
            collapseName:["base_info","payment", "income", "cost"],

            username:accountService.get_user_info("ms_username"),
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            item_id:this.$route.query.id,

            total_standard_cost:0,
            total_actual_cost:0,
            total_standard_income:0,
            total_actual_income:0,
            today:"",
            tbKey:0,
            tbKey1:1,
            tbKey2:2,
            tbKey3:3,
            tbKey4:4,

            current_order_id:null,

            cost_sort_column:"date",
            cost_sort:"desc",
            income_sort_column:"date",
            income_sort:"desc",
            pay_sort_column:"order_date",
            pay_sort:"desc",

            loading:false,
            deleteID:null,
            deleteView:false,
            viewPayOrderVisible:false,
            incomeEditVisible:false,
            costEditVisible:false,
            updatePreTimeVisible:false,
            workItemView:false,

            updateItemVisible: false,
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

            payOrderForm:{
                payment_item:[]
            },

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
            return Math.round((this.total_standard_income - this.total_standard_cost) * 10) / 10;
        },

        totalActualIncome(){
            return Math.round((this.total_actual_income - this.total_actual_cost) * 10) / 10;
        },

        is_project_owner(){
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

        confirmPay(){
            if (this.pay_date=="" || this.pay_date==null){
                return this.$message.error("請選擇撥款日期")
            };
            var param = {
                action:"pay",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_item_id: this.pay_id,
                    pay_date:this.pay_date
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                if(res.code>0){
                    this.$message.success("Success") 
                    this.getCostData();
                    this.closeAllDialog();
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
            this.current_order_id = row.order_id;
            this.viewPayOrderVisible=true;
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
            this.viewPayOrderVisible=false;
            this.incomeEditVisible=false;
            this.costEditVisible=false;
            this.updatePreTimeVisible = false;
            this.deleteView=false;
            this.current_order_id = null;
            
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
            this.costForm.username = accountService.get_user_info("ms_username");
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
            workItemService.update_cost_record(param).then(res =>{ 
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
            this.incomeForm.username = accountService.get_user_info("ms_username");
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

        handleCostSortChange({prop, order}){
            this.cost_sort_column = prop;
            this.cost_sort = order;
            this.getCostData();
        },

        handleIncomeSortChange({prop, order}){
            this.income_sort_column = prop;
            this.income_sort = order;
            this.getCostData();
        },

        handlePaySortChange({prop, order}){
            this.pay_sort_column = prop;
            this.pay_sort = order;
            this.getCostData();
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
                filter:{item_id:this.item_id},
                sort:this.cost_sort,
                sort_column:this.cost_sort_column                
            }).then(res =>{ 
                if(res.code > 0){
                    this.tableData_pay_order= res.data;
                    this.getSpanArr(this.tableData_pay_order);
                }else{
                    this.$message.error(res.msg);
                }
            })
            this.loading=false;
        },
     
        search(){
            this.getCostData();
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
