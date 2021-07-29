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
                <el-select size="large" class="mgr10 handle-input" v-model="filter.item_id" filterable clearable multiple collapse-tags
                :placeholder="$t('project.name')" @change="search">
                    <el-option v-for="item in option.projects" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                </el-select>
                <el-input v-model="filter.name" clearable size="large" class="mgr10 handle-input" :placeholder="$t('reimburse.information_key_word')" :disabled="loading" @change="search"/>
                <el-button size="large" type="info" class="mgr10" plain :disabled="loading" @click="cancelSearch">{{$t('btn.clean')}}</el-button>
                <el-checkbox v-model="filter.only_mine"  class="mgr10" @change="search">{{$t('reimburse.show_mine')}}</el-checkbox>
                <el-checkbox v-if="is_accountant" v-model="filter.only_accountant"  class="mgr10" @change="search">{{$t('reimburse.show_accountant')}}</el-checkbox>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" v-loading="loading"
            @sort-change="handleSortChange" :cell-style="getCellStyle" :key="tbKey" :span-method="objectSpanMethod">
                <el-table-column prop="order_id" :label="$t('reimburse.order_id')" width="160" sortable="custom" align="left" show-overflow-tooltip/>
                <el-table-column prop="item_name" :label="$t('reimburse.project_name')" min-width="150px"  width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="owner" :label="$t('reimburse.project_owner')"  width="140" align="center" show-overflow-tooltip/>
                <el-table-column prop="p_name" :label="$t('reimburse.applicant_name')" width="140" align="center" show-overflow-tooltip/>
                <el-table-column prop="description" :label="$t('reimburse.description')" min-width="150px"  width="auto" sortable="custom" show-overflow-tooltip/>
                <el-table-column prop="order_date" :label="$t('reimburse.order_date')" width="140" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="status_name" :label="$t('reimburse.status')" width="120" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='D'" style="color:grey">{{$t('reimburse.status_tag.D')}}</span>
                        <span v-if="scope.row.status=='P'" style="color:blue">{{$t('reimburse.status_tag.P')}}</span>
                        <span v-if="scope.row.status=='F'" style="color:green">{{$t('reimburse.status_tag.F')}}</span>
                        <span v-if="scope.row.status=='A'" style="color:red">{{$t('reimburse.status_tag.A')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payment_note" :label="$t('reimburse.payment_note')" width="110" align="left" :formatter="stateFormat" show-overflow-tooltip/>
                <el-table-column prop="is_paied" :label="$t('reimburse.reimburse_status')" width="110" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='F'&&scope.row.is_paied==1" style="color:green">{{$t('reimburse.allocate_tag.allocated')}}</span>
                        <span v-if="scope.row.status=='F'&&scope.row.is_paied==0" style="color:red">{{$t('reimburse.allocate_tag.waiting')}}</span>
                        <span v-if="scope.row.status!='F'" style="color:grey">--</span>
                    </template>
                </el-table-column>
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
        
        <el-dialog :title="$t('reimburse.edit_reimburse')" :visible.sync="updateView" width="1100px" :key="tbkey" :before-close="cancelDialog" top="8%" :close-on-press-escape="false" :close-on-click-modal="false" class="edit-Dialog">
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
                                    <!-- <el-button type="text" style="font-size:16px;width:300px;word-wrap:break-word;" @click="handleOpenProjectCost(form.item_id)">{{form.item_id}} - {{form.item_name}}</el-button> -->
                                    
                                    <span style="width:80%;font-size:16px;cursor: pointer;color:blue" @click="handleOpenProjectCost(form.item_id)">{{form.item_id}} - {{form.item_name}}</span>
                                    
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
                        <el-table :data="form.content_json" border height="300px" style="width: 100%">
                            <el-table-column type="index" label="項次" width="50" align="center" show-overflow-tooltip/>
                            <el-table-column prop="type" label="項目" width="110" align="center" show-overflow-tooltip/>
                            <el-table-column prop="date" label="日期" width="110" align="center" show-overflow-tooltip/>
                            <el-table-column prop="content" label="內容" width="auto" align="left" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-for="item in scope.row.content" :key="item.id"> [{{item.title}}]:{{item.result}} </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="amount" label="金額" width="120" align="right" :formatter="stateFormat"/>
                            <el-table-column prop="action" :label="$t('btn.action')" width="180" align="center" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleUpdateItem(scope.row,scope.$index)">{{$t('btn.edit')}}</el-button>
                                    <el-button v-if="!orderReadOnly" type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteItem(scope.$index)">{{$t('btn.delete')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <!-- <el-row v-for="(item,index) in form.content_json" :key="item.id" >
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
                                                    <el-input :type="data.type" :rows="3" autosize :readonly="orderReadOnly" v-model="data.result" :placeholder="'請輸入'+data.title" clearable @change="handleContentChange"></el-input>
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
                        </el-row> -->
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",handleCaculateTotalAmount)}} 元</h2></span>
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card shadow="always" class="mgb10" v-loading.lock="loading">
                        <div slot="header" class="clearfix">
                            <span>{{$t('reimburse.payment_setting')}}</span>
                             <el-button v-if="!orderReadOnly" type=success size=large icon="el-icon-plus" class="card-header-r-btn" @click="handleAddPaymentItem">{{$t('btn.new')}}</el-button>
                        </div>
                            <el-table :data="form.payment_item" border height="300px" style="width: 100%">
                                <el-table-column type="index" label="項次" width="50" align="center" show-overflow-tooltip/>
                                <el-table-column prop="remittance_date" label="預計付款日期" width="110" align="center" show-overflow-tooltip/>
                                <el-table-column prop="remittance_date" label="付款日期" width="110" align="center" show-overflow-tooltip/>
                                <el-table-column prop="payment_note" label="付款說明" width="100" show-overflow-tooltip/>
                                <el-table-column prop="payment_method" label="付款方式" width="100" align="center" >
                                    <template slot-scope="scope">
                                        <span>{{$t('reimburse.'+ scope.row.payment_method)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="account_name" label="支付對象" min-widht="80" width="auto"/>
                                <el-table-column prop="amount" label="金額" width="120" align="right" :formatter="stateFormat"/>
                                <el-table-column prop="action" :label="$t('btn.action')" width="200" align="center" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button v-if="is_accountant && form.status=='F' && scope.row.is_paied==0" type="success" size="mini" icon="el-icon-money" @click="handleSettingPaymentDate(scope.row,scope.index)">設定付款日期</el-button>
                                        <el-button v-if="!orderReadOnly" type="warning" size="mini" icon="el-icon-edit" @click="handleUpdatePayItem(scope.row,scope.$index)">{{$t('btn.edit')}}</el-button>
                                        <el-button v-if="!orderReadOnly" type="danger" size="mini" icon="el-icon-delete" @click="handleRemovePaymentItem(scope.$index)">{{$t('btn.delete')}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <!-- <el-row v-for="(item,index) in form.payment_item" :key="item.id">
                                <el-card shadow="always" class="mgb10" v-loading.lock="loading">
                                    <el-col :span="10">
                                        <el-form-item :label="$t('reimburse.payment_date')">
                                            <el-date-picker v-model="item.remittance_date" :readonly="orderReadOnly" type="date" align="right" :placeholder="$t('common_msg.optional')" unlink-panels value-format="yyyy-MM-dd" />
                                        </el-form-item>
                                        <el-form-item :label="$t('reimburse.amount')">
                                            <el-input :readonly="orderReadOnly" type="number" v-model.number="item.amount"  style="width:200px;" @keyup.native="prevent($event)" @mousewheel.native.prevent><template slot="append">元</template></el-input>
                                        </el-form-item>
                                        <el-form-item :label="$t('reimburse.payment_note')">
                                            <el-select
                                                v-model="item.payment_note"
                                                filterable
                                                allow-create
                                                default-first-option
                                                :disabled="orderReadOnly"
                                                :readonly="orderReadOnly"
                                                :placeholder="$t('common_msg.select')">
                                                <el-option
                                                v-for="item in option.payment_note"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item :label="$t('reimburse.reimburse_status')">
                                            <span v-if="form.status=='F'&&item.is_paied==1" style="color:green">{{$t('reimburse.allocate_tag.allocated')}}</span>
                                            <span v-if="form.status=='F'&&item.is_paied==0" style="color:red">{{$t('reimburse.allocate_tag.waiting')}}</span>
                                            <span v-if="form.status!='F'" style="color:grey">--</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item :label="$t('reimburse.payment_method')">
                                            <el-radio-group v-model="item.payment_method" :disabled="orderReadOnly" size="mini">
                                                <el-radio label="transfer" border>{{$t('reimburse.remit')}}</el-radio>
                                                <el-radio label="cash" border>{{$t('reimburse.cash')}}</el-radio>
                                                <el-radio label="check" border>{{$t('reimburse.check')}}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item :label="$t('reimburse.remit_options')">
                                            <el-radio-group v-model="item.remittance_setting" :disabled="item.payment_method!='transfer' || orderReadOnly" size="mini">
                                                <el-radio label="deduct" border>{{$t('reimburse.deduct')}}</el-radio>
                                                <el-radio label="no_deduct" border>{{$t('reimburse.no_deduct')}}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item :label="$t('reimburse.beneficiary')">
                                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="item.account_name" ></el-input>
                                            <el-button v-if="!orderReadOnly" class="el-icon-user" type="text" size="large" style="margin-left:10px;" @click="handlePartner(item.id)">{{$t('reimburse.partner_account')}}</el-button>
                                        </el-form-item>
                                        <el-form-item :label="$t('reimburse.beneficiary_bank')">
                                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="item.remittance_bank" ></el-input>
                                        </el-form-item>
                                        <el-form-item :label="$t('reimburse.swift_code')">
                                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="item.remittance_account" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-button v-if="!orderReadOnly" type="text" size="large" style="float:right;" @click="handleRemovePaymentItem(index)">{{$t('btn.delete')}}</el-button>
                                        <el-button v-if="is_accountant && form.status=='F' && item.is_paied==0" type="warning" size="large" icon="el-icon-money" @click="handlePay(item.id,item.remittance_date)">{{$t('btn.grant')}}</el-button>
                                    </el-col>
                                </el-card>
                            </el-row> -->
                        
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
                            height="300px"
                            style="width: 100%;">
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
                <el-button v-if="true"  size="large" @click="cancelDialog">{{$t('btn.close')}}</el-button>
                <el-button v-if="is_accountant && form.status=='F' && form.is_paied==0" type="danger" size="large" @click="handleRejectAc(form)">{{$t('btn.reject')}}</el-button>
                <el-button v-if="is_order_owner && (form.status=='A' || form.status=='P')" type="success" size="large" @click="handleRestore(form)">{{$t('btn.draft')}}</el-button>
                <el-button v-if="is_project_owner && form.status=='P'" type="danger" size="large" @click="handleReject">{{$t('btn.reject')}}</el-button>
                <el-button v-if="is_project_owner && form.status=='P'" type="primary" size="large" @click="handlePass">{{$t('btn.proccess')}}</el-button>
                <el-button v-if="orderReadOnly==false" type="danger" size="large" @click="handleDelete(form)">{{$t('btn.abandon')}}</el-button>
                <el-button v-if="is_order_owner && form.status=='F'" type="primary" size="largre" @click="handleDownload(form)">{{$t('btn.download')}}</el-button>
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

        <el-dialog :title="$t('cost.approval')" :visible.sync="passVisible" width="300px" center :before-close="cancelPayOrderDialog">
            <div style="text-align:center;">
                <span>{{$t('cost.confirm_approval')}}</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPass">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('cost.withdraw')" :visible.sync="rejectVisible" width="300px" center :before-close="cancelPayOrderDialog">
            <div style="text-align:left;">
                <span>{{$t('cost.confirm_withdraw')}}</span>
            </div>
            <div style="margin-top:10px;text-align:center;">
                <el-input type="textarea" v-model="reject_note" :rows="3" :placeholder="$t('cost.reject_reason')"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmReject">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('cost.appropriate')" :visible.sync="payVisible" width="300px" center :before-close="cancelPayOrderDialog">
            <div style="text-align:center;">
                <span>{{$t('cost.select_appropriate_date')}}</span>
            </div>
            <div style="margin-top:10px;text-align:center;">
               <el-date-picker v-model="pay_date" type="date" align="right" value-format="yyyy-MM-dd" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPay">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('reimburse.partner_account')" :visible.sync="partnerVisible" width="500px" center :before-close="cancelPartnerVisivle">
            <div style="text-align:center;">
                <el-select v-model="select_partner" filterable :placeholder="$t('reimburse.partner_account')" style="width:300px;">
                    <el-option
                    v-for="item in option.partner" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPartnerVisivle">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPartner">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog title="編輯請款內容" :visible.sync="updateItemVisible" width="500px" center :before-close="cancelUpdateItem">
            <div>
                 <el-form ref="form" label-width="80px">
                    <el-form-item label="類別">
                        <span>{{item_form.type}}</span>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker :readonly="orderReadOnly" v-model="item_form.date" style="width:155px" type="date" align="right" unlink-panels value-format="yyyy-MM-dd"  />
                    </el-form-item>
                    <el-form-item  v-for="data in item_form.content" :key="data.id+item_form.id" :label="data.title">
                        <el-input :type="data.type" :rows="3" autosize :readonly="orderReadOnly" v-model="data.result" :placeholder="'請輸入'+data.title" clearable @change="handleContentChange"></el-input>
                    </el-form-item>
                    

                    <el-form-item label="金額">
                        <el-input 
                        style="width:200px;"
                        :readonly="orderReadOnly" 
                        type="number"  
                        v-model.number="item_form.amount" 
                        @keyup.native="prevent($event)"
                        @mousewheel.native.prevent
                        @change="handleContentChange"
                        ><template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdateItem">{{$t('btn.cancel')}}</el-button>
                <el-button  v-if="!orderReadOnly" type="primary" @click="confirmUpdateItem">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog title="編輯支付設定" :visible.sync="updatePayItemVisible" width="1000px" center :before-close="cancelUpdatePayItem">
            <div>
                <el-row>
                <el-form ref="form" label-width="auto">
                    <el-col :span="10">
                        <el-form-item :label="$t('reimburse.payment_date')">
                            <el-date-picker v-model="pay_item_form.remittance_date" :readonly="orderReadOnly" type="date" align="right" :placeholder="$t('common_msg.optional')" unlink-panels value-format="yyyy-MM-dd" />
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.amount')">
                            <el-input :readonly="orderReadOnly" type="number" v-model.number="pay_item_form.amount"  style="width:200px;" @keyup.native="prevent($event)" @mousewheel.native.prevent><template slot="append">元</template></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.payment_note')">
                            <el-select
                                v-model="pay_item_form.payment_note"
                                filterable
                                allow-create
                                default-first-option
                                :disabled="orderReadOnly"
                                :readonly="orderReadOnly"
                                :placeholder="$t('common_msg.select')">
                                <el-option
                                v-for="note in option.payment_note"
                                :key="note.value"
                                :label="note.label"
                                :value="note.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.reimburse_status')">
                            <span v-if="form.status=='F'&&pay_item_form.is_paied==1" style="color:green">{{$t('reimburse.allocate_tag.allocated')}}</span>
                            <span v-if="form.status=='F'&&pay_item_form.is_paied==0" style="color:red">{{$t('reimburse.allocate_tag.waiting')}}</span>
                            <span v-if="form.status!='F'" style="color:grey">--</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item :label="$t('reimburse.payment_method')">
                            <el-radio-group v-model="pay_item_form.payment_method" :disabled="orderReadOnly" size="mini">
                                <el-radio label="transfer" border>{{$t('reimburse.remit')}}</el-radio>
                                <el-radio label="cash" border>{{$t('reimburse.cash')}}</el-radio>
                                <el-radio label="check" border>{{$t('reimburse.check')}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.remit_options')">
                            <el-radio-group v-model="pay_item_form.remittance_setting" :disabled="pay_item_form.payment_method!='transfer' || orderReadOnly" size="mini">
                                <el-radio label="deduct" border>{{$t('reimburse.deduct')}}</el-radio>
                                <el-radio label="no_deduct" border>{{$t('reimburse.no_deduct')}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.beneficiary')">
                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="pay_item_form.account_name" ></el-input>
                            <el-button v-if="!orderReadOnly" class="el-icon-user" type="text" size="large" style="margin-left:10px;" @click="handlePartner()">{{$t('reimburse.partner_account')}}</el-button>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.beneficiary_bank')">
                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="pay_item_form.remittance_bank" ></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.swift_code')">
                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="pay_item_form.remittance_account" ></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="3">
                        <el-button v-if="!orderReadOnly" type="text" size="large" style="float:right;" @click="handleRemovePaymentItem(index)">{{$t('btn.delete')}}</el-button>
                        <el-button v-if="is_accountant && form.status=='F' && item.is_paied==0" type="warning" size="large" icon="el-icon-money" @click="handlePay(item.id,item.remittance_date)">{{$t('btn.grant')}}</el-button>
                    </el-col> -->
                </el-form>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdatePayItem">{{$t('btn.cancel')}}</el-button>
                <el-button v-if="!orderReadOnly" type="primary" @click="confirmUpdatePayItem">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import { payOrderService } from "@/_services";
import { dayItemService } from "@/_services";
import { partnerService } from "@/_services";

export default {
    name: "pay_order",
    components: {
    },
    data(){
        return {
            tbkey:0,
            activeNames:"",
            itemKey:0,
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
            updateItemVisible: false,
            item_form:{
                type:"",
                amount:"",
                date:"",
                content:[]
            },
            item_index:null,

            updatePayItemVisible:false,
            pay_item_form:{},
            pay_item_index:null,

            restoreVisible:false,
            downloadVisible:false,
            deleteVisible:false,
            partnerVisible:false,

            payVisible:false,
            passVisible:false,
            rejectVisible:false,
            reject_note:"",
            pay_date:"",
            pay_id:"",

            select_partner:0,
            payment_row_id:"",

            restore_id:"",
            download_id:"",
            delete_id:"",
           
            filter:{
                name:"",
                status:[],
                only_mine:false,
                only_accountant:false,
                item_id:[],
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
                payment_item:[],
                content_json:[]
            },

            pay_order_history:[],

            option:{
                projects:[],
                partner:[],
                payment_note:[
                    {label:"一般支付",value:"一般支付"},
                    {label:"訂金",value:"訂金"},
                    {label:"頭期款",value:"頭期款"},
                    {label:"尾款",value:"尾款"},
                ],
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
        },
        is_order_owner(){
            return this.form.pid == this.odoo_employee_id;
        },
        is_accountant(){
            if(localStorage.getItem("ms_user_menus").includes("accountant")){
                return true
            }else{
                return false
            }
        },
        is_project_owner(){
            if(this.form.project_owner_id == localStorage.getItem("ms_odoo_employee_id")){
                return true
            }else{
                return false
            }
        },
        computePayOrder(){
            var set_amount = 0;
            var total_amount = this.handleCaculateTotalAmount;
            this.form.payment_item.forEach(element => {
                set_amount += element.amount;
            });
            if(total_amount - set_amount > 0){
                return total_amount - set_amount
            }else{
                return 0
            };
        },

    }, 
    
    methods: {
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if(["order_id", "item_name","owner","p_name","description","order_date","status_name","total_amount","action"].includes(column.property)){
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

        handleOpenProjectCost(item_id){
            let routeData = this.$router.resolve({path: "/work_item_cost_edit", query: {id: item_id}});
            window.open(routeData.href, '_blank');
        },
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
        cancelPartnerVisivle(){
            this.partnerVisible = false;
        },
        confirmPartner(){
            // var item_index = this.form.payment_item.findIndex((element) => element.id == this.payment_row_id);
            // console.log(this.select_partner);
            var partner_index = this.option.partner.findIndex((element) => element.id == this.select_partner);
            var select_partner_data = this.option.partner[partner_index]
            // console.log(partner_index);
            // console.log(select_partner_data);
            this.pay_item_form.remittance_account = select_partner_data.account;
            this.pay_item_form.remittance_bank = select_partner_data.bank;
            this.pay_item_form.account_name = select_partner_data.account_name;
            this.partnerVisible = false;
        },
        handlePartner(row_id){
            this.select_partner = "";
            // this.payment_row_id = row_id;
            this.partnerVisible = true;
        },
        cancelQuestDialog(){
            this.restoreVisible = false;
            this.downloadVisible = false;
            this.deleteVisible = false;
        },

        cancelPayOrderDialog(){
            this.payVisible=false;
            this.passVisible=false;
            this.rejectVisible=false;
        },
        handlePass(){
            this.passVisible=true;
        },
        handlePay(id,date=""){
            this.pay_id = id;
            this.pay_date = date;
            this.payVisible=true;
        },
        handleReject(){
            this.reject_note = "";
            this.rejectVisible=true;
        },
        handleRejectAc(row){
            // this.form.order_id = row.order_id;
            this.reject_note = "";
            this.rejectVisible=true;
        },
        confirmPass(){
            var param = {
                action:"review",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.form.order_id,
                    status:"F"
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("success"); 
                    this.getData();
                    this.handleEdit(0, {order_id:this.form.order_id});
                    this.cancelPayOrderDialog();
                }else{
                    this.$message.error(res.msg)
                }
                    
            })
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
                console.log(res);
                if(res.code>0){
                    this.$message.success("success"); 
                    this.getData();
                    this.handleEdit(0, {order_id:this.form.order_id});
                    this.cancelPayOrderDialog();
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
                    order_id: this.form.order_id,
                    status:"A",
                    review_note:this.reject_note
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                console.log(res);
                if(res.code>0){
                    this.$message.success("success"); 
                    this.getData();
                    this.handleEdit(0, {order_id:this.form.order_id});
                    this.cancelPayOrderDialog();
                }else{
                    this.$message.error(res.msg)
                }
                    
            })
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
                    this.cancelDialog();
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
                    this.handleEdit(0, {order_id:this.form.order_id});
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

        handleUpdateItem(row,index){
            this.item_form = JSON.parse(JSON.stringify(row));
            this.item_index = index;
            console.log(index);
            this.updateItemVisible = true;
        },
        cancelUpdateItem(){
            this.updateItemVisible = false;
        },
        confirmUpdateItem(){
            if(this.item_index<0){
                this.form.content_json.push(this.item_form);
            }else{
                this.form.content_json.splice(this.item_index, 1, this.item_form);
            };
            this.updateItemVisible = false;
        },

        handleUpdatePayItem(row,index){
            this.pay_item_form = JSON.parse(JSON.stringify(row));
            this.pay_item_index = index;
            this.updatePayItemVisible = true;
        },
        cancelUpdatePayItem(){
            this.updatePayItemVisible = false;
        },
        confirmUpdatePayItem(){
            if(this.item_index<0){
                this.form.payment_item.push(this.pay_item_form);
            }else{
                this.form.payment_item.splice(this.pay_item_index, 1, this.pay_item_form);
            };
            this.form.payment_item = this.form.payment_item.sort((a, b) => {return a.remittance_date < b.remittance_date});
            console.log(this.form.payment_item.sort((a, b) => {return a.remittance_date > b.remittance_date}));
            this.updatePayItemVisible = false;
        },

        async handleAddPaymentItem(){
            if (this.select_partner){
                var partner_index = this.option.partner.findIndex((element) => element.id == this.select_partner);
                var select_partner_data = this.option.partner[partner_index]
            }else{
                var select_partner_data = {
                    "account_name":"",
                    "bank":"",
                    "account":""
                }
            };
            
            if(this.form.payment_item.length<5){
                var temp_content = {
                    pay_order_id:this.form.order_id,
                    amount:this.computePayOrder,
                    payment_note:"一般支付",
                    payment_method:"transfer",
                    remittance_setting:"deduct",
                    remittance_date:null,
                    remittance_bank:select_partner_data.bank,
                    remittance_account:select_partner_data.account,
                    account_name:select_partner_data.account_name,
                    is_paied:0
                };
                var new_uuid = this.create_UUID(8);
                temp_content.id = new_uuid;
                await this.handleUpdatePayItem(temp_content, -1);      
            }else{
                return this.$message.error("僅限三筆付款資訊")
            }
             
        },
        cancelAddItem(){
            this.addItemVisible = false;
        },
        async confirmAddItem(content){
            var temp_content = JSON.parse(JSON.stringify(content));
            var new_uuid = this.create_UUID(8);
            temp_content.id = new_uuid
            this.handleUpdateItem(temp_content,-1);
            this.addItemVisible = false;
        },
        handleDeleteItem(index){
            console.log(index);
            this.form.content_json.splice(index,1);
        },
        handleRemovePaymentItem(index){
            console.log(index);
            this.form.payment_item.splice(index,1);
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
            this.tbkey++;
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
                    this.handleEdit(0, {order_id:this.form.order_id});
                            
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
            // console.log("GOGOGO");
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
                            this.handleEdit(0, {order_id:this.form.order_id});
                            this.$message.success("Success"); 
                            // this.cancelDialog();
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
            // if(this.form.payment_method=="transfer"){
            //     console.log("transfer");
            //     if(this.form.remittance_setting==""||this.form.remittance_setting==null){
            //         return this.$message.error("未設定匯款方式");
            //     };
            //     // if(this.form.remittance_date==""||this.form.remittance_date==null){
            //     //     return this.$message.error("未設定預計付款日期");
            //     // };
            //     if(this.form.remittance_bank==""||this.form.remittance_bank==null){
            //         return this.$message.error("未設定匯款銀行/分行");
            //     };
            //     if(this.form.remittance_account==""||this.form.remittance_account==null){
            //         return this.$message.error("未設定匯款帳號");
            //     };
            //     if(this.form.account_name==""||this.form.account_name==null){
            //         return this.$message.error("未設定支付對象/戶名");
            //     };
            // };
            
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
                    status:this.filter.status,
                    only_mine:this.filter.only_mine,
                    only_accountant:this.filter.only_accountant,
                    item_id:this.filter.item_id,
                    username:this.username
                }
            }
            await payOrderService.get_pay_orders(param).then(res =>{ 
                this.tableData=res.data;
                this.totalRow=res.total;
                this.getSpanArr(this.tableData);
            })
            this.loading=false;
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["work_item_now"]}).then(res =>{ 
                this.option.projects=res.work_item_now;
            });
            await partnerService.get_supplier_account({action:"table",filter:{start_row:0, page_size:1000, key_word:"" }}).then(res =>{
                console.log(res);
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
        resultChange(result){
            console.log(data);
            console.log(result);
        }
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