<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-lock"></i>
          <b> {{$t('menus.role_edit')}}</b>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="success" icon="search" @click="new_role" style="margin-right:20px;">{{$t('btn.new')}}</el-button>
        <el-input clearable v-model="filter.role" :placeholder="$t('role.input_role')" class="handle-filter-role mr10"></el-input>
        <el-input clearable v-model="filter.description" :placeholder="$t('role.input_description')" class="handle-filter-description mr10"></el-input>
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
        <el-table-column prop="role_id" :label="$t('table_title.role')" width="220"></el-table-column>
        <el-table-column prop="description" :label="$t('table_title.description')" width="250"></el-table-column>
        <el-table-column prop="show_menus" :label="$t('table_title.menus')"></el-table-column>
        <el-table-column prop="action_menus" :label="$t('table_title.actions')"></el-table-column>
        <el-table-column :label="$t('btn.action')" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)">{{$t('btn.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-down">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total_rows"
        ></el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog
      :title="$t('common_msg.edit_title')"
      :visible.sync="editVisible"
      width="30%"
      :before-close="handleClose"
      :show-close="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100">
        <el-form-item :label="$t('table_title.role')" prop="role_id">
          <el-input v-model="form.role_id" :readonly="!is_newdata"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.description')">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table_title.menus')">
          <el-select
            v-model="menus_select"
            multiple
            placeholder="Select"
            class="menus-select-input">
            <el-option
              v-for="item in all_menus"
              :key="item.index"
              :label="$t(item.title)"
              :value="item.index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table_title.action')">
          <div>
            <dicMenus v-if="editVisible" 
            :menus_select_value="actions_select" 
            keystr="SYSTEM-role-actions" 
            formClass="menus-select-input" 
            :i18nAsLabel="true" :isMultiple="true" 
            v-on:select_menu="select_value_from"
            ></dicMenus>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{$t('btn.cancel')}}</el-button>
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
import { shopService } from "@/_services";
import { Message } from "element-ui";
import dicMenus from "@/components/common/DictMenusForEditInfo.vue";
import Vue from "vue";

export default {
  name: "role_table",
  components: {
    dicMenus
  },
  data() {
    return {
      total_rows: 0,
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      is_newdata: false,
      editVisible: false,
      delVisible: false,
      filter:{
        role:"",
        description:""
      },
      form: {
        role_id: "",
        description: "",
        menus_id: "",
        actions_id:""
      },
      idx: -1,
      local_settings: "/local_settings.json",
      add_menus: [], //read from local settings
      shop_menus: [], //read from mysql db
      menus_select: [],
      actions_select:[],
      test_select:[],
      rules: {
        role_id: [
          {
            required: true,
            message: this.$i18n.t("role.alert_id_must_fill"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getData();
    this.getMenus();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.role_id === this.del_list[i].role_id) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (d.role_id.indexOf(this.select_cate) > -1) {
            return d;
          }
        }
      });
    },
    // actions_menu(){
    //   return this.actions_select
    // },
    all_menus(){
      //console.log(this.shop_menus.concat(this.add_menus))
      return this.shop_menus.concat(this.add_menus)
    } 
  },
  methods: {
    handleCancel(){
      this.editVisible=false;
      this.$refs.form.clearValidate();
    },
    select_value_from(param){
      this.actions_select=param
    },
    // 分页导航
    handleCurrentChange(val) {     
      this.cur_page = val;
      this.getData();
    },
    getData() {
      console.log(localStorage.getItem("ms_user_token"))
      console.log(this.cur_page)
      roleService
        .list_by_page(localStorage.getItem("ms_user_token"), this.cur_page, this.filter)
        .then(result => {
          if (result.msg_code == 1) {
            const root=this.$root
            var new_data=[]
            result.data.forEach(function(item, index) {             
              var menus_arr = item.menus_id.split(",");
              var menus_name_list=[]
                menus_arr.forEach(function(item2, index2) {                 
                var menus_name = root.$t("menus."+item2);
                menus_name_list.push(menus_name)                
              });

              if(item.actions_id==""){
                item['action_menus']=[];
              }else{
                var actions_arr = item.actions_id.split(",");
                var actions_name_list=[]
                  actions_arr.forEach(function(item2, index2) {                 
                  var actions_name = root.$t("dict.actions."+item2);
                  actions_name_list.push(actions_name)                
                });
              item['action_menus']=actions_name_list.join(',')
              };           
              item['show_menus']=menus_name_list.join(',')
              new_data.push(item)
            });
            this.tableData = new_data;
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
    beforeMount() {       
    //console.log('beforeMount')       
    },
    mounted() {     
      //console.log('mounted')    
    },
    // 获取 menus 的模拟数据
    getMenus() {       
      fetch(this.local_settings)
        .then(r => r.json())
        .then(json => {
          //console.log(json["menus"]);
          this.add_menus = json["menus"];
        }); 
       
    },
    search() {
      this.is_search = true;
      this.getData();
    },
    new_role() {
      this.is_newdata = true;
      this.editVisible = true;
      this.menus_select = [];
      this.actions_select = [];
      this.form = {
        role_id: "",
        description: "",
        menus_id: ""
      };
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        role_id: item.role_id,
        description: item.description,
        menus_id: item.menus_id,
        actions_id: item.actions_id
      };
      this.is_newdata = false;
      if (this.form.menus_id.trim() != "") {
        this.menus_select = this.form.menus_id.split(",");
      } else {
        this.menus_select = [];
      }

      if (this.form.actions_id.trim() != "") {
        this.actions_select = this.form.actions_id.split(",");
      } else {
        this.actions_select = [];
      }
      console.log(this.actions_select)
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    handleClose(done) {
      return false;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].role_id + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存编辑
    saveEdit(formName) {
      console.log(this.actions_select)
      this.$refs[formName].validate(valid => {
        if (valid) {
          //save
          console.log(this.form, this.menus_select.join(","));
          this.form.menus_id = this.menus_select.join(",");
          this.form.actions_id = this.actions_select.join(",");
          roleService
            .save_role(
              localStorage.getItem("ms_user_token"),
              this.is_newdata,
              this.form.role_id,
              this.form.description,
              this.form.menus_id,
              this.form.actions_id
            )
            .then(result => {
              if (result.msg_code == 1) {
                this.editVisible = false;
                this.is_newdata = false;
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
      //this.tableData.splice(this.idx, 1);
      console.log("select delete =");
      console.log(this.tableData[this.idx].role_id);
      roleService
        .delete_role(
          localStorage.getItem("ms_user_token"),
          this.tableData[this.idx].role_id
        )
        .then(result => {
          if (result.msg_code == 1) {
            this.$message.success(this.$t(result.msg_i18n));
            this.delVisible = false;
            this.cur_page= 1;
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

.handle-filter-role{
  width: 150px;
  display: inline-block;
}
.handle-filter-description{
  width: 250px;
  display: inline-block;
}
</style>

<style>
    .el-breadcrumb {
        font-size: 20px;
        height: 25px;
    }
</style>