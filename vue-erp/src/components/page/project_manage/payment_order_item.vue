<template>
    <div class="table">
        <div v-loading.lock="loading">
            <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">
                <el-row class="mgb10" >
                    <div style="float:right;">
                        <el-button v-if="true"  size="large" @click="closeDialog">{{$t('btn.close')}}</el-button>
                        <el-button v-if="is_accountant && form.status=='F' && form.is_paied==0" type="danger" size="large" @click="handleRejectAc(form)">{{$t('btn.reject')}}</el-button>
                        <el-button v-if="is_accountant && form.status=='F' && form.is_paied==0" type="success" size="large" @click="handleConfirmPayment(form)">{{$t("reimburse.confirm_payment_order")}}</el-button>
                        <el-button v-if="is_order_owner && (form.status=='A' || form.status=='P')" type="success" size="large" @click="handleRestore(form)">{{$t('btn.draft')}}</el-button>
                        <approvalReviewButton v-if="is_current_approver && form.status=='P'" :current_stage_id="form.current_stage_id" class="flr mgl5" @beforeClose="closeDialog" @change="getData"></approvalReviewButton>
                        <approvalRejectButton v-if="is_current_approver && form.status=='P'" :current_stage_id="form.current_stage_id" class="flr mgl5" @beforeClose="closeDialog" @change="getData"></approvalRejectButton>
                        <el-button v-if="orderReadOnly==false" type="danger" size="large" @click="handleDelete(form)">{{$t('btn.abandon')}}</el-button>
                        <el-button v-if="is_order_owner && form.status=='F'" type="primary" size="largre" @click="confirmDownload(form)">{{$t('btn.download')}}</el-button>
                        <el-button v-if="orderReadOnly==false" size="large" type="primary" @click="confirmDialog">{{$t('btn.save')}}</el-button>
                        <el-button v-if="orderReadOnly==false" size="large" type="success" style="width:120px;" @click="handleHandIn">{{$t('reimburse.submit')}}</el-button>
                    </div>
                </el-row>
                <el-row :gutter="10" style="min-height:400px;">
                    <el-col :span="18">
                        <el-card shadow="always" class="mgb10" >
                            <div slot="header" class="clearfix">
                                <span>{{$t('reimburse.basic_info')}}</span>
                            </div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item :label="$t('reimburse.order_id')" >
                                        <span>{{form.display_order_id}}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.project_name')">
                                        <span style="width:80%;font-size:16px;cursor: pointer;color:blue" @click="handleOpenProjectCost(form.item_id)">{{form.item_id}} - {{form.item_name}}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.order_date')">
                                        <span>{{form.order_date}}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.status')">
                                        <span v-if="form.status=='D'" style="color:grey">{{$t('reimburse.status_tag.D')}}</span>
                                        <span v-if="form.status=='P'" style="color:blue">{{$t('reimburse.status_tag.P')}}</span>
                                        <span v-if="form.status=='F'" style="color:green">{{$t('reimburse.status_tag.F')}}</span>
                                        <span v-if="form.status=='A'" style="color:red">{{$t('reimburse.status_tag.A')}}</span>
                                        <span v-if="form.status=='C'" style="color:green">{{$t('reimburse.status_tag.C')}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="$t('reimburse.filler')">
                                        <span>{{form.p_name}}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.applicant')">
                                        <span>{{form.applicant_name}}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.applicant_dept')">
                                        <span>{{form.dept_name}}</span>
                                    </el-form-item>
                                    <el-form-item :label="$t('reimburse.total_amount')">
                                        <span>{{stateFormat(0,0, handleCaculateTotalAmount)}} 元</span>
                                    </el-form-item>
                                    <el-form-item v-if="form.status =='F' || form.status =='C'" :label="$t('reimburse.paied_amount')">
                                        <span>{{stateFormat(0,0,caculatePaiedTotalAmount)}} 元</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-form-item :label="$t('reimburse.description')">
                                    <el-input :readonly="orderReadOnly" type="textarea" :rows="4" v-model="form.description" ></el-input>
                                </el-form-item>
                            </el-row>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="always" style="height:100%" class="mgb10">
                            <div slot="header" class="clearfix">
                                <span>{{$t("work_flow.approval_flow")}}</span>
                            </div>
                            <div style="height:308px;">
                                <el-scrollbar style="height:100%">
                                    <workFlowStatus type="payment" :related_id="order_id" :load_key="tbkey"></workFlowStatus>
                                </el-scrollbar>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <!-- 請款內容 -->
                <el-row>
                    <el-card shadow="always" class="mgb10" style="padding-bottom:20px;">
                        <div slot="header" class="clearfix">
                            <span>{{$t('reimburse.content')}}</span>
                            <el-button v-if="!orderReadOnly" type=success size=large icon="el-icon-plus" class="card-header-r-btn" @click="handleAddItem">{{$t('btn.new')}}</el-button>
                        </div>
                        <el-table :data="form.content_json" border height="300px" style="width: 100%">
                            <el-table-column type="index" :label="$t('reimburse.id')" width="50" align="center" show-overflow-tooltip/>
                            <el-table-column prop="type" :label="$t('reimburse.item_name')" width="110" align="left" show-overflow-tooltip/>
                            <el-table-column prop="date" :label="$t('reimburse.date')" width="110" align="center" show-overflow-tooltip/>
                            <el-table-column prop="content" :label="$t('reimburse.item_content')" width="auto" align="left" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-for="item in scope.row.content" :key="item.id"> [{{item.title}}]:{{item.result}} </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="amount" :label="$t('reimburse.amount')" width="120" align="right" :formatter="stateFormat"/>
                            <el-table-column prop="action" :label="$t('btn.action')" width="200" align="center" fixed="right">
                                <template slot-scope="scope">
                                    <el-button v-if="orderReadOnly" type="info" size="mini" icon="el-icon-document" @click="handleUpdateItem(scope.row,scope.$index)">{{$t('btn.view')}}</el-button>
                                    <el-button v-if="!orderReadOnly" type="warning" size="mini" icon="el-icon-edit" @click="handleUpdateItem(scope.row,scope.$index)">{{$t('btn.edit')}}</el-button>
                                    <el-button v-if="!orderReadOnly" type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteItem(scope.$index)">{{$t('btn.delete')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",handleCaculateTotalAmount)}} 元</h2></span>
                        </div>
                    </el-card>
                </el-row>

                <!-- 支付設定 -->
                <el-row >
                    <el-card shadow="always" class="mgb10" style="padding-bottom:20px;">
                        <div slot="header" class="clearfix">
                            <span>{{$t('reimburse.payment_setting')}}</span>
                             <el-button v-if="!orderReadOnly" type=success size=large icon="el-icon-plus" class="card-header-r-btn" @click="handleAddPaymentItem">{{$t('btn.new')}}</el-button>
                        </div>
                        <el-table :data="form.payment_item" border height="300px" style="width: 100%">
                            <el-table-column type="index" :label="$t('reimburse.id')" width="50" align="center" show-overflow-tooltip/>
                            <el-table-column prop="pre_payment_date" :label="$t('reimburse.pre_payment_date')" width="110" align="center" show-overflow-tooltip/>
                            <el-table-column prop="act_payment_date" :label="$t('reimburse.act_payment_date')" width="110" align="center" show-overflow-tooltip/>
                            <el-table-column prop="payment_note" :label="$t('reimburse.payment_note')" width="100" show-overflow-tooltip/>
                            <el-table-column prop="payment_method" :label="$t('reimburse.payment_method')" width="100" align="center" >
                                <template slot-scope="scope">
                                    <span>{{$t('reimburse.'+ scope.row.payment_method)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="account_name" :label="$t('reimburse.beneficiary')" min-widht="80" width="auto"/>
                            <el-table-column prop="amount" :label="$t('reimburse.amount')" width="120" align="right" :formatter="stateFormat"/>
                            <el-table-column prop="action" :label="$t('btn.action')" width="210" align="center" fixed="right">
                                <template slot-scope="scope">
                                    <el-button v-if="is_accountant && form.status=='F' && form.is_paied==0" type="success" size="mini" @click="handleSettingPaymentDate(scope.row)">{{$t('reimburse.update_payment_date')}}</el-button>
                                    <el-button v-if="orderReadOnly" type="info" size="mini" icon="el-icon-document" @click="handleUpdatePayItem(scope.row,scope.$index)">{{$t('btn.view')}}</el-button>
                                    <el-button v-if="!orderReadOnly" type="warning" size="mini" icon="el-icon-edit" @click="handleUpdatePayItem(scope.row,scope.$index)">{{$t('btn.edit')}}</el-button>
                                    <el-button v-if="!orderReadOnly" type="danger" size="mini" icon="el-icon-delete" @click="handleRemovePaymentItem(scope.$index)">{{$t('btn.delete')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="float:right;color:red;">
                            <span><h2>Total {{stateFormat("","",handleCaculatePayItemTotalAmount)}} 元</h2></span>
                        </div>
                    </el-card>
                </el-row>

                <!-- 簽核狀態 -->
                <el-row :gutter="10">
                    <!-- <el-col :span="9">
                        <el-card shadow="always">
                            <div slot="header" class="clearfix">
                                <span>{{$t("work_flow.approval_flow")}}</span>
                            </div>
                            <div style="height:400px;">
                                <el-scrollbar style="height:100%">
                                    <workFlowStatus type="payment" :related_id="order_id" :load_key="tbkey"></workFlowStatus>
                                </el-scrollbar>
                            </div>
                        </el-card>
                    </el-col> -->
                    <el-col :span="24">
                        <el-card shadow="always">
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
                    </el-col>
                    
                </el-row>
            </el-form>
            <div class="mgt10" style="height:50px;" >
                <div class="flr">
                <el-button v-if="true"  size="large" @click="closeDialog">{{$t('btn.close')}}</el-button>
                <el-button v-if="is_accountant && form.status=='F' && form.is_paied==0" type="danger" size="large" @click="handleRejectAc(form)">{{$t('btn.reject')}}</el-button>
                <el-button v-if="is_accountant && form.status=='F' && form.is_paied==0" type="success" size="large" @click="handleConfirmPayment(form)">{{$t("reimburse.confirm_payment_order")}}</el-button>
                <el-button v-if="is_order_owner && (form.status=='A' || form.status=='P')" type="success" size="large" @click="handleRestore(form)">{{$t('btn.draft')}}</el-button>
                <approvalReviewButton v-if="is_current_approver && form.status=='P'" :current_stage_id="form.current_stage_id" class="flr mgl5" @beforeClose="closeDialog" @change="getData"></approvalReviewButton>
                <approvalRejectButton v-if="is_current_approver && form.status=='P'" :current_stage_id="form.current_stage_id" class="flr mgl5" @beforeClose="closeDialog" @change="getData"></approvalRejectButton>
                <el-button v-if="orderReadOnly==false" type="danger" size="large" @click="handleDelete(form)">{{$t('btn.abandon')}}</el-button>
                <el-button v-if="is_order_owner && form.status=='F'" type="primary" size="largre" @click="confirmDownload(form)">{{$t('btn.download')}}</el-button>
                <el-button v-if="orderReadOnly==false" size="large" type="primary" @click="confirmDialog">{{$t('btn.save')}}</el-button>
                <el-button v-if="orderReadOnly==false" size="large" type="success" style="width:120px;" @click="handleHandIn">{{$t('reimburse.submit')}}</el-button>
                </div>
            </div>
        </div>

        <el-dialog :title="$t('reimburse.create_item')" :modal="true" :append-to-body="true" :visible.sync="addItemVisible" width="600px" center :before-close="cancelAddItem" v-draggable>
            <el-row>
                <el-col v-for="type in option.item_types" :key="type.title" :span="8">
                    <div style="padding:5px;">
                        <el-button type="primary" style="height:100px;width:100%;font-size:24px;" @click="confirmAddItem(type.content)">{{type.title}}</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

         <el-dialog :title="$t('reimburse.confirm_restore')" :modal="true" :append-to-body="true" :visible.sync="restoreVisible" width="300px" center :before-close="cancelQuestDialog"  v-draggable>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelQuestDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmRestore">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('reimburse.confirm_abandon')" :modal="true" :append-to-body="true" :visible.sync="deleteVisible" width="300px" center :before-close="cancelQuestDialog"  v-draggable>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelQuestDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('cost.approval')" :modal="true" :append-to-body="true" :visible.sync="passVisible" width="300px" center :before-close="cancelPayOrderDialog"  v-draggable>
            <div style="text-align:center;">
                <span>{{$t('cost.confirm_approval')}}</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPass">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('cost.withdraw')" :modal="true" :append-to-body="true" :visible.sync="rejectVisible" width="300px" center :before-close="cancelPayOrderDialog"  v-draggable>
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

        <el-dialog :title="$t('cost.appropriate')" :modal="true" :append-to-body="true" :visible.sync="payDateVisible" width="300px" center :before-close="cancelPayOrderDialog"  v-draggable>
            <div style="text-align:center;">
                <span>{{$t('cost.select_appropriate_date')}}</span>
            </div>
            <div style="margin-top:10px;text-align:center;">
               <el-date-picker v-model="pay_date" type="date" align="right" value-format="yyyy-MM-dd" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPayOrderDialog">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPaymentDate">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('reimburse.partner_account')" :modal="true" :append-to-body="true"  :visible.sync="partnerVisible" width="1200px" center :before-close="cancelPartnerVisivle"  v-draggable>
            <div>
                <span style="width:250px;margin-bottom:20px;">{{$t('reimburse.select_partner')}}: {{select_partner.name}}</span>
                <addNewPartner v-if="is_purchasing" style="float:right" class="mgl10" :btnTitle="$t('btn.new')" @finish="handleFinishCreate"></addNewPartner>
                <el-input v-model="partner_search" size="mini" style="float:right;width:250px;margin-bottom:20px;" :placeholder="$t('btn.key_word')" clearable/>
                <el-table :data="option.partner.filter(
                    data => !partner_search || ( 
                        data.name.toLowerCase().includes(partner_search.toLowerCase()) || 
                        data.account.toLowerCase().includes(partner_search.toLowerCase()) || 
                        data.bank.toLowerCase().includes(partner_search.toLowerCase()) || 
                        data.name.toLowerCase().includes(partner_search.toLowerCase()))
                    )" border height="400px" style="width: 100%">
                    <el-table-column :label="$t('reimburse.option')" width="70"  align="center">
                        <template slot-scope="scope">
                            <el-radio  v-model="select_partner_id" :label="scope.row.id"><i></i></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" :label="$t('reimburse.partner_name')" min-width="180" width="auto" align="left" show-overflow-tooltip/>
                    <el-table-column prop="account_name" :label="$t('reimburse.beneficiary')" min-width="180" width="auto" align="left" show-overflow-tooltip/>
                    <el-table-column prop="bank" :label="$t('reimburse.beneficiary_bank')" width="180" align="left" show-overflow-tooltip/>
                    <el-table-column prop="branch" :label="$t('reimburse.beneficiary_branch')" width="180" align="left" show-overflow-tooltip/>
                    <el-table-column prop="swift_code" label="swift code" min-width="100px" width="auto" align="left" show-overflow-tooltip/>
                    <el-table-column prop="account" :label="$t('reimburse.swift_code')" min-width="120px" width="auto" align="left" show-overflow-tooltip/>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPartnerVisivle">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPartner">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('reimburse.update_payment_item_setting')" :modal="true" :append-to-body="true"  :visible.sync="updateItemVisible" width="500px" center :before-close="cancelUpdateItem" 
        :close-on-click-modal="false" :close-on-press-escape="false"  v-draggable>
            
            <div>
                 <el-form ref="form" label-width="80px">
                    <el-form-item v-if="item_index>-1" :label="$t('reimburse.id')">
                        <span>{{item_index+1}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('reimburse.item_name')">
                        <el-select :disabled="orderReadOnly" v-model="item_form.type" @change="handleItemTypeClick">
                            <el-option
                            v-for="item in option.item_content_types"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                        <!-- <span>{{item_form.type}}</span> -->
                    </el-form-item>
                    <!-- 選擇日期 -->
                    <el-form-item :label="$t('reimburse.date')">
                        <el-date-picker 
                        :readonly="orderReadOnly" v-model="item_form.date" 
                        :picker-options="pickerOptions"
                        style="width:155px" 
                        type="date" align="right" unlink-panels 
                        value-format="yyyy-MM-dd" />
                    </el-form-item>
                    <el-form-item  v-for="data in item_form.content" :key="data.id+item_form.id" :label="data.title">
                        <el-input :type="data.type" :rows="3" autosize :readonly="orderReadOnly" v-model="data.result" :placeholder="'請輸入'+data.title" clearable></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('reimburse.amount')">
                        <el-input 
                        style="width:200px;"
                        :readonly="orderReadOnly" 
                        type="number"  
                        v-model.number="item_form.amount" 
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

        <el-dialog :title="$t('reimburse.update_payment_setting')" :modal="true" :append-to-body="true"  :visible.sync="updatePayItemVisible" width="1000px" center  
        :before-close="cancelUpdatePayItem" :close-on-click-modal="false" :close-on-press-escape="false"  v-draggable>
            <div>
                <el-row>
                <el-form ref="form" label-width="auto">
                    <el-col :span="10">
                        <el-form-item :label="$t('reimburse.pre_payment_date')">
                            <el-date-picker v-model="pay_item_form.pre_payment_date" :readonly="orderReadOnly" type="date" align="right" :placeholder="$t('common_msg.optional')" unlink-panels value-format="yyyy-MM-dd" />
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
                        <el-form-item label="幣別">
                            <el-select
                            v-model="pay_item_form.currency"
                            filterable
                            :disabled="orderReadOnly"
                            :readonly="orderReadOnly"
                            :placeholder="$t('common_msg.select')">
                                <el-option
                                v-for="note in option.pos_currency"
                                :key="note.value"
                                :label="note.label"
                                :value="note.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.amount')">
                            <el-input :readonly="orderReadOnly" type="number" v-model.number="pay_item_form.amount"  style="width:200px;"><template slot="append">元</template></el-input>
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
                            <el-autocomplete
                            class="inline-input"
                            style="width:300px;"
                            clearable
                            v-model="pay_item_form.remittance_bank"
                            :readonly="orderReadOnly"
                            :fetch-suggestions="querySearchBank"
                            :placeholder="$t('common_msg.input_string')"
                            @select="handleBankSelect"
                            ></el-autocomplete>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.beneficiary_branch')">
                            <el-autocomplete
                            class="inline-input"
                            style="width:300px;"
                            clearable
                            v-model="pay_item_form.remittance_branch"
                            :readonly="orderReadOnly"
                            :fetch-suggestions="querySearchBranch"
                            :placeholder="$t('common_msg.input_string')"
                            @select="handleBranchSelect"
                            ></el-autocomplete>
                        </el-form-item>
                        <el-form-item label="SWIFT Code">
                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="pay_item_form.swift_code" ></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('reimburse.swift_code')">
                            <el-input :readonly="orderReadOnly" type="text" style="width:200px;" v-model="pay_item_form.remittance_account" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdatePayItem">{{$t('btn.cancel')}}</el-button>
                <el-button v-if="!orderReadOnly" type="primary" @click="confirmUpdatePayItem">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('reimburse.confirm_payment_order')" :modal="true" :append-to-body="true" :visible.sync="confirmPaymentVisible" width="300px" center 
        :before-close="cancelConfirmPayment"  v-draggable>
            <div>
                <el-form ref="form" label-width="80px">
                    <el-form-item :label="$t('reimburse.total_amount')">
                        <span>{{stateFormat(0,0,handleCaculatePayItemTotalAmount)}} 元</span>
                    </el-form-item>
                    <el-form-item :label="$t('reimburse.paied_amount')">
                        <span>{{stateFormat(0,0,caculatePaiedTotalAmount)}} 元</span>
                    </el-form-item>
                </el-form>
                <span v-if="handleCaculatePayItemTotalAmount == caculatePaiedTotalAmount" style="color:blue;">{{$t('reimburse.quest_complete_payment')}}</span>
                <span v-if="handleCaculatePayItemTotalAmount > caculatePaiedTotalAmount" style="color:red;">{{$t('reimburse.quest_complete_payment_unpaied')}}</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelConfirmPayment">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPayment">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { payOrderService } from "@/_services";
import { partnerService } from "@/_services";
import { accountService } from "@/_services";
import workFlowStatus from "../work_flow/workflow_status.vue";
import approvalRejectButton from "../work_flow/approval_button_reject.vue";
import approvalReviewButton from "../work_flow/approval_button_review.vue";
import addNewPartner from "../partner/add_new_partner";

export default {
    name: "pay_order",
    components: {
        workFlowStatus,
        approvalRejectButton,
        approvalReviewButton,
        addNewPartner
    },
    props: {
        order_id: {
            type: String,
            default:""
        },
        is_dialog: {
            type: Boolean,
            default:true
        }
    },
    data(){
        return {
            activeNames:"",
            itemKey:0,
            tbkey:0,
            pos:0,

            approval_key:0,
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            loading:false,
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

            payDateVisible:false,
            passVisible:false,
            rejectVisible:false,
            confirmPaymentVisible:false,

            reject_note:"",
            pay_date:"",
            pay_id:"",

            select_partner_id:"",
            select_partner:{
                account:"",
                name:"",
                bank:"",
                branch:"",
                account_name:"",
                id:""
            },
            partner_search:"",

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
                project_id:"",
                applicant_id:"",
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
                remittance_branch:"",
                remittance_account:"",
                remittance_setting:"",
                acount_name:"",
                payment_item:[],
                content_json:[]
            },

            pay_order_history:[],

            option:{
                bank_list:[],
                branch_list:[],
                projects:[],
                partner:[],
                members:[],
                pos_currency:[],
                payment_note:[
                    {label:"請款",value:"請款"},
                    {label:"訂金",value:"訂金"},
                    {label:"尾款",value:"尾款"},
                ],
                status:[
                    {label:this.$t("reimburse.status_tag.D"),value:"D"},
                    {label:this.$t("reimburse.status_tag.P"),value:"P"},
                    {label:this.$t("reimburse.status_tag.F"),value:"F"},
                    {label:this.$t("reimburse.status_tag.C"),value:"C"},
                    {label:this.$t("reimburse.status_tag.A"),value:"A"}
                ],
                item_content_types:[ "一般請款", "交通費請款", "住宿費請款", "生活費(膳食)", "辦公費(郵電/交際/車資等)"],
                item_types:[
                    {
                        title:"一般",
                        content:{
                            type:"一般請款",
                            amount:0,
                            date:"",
                            content:[
                                {id:"1",title:"說明",width:24,type:"textarea",result:""}
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
                                {id:"1",title:"說明",width:24,type:"textarea",result:""}
                            ]
                        }
                    },
                    {
                        title:"生活費",
                        content:{
                            type:"生活費(膳食)",
                            amount:0,
                            date:"",
                            content:[
                                {id:"1",title:"說明",width:24,type:"textarea",result:""}
                            ]
                        }
                    },
                    {
                        title:"辦公費",
                        content:{
                            type:"辦公費(郵電/交際/車資等)",
                            amount:0,
                            date:"",
                            content:[
                                {id:"1",title:"說明",width:24,type:"textarea",result:""}
                            ]
                        }
                    },
                ]
            },
           
            rules: {
                payment_method: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ]
                
            },

            pickerOptions: {
                disabledDate:this.disabledDate
            }
        }
    },

    async created(){
        await this.getData();
        await this.getOption();
    },
    watch:{
        select_partner_id(val){
            console.log(val);
            let index = this.option.partner.findIndex(element => element.id==val);
            if(index >= 0){
                this.select_partner = this.option.partner[index];
            }else{
                this.select_partner = {
                    name:"",
                    account:"",
                    account_name:"",
                    bank:"",
                    branch:""
                }
            }
        },

        "pay_item_form.remittance_bank"(val){
            this.init_branch(val)
        }
    },

    computed: {
        handleCaculateTotalAmount(){
            var total = 0;
            this.form.content_json.forEach(element => {
                total+=element.amount
            });
            return total
        },

        handleCaculatePayItemTotalAmount(){
            var total = 0;
            this.form.payment_item.forEach(element => {
                total+=element.amount
            });
            return total
        },

        caculatePaiedTotalAmount(){
            var total = 0;
            this.form.payment_item.forEach(element => {
                if(element.is_set_paied_date){
                    total+=element.amount
                }
            });
            return total
        },

        async checkContent(){
            await this.form.content_json.forEach(element => {
                // console.log(element.amount);
                if(element.amount==0 || element.amount==null || element.amount==""){
                    // console.log("false");
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
            return this.form.pid == this.odoo_employee_id || this.form.applicant_id == this.odoo_employee_id;
        },

        is_accountant(){
            if(accountService.get_user_menus().includes("accountant")){
                return true
            }else{
                return false
            }
        },

        is_purchasing(){
            if(accountService.get_user_menus().includes("purchasing")){
                return true
            }else{
                return false
            }
        },

        is_current_approver(){
            if(this.form.current_approver_json){
                if(this.form.current_approver_json.includes(accountService.get_user_info("ms_odoo_employee_id").toString())){
                    return true
                }else{
                    return false
                }
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
            return total_amount - set_amount
        },

        min_cert_date(){
            var max_date = "";
            this.form.content_json.forEach(element=>{
                console.log(element);
                if(max_date){
                    if(element.date>max_date){
                        max_date = element.date
                    }
                }else{
                    max_date = element.date
                }
            });

            if(max_date){
                let date = new Date(max_date);
                date.setDate(date.getDate() - 30);
                return date;
            }else{
                return false
            };
            
        },

        max_cert_date(){
            var min_date = "";
            this.form.content_json.forEach(element=>{
                console.log(element);
                if(min_date){
                    if(element.date<min_date){
                        min_date = element.date
                    }
                }else{
                    min_date = element.date
                }
            });

            if(min_date){
                let date = new Date(min_date);
                console.log(date.getMonth());
                date.setDate(date.getDate() + 30);
                return date;
            }else{
                return false
            };
        },
        

    }, 
    
    methods: {
        handleItemTypeClick(val){
            console.log(val)
            if(val=="交通費請款"){
                this.item_form.content = [
                    {id:"1",title:"起訖地點",width:12,type:"text",result:""},
                    {id:"2",title:"票種",width:12,type:"text",result:""}
                ];
            }else{
                if(this.item_form.content.length==2){
                    this.item_form.content =[
                        {id:"1",title:"說明",width:24,type:"textarea",result:""}
                    ];
                }
            }
        },

        querySearchBank(queryString, cb) {
            var banks = this.option.bank_list;
            var results = queryString ? banks.filter(this.createFilter(queryString)) : banks;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },

        querySearchBranch(queryString, cb) {
            var branches = this.option.branch_list;
            var results = queryString ? branches.filter(this.createFilter(queryString)) : branches;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },

        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
            };
        },

        handleBankSelect(item) {
            this.option.branch_list = item.branch_json;
        },

        handleBranchSelect(item) {
            console.log(item);
        },

        init_branch(bank){
            console.log("init");
            var index = this.option.bank_list.findIndex(element => element.value==bank)
            if(index>=0){
                this.option.branch_list = this.option.bank_list[index].branch_json;
            }else{
                this.option.branch_list=[];
            }
        },

        async handleFinishCreate(result){
            await this.getOption();
            console.log(result);
            console.log(result.data);
            console.log(result.data.name);
            this.partner_search = result.data.name;
            this.select_partner_id = result.data.id;
        },

        disabledDate (time) {
            let today = new Date();
            var limit_min_date = today.setDate(today.getDate()-93);

            let count_date = 0;
            let month_list = [];
            this.form.content_json.forEach(element=>{
                if(element.date){
                    // count_date++
                    var date = new Date(element.date);
                    var year_month = date.getFullYear()+"-"+(date.getMonth()+1).toString().padStart(2, '0');
                    if(!month_list.includes(year_month)){
                        month_list.push(year_month);
                    }
                };
            });
            
            if((!month_list.length) || (this.form.content_json.length==1 && this.item_index==0)){
                return time.getTime() < limit_min_date;
            };
            var min_month = month_list.sort()[0];
            var max_month = month_list.sort()[month_list.length-1];
            if(min_month==max_month){
                var min_month_list = min_month.split("-");
                if(min_month_list[1]=="12"){
                    var nextMonthDays = new Date((Number(min_month_list[0])+1), 1, 0).getDate();
                    var max_date = new Date((Number(min_month_list[0])+1)+"-01-"+nextMonthDays);
                }else{
                    var nextMonthDays = new Date(min_month_list[0], (Number(min_month_list[1])+1), 0).getDate();
                    var max_date = new Date(min_month_list[0]+"-"+(Number(min_month_list[1])+1)+"-"+nextMonthDays);
                };
                if(min_month_list[1]=="01"){
                   var min_date = new Date((Number(min_month_list[0])-1)+"-12-01");
                }else{
                    var min_date = new Date(min_month_list[0]+"-"+(Number(min_month_list[1])-1)+"-01");
                };
                return time.getTime() < limit_min_date || ( time.getTime() < min_date  ||  time.getTime() > max_date );
            }else{
                var min_month_list = min_month.split("-");
                var max_month_list = max_month.split("-");
                var maxMonthDays = new Date(max_month_list[0], Number(max_month_list[1]), 0).getDate();
                var max_date = new Date(max_month_list[0]+"-"+(Number(max_month_list[1]))+"-"+maxMonthDays);
                var min_date = new Date(min_month_list[0]+"-"+(Number(min_month_list[1]))+"-01");
                return time.getTime() < limit_min_date || ( time.getTime() < min_date  ||  time.getTime() > max_date );
            };
        },
        
        handleOpenProjectCost(item_id){
            let routeData = this.$router.resolve({path: "/work_item_cost_edit", query: {id: item_id}});
            window.open(routeData.href, '_blank');
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
            this.partner_search = "";
            this.partnerVisible = false;
        },

        confirmPartner(){
            this.partner_search = "";
            this.pay_item_form.remittance_account = this.select_partner.account;
            this.pay_item_form.remittance_bank = this.select_partner.bank;
            this.pay_item_form.remittance_branch = this.select_partner.branch;
            this.pay_item_form.account_name = this.select_partner.account_name;
            this.pay_item_form.swift_code = this.select_partner.swift_code;
            this.partnerVisible = false;
        },

        handlePartner(){
            this.select_partner_id = null;
            this.partnerVisible = true;
        },

        cancelQuestDialog(){
            this.restoreVisible = false;
            this.downloadVisible = false;
            this.deleteVisible = false;
        },

        cancelPayOrderDialog(){
            this.payDateVisible=false;
            this.passVisible=false;
            this.rejectVisible=false;
            this.payDateVisible=false;
        },

        handlePass(){
            this.passVisible=true;
        },

        handleSettingPaymentDate(row){
            this.pay_id = row.id;
            this.pay_date = row.act_payment_date;
            this.payDateVisible=true;
        },

        handleReject(){
            this.reject_note = "";
            this.rejectVisible=true;
        },

        handleRejectAc(row){
            
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
                if(res.code>0){
                    this.$message.success("success"); 
                    this.cancelPayOrderDialog();
                    this.closeDialog();
                }else{
                    this.$message.error(res.msg)
                }
                    
            })
        },

        confirmPaymentDate(){
            var param = {
                action:"paymentdate",
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
                if(res.code>0){
                    this.$message.success("success"); 
                    this.cancelPayOrderDialog();
                    this.closeDialog();
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

        confirmDelete(){
            var param = {
                action:"delete",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.delete_id
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                // console.log(res);
                if(res.code>0){
                    this.$message.success("Success") 
                    this.getData();
                    this.cancelQuestDialog();
                    this.closeDialog();
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
                // console.log(res);
                if(res.code>0){
                    this.$message.success("Success") ;
                    this.cancelQuestDialog();
                    this.closeDialog();
                }else{
                    this.$message.error(res.msg)
                } 
            })
        },

        handleConfirmPayment(){
            this.confirmPaymentVisible = true;
        },

        cancelConfirmPayment(){
            this.confirmPaymentVisible = false;
        },

        confirmPayment(){
            var param = {
                action:"ConfirmPayment",
                form:{
                    odoo_employee_id:this.odoo_employee_id,
                    order_id: this.form.order_id,
                    paied_amount: this.caculatePaiedTotalAmount
                }
            };
            payOrderService.update_pay_orders(param).then(res =>{ 
                // console.log(res);
                if(res.code>0){
                    this.$message.success("Success");
                    this.cancelQuestDialog();
                    this.closeDialog();
                    this.confirmPaymentVisible = false;
                }else{
                    this.$message.error(res.msg)
                } 
            })
            this.confirmPaymentVisible = false;
        },
        
        confirmDownload(row){
            var param = {order_id: row.order_id};
            this.loading = true;
            payOrderService.downlaod_pay_order(param).then(response => {
                const link = document.createElement('a');
                let blob = new Blob([response.data], {type: 'application/pdf'});
                link.style.display = 'none';
                link.href = URL.createObjectURL(blob);//创建url对象
                link.download = this.today+'-'+row.order_id+".pdf"
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);//销毁url对象
                this.cancelQuestDialog();
                this.loading = false;
            }).catch(err => {
                this.cancelQuestDialog();
                this.loading = false;
            })
            this.dialog_loading = true;
        },

        handleAddItem(){
            this.addItemVisible = true;
        },

        handleUpdateItem(row,index){
            this.item_form = JSON.parse(JSON.stringify(row));
            this.item_index = index;
            this.updateItemVisible = true;
        },

        cancelUpdateItem(){
            this.updateItemVisible = false;
        },

        confirmUpdateItem(){
            if(!this.item_form.date){
                return this.$message.error("請設定憑證日期")
            }else{
                if(this.item_index<0){
                    this.form.content_json.push(this.item_form);
                }else{
                    this.form.content_json.splice(this.item_index, 1, this.item_form);
                };
                this.confirmDialog();
                this.updateItemVisible = false;
            }
            
        },

        handleUpdatePayItem(row,index){
            this.pay_item_form = JSON.parse(JSON.stringify(row));
            this.pay_item_index = index;
            if(this.pay_item_form.currency==null){
                this.pay_item_form.currency = "TWD";
            };
            this.updatePayItemVisible = true;
        },

        cancelUpdatePayItem(){
            this.updatePayItemVisible = false;
        },

        confirmUpdatePayItem(){
            if(this.pay_item_index<0){
                this.form.payment_item.push(this.pay_item_form);
            }else{
                this.form.payment_item.splice(this.pay_item_index, 1, this.pay_item_form);
            };
            this.updatePayItemVisible = false;
        },

        async handleAddPaymentItem(){
            if (!this.select_partner){
                this.select_partner = {
                    "name":"",
                    "account_name":"",
                    "bank":"",
                    "branch":"",
                    "swift_code":"",
                    "account":""
                }
            };
            
            if(this.form.payment_item.length<5){
                var temp_content = {
                    pay_order_id:this.form.order_id,
                    amount:this.computePayOrder,
                    payment_note:"請款",
                    payment_method:"transfer",
                    remittance_setting:"deduct",
                    currency:"TWD",
                    pre_payment_date:null,
                    remittance_bank:this.select_partner.bank,
                    remittance_branch:this.select_partner.branch,
                    remittance_account:this.select_partner.account,
                    account_name:this.select_partner.account_name,
                    swift_code:this.select_partner.swift_code,
                    is_set_paied_date:0
                };
                var new_uuid = this.create_UUID(8);
                temp_content.id = new_uuid;
                await this.handleUpdatePayItem(temp_content, -1);      
            }else{
                return this.$message.error("僅限五筆付款資訊")
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
            this.form.content_json.splice(index,1);
        },

        handleRemovePaymentItem(index){
            this.form.payment_item.splice(index,1);
        },
       
        async getData(){
            this.loading = true;
            var param = {
                action:"info",
                token:localStorage.getItem("ms_user_token"),
                filter:{
                    order_id:this.order_id
                }
            };
            await payOrderService.get_pay_orders(param)
            .then(res =>{ 
                this.loading = false;
                console.log(res.data);
                if(res.code>0){
                    this.form=res.data;
                    this.pay_order_history=res.histories;
                    this.tbkey++;
                }else{
                    if(res.msg=="token_expire"){
                        this.$message.error("驗證失效")
                        accountService.logout();
                    }else{
                        this.$message.error(res.msg);
                    }
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
            this.loading = true;
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
                        this.loading = false;
                        if(res.code > 0){ 
                            this.$message.success("Success"); 
                            this.closeDialog();
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
                // console.log(element.amount);
                if(element.amount==0 || element.amount==null || element.amount==""){
                    return this.$message.error("請款單細項未正確設定金額");
                }
            });
            if(this.form.description==""||this.form.description==null){
                return this.$message.error("請填寫請款說明");
            };
            await this.handInOrder();

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
                remittance_branch:"",
                remittance_account:"",
                remittance_setting:"",
                acount_name:"",
                payment_item:[],
                content_json:[]
            };
        },
        
        async getOption(){
            await partnerService.get_supplier_account({action:"table",filter:{start_row:0, page_size:1000, key_word:"" }}).then(res =>{
                this.option.partner=res.data;
            });

            await partnerService.get_bank_list({action:"table"}).then(res=>{
                this.option.bank_list = res.data;
            });

            await partnerService.get_pos_currency().then(res=>{
                this.option.pos_currency = res.data;
            });
        },

        closeDialog(){
            this.$emit('close',{})
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
    .mgl5{
        margin-left:5px;
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
    .flr{
        float:right;
    }
</style>