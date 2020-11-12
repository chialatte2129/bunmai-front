<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-lock"></i>
          <b> {{$t('menus.user_edit')}}</b>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="success" icon="search" @click="new_user" style="margin-right:20px;">{{$t('btn.new')}}</el-button> -->
        <el-input clearable v-model="filter.account" :placeholder="$t('account.input_account')" class="handle-filter-account mr10"></el-input>
        <el-input clearable v-model="filter.alias" :placeholder="$t('account.input_alias')" class="handle-filter-alias mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">{{$t('btn.search')}}</el-button>
      </div>
      <div class="pagination-up">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total_rows">
        </el-pagination>
      </div>
      <el-table
        :data="data"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange">
        <el-table-column prop="username" :label="$t('table_title.account')" width="150"></el-table-column>
        <el-table-column prop="last_name" :label="$t('table_title.last_name')" width="250"></el-table-column>
        <el-table-column prop="info" :label="$t('table_title.info')" width="250"></el-table-column>
        <el-table-column prop="roles_id" :label="$t('table_title.role')"></el-table-column>
        <el-table-column prop="email" :label="$t('table_title.email')" :formatter="formatter"></el-table-column>
        <el-table-column :label="$t('btn.action')" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >{{$t('btn.edit')}}</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >{{$t('btn.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-down">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total_rows">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog
      :title="$t('common_msg.edit_title')"
      :visible.sync="editVisible"
      width="30%"
      :before-close="handleClose"
      :show-close="false">
      <el-form ref="form" :model="form" label-width="auto" :rules="computed_rules()">
        <el-form-item :label="$t('table_title.account')" prop="username">
          <el-input v-model="form.username" :disabled="form.is_odoo_user==1" :readonly="!is_newdata" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.last_name')" prop="last_name">
          <el-input v-model="form.last_name" :disabled="form.is_odoo_user==1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.info')">
          <el-input v-model="form.info" :disabled="form.is_odoo_user==1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.email')">
          <el-input v-model="form.email" :disabled="form.is_odoo_user==1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.input_new_pass')" prop="new_pass" v-if="is_newdata">
          <el-input type="password" v-model="form.new_pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('account.input_confirm_pass')"
          prop="confirm_pass"
          v-if="is_newdata">
          <el-input type="password" v-model="form.confirm_pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.role')">
          <el-select
            v-model="roles_select"
            multiple
            placeholder="Select"
            class="menus-select-input">
            <el-option
              v-for="item in options_roles"
              :key="item.role_id"
              :label="item.role_id"
              :value="item.role_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="saveEdit('form')">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog :title="$t('common_msg.warning')" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">{{$t('common_msg.delete_confirm')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="deleteRow">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { accountService } from "@/_services";
import { roleService } from "@/_services";
import { Message } from "element-ui";

export default {
  name: "account_table",
  data() {
    return {
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
      filter:{
        account:"",
        alias:""
      },
      form: {
        username: "",
        email: "",
        roles: "",
        last_name: "",
        new_pass: "",
        confirm_pass: "",
        info:"",
        is_odoo_user:0
      },
      idx: -1,
      local_settings: "/local_settings.json",
      options_roles: [], //read from local settings
      roles_select: [],
      rules: {
        username: [
          {
            required: true,
            message: this.$i18n.t("account.alert_input_new_account"),
            trigger: "blur"
          }
        ],
        last_name: [
          {
            required: true,
            message: this.$i18n.t("account.alert_input_new_alias"),
            trigger: "blur"
          }
        ],
        new_pass: [
          {
            required: this.is_newdata,
            message: this.$i18n.t("account.alert_input_new_pass"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: this.$i18n.t("rules.password_len"),
            trigger: "blur"
          }
        ],
        confirm_pass: [
          {
            required: this.is_newdata,
            message: this.$i18n.t("account.alert_input_confirm_pass"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: this.$i18n.t("rules.password_len"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getData();
    this.getRoles();
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
    computed_rules() {
      return {
        username: [
          {
            required: true,
            message: this.$i18n.t("account.alert_input_new_account"),
            trigger: "blur"
          }
        ],
        last_name: [
          {
            required: true,
            message: this.$i18n.t("account.alert_input_new_alias"),
            trigger: "blur"
          }
        ],
        new_pass: [
          {
            required: this.is_newdata,
            message: this.$i18n.t("account.alert_input_new_pass"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: this.$i18n.t("rules.password_len"),
            trigger: "blur"
          }
        ],
        confirm_pass: [
          {
            required: this.is_newdata,
            message: this.$i18n.t("account.alert_input_confirm_pass"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: this.$i18n.t("rules.password_len"),
            trigger: "blur"
          }
        ]
      };
    },
    
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleClose(done) {
      return false;
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      accountService
        .list_by_page(localStorage.getItem("ms_user_token"), this.cur_page, this.filter)
        .then(result => {
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
        info: "",
        last_name: "",
        new_pass: "",
        confirm_pass: ""
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
      this.getData();
    },
    formatter(row, column) {
      return row.email;
    },
    filterTag(value, row) {
      return row.tag === value;
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
        is_odoo_user:item.is_odoo_user
      };
      if (this.form.roles.trim() != "") {
        this.roles_select = this.form.roles.split(",");
      } else {
        this.roles_select = [];
      }
      this.is_newdata = false;
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
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
    deleteRow() {
      console.log(this.tableData[this.idx].username);
      accountService
        .delete_account(
          localStorage.getItem("ms_user_token"),
          this.tableData[this.idx].username
        )
        .then(result => {
          if (result.msg_code == 1) {
            console.log(result.data);
            this.$message.success(this.$t(result.msg_i18n));
            this.delVisible = false;
            this.cur_page = 1;
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
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 15px;
  float:left;
}
.pagination-up{
  float:right;
}
.pagination-down{
  margin-top:10px;
  text-align:right;
}
.handle-select {
  width: 120px;
}
.container{
  height:auto;
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
.handle-filter-account{
  width: 250px;
  display: inline-block;
}
.handle-filter-alias{
  width: 150px;
  display: inline-block;
}
</style>

<style>
    .el-breadcrumb {
        font-size: 20px;
        height: 25px;
    }
</style>