<template>
    <div>
        <el-button size="large" type="primary" class="mgr10" icon="el-icon-upload" :disabled="loading" 
        @click="handleUpload()">
            批量處理
        </el-button>
        <el-dialog title="批次請款" v-if="uploadVisible" :visible.sync="uploadVisible" 
        width="1200px" center 
        :close-on-click-modal="false" :close-on-press-escape="false" 
        :before-close="cancelUpload">
            <el-row>
                <el-card>
                    <el-form ref="form" label-width="auto">
                        <el-col :span="10">
                            <el-form-item :label="$t('reimburse.pre_payment_date')">
                                <el-date-picker v-model="payment_form.pre_payment_date" type="date" align="right" :placeholder="$t('common_msg.optional')" unlink-panels value-format="yyyy-MM-dd" />
                            </el-form-item>
                            <el-form-item :label="$t('reimburse.payment_note')">
                                <el-select
                                v-model="payment_form.payment_note"
                                filterable
                                allow-create
                                default-first-option
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
                                v-model="payment_form.currency"
                                filterable
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
                                <el-input type="number" v-model.number="payment_form.amount"  style="width:200px;"><template slot="append">元</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item :label="$t('reimburse.payment_method')">
                                <el-radio-group v-model="payment_form.payment_method" size="mini">
                                    <el-radio label="transfer" border>{{$t('reimburse.remit')}}</el-radio>
                                    <el-radio label="cash" border>{{$t('reimburse.cash')}}</el-radio>
                                    <el-radio label="check" border>{{$t('reimburse.check')}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item :label="$t('reimburse.remit_options')">
                                <el-radio-group v-model="payment_form.remittance_setting" :disabled="payment_form.payment_method!='transfer'" size="mini">
                                    <el-radio label="deduct" border>{{$t('reimburse.deduct')}}</el-radio>
                                    <el-radio label="no_deduct" border>{{$t('reimburse.no_deduct')}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item :label="$t('reimburse.beneficiary')">
                                <el-input type="text" style="width:200px;" v-model="payment_form.account_name" ></el-input>
                                <el-button class="el-icon-user" type="text" size="large" style="margin-left:10px;" @click="handlePartner()">{{$t('reimburse.partner_account')}}</el-button>
                            </el-form-item>
                            <el-form-item :label="$t('reimburse.beneficiary_bank')">
                                <el-autocomplete
                                class="inline-input"
                                style="width:300px;"
                                clearable
                                v-model="payment_form.remittance_bank"
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
                                v-model="payment_form.remittance_branch"
                                :fetch-suggestions="querySearchBranch"
                                :placeholder="$t('common_msg.input_string')"
                                @select="handleBranchSelect"
                                ></el-autocomplete>
                            </el-form-item>
                            <el-form-item label="SWIFT Code">
                                <el-input  type="text" style="width:200px;" v-model="payment_form.swift_code" ></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('reimburse.swift_code')">
                                <el-input type="text" style="width:200px;" v-model="payment_form.remittance_account" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-card>
            </el-row>
            <el-row>
                <el-card>
                    <el-form label-position="left" label-width="100px">
                        <el-form-item label="請款日期">
                        <el-date-picker
                            class="pickerStyle"
                            v-model="upload_month"
                            type="date"
                            value-format="yyyy-MM-dd"
                            size="small"
                            placeholder="選擇上傳月份">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="上傳檔案">
                            <div style="width:400px;">
                                <el-upload
                                ref="upload"
                                drag
                                accept=".xlsx"
                                action
                                :multiple="false"
                                :limit="1"
                                :auto-upload="false"
                                :on-remove="handleUploadRemove"
                                :on-change="handleUploadChange">
                                    <el-button size="large"  type="primary" style="width:100%">上傳檔案</el-button>
                                </el-upload>
                                <el-button type="text" @click="handleDownloadSample()">下載範本.csv</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="資料筆數">
                            <span>{{dalen}} 筆</span>
                        </el-form-item>
                    </el-form>
                    <el-table :data="da" border class="table" style="max-height:500px;" ref="multipleTable" tooltip-effect="light" v-loading="loading" :cell-style="getCellStyle" :key="tbKey">
                        <el-table-column prop="item_name" label="專案名稱" width="auto" align="left" show-overflow-tooltip/>
                        <el-table-column prop="applicant" label="申請人" width="100px" align="center" show-overflow-tooltip/>
                        <el-table-column prop="item_date" label="憑證日期"  width="100px" align="center" show-overflow-tooltip/>
                        <el-table-column prop="item_type" label="請款類別" width="130px" align="left" show-overflow-tooltip/>
                        <el-table-column prop="item_content" label="細項說明"  width="auto" align="left" show-overflow-tooltip/>
                        <el-table-column prop="travel_location" label="起訖地點(交通費必填)"  width="auto" align="left" show-overflow-tooltip/>
                        <el-table-column prop="ticket" label="票種(交通費必填)"  width="150" align="auto" show-overflow-tooltip/>
                        <el-table-column prop="amount" label="金額"  width="120" align="right" show-overflow-tooltip/>
                    </el-table>
                </el-card>
            </el-row>
            <!-- <el-row>
                
            </el-row> -->
            <span slot="footer" class="dialog-footer">
                <el-button size="large"  @click="cancelUpload">{{$t('btn.cancel')}}</el-button>
                <el-button size="large" type="primary" @click="confirmUpload">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <!-- <el-dialog :title="$t('reimburse.partner_account')" :modal="true" :append-to-body="true"  :visible.sync="partnerVisible" width="1200px" center :before-close="cancelPartnerVisivle"  v-draggable>
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
        </el-dialog> -->
    </div>
</template>
<script>
import { dayItemService } from "@/_services";
import { accountService } from "@/_services";
export default {
    name: "pay_order_upload",
    components: {

    },
    data(){
        return {
            tbKey:0,
            upload_month:"",
            da:[],
            dalen:0,
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            username:accountService.get_user_info("ms_username"),
    
            loading:false,
            uploadVisible:false, 
            
            select_partner_id:"",
            partnerVisible:false,
            payment_form:{
                pay_order_id:"",
                amount:0,
                payment_note:"請款",
                payment_method:"transfer",
                remittance_setting:"deduct",
                currency:"TWD",
                pre_payment_date:null,
                remittance_bank:"",
                remittance_branch:"",
                remittance_account:"",
                account_name:"",
                swift_code:"",
                is_set_paied_date:0
            },
            option:{
                bank_list:[],
                branch_list:[],
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
                ]
            }  
        }
    },

    async created(){},

    computed: {
        today(){
            let time =new Date();
            return time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

    }, 
    
    methods: {
        orgDateFormat(originVal){
            // excel 以1900起算，Vue 以1970起算, 一天為86400000微秒
            const dt = new Date((originVal-25569)*86400000);
            const y = dt.getFullYear();
            const m  = (dt.getMonth() + 1 + "").padStart(2,'0')
            const d  = (dt.getDate() + "").padStart(2,'0')
            console.log(originVal);
            return `${y}-${m}-${d}`;
        },

        handleDownloadSample(){
            // this.dialog_loading = true;
            // dayItemService.downlaod_cost_sample({}).then(response => {
            //     // console.log(response);
            //     const link = document.createElement('a');
            //     let blob = new Blob([response.data], {type: 'application/pdf'});
            //     link.style.display = 'none';
            //     link.href = URL.createObjectURL(blob);//创建url对象
            //     link.download = "專案工時成本上傳範本.csv"
            //     document.body.appendChild(link);
            //     link.click();
            //     document.body.removeChild(link);
            //     URL.revokeObjectURL(link.href);//销毁url对象
            //     // this.cancelQuestDialog();
            //     this.dialog_loading = false;
            // }).catch(err => {
            //     console.log(err);
            //     // this.cancelQuestDialog();
            //     this.dialog_loading = false;
            // });
        },

        handleUploadRemove(file, fileList){
            console.log("Remove");
            this.da = null;
            this.dalen = 0;
            this.fileTemp = null;
            this.file = null;
        },

        handleUploadChange(file, fileList) {
            this.da = [];
            this.dalen = 0;
            this.fileTemp = file.raw;
            if (this.fileTemp) {
                if(this.fileTemp.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || this.fileTemp.type == "application/vnd.ms-excel") {
                    this.importfxx(this.fileTemp);
                }else{
                    this.$message({
                        type: "warning",
                        message: "檔案格式错誤，請重新上傳",
                    });
                }
            }else{
                this.$message({
                    type: "warning",
                    message: "請上傳檔案！",
                });
            }
        },

        importfxx(obj) {
            let _this = this;
            // let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
            this.file = event.currentTarget.files[0];
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            var reader = new FileReader(); //if (!FileReader.prototype.readAsBinaryString) {
            FileReader.prototype.readAsBinaryString = function (f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for (var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require("xlsx");
                    if (rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), {
                            //手动转化
                            type: "base64",
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: "binary",
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata 數據的輸出
                    console.log("上傳數據內文：");
                    console.log(outdata); //此處對數據進行處理
                    let arr = [];
                    outdata.map((v) => {
                        let obj = {};
                        obj.item_name = v["專案名稱"];
                        obj.applicant = v["申請人"];
                        obj.item_date = _this.orgDateFormat(v["憑證日期"]);
                        obj.item_type = v["請款類別"];
                        obj.item_content = v["細項說明"];
                        obj.travel_location = v["起訖地點(交通費必填)"];
                        obj.ticket = v["票種(交通費必填)"];
                        obj.amount = v["金額"];
                        arr.push(obj);
                    });
                    _this.da = arr;

                    _this.dalen = arr.length;
                    return arr;
                };
                reader.readAsArrayBuffer(f);
            };
            if (rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },

        create_UUID(len) {
            let text = ""
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            for( let i=0; i < len; i++ ) {
                text += chars.charAt(Math.floor(Math.random() * chars.length))
            }
			return text
		},

        stateFormat(row, column, cellValue) {
			cellValue += '';
			if (!cellValue.includes('.')) cellValue += '.';
			return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
				return $1 + ',';
			}).replace(/\.$/, '');
		},

        handleUpload(){
            this.uploadVisible = true;
        },

        confirmUpload(){
            console.log(this.da);
            // if(!this.upload_month){
            //     return this.$message.error("請選擇月份")
            // };
            // if(!this.dalen){
            //     return this.$message.error("請上傳檔案")
            // };
            // dayItemService.upload_worktime_cost({month:this.upload_month, data:this.da, odoo_employee_id:this.odoo_employee_id}).then(res =>{ 
            //     console.log(res);
            //     if(res.code>0){
            //         this.$message.success("Success") 
            //     }else{
            //         this.$message.error(res.msg)
            //     } 
            // })
        },

        cancelUpload(){
            this.uploadVisible = false;
            this.handleUploadRemove("","");
            this.upload_month = "";
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

        handleBankSelect(item) {
            this.option.branch_list = item.branch_json;
        },

        handleBranchSelect(item) {
            console.log(item);
        },

        handlePartner(){
            this.select_partner_id = null;
            this.partnerVisible = true;
        },
        
    }
}
</script>
<style>
    .el-upload {
        border: none;
        background-color: transparent;
        height: 40px;
        width: 150px;
    }
    .el-upload-dragger{
        height: 40px;
        width: 150px;
    }
    .el-upload--text{
        height: 40px;
        width: 150px;
    }
</style>
<style scoped>
    
</style>