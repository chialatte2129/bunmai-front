<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-collection"></i> {{$t('menus.project_manage')}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('menus.task_report')}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t('menus.day_item_person')}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb10">
                <el-button size="large" type="success" icon="el-icon-circle-plus-outline" class="mgr10" @click="handleCreate" :disabled="table_loading">{{$t('btn.new')}}</el-button>
                <el-select size="large" v-model="filter.item_id" filterable clearable :placeholder="$t('project.name')" @change="search" class="mgr10" :disabled="table_loading">
                    <el-option v-for="item in option.work_item" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id" :disabled="table_loading"/>
                </el-select>
                <el-date-picker v-model="filter.work_date" type="daterange" align="right" unlink-panels value-format="yyyy-MM-dd" :picker-options="pickerOptions" class="mgr10" :disabled="table_loading"
                size="large" @change="search" :range-separator="$t('employee.date_range')" :start-placeholder="$t('employee.start_date')" :end-placeholder="$t('employee.end_date')"/>
                <el-button size="large" type="info" class="mgr10" plain v-html="$t('btn.clean')" @click="cancelSearch" :disabled="table_loading"/>
                <el-button size="large" type="success" style="float:right;" plain v-html="$t('employee.edit_personal_tags')" @click="openTagManager"/>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" tooltip-effect="light" @sort-change="handleSortChange" v-loading="table_loading" 
            :span-method="dateCellMerge" :cell-style="getCellStyle" :key="tbKey">
                <el-table-column prop="work_date" :label="$t('employee.work_date')" width="120" sortable="custom" align="center" show-overflow-tooltip/>
                <el-table-column prop="item_id" :label="$t('project.name')" width="250" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.item_name}}</template>
                </el-table-column>
                <el-table-column prop="description" :label="$t('employee.description')" width="auto" show-overflow-tooltip/>
                <el-table-column prop="comp_time" :label="$t('overtime.comp_time')" width="105" align="right" header-align="left">
                    <template slot-scope="scope">
                        <span v-if="scope.row.comp_time">{{scope.row.comp_time}}</span><span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="work_hours" :label="$t('employee.work_hour')" width="105" align="right" header-align="left"/>
                <el-table-column prop="tag1" :label="$t('project.tag1')" width="140" sortable="custom" show-overflow-tooltip/>
                <el-table-column :label="$t('btn.action')" width="230" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)" :disabled="table_loading">{{$t('btn.edit')}}</el-button>
                        <el-button type="primary" size="mini" @click="handleCopy(scope.$index, scope.row)"
                        :disabled="table_loading||ban_status.includes(scope.row.status)||overtime_ban_status.includes(scope.row.overtime_status)">{{$t('btn.copy')}}</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)" 
                        :disabled="table_loading||ban_status.includes(scope.row.status)||overtime_ban_status.includes(scope.row.overtime_status)">{{$t('btn.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"
                :disabled="table_loading" :current-page="cur_page" :page-sizes="page_size_list" :page-size="page_size" :total="totalRow" background/>
            </div>
        </div>
        
        <el-dialog :title="$t('common_msg.warning')" :visible.sync="deleteView" width="500px" center :before-close="cancelDelete">
            <div class="del-dialog-cnt"><i class="el-icon-warning" style="color:#E6A23C;"/> {{$t('common_msg.ask_for_delete')}} ?</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">{{$t("btn.cancel")}}</el-button>
                <el-button type="primary" @click="confirmDelete">{{$t("btn.confirm")}}</el-button>
            </span>
        </el-dialog>
        
        <el-dialog :title="showTitle" :visible.sync="showVisible" width="600px" :before-close="cancelDialog" 
        :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="dlKey">
            <div v-loading.lock="dialog_loading">
                <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="auto">
                    <el-form-item :label="$t('employee.work_date')" prop="work_date">
                        <el-date-picker v-model="form.work_date" type="date" unlink-panels value-format="yyyy-MM-dd" class="handle-input" 
                        :placeholder="$t('common_msg.select_date')" :disabled="updateView||copyView" :picker-options="{
                            disabledDate(time){ 
                                return time.getTime()>Date.now()+day_mileseconds*31;
                            }
                        }"/>
                    </el-form-item>
                    <el-form-item :label="$t('employee.copy_date')" prop="copy_date" v-if="copyView">
                        <el-date-picker v-model="form.copy_date" type="date" unlink-panels value-format="yyyy-MM-dd" class="handle-input"
                        :placeholder="$t('common_msg.select_date')" :picker-options="{
                            disabledDate(time){
                                return time.getTime()>Date.now()+day_mileseconds*31||
                                time.getFullYear()+'-'+String(time.getMonth()+1).padStart(2, '0')+'-'+String(time.getDate()).padStart(2, '0')==form.work_date;
                            }
                        }"/>
                    </el-form-item>
                    <el-form-item :label="$t('project.name')" prop="item_id">
                        <el-select v-model="form.item_id" filterable clearable class="handle-input" :disabled="updateView||copyView" @change="handleChangeProj">
                            <el-option v-for="item in option.work_item_now" :key="item.item_id" :label="`${item.item_id} - ${item.item_name}`" :value="item.item_id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('employee.work_hour')" prop="work_hours">
                        <el-input v-model="form.work_hours" clearable maxlength="4" show-word-limit class="handle-input" 
                        :readonly="ban_status.includes(form.status)||overtime_ban_status.includes(form.overtime_status)"/>
                    </el-form-item>
                    <el-form-item :label="$t('employee.description')" prop="description" :key="desKey">
                        <el-input v-model="form.description" type="textarea" :rows="5" style="width:95%;"
                        :readonly="ban_status.includes(form.status)||overtime_ban_status.includes(form.overtime_status)"/>
                    </el-form-item>
                    <el-form-item :label="$t('project.tag1')" prop="tag1">
                        <el-select v-model="form.tag1" filterable clearable class="handle-input" :disabled="copyView||overtime_ban_status.includes(form.overtime_status)">
                            <el-option-group v-for="group in option.tags" :key="group.label" :label="$t(group.label)">
                                <el-option v-for="item in group.tags" :key="item" :label="item" :value="item"/>
                            </el-option-group>
                        </el-select>
                        <el-tooltip effect="light" :content="$t('employee.use_tag_tip')" placement="bottom" v-if="!copyView">
                            <i style="font-size:28px;vertical-align:middle;color:#F56C6C;border-color:#fbc4c4;" class="el-icon-question mgl10"></i>
                        </el-tooltip>
                        <el-tooltip effect="light" :content="$t('employee.edit_personal_tags')" placement="bottom" v-if="!copyView">
                            <el-button circle size=mini type=success plain style="margin-left:5px;" icon="el-icon-plus" @click="regetTag=true, openTagManager()"/>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item :label="$t('overtime.apply_comp_time')" prop="comp_time" v-if="!copyView">
                        <el-input v-model="form.comp_time" maxlength="5" @input="compTimeInput" show-word-limit class="handle-input" :placeholder="$t('overtime.comp_time_placeholder')"
                        :readonly="ban_status.includes(form.status)||overtime_ban_status.includes(form.overtime_status)"/>
                        <el-tooltip effect="light" :content="$t('overtime.comp_time_tips')" placement="bottom" v-if="!copyView">
                            <i style="font-size:28px;vertical-align:middle;color:#F56C6C;border-color:#fbc4c4;" class="el-icon-question mgl10"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer-loading">
                    <el-button @click="cancelDialog">{{$t("btn.cancel")}}</el-button>
                    <el-button type="primary" @click="confirmDialog" 
                    :disabled="ban_status.includes(form.status)||overtime_ban_status.includes(form.overtime_status)">{{$t("btn.confirm")}}</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog :title="$t('employee.edit_personal_tags')" :visible.sync="tagView" top="90px" width="1100px" 
        :before-close="cancelTagDialog" :close-on-press-escape="false" :close-on-click-modal="false" :destroy-on-close="true" :key="tagDlKey">
            <div v-loading.lock="tag_dl_loading">
                <el-row class="mgb10 mgl10">
                    <span style="color:#FF4242;">{{$t("employee.manage_tag_tip")}}</span>
                </el-row>
                <el-row>
                    <el-col :span="8" class="pdr10">
                        <el-card shadow="never" style="height:557px" body-style="padding:10px">
                            <div slot="header" class="clearfix">{{$t("project.list")}}</div>
                            <div class="tree_filter">
                                <el-input :placeholder="$t('btn.search')" v-model="filterProjText" style="width:100%;" clearable/>
                            </div>
                            <div class="scrollBar">
                                <el-scrollbar ref="scroll" wrap-class="list" view-class="view-box" :native="false" style="height:457px;">
                                    <el-tree class="filtered-tree" node-key="item_id" ref="proj_tree" highlight-current :expand-on-click-node="false"
                                    :data="proj_tree" :props="defaultProps" :filter-node-method="filterNode">
                                        <span class="custom-tree-node" slot-scope="{node, data}" :style="activeStyle(data.is_open_tags)">
                                            <span class="node_label_1" v-if="node.level===1">{{node.label}}</span>
                                            <span class="node_icon">
                                                <span class="node_plus">
                                                    <el-button size=mini type=primary icon="el-icon-plus" circle plain @click="addToPersTree(data)"/>
                                                </span>
                                            </span>
                                        </span>
                                    </el-tree>
                                </el-scrollbar>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="pdr10">
                        <el-card shadow="always" style="height:557px" body-style="padding:10px">
                            <div slot="header" class="clearfix">{{$t("project.personal_tag")}}</div>
                            <div class="tree_filter">
                                <el-input :placeholder="$t('btn.search')" v-model="filterPersText" style="width:100%;" clearable/>
                            </div>
                            <div class="scrollBar">
                                <el-scrollbar ref="scroll" wrap-class="list" view-class="view-box" :native="false" style="height:457px;">
                                    <el-tree class="filtered-tree" node-key="item_id" ref="pers_tree" highlight-current :expand-on-click-node="false"
                                    :data="pers_tree" :props="defaultProps" :filter-node-method="filterNode" @node-click="handleNodeClick">
                                        <span class="custom-tree-node" slot-scope="{node, data}" :style="activeStyle(data.is_open_tags)">
                                            <span class="node_label_1" v-if="node.level===1">{{node.label}}</span>
                                            <span class="node_icon" v-if="!/^[_]+/.test(node.label)">
                                                <span class="node_plus">
                                                    <el-tooltip effect="light" :content="$t('employee.clear_tag_tip')" placement="left">
                                                        <el-button size=mini type=danger icon="el-icon-minus" circle plain @click="delToProjTree(data)"/>
                                                    </el-tooltip>
                                                </span>
                                            </span>
                                        </span>
                                    </el-tree>
                                </el-scrollbar>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="pdr10">
                        <el-card shadow="always" style="height:557px" body-style="padding:10px" class="tag-dialog">
                            <div slot="header" class="clearfix">
                                <div>{{$t("project.tags")}}</div>
                                <div class="mgt10" v-if="tag_form.item_id">{{edit_tag_info.label}}</div>
                            </div>
                            <div v-if="tag_form.item_id">
                                <!-- <el-button type=primary size=medium @click="saveTags">{{$t("btn.save")}}</el-button> -->
                                <!-- <el-button type=info plain size=medium @click="tag_form.tags=[]">{{$t("btn.reset")}}</el-button> -->
                                <!-- <el-divider/> -->
                                <el-input style="width:100%;" v-model="tagValue" clearable ref="saveTagInput" size=medium show-word-limit maxlength="20"
                                @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"/>
                                <!-- <el-button v-else type=warning plain size=medium @click="showInput">{{$t("project.add_tags")}}</el-button> -->
                                <el-divider class="tag-group"/>
                                <el-tag style="margin:5px 5px 0px 0px;" :key="tag" v-for="tag in tag_form.tags" size=large type=success closable 
                                :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { dayItemService, personTagService } from "@/_services";
export default {
    name: "day_item_person",
    data(){
        return {
            odoo_employee_id:localStorage.getItem("ms_odoo_employee_id"),
            fullname:localStorage.getItem("ms_user_fullname"),
            tbKey:0,
            dlKey:0,
            desKey:0,
            tagDlKey:1000,
            table_loading:false,
            dialog_loading:false,
            tag_dl_loading:false,
            tableData:[],
            totalRow:0,
            spanArr:[],
            pos:0,
            cur_page: 1,
            page_size:10,
            page_size_list:[5, 10, 20, 50],
            start_row:0,
            sort_column:"work_date",
            sort:"desc",
            deleteInfo:{
                pid:localStorage.getItem("ms_odoo_employee_id"),
                item_id:null,
                work_date:"",
                tag1:"",
                overtime_application_udid:null,
            },
            deleteView:false,
            createView:false,
            updateView:false,
            copyView:false,
            tagView:false,
            tagVisible:false,
            tagValue:"",
            regetTag:false,
            des_flag:false,
            filter:{
                item_id:null,
                work_date:[],
                pid:localStorage.getItem("ms_odoo_employee_id"),
            },
            ban_status:["F"],
            overtime_ban_status:["F", "A"],
            edit_idx:null,
            form:{
                pid:localStorage.getItem("ms_odoo_employee_id"),
                p_name:localStorage.getItem("ms_user_fullname"),
                item_id:"",
                work_date:"",
                work_hours:"",
                description:"",
                tag1:"",
                comp_time:null,
                overtime_status:"",
                overtime_application_udid:null,
            },
            tag_form:{
                item_id:"",
                pid:localStorage.getItem("ms_odoo_employee_id"),
                tags:[],
            },
            edit_tag_info:{
                label:"",
            },
            isRemove:false,
            filterProjText:"",
            filterPersText:"",
            proj_tree:[],
            pers_tree:[],            
            defaultProps: {
                children:"children",
                label:"label",
                level:"level",
            },
            option:{
                work_item:[],
                work_item_now:[],
                tags:[],
            },
            day_mileseconds:86400000,
            pickerOptions:{
                disabledDate(time){
                    return time.getTime() > Date.now()+86400000*31;
                },
                shortcuts:[
                    {
                        text: this.$t('employee.today'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('employee.yesterday'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('employee.week'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: this.$t('employee.month'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: this.$t('employee.three_months'),
                        onClick(picker){
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            
            rules_org: {
                work_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                copy_date: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                item_id: [
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur", "change"]},
                ],
                work_hours: [
                    {pattern: /^[0-9.]+$/, message: `${this.$t('rules.only_numbers')} [0123456789.]`, trigger: ["blur", "change"]},
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
                comp_time:[
                    {pattern: /^[0-9.]+$/, message: `${this.$t('rules.only_numbers')} [0123456789.]`, trigger: ["blur", "change"]},
                ],
            },

            rules_com:{
                description:[
                    {required: true, message: this.$t("common_msg.must_fill"), trigger: ["blur"]},
                ],
            }
        }
    },

    async created(){
        await this.connectFromOtherPlace();
        await this.getOption();
        await this.getData();
    },

    watch:{
        filterProjText(val){
            this.$refs.proj_tree.filter(val);
        },

        filterPersText(val){
            this.$refs.pers_tree.filter(val);
        },
    },

    computed:{
        rules(){
            var output_rules = this.rules_org;
            var com_key = Object.keys(this.rules_com);
            if(this.des_flag){
                for(var key of com_key){
                    output_rules[key] = this.rules_com[key];
                };
            }else{
                for(var key of com_key){
                    delete output_rules[key];
                };
            };
            this.desKey++;
            return output_rules;
        },

        count_page(){
            this.start_row=(this.cur_page-1)*this.page_size;
        },

        showTitle(){
            if(this.createView) return this.$t("employee.create_day_item");
            else if(this.updateView) return this.$t("employee.update_day_item");
            else if(this.copyView) return this.$t("employee.copy_day_item");
            else return "";
        },

        showVisible(){
            if(this.createView) return this.createView;
            else if(this.updateView) return this.updateView;
            else if(this.copyView) return this.copyView;
            else return false;
        },
    },    
    
    methods:{
        getCellStyle({ column }){
            const tempWidth=column.realWidth||column.width;
            if(column.showOverflowTooltip){
                return {
                    minWidth:`${tempWidth}px`,
                    maxWidth:`${tempWidth}px`
                }
            };
            return {};
        },

        connectFromOtherPlace(){
            if(this.$route.query.pjid){
                this.filter.item_id=this.$route.query.pjid;
            };
            if(this.$route.query.date){
                this.filter.work_date=[this.$route.query.date, this.$route.query.date];
            };
            this.$router.replace("day_item_person").catch(err => {});
        },

        compTimeInput(){
            if((/^[0-9.]+$/.test(this.form.comp_time))&&parseFloat(this.form.comp_time)>0){
                if(parseFloat(this.form.comp_time)>100){
                    this.form.comp_time=99.99;
                };
                return this.des_flag=true;
            };
            return this.des_flag=false;
        },

        async handleNodeClick(data){
            if(!this.isRemove){
                this.tag_dl_loading=true;
                this.resetTagForm();
                await personTagService.get_tag({pid:this.odoo_employee_id, item_id:data.item_id}).then(res =>{
                    if(res.code==1){
                        this.tag_form=res.tag_form;
                        this.edit_tag_info.label=data.item_name;
                    }else{
                        this.$message.error(this.$t("common_msg.contact_maintainer"));
                    }
                });
                this.tag_dl_loading=false;
            };
        },

        async addToPersTree(data){
            this.tag_dl_loading=true;
            await personTagService.add_tag({pid:this.odoo_employee_id, item_id:data.item_id}).then(res =>{
                if(res.code==1){
                    this.pers_tree.push(data);
                    this.pers_tree.sort((a, b) => a.item_id.localeCompare(b.item_id));
                    var pos = this.proj_tree.indexOf(data);
                    if(pos!=-1) this.proj_tree.splice(pos, 1);
                    this.handleNodeClick(data);
                }else{
                    this.$message.error(this.$t("common_msg.contact_maintainer"));
                }
            });
            this.tag_dl_loading=false;
        },

        async delToProjTree(data){
            this.isRemove=true;
            this.tag_dl_loading=true;
            await personTagService.remove_tag({pid:this.odoo_employee_id, item_id:data.item_id}).then(res =>{
                if(res.code==1){
                    this.proj_tree.push(data);
                    this.proj_tree.sort((a, b) => a.item_id.localeCompare(b.item_id));
                    var pos = this.pers_tree.indexOf(data);
                    if(pos!=-1) this.pers_tree.splice(pos, 1);
                    if(data.item_id==this.tag_form.item_id){
                        this.resetTagForm();
                    };
                }else{
                    this.$message.error(this.$t("common_msg.contact_maintainer"));
                }
            });
            this.isRemove=false;
            this.tag_dl_loading=false;
        },

        async saveTags(){
            this.tag_dl_loading=true;
                await personTagService.save_tag(this.tag_form).then(res =>{
                    if(res.code==1){
                        // this.$message.success(this.$t("common_msg.save_ok"));
                    }else if(res.code==0){
                        this.$message.warning(this.$t(res.msg));
                    }else{
                        this.$message.error(this.$t(res.msg));
                    };
                });
            this.tag_dl_loading=false;
        },

        filterNode(value, data){
            if(!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        async handleClose(tag){
            await this.tag_form.tags.splice(this.tag_form.tags.indexOf(tag), 1);
            await this.saveTags();
        },

        async handleInputConfirm(){
            let inputValue=this.tagValue;
            if(inputValue){
                if(!this.tag_form.tags.includes(inputValue)){
                    await this.tag_form.tags.push(inputValue);
                    await this.saveTags();
                };
            };
            this.tagVisible=false;
            this.tagValue="";
        },

        showInput(){
            this.tagVisible=true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        async openTagManager(){
            await personTagService.get_tag_tree({pid:this.odoo_employee_id}).then(res =>{
                if(res.code==1){
                    this.proj_tree=res.proj_tree;
                    this.pers_tree=res.pers_tree;
                    this.tagView=true;
                }else{
                    this.$message.error(this.$t("common_msg.contact_maintainer"));
                    this.tagView=false;
                }
            });
        },

        resetTagForm(){
            this.tag_form={
                item_id:"",
                pid:localStorage.getItem("ms_odoo_employee_id"),
                tags:[],
            };
            this.edit_tag_info={
                label:"",
            };
        },

        async cancelTagDialog(){
            if(this.regetTag) await this.get_filter_tag();
            this.tagView=false;
            this.resetTagForm();
            this.regetTag=false;
        },
        
        activeStyle(status){
            if(status==1){
                return "background:#FFEDED;";
            }
            return "background:#FCFFF7;";
        },

        getSpanArr(data){
            this.resetSpanArr();
            for(var i=0;i<data.length;i++){
                if(i===0){ 
                    this.spanArr.push(1);
                    this.pos=0;
                }else{
                    if(data[i].work_date===data[i-1].work_date){
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

        dateCellMerge({row, column, rowIndex, columnIndex}){
            if(column.property==="work_date"){
                const _row=this.spanArr[rowIndex];
                const _col=_row>0?1:0;
                return { rowspan:_row, colspan:_col }
            }
        },

        async handleChangeProj(){
            this.form.tag1="";
            this.option.tags=[];
            await this.get_filter_tag();
        },

        handleCopy(index, row){
            var today = new Date();
            var temp_form=Object.assign({}, row);
            temp_form.copy_date=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2, "0")+'-'+String(today.getDate()).padStart(2, "0");
            if(temp_form.work_date==temp_form.copy_date){
                temp_form.copy_date="";
            };
            this.form = temp_form;
            this.edit_idx=index;
            this.copyView=true;
        },

        async handleCreate(){
            var today = new Date();
            this.form.work_date=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            await this.get_filter_tag();
            this.createView=true;
        },

        async handleEdit(index, row){
            this.form=Object.assign({}, row);
            this.form.org_tag1=row.tag1;
            await this.get_filter_tag();
            this.edit_idx=index;
            this.updateView=true;
        },

        handleDelete(index, row){
            this.deleteInfo={
                pid:this.odoo_employee_id,
                item_id:row.item_id,
                work_date:row.work_date,
                tag1:row.tag1,
                overtime_application_udid:row.overtime_application_udid,
            };
            this.deleteView=true;
        },

        handleDeleteChange(){
            if(this.start_row==(this.totalRow-1)&&this.start_row!=0){ this.start_row-=this.page_size }
            this.getData();
        },

        cancelDelete(){
            this.deleteInfo={
                pid:this.odoo_employee_id,
                item_id:null,
                work_date:"",
                tag1:"",
                overtime_application_udid:null,
            };
            this.deleteView=false;
        },

        confirmDelete(){
            var param = {
                action:"delete",
                form:this.deleteInfo
            }
            this.update_day_item(param);
        },

        async update_day_item(param){ 
            this.dialog_loading=true;
            await dayItemService.update_day_item(param).then(res =>{ 
                if(res.code==1){ 
                    this.$message.success(this.$t(res.msg)); 
                    if(["create", "copy"].includes(param.action)){
                        this.getData();
                        this.cancelDialog();
                    }else if(param.action=="update"){
                        delete param.form["org_tag1"];
                        this.tableData[this.edit_idx]=param.form;
                        this.tbKey++;
                        this.getData();
                        this.cancelDialog();
                    }else if(param.action=="delete"){
                        this.cancelDelete()
                        this.handleDeleteChange();
                    }
                }else if(res.code==0){ 
                    this.$message.warning(this.$t(res.msg)); 
                }else{ 
                    this.$message.error(this.$t(res.msg)); 
                } 
            }) 
            this.dialog_loading=false;
        },

        confirmDialog(){
            this.$refs.form.validate(valid => {
                if(valid){
                    var temp_form = Object.assign({}, this.form);
                    var param = {
                        action:this.createView?"create":(this.updateView?"update":"copy"),
                        form:temp_form
                    };
                    this.update_day_item(param);
                }
            })
        },

        cancelDialog(){
            this.resetForm();
            this.createView=false;
            this.updateView=false;
            this.copyView=false;
        },

        resetForm(){
            this.dlKey++;
            this.form={
                pid:this.odoo_employee_id,
                p_name:this.fullname,
                item_id:"",
                work_date:"",
                work_hours:"",
                description:"",
                tag1:"",
                comp_time:null,
                overtime_status:"",
                overtime_application_udid:null,
            };
            this.option.tags=[];
            this.edit_idx=null;
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
            this.table_loading=true;
            var param = {
                action:"table",
                sort_column:this.sort_column,
                sort:this.sort,
                start_row:this.start_row,
                page_size:this.page_size,
                filter:this.filter
            }
            await dayItemService.person_day_list(param).then(res =>{ 
                this.tableData=res.day_items;
                this.totalRow=res.total;
                this.getSpanArr(this.tableData);
            })
            this.table_loading=false;
        },
        
        async getOption(){
            await dayItemService.get_option_list({action:["work_item", "work_item_now"]}).then(res =>{ 
                this.option.work_item=res.work_item;
                this.option.work_item_now=res.work_item_now;
            });
        },

        async get_filter_tag(){
            this.dialog_loading=true;
            await dayItemService.get_option_list({action:["tags"], param:{item_id:this.form.item_id, pid:this.odoo_employee_id}}).then(res =>{ 
                this.option.tags=res.tags;
            });
            this.dialog_loading=false;
        },

        search(){
            this.handleCurrentChange(1);
        },
        
        cancelSearch(){
            this.filter={
                item_id:null,
                work_date:[],
                pid:this.odoo_employee_id
            };
            this.tbKey++;
            this.sort_column="work_date";
            this.sort="desc";
            this.handleCurrentChange(1);
        },
    }
}
</script>
<style scoped>
    .handle-input{
        width: 300px;
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
    .pdr10{
        padding-right:10px;
    }
    .crumbs >>> .el-breadcrumb{
        font-size:20px;
        height:25px;
    }
    .dialog-footer-loading{
        text-align:right;
        margin:40px 0 -10px 0;
    }
    .clearfix{
        position:relative;
        line-height:1.23;
        font-size: 16px;
    }
    .custom-tree-node{
        flex:1;
        display:flex;
        align-items:center;
        justify-content:space-between;
        font-size:14px;
        padding-right:15px;
    }
    .scrollBar{ 
        height:440px; 
        overflow:hidden; 
    } 
    .list{ 
        max-height:10px; 
    }
    .custom-tree-node >>> .node_label_1{
        width:150px;
        line-height:26px;
    }
    .custom-tree-node >>> .node_plus{
        line-height:20px;
    }
    .filtered-tree >>> .el-tree-node__expand-icon.is-leaf{
        display:none;
    }
    .filtered-tree{
        margin-left:3px;
    }
    .tree_filter{
        margin:0px 0px 10px 2px;
        min-width:100px;
        width:100%;
    }
    .node_icon >>> .el-button--primary.el-button--mini.is-circle{
        padding:3px;
        position:absolute;
    }
    .node_icon >>> .el-button--danger.el-button--mini.is-circle{
        padding:3px;
        position:absolute;
    }
    .node_plus{
        margin-right:20px;
        z-index:2;
    }
    .tag-dialog >>> .el-divider--horizontal{
        margin:10px 0;
    }
    .tag-dialog >>> .el-divider--horizontal.tag-group{
        margin:10px 0 5px 0;
    }
    .container{
        margin-right:150px;
    }
</style>