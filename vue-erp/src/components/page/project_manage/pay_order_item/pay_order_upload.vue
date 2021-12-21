<template>
    <div>
        <el-button size="large" type="primary" class="mgr10" icon="el-icon-upload" :disabled="loading" 
        @click="handleUpload()">
            批次請款
        </el-button>
        <el-dialog title="批次請款" v-if="uploadVisible" :visible.sync="uploadVisible" width="1200px" 
        :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
        :before-close="cancelUpload" v-loading="loading">
            <el-row style="margin-bottom:20px;">
                <div style="float:left;">
                    <div >
                        <span>下載範本後按照欄位填入資料上傳。系統會根據 <span style="color:red;"><b>專案、申請人、請款說明</b></span> 欄位產生請款單『草稿』。</span>
                    </div>
                    <div>
                        <span>付款資訊會根據設定<span style="color:red;"><b>統一帶入請款單</b></span>。</span>
                    </div>
                </div>
                <div style="float:right;">
                    <el-button size="large"  @click="cancelUpload">{{$t('btn.cancel')}}</el-button>
                    <el-button size="large" type="success" style="width:150px;" @click="confirmUpload">{{$t('btn.confirm')}}</el-button>
                </div>
            </el-row>
            <el-row style="margin-bottom:20px;">
                <el-card style="height:300px;">
                    <div slot="header" class="clearfix">
                        <span>請款設定</span>
                        <el-switch
                        style="float:right"
                        v-model="auto_pay_info"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="帶入付款資訊"
                        inactive-text="不帶付款資訊">
                        </el-switch>
                    </div>
                    <el-form ref="form" label-width="auto">
                        <el-col :span="6">
                            <el-form-item :label="$t('reimburse.pre_payment_date')" >
                                <el-date-picker v-model="payment_form.pre_payment_date" type="date" align="right"  
                                style="width:150px;" :placeholder="$t('common_msg.optional')" unlink-panels value-format="yyyy-MM-dd" />
                            </el-form-item>
                            <el-form-item :label="$t('reimburse.payment_note')">
                                <el-select
                                v-model="payment_form.payment_note"
                                style="width:150px;"
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
                                style="width:150px;"
                                :placeholder="$t('common_msg.select')">
                                    <el-option
                                    v-for="note in option.pos_currency"
                                    :key="note.value"
                                    :label="note.label"
                                    :value="note.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
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
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('reimburse.beneficiary_bank')">
                                <el-autocomplete
                                class="inline-input"
                                style="width:200px;"
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
                                style="width:200px;"
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
                    <div slot="header" class="clearfix">
                        <span>請款細項上傳</span>
                    </div>
                    <el-form label-position="left" label-width="100px">
                        <el-form-item label="上傳檔案">
                            <div style="width:400px;">
                                <el-upload ref="upload" drag accept=".xlsx" action
                                :multiple="false" :limit="1" :auto-upload="false" :on-remove="handleUploadRemove" :on-change="handleUploadChange">
                                    <el-button size="large"  type="primary" style="width:100%">上傳檔案</el-button>
                                </el-upload>
                                <el-button type="text" @click="handleDownloadSample()">下載範本.xlsx</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="資料筆數">
                            <span>{{dalen}} 筆</span>
                        </el-form-item>
                    </el-form>
                    <el-table :data="da" border class="table" 
                    :default-sort="{prop:'item_name',order:'descending'}"
                    height="500px" ref="multipleTable" tooltip-effect="light" 
                    v-loading="loading" :cell-style="getCellStyle" :key="tbKey">
                        <el-table-column prop="item_name" label="專案名稱" width="auto" align="left" show-overflow-tooltip sortable/>
                        <el-table-column prop="applicant" label="申請人" width="100px" align="center" show-overflow-tooltip/>
                        <el-table-column prop="description" label="請款說明" width="auto" align="left" show-overflow-tooltip/>
                        <el-table-column prop="item_date" label="憑證日期"  width="100px" align="center" show-overflow-tooltip/>
                        <el-table-column prop="item_type" label="請款類別" width="130px" align="left" show-overflow-tooltip/>
                        <el-table-column prop="item_content" label="細項說明"  width="auto" align="left" show-overflow-tooltip/>
                        <el-table-column prop="travel_location" label="起訖地點(交通費必填)"  width="auto" align="left" show-overflow-tooltip/>
                        <el-table-column prop="ticket" label="票種(交通費必填)"  width="150" align="auto" show-overflow-tooltip/>
                        <el-table-column prop="amount" label="金額"  width="120" align="right" show-overflow-tooltip/>
                    </el-table>
                </el-card>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="large"  @click="cancelUpload">{{$t('btn.cancel')}}</el-button>
                <el-button size="large" type="success" style="width:150px;" @click="confirmUpload">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="$t('reimburse.partner_account')" :modal="true" :append-to-body="true"  :visible.sync="partnerVisible" width="1200px" center :before-close="cancelPartnerVisible"  v-draggable>
            <div>
                <span style="width:250px;margin-bottom:20px;">{{$t('reimburse.select_partner')}}: {{select_partner.name}}</span>
                <addNewPartner style="float:right" class="mgl10" :btnTitle="$t('btn.new')" @finish="handleFinishCreate"></addNewPartner>
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
                <el-button @click="cancelPartnerVisible">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="confirmPartner">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { payOrderService } from "@/_services";
import { accountService } from "@/_services";
import { partnerService } from "@/_services";
import addNewPartner from "../../partner/add_new_partner";
export default {
    name: "pay_order_upload",
    components: {
        addNewPartner
    },
    data(){
        return {
            tbKey:0,
            payment_date:"",
            da:[],
            spanArr:[],
            pos:0,

            dalen:0,
            odoo_employee_id:accountService.get_user_info("ms_odoo_employee_id"),
            username:accountService.get_user_info("ms_username"),
    
            loading:false,
            uploadVisible:false, 
            
            select_partner_id:"",
            select_partner:{
                account:"",
                name:"",
                bank:"",
                branch:"",
                swift_code:"",
                account_name:"",
                id:""
            },
            partner_search:"",
            partnerVisible:false,

            auto_pay_info:true,

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
                pos_currency:[],
                partner:[],
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

    async created(){
        this.getOption();
    },

    computed: {
        today(){
            let time =new Date();
            return time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')
        },

        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

    }, 
    
    watch: {
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
                    swift_code:"",
                    bank:"",
                    branch:""
                }
            }
        },

        "payment_form.remittance_bank"(val){
            this.init_branch(val)
        }
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
            this.loading = true;
            payOrderService.downlaod_upload_template({}).then(res => {
                console.log(res);
                if (res.status === 200) {
                    if (res.headers["content-type"].includes("application/json")) {
                        //如果有錯誤訊息格式是 json 但是要轉一下 blob
                        var blb = new Blob([res.data], { type: "json" });
                        var fr = new FileReader();
                        var self = this
                        fr.onload = function() {
                            var res_json = JSON.parse(this.result);
                            self.$message.warning(self.$i18n.t(res_json.msg));
                        };
                        fr.readAsText(blb);
                        this.loading = false;
                    } else {
                        let blob = new Blob([res.data]);
                        let link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        link.setAttribute("download", "temp.xlsx");
                        link.click();
                        this.loading = false;
                    }
                }      
            }).catch(err => {
                console.log(err);
                this.loading = false;
            });
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
                        obj.description = v["請款說明"];
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
            this.da=[];
            this.dalen=0;
            this.auto_pay_info=true;
            this.payment_form= {
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
            }

        },

        confirmUpload(){
            console.log(this.da);
            if(!this.dalen){
                return this.$message.error("請上傳檔案")
            };
            this.loading = true;
            payOrderService.group_create_payment_order({
                    odoo_employee_id:this.odoo_employee_id,
                    order_date:this.order_date,
                    auto_pay_info:this.auto_pay_info,
                    payment_info:this.payment_form,
                    payment_item:this.da
                }).then(res =>{ 
                console.log(res);
                this.loading = false;
                if(res.code>0){
                    this.$message.success("Success");
                    this.uploadVisible = false;
                    this.handleGetData();
                }else{
                    this.$message.error(res.msg)
                } 
            })
        },

        handleGetData(){
            this.$emit('finish',{})
        },

        cancelUpload(){
            this.uploadVisible = false;
            this.handleUploadRemove("","");
            this.payment_date = "";
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

        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
            };
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

        confirmPartner(){
            this.partner_search = "";
            this.payment_form.remittance_account = this.select_partner.account;
            this.payment_form.remittance_bank = this.select_partner.bank;
            this.payment_form.remittance_branch = this.select_partner.branch;
            this.payment_form.account_name = this.select_partner.account_name;
            this.payment_form.swift_code = this.select_partner.swift_code;
            this.partnerVisible = false;
        },

        async handleFinishCreate(result){
            await this.getOption();
            console.log(result);
            console.log(result.data);
            console.log(result.data.name);
            this.partner_search = result.data.name;
            this.select_partner_id = result.data.id;
        },

        cancelPartnerVisible(){
            this.partner_search = "";
            this.partnerVisible = false;
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