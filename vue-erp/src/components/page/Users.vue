<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-lock"></i>
          {{$t('menus.user_edit')}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="account_filter" size="large" :placeholder="$t('table_title.account')" class="handle-select mr10" @change="handleSearchChange" clearable/>
        <el-input v-model="last_name_filter" size="large" :placeholder="$t('table_title.last_name')" class="handle-select mr10" @change="handleSearchChange" clearable/>
        <el-input v-model="roles_filter" size="large" :placeholder="$t('table_title.role')" class="handle-select mr10" @change="handleSearchChange" clearable/>
        <el-button type="info" plain size="large" v-html="$t('btn.clean')" class="mr10" @click="account_filter='', last_name_filter='', roles_filter='', getData()"/>
      </div>
      <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" tooltip-effect="light">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label-width="100px">
              <el-form-item :label="$t('table_title.account')">
                <span><b>{{ props.row.username }}</b></span>
              </el-form-item>
              <el-form-item :label="$t('table_title.last_name')">
                <span><b>{{ props.row.last_name }}</b></span>
              </el-form-item>
              <el-form-item :label="$t('table_title.role')">
                <div style="width:1000px;float:left;" v-if="props.row.roles_id!=''">
                  <el-tag v-for="role in props.row.roles_id.split(',')" style="margin-right:5px;" size="medium">{{ role }}</el-tag>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        
        <el-table-column prop="username" :label="$t('table_title.account')" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="last_name" :label="$t('table_title.last_name')" width="auto" show-overflow-tooltip></el-table-column>
        <el-table-column prop="info" :label="$t('table_title.info')" width="auto" show-overflow-tooltip></el-table-column>
        <el-table-column prop="email" :label="$t('table_title.email')" width="300" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('btn.action')" width="105" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="success" icon="el-icon-circle-check" @click="handleActive(scope.$index, scope.row)" v-if="!scope.row.is_active" :disabled="login_user==scope.row.username">
              {{$t('account.active')}}
            </el-button> -->
            <el-button type="warning" icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
            <!-- <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('btn.delete')}}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total_rows"></el-pagination>
      </div>
    </div>

    <el-dialog :title="$t('common_msg.edit_title')" :visible.sync="editVisible" :before-close="handleClose" width="50%" :key="dialogKey" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item :label="$t('table_title.account')" prop="username">
          <el-input v-model="form.username" :readonly="!is_newdata" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.last_name')" prop="last_name">
          <el-input v-model="form.last_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.info')">
          <el-input v-model="form.info" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.email')">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.input_new_pass')" prop="new_pass" v-if="is_newdata">
          <el-input type="password" v-model="form.new_pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.input_confirm_pass')" prop="confirm_pass" v-if="is_newdata">
          <el-input type="password" v-model="form.confirm_pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.role')">
          <el-select v-model="roles_select" filterable multiple placeholder="Select" class="menus-select-input">
            <el-option v-for="item in options_roles" :key="item.role_id" :label="item.role_id" :value="item.role_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="saveEdit('form')">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog :title="$t('common_msg.warning')" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">{{$t('common_msg.delete_confirm')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="deleteRow">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { accountService } from "@/_services";
import { roleService } from "@/_services";
import { shopManageService } from "@/_services";
import { Message } from "element-ui";

export default {
  name: "account_table",
  data() {
    return {
      dialogKey:0,
      total_rows: 0,
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_newdata: false,
      is_search: false,
      editVisible: false,
      delVisible: false,
      activeView:false,
      activeif:false,
      activeUser:"",
      login_user:accountService.get_user_info('ms_username'),
      form: {
        username: "",
        email: "",
        info:"",
        roles: "",
        last_name: "",
        new_pass: "",
        confirm_pass: "",
        dealers:[]
      },
      options:{
        dealers_list:[]
      },
      props: { multiple: true },
      account_filter:"",
      last_name_filter:"",
      roles_filter:"",
      idx: -1,
      local_settings: "/local_settings.json",
      options_roles: [], //read from local settings
      roles_select: [],
      
      rules: {
        username: [
          {
            required: true,
            message: this.$t("account.alert_input_new_account"),
            trigger: "blur"
          }
        ],
        last_name: [
          {
            required: true,
            message: this.$t("account.alert_input_new_alias"),
            trigger: "blur"
          }
        ],
        new_pass: [
          {
            required: true,
            message: this.$t("account.alert_input_new_pass"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: this.$t("rules.password_len"),
            trigger: "blur"
          }
        ],
        confirm_pass: [
          {
            required: true,
            message: this.$t("account.alert_input_confirm_pass"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: this.$t("rules.password_len"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getData();
    this.getRoles();
    // this.getOptionFilter();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.username === this.del_list[i].username) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.email.indexOf(this.select_cate) > -1 &&
            (d.username.indexOf(this.select_word) > -1 ||
              d.email.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleClose() {
      this.editVisible = false;
      this.dialogKey++;
      this.$refs.form.clearValidate();
    },
    handleSearchChange(){
      console.log("filter change");
      this.handleCurrentChange(1)
    },
    // getOptionFilter(){
    //   accountService
    //   .get_authdealer_list()
    //   .then(res =>{
    //     this.options.dealers_list=res.data;
    //   })
    // },
    // 获取 easy-mock 的模拟数据
    getData() {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      accountService
        .list_by_page(
          localStorage.getItem("ms_user_token"), 
          this.cur_page,this.account_filter,
          this.last_name_filter,this.roles_filter
        ).then(result => {
          if (result.msg_code == 1) {          
            this.tableData = result.data;
            this.total_rows = result.total_rows;
          } else {
            return result;
          }
        })
        .then(rs => {
          if (rs && rs.msg_code == 0) {
            Message({
              type: "error",
              message: this.$t(rs.msg_i18n)
            });
            if (rs.msg_i18n == "account.token_over_exprie") {          
              accountService.clean_login_info(localStorage, this.$router);
            }
          } else if (rs && rs.msg_code == -1) {
            Message({
              type: "error",
              message: this.$t(rs.msg)
            });
          }
        });
    },
    new_user() {
      this.is_newdata = true;
      this.form = {
        username: "",
        email: "",
        roles: "",
        info:"",
        last_name: "",
        new_pass: "",
        confirm_pass: "",
        // dealers:[]
      };
      this.roles_select = [];
      this.editVisible = true;
    },
    // 获取 menus 的模拟数据
    getRoles() {
      roleService
        .list_all_roles(localStorage.getItem("ms_user_token"))
        .then(result => {
          if (result.msg_code == 1) {
            this.options_roles = result.data;
          } else {
            return result;
          }
        })
        .then(rs => {
          if (rs && rs.msg_code == 0) {
            Message({
              type: "error",
              message: this.$t(rs.msg_i18n)
            });
            if (rs.msg_i18n == "account.token_over_exprie") {          
              accountService.clean_login_info(localStorage, this.$router);
            }
          } else if (rs && rs.msg_code == -1) {
            Message({
              type: "error",
              message: this.$t(rs.msg)
            });
          }
        });
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.email;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    tableRowClassName({row, rowIndex}){
      if(!row.is_active) return 'inactive-row' 
      return '';
    },
    handleActive(index, row){
      this.activeif=row.is_active?true:false;
      this.activeView=true;
      this.activeUser=row.username;
    },
    cancelActive(){
      this.activeView=false;
      this.activeif=false;
      this.activeUser="";
    },
    confirmActive(){
      accountService.active_account({username:this.activeUser,action:!this.activeif})
      .then(res=>{
        if(res.msg_code==1){
          if(this.activeif) this.$message.success(`${this.$t('common_msg.inactive_ok')}, ${this.$t('table_title.account')} : ${this.activeUser}`);
          else this.$message.success(`${this.$t('common_msg.active_ok')}, ${this.$t('table_title.account')} : ${this.activeUser}`); 
          this.cancelActive();
          this.getData();
        }else{this.$message.error(res.msg)}       
      })
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        username: item.username,
        last_name: item.last_name,
        email: item.email,
        roles: item.roles_id,
        info: item.info,
        // dealers: item.dealers_id
      };
      // console.log(this.form.dealers);
      if (this.form.roles.trim() != "") {
        this.roles_select = this.form.roles.split(",");
      } else {
        this.roles_select = [];
      }
      this.is_newdata = false;
      this.editVisible = true;
    },
    // handleDelete(index, row) {
    //   this.idx = index;
    //   this.delVisible = true;
    // },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].username + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$set(this.tableData, this.idx, this.form);
          this.form.roles = this.roles_select.join(",");
          var new_scr_pass = "";
          if (this.is_newdata) {
            new_scr_pass = btoa(btoa(this.form.new_pass));
            if (this.form.new_pass != this.form.confirm_pass) {
              Message({
                type: "error",
                message: this.$t("account.new_confirm_pass_not_match")
              });
              return false;
            }
          }
          accountService
            .update_account(
              localStorage.getItem("ms_user_token"),
              this.is_newdata,
              this.form.username,
              this.form.email,
              this.form.roles, 
              this.form.last_name, 
              this.form.info, 
              new_scr_pass 
              // this.form.dealers
            )
            .then(result => {
              if (result.msg_code == 1) {           
                this.editVisible = false;
                this.is_newdata = false;
                this.editVisible = false;
                this.$message.success(this.$t("common_msg.save_ok"));
                this.getData(); // refresh
              } else {
                return result;
              }
            })
            .then(rs => {
              if (rs && rs.msg_code == 0) {
                Message({
                  type: "error",
                  message: this.$t(rs.msg_i18n)
                });
                if (rs.msg_i18n == "account.token_over_exprie") {             
                  accountService.clean_login_info(localStorage, this.$router);
                }
              } else if (rs && rs.msg_code == -1) {
                Message({
                  type: "error",
                  message: this.$t(rs.msg)
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    // 确定删除
    // deleteRow() {
    //   accountService
    //     .delete_account(
    //       localStorage.getItem("ms_user_token"),
    //       this.tableData[this.idx].username
    //     )
    //     .then(result => {
    //       if (result.msg_code == 1) {
    //         this.$message.success(this.$t(result.msg_i18n));
    //         this.delVisible = false;
    //         this.cur_page = 1;
    //         this.getData(); // refresh
    //       } else {
    //         return result;
    //       }
    //     })
    //     .then(rs => {
    //       if (rs && rs.msg_code == 0) {
    //         Message({
    //           type: "error",
    //           message: this.$t(rs.msg_i18n)
    //         });
    //         if (rs.msg_i18n == "account.token_over_exprie") {            
    //           accountService.clean_login_info(localStorage, this.$router);
    //         }
    //       } else if (rs && rs.msg_code == -1) {
    //         Message({
    //           type: "error",
    //           message: this.$t(rs.msg)
    //         });
    //       }
    //     });
    // }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 10px;
}

.handle-select {
  width: 200px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.menus-select-input {
  width: 99%;
  display: inline-block;
}

.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.crumbs >>> .el-breadcrumb{
  font-size: 20px;
  height: 25px;
}
.inactive-btn{
  color:#E6A23C;
}
.active-btn{
  color:#67C23A;
}
.table >>> .inactive-row{
  background:#FFF8FC;
}
</style>
