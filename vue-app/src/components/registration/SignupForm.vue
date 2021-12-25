<template>
    <div id="bar-scroller" ref="content">
        <div class="container" v-if="res_status">
            <el-form ref="member_info" :model="member_info" :rules="rules" label-position="top" label-width=auto status-icon>
                <el-row :gutter="20">
                    <el-col :span="col_num1">
                        <el-form-item 
                        class="label_class"
                        prop="first_name">
                        <p class="label_class_p" v-html="$t('public.sign_up.name')"></p>
                            <el-input 
                            class="input_class"
                            type="text"
                            maxlength="200"
                            v-model="member_info.first_name"
                            :placeholder="$t('public.sign_up.first_name_placeholder')">
                            </el-input>
                            <div class="form_description" v-html="$t('public.sign_up.first_name')"></div>
                        </el-form-item>
                        <el-form-item 
                        class="no_label_class"
                        prop="last_name">
                            <el-input 
                            class="input_class"
                            type="text"
                            maxlength="200"
                            v-model="member_info.last_name"
                            :placeholder="$t('public.sign_up.last_name_placeholder')">
                            </el-input>
                            <div class="form_description" v-html="$t('public.sign_up.last_name')"></div>
                        </el-form-item>
                        <el-form-item 
                        class="label_class"
                        prop="gender">
                        <p class="label_class_p" v-html="$t('public.sign_up.gender')"></p>
                            <el-checkbox-group 
                            v-model="member_info.gender">
                                <el-checkbox 
                                class="checkbox_male_class"
                                :label="$t('public.sign_up.male')"
                                true-label="1"
                                false-label=""
                                border>
                                </el-checkbox>
                                <el-checkbox 
                                class="checkbox_female_class"
                                :label="$t('public.sign_up.female')" 
                                true-label="0"
                                false-label=""
                                border>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item 
                        class="label_class"
                        prop="birthdate">
                        <p class="label_class_p" v-html="$t('public.sign_up.birthdate')"></p>
                            <el-date-picker 
                            class="input_class"
                            type="date"
                            size=large
                            :editable="false"
                            v-model="member_info.birthdate"
                            clearable
                            :placeholder="$t('public.sign_up.birthdate_placeholder')">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item 
                        class="label_class"
                        prop="contact_phone">
                        <p class="label_class_p" v-html="$t('public.sign_up.contact_phone')"></p>
                            <el-row>
                                <el-select 
                                id="select_keyboard"
                                class="select_codes_class"
                                size=large
                                v-model="member_info.phone_codes"
                                :placeholder="$t('public.sign_up.phone_codes_placeholder')"
                                filterable>
                                    <el-option
                                    v-for="item in options.country_codes" 
                                    :key="item.iso2+' '+item.dialCode"
                                    :value="item.iso2+' '+item.dialCode"
                                    :label="item.dialCode">
                                        <span style="float:left">
                                            <el-image 
                                            :src="item.image_path"
                                            style="width:20px;margin-top:11px;">
                                            </el-image>
                                        </span>
                                        <span style="float:left;position:absolute;left:20%;" v-html="showCodesLabel(item)"></span>
                                    </el-option>                                    
                                </el-select>
                            </el-row>
                            <el-row>
                                <el-input 
                                class="input_class"
                                maxlength="20"
                                :placeholder="$t('public.sign_up.phone_placeholder')" 
                                v-model="member_info.contact_phone">
                                </el-input>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="col_num2">
                        <el-form-item
                        class="label_class"
                        prop="country">
                        <p class="label_class_p" v-html="$t('public.sign_up.country')"></p>
                            <el-select
                            id="select_country"
                            class="select_codes_class"
                            v-model="member_info.country"
                            :placeholder="$t('public.sign_up.country_placeholder')"
                            filterable
                            size=large>
                                <el-option
                                class="option_country_class"
                                v-for="item in options.country_codes" 
                                :key="item.iso2"
                                :value="item.iso2"
                                :label="item.name">
                                <span style="float:left;">
                                    <el-image 
                                    class="image_country"
                                    :src="item.image_path"
                                    style="width:20px;margin-top:11px;">
                                    </el-image>
                                </span>
                                <span style="float:left;position:absolute;left:20%;" v-html="showCountry(item)"></span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item 
                        class="label_class"
                        :label="$t('public.sign_up.zip_code')"
                        prop="zip_code">
                            <el-input 
                            type="text"
                            class="input_class"
                            maxlength="10"
                            v-model="member_info.zip_code"
                            :placeholder="$t('public.sign_up.zip_code_placeholder')">
                            </el-input>
                        </el-form-item>
                        <el-form-item 
                        class="label_class"
                        :label="$t('public.sign_up.address')"
                        prop="address">
                            <el-input 
                            class="input_class"
                            type="textarea"
                            :rows="row_num"
                            maxlength="255"
                            v-model="member_info.address"
                            :placeholder="$t('public.sign_up.address_placeholder')">
                            </el-input>
                        </el-form-item>
                        <el-form-item 
                        class="label_class"
                        prop="identification_or_passport">
                        <p class="label_class_p" v-html="$t('public.sign_up.identification_or_passport')"></p>
                            <el-input 
                            class="input_class"
                            type="text"
                            maxlength="40"
                            v-model="member_info.identification_or_passport"
                            :placeholder="$t('public.sign_up.id_pass_placeholder')">
                            </el-input>
                            <div class="form_description" v-html="$t('public.sign_up.id_pass_description')"></div>
                        </el-form-item>
                        <el-form-item 
                        class="label_class"
                        prop="contact_mail">
                        <p class="label_class_p" v-html="$t('public.sign_up.contact_mail')"></p>
                            <el-input 
                            class="input_class"
                            type="textarea"
                            :rows="row_num"
                            maxlength="200"
                            v-model="member_info.contact_mail"
                            :placeholder="$t('public.sign_up.mail_placeholder')">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <v-PrivacyPolicy></v-PrivacyPolicy>
                <el-row :gutter="20">
                    <el-col>
                        <div style="margin:10px 0px;">
                            <input type="checkbox" class="policy_checkbox" v-model="policy_check">
                            <div class="show_policy">{{$t('public.sign_up.policy_checkbox')}}</div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col>
                        <div>
                            <el-button class="btm_button" type="primary" @click="submitForm()" :disabled="!policy_check">{{$t('public.sign_up.confirm')}}</el-button>
                            <el-button class="btm_button" type="warning" @click="resetForm()">{{$t('public.sign_up.reset_form')}}</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <!-- <el-dialog 
            class="submit_success_class"
            :title="$t('public.sign_up.thx_registration')" 
            :visible.sync="submit_success" 
            :show-close="false"
            width=50% 
            center>
            <p class="submit_success_class_p">{{default_close_sec}} 
                <p class="submit_success_class_p" v-html="$t('public.sign_up.submit_success_and_leave_page')"></p>
            </p>
            </el-dialog> -->
        </div>
        <!-- <div class="no_form" v-if="!res_status">
            Thanks Your Viewing
        </div> -->
    </div>
</template>
<script>
import { registerService } from './services/register.service.js';
import { countryService } from './services/country_codes.js';
import { rsa_encypted } from './services/rsa_encrypted.js'
import vPrivacyPolicy from "./Privacy_Policy.vue";
export default {
    components: {
        vPrivacyPolicy,
    },
    data(){
        return {
            // default_close_sec:3,
            // submit_success:false,
            // submit_failure:false,
            window:{
                width: 0,
                height: 0
            },            
            lang:"",
            input_lang:"en",
            col_num1:0,
            col_num2:0,
            row_num:0,
            res_status:true,
            member_info:{
                address: "",
                birthdate: "",
                city: "",
                contact_mail: "",
                contact_phone: "",
                phone_codes: "",
                country: "",
                first_name: "",
                last_name: "",
                gender: "",
                identification_or_passport: "",
                zip_code: ""
            },
            policy_check:false,
            options:{
                gender:[
                    {label: "public.sign_up.male", value:"1"},
                    {label: "public.sign_up.female", value:"0"}
                ],
                country_codes:[],
            },
            img_array:[],
            rules:{
                first_name:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"},
                ],
                last_name:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"}
                ],
                gender:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"}
                ],
                birthdate:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"}
                ],
                contact_phone:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"}
                ],
                country:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"}
                ],
                identification_or_passport:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"},                    
                    {pattern: /[a-zA-Z0-9_\-. ]+$/, message: this.$i18n.t("public.sign_up.not_match"), trigger: "blur"}
                ],
                contact_mail:[
                    {required: true, message: this.$i18n.t("public.sign_up.required"), trigger: "blur"},
                    {type:"email", message: this.$i18n.t("public.sign_up.mail_pattern"), trigger: "blur"}
                ]
            }
        };
    },

    created(){
        console.log("signupform");
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
        this.getData();
    },


    methods:{
        // closeWindow(){
        //     let clock = window.setInterval(() => {
        //         this.default_close_sec--;
        //         if(this.default_close_sec==0){
        //             window.clearInterval(clock);
        //             window.open('','_self').close()
        //         }
        //     }, 1000)
        // },

        submitForm(){
            this.$refs.member_info.validate(valid => {
                if(valid){
                    if(!RegExp(/\d{4}-\d{2}-\d{2}/).test(this.member_info.birthdate)){
                        var date = new Date(this.member_info.birthdate)
                        var month = (date.getMonth()+1).toString().length==1?'0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
                        var day = date.getDate().toString().length==1?'0'+date.getDate().toString():date.getDate().toString();
                        this.member_info.birthdate = date.getFullYear()+'-'+month+'-'+day;
                    }
                    var post_member_info = {
                        "first_name":this.member_info.first_name,
                        "last_name":this.member_info.last_name,
                        "identification_or_passport":this.member_info.identification_or_passport,
                        "gender":this.member_info.gender,
                        "birthdate":this.member_info.birthdate,
                        "phone_codes":this.member_info.phone_codes,
                        "contact_phone":this.member_info.contact_phone,
                        "country":this.member_info.country,
                        "address":this.member_info.address,
                        "zip_code":this.member_info.zip_code,
                        "contact_mail":this.member_info.contact_mail
                    };
                    var register_url = this.$route.fullPath;
                    var cipher = Base64.encodeURI(JSON.stringify({
                        "post_member_info":post_member_info,
                        "register_url":register_url
                    }));
                    registerService.confirm_registraion(cipher)
                    .then(res => {
                        if(res.code==1){
                            this.$router.replace({path:'/registration/finish', query:{status:"success"}});
                        }else if(res.code==0){
                            if(res.msg=="public.sign_up.member_reward_expired"){
                                this.$router.replace({path:'/registration/finish', query:{status:"expired"}});
                            }else if(res.msg="public.sign_up.member_reward_used"){
                                this.$router.replace({path:'/registration/finish', query:{status:"used"}});
                            }else if(res.msg="public.sign_up.duplicated_sign_up_in_a_event"){
                                this.$router.replace({path:'/registration/finish', query:{status:"duplicated"}});
                            }else{
                                this.$router.replace({path:'/registration/finish', query:{status:"error"}});
                            }
                        }else{
                            this.$router.replace({path:'/registration/finish', query:{status:"error"}});
                        }
                    })
                }
            })
        },

        language_match(){
            var selection = {
                "zh-TW":"zh_tw",
                "ja-JP":"ja_jp",
                "zh-CN":"zh_cn",
                "en-US":"en"
            }
            if(this.lang in selection){
                this.input_lang = selection[this.lang];
            }else{
                this.input_lang = "en"
            }
            this.$i18n.locale = this.input_lang;
            localStorage.setItem("register_lang",!!localStorage.getItem("register_lang"));
            this.$emit('forceRender', localStorage.getItem("register_lang"));

        },

        resetForm(){
            this.member_info = {
                address: "",
                birthdate: "",
                city: "",
                contact_mail: "",
                contact_phone: "",
                phone_codes: "",
                country: "",
                first_name: "",
                last_name: "",
                gender: "",
                identification_or_passport: "",
                zip_code: ""
            }
            this.getCountry();
            this.$refs.member_info.clearValidate();
        },

        handleResize(){
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
            if(this.window.width>=768&&this.window.width<877){
                this.col_num1=12;
                this.col_num2=12;
                this.row_num=1;
            }else if(this.window.width>=877&&this.window.width<1095){
                this.col_num1=10;
                this.col_num2=10;
                this.row_num=1;
            }else if(this.window.width>=1095&&this.window.width<1426){
                this.col_num1=8;
                this.col_num2=8;
                this.row_num=1;
            }else if(this.window.width>=1426){
                this.col_num1=6;
                this.col_num2=6;
                this.row_num=1;
            }else{
                this.col_num1=24;
                this.col_num2=24;               
                this.row_num=2;
            }
        },

        showCheckBoxPolicy(){
            return "public.sign_up.policy_checkbox"
        },

        showCountry(item){
            if(item.name.indexOf("(")>0){
                return item.name.slice(0, item.name.indexOf("("))
            }else{
                return item.name
            }
        },

        getCountry(){
            if(this.member_info.country==""){
                this.member_info.country=countryService.get_country_iso2();
                if(this.member_info.phone_codes==""){
                    this.member_info.phone_codes="TW 886";
                    for(var i=0;i<this.options.country_codes.length;i++){
                        if(this.options.country_codes[i]['iso2']==this.member_info.country){
                            this.member_info.phone_codes=this.member_info.country+' '+this.options.country_codes[i]['dialCode'];
                        }
                    }
                }
            }
        },

        showCodesLabel(item){
            return "<p style='width:auto;'>"+this.showCountry(item)+' +'+item.dialCode+"</p>"
        },

        getOptions(){
            this.options.country_codes=countryService.get_country_codes();
        },

        async getData(){
            await
            registerService.get_registraion_form(this.$route.fullPath)
            .then(res => {
                if(res.code==1){
                    this.res_status = true;
                    this.lang = res.lang;
                    this.language_match();
                    this.getOptions();
                    if(res.member_info.identification_or_passport!=undefined){
                        var keys = Object.keys(res.member_info);
                        var key = "";
                        for(var key in keys){
                            var item = "";
                            var item = res.member_info[keys[key]];
                            if(typeof item === 'number' || item == '' || item == null){
                                this.member_info[keys[key]] = item;
                            }else{
                                this.member_info[keys[key]] = Base64.decode(item);
                            }
                            if(this.member_info[keys[key]]==null){
                                this.member_info[keys[key]]="";
                            }
                        }
                    };
                    this.getCountry();
                    this.img_array = require.context('@/../public/image/flagPng100px', false, /.png$/).keys()
                }else if(res.code==0){
                    this.res_status = false;
                    if(res.msg=="public.sign_up.member_reward_expired"){
                        this.$router.replace({path:'/registration/finish', query:{status:"expired"}});
                    }else if(res.msg="public.sign_up.member_reward_used"){
                        this.$router.replace({path:'/registration/finish', query:{status:"used"}});
                    }else if(res.msg="public.sign_up.duplicated_sign_up_in_a_event"){
                        this.$router.replace({path:'/registration/finish', query:{status:"duplicated"}});
                    }else{
                        this.$router.replace({path:'/registration/finish', query:{status:"error"}});
                    }
                }else{
                    this.$router.replace({path:'/registration/finish', query:{status:"error"}});
                }
            })
        },


    }
};
</script>
<style scoped>
.container{
    font-weight:bolder;
    border:0;
}
.label_class>>>.el-form-item__label{
    font-size:20px !important;
    margin-bottom:-5px;
}
.label_class_p{
    font-size:20px !important;
    line-height: 32px;
    margin-bottom:-5px;
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0 0 10px;
    color: #606266;
    box-sizing: border-box;
}
.input_class{
    width:100%;
    max-width:320px;
    margin-right:100%;
}
.form_description{
    width:100%;
    max-width:300px;
    font-size:80%;
    margin:-5px 0px -5px 0px;
    color:#C6C6C6;
}
.checkbox_male_class{
    margin-right:10px;
}
.checkbox_female_class{
    margin:0px 10px;
}
.checkbox_female_class.el-checkbox.is-bordered.is-checked{
    border-color: #FA8072;
    margin:0px 10px;
}
.checkbox_female_class>>>.el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #FA8072;
    border-color: #FA8072;
}
.checkbox_female_class>>>.el-checkbox__input.is-checked+.el-checkbox__label{
    color: #FA8072;
}
.checkbox_female_class>>>.el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #FA8072;
}
.select_codes_class{
    width:100%;
    max-width:320px;
    margin-bottom:5px;
    margin-right:100%;
}
.btm_button{
    margin-top:20px;
    margin-bottom:-10px;
}
.policy_checkbox{
    vertical-align:middle;
    float:left;
}
.show_policy{
    margin-left:7px;
    font-size:10px;
    display:inline-block;
    vertical-align:middle;
    color:#979797;
    float:left;
    position:absolute;
}
.no_form{
    text-align:center;
    vertical-align:middle;
}
.submit_success_class_p{
    text-align:center;
    color:#CDCDCD;
    font-style:italic;
    display:inline;
}
.submit_success_class>>>.el-dialog__title{
    color:#549942;
}
.submit_success_class>>>.el-dialog{
    border-radius:10px;
}
.submit_failure_class_p{
    text-align:center;
}
.submit_failure_class>>>.el-dialog__title{

}
@media(max-width:320px){
    #bar-scroller{
        position:relative; 
        width:80%;
        min-width:320px;
        overflow-x:scroll;
    }
}
</style>
<style>
</style>