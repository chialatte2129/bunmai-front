<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"/>
          {{$t('menus.role_edit')}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="mgb10">
        <el-button icon="el-icon-circle-plus-outline" size="large" type="success" class="mgr10" @click="new_role">{{$t('btn.new')}}</el-button>
        <el-input v-model="filter.role_id" size="large" :placeholder="$t('table_title.role')" class="handle-select mgr10" @change="handleSearchChange" clearable/>
        <el-input v-model="filter.description" size="large" :placeholder="$t('table_title.description')" class="handle-select mgr10" @change="handleSearchChange" clearable/>
        <el-button type="info" plain size="large" v-html="$t('btn.clean')" class="mgr10" @click="filter.role_id='', filter.description='', getData()"/>
      </div>
      <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label-width="100px">
              <el-form-item :label="$t('table_title.role')">
                <span><b>{{ props.row.role_id}}</b></span>
              </el-form-item>
              <el-form-item :label="$t('table_title.description')">
                <span><b>{{ props.row.description }}</b></span>
              </el-form-item>
              <el-form-item :label="$t('table_title.menus')">
                <div style="width:1200px;float:left;" v-if="props.row.show_menus!=''">
                  <el-tag v-for="role in props.row.show_menus.split(',')" style="margin-right:5px;" size="medium">{{role}}</el-tag>
                </div>
              </el-form-item>
              <el-form-item :label="$t('table_title.actions')">
                <div style="width:1200px;" v-if="props.row.action_menus!=''">
                  <el-tag v-for="role in props.row.action_menus.split(',')" style="margin-right:5px;" size="medium">{{role}}</el-tag>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="role_id" :label="$t('table_title.role')" width="auto"/>
        <el-table-column prop="description" :label="$t('table_title.description')" width="auto"/>
        <el-table-column :label="$t('btn.action')" width="185" align="center">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">{{$t('btn.edit')}}</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">{{$t('btn.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total_rows"/>
      </div>
    </div>


    <el-dialog :title="$t('common_msg.edit_title')" :visible.sync="editVisible" width="900px" :before-close="handleClose" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100" label-position="top">
        <el-form-item :label="$t('table_title.role')" prop="role_id">
          <el-input v-model="form.role_id" :readonly="!is_newdata"/>
        </el-form-item>
        <el-form-item :label="$t('table_title.description')">
          <el-input v-model="form.description"/>
        </el-form-item>
        <el-form-item :label="$t('table_title.menus')">
          <el-select v-model="menus_select" multiple filterable :placeholder="$t('btn.search')" style="width:94%;">
            <el-option v-for="item in all_menus" :key="item.index" :label="$t(item.title)" :value="item.index"/>
          </el-select>
          <el-button icon="el-icon-edit" class="mgl10" size="small" circle @click="searchSelect"/>
        </el-form-item>
        <el-form-item :label="$t('table_title.actions')">
          <div>
            <dicMenus v-if="editVisible" :menus_select_value="actions_select" keystr="SYSTEM-role-actions" formClass="menus-select-input" 
            :i18nAsLabel="true" :isMultiple="true" v-on:select_menu="select_value_from"/>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="saveEdit('form')">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('common_msg.warning')" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">{{$t('common_msg.delete_confirm')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="deleteRow">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog>

    <!-- 搜尋選擇視窗框 -->
    <el-dialog :title="$t('table_title.menus')" center width="900px" top="8vh" :key="selectBoxKey"
    :visible.sync="selectBoxEditVisible" :before-close="confirm_roles" :close-on-click-modal="false">
       <div class="menus-select">
        <el-transfer ref="transfer" style="text-align:left;display:inline-block;" filterable v-model="menus_select"
          :filter-method="filterMethod" :filter-placeholder="$t('btn.search')" :target-order="'push'"
          :titles="[$t('table_title.menus'), $t('table_title.has_selected')]" :format="{ noChecked:'${total}', hasChecked:'${checked}/${total}' }"
          :data="all_menus_Select_box">
          <span slot-scope="{option}">{{option.label}}</span>
        </el-transfer>
       </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirm_roles">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="confirm_roles">{{$t('btn.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { accountService } from "@/_services";
import { roleService } from "@/_services";
import dicMenus from "@/components/common/DictMenusForEditInfo.vue";
export default {
  name: "role_table",
  components: {
    dicMenus
  },
  data() {
    return {
      selectBoxKey:0,
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
      selectBoxEditVisible:false,
      form: {
        role_id: "",
        description: "",
        menus_id: "",
        actions_id:""
      },
      filter:{
        role:"",
        description:"",
      },
      idx: -1,
      local_settings: "/local_settings.json",
      add_menus: [], //read from local settings
      shop_menus: [], //read from mysql db
      menus_select: [],
      all_menus_Select_box:[],
      actions_select:[],
      filterMethod(query, item){
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      },
      test_select:[],
      rules: {
        role_id: [
          { required: true, message: this.$i18n.t("role.alert_id_must_fill"), trigger: "blur" }
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
    all_menus(){
      return this.shop_menus.concat(this.add_menus)
    } 
  },
  methods: {
    handleSearchChange(){
      this.handleCurrentChange(1)
    },
    searchSelect(){
      this.all_menus_Select_box=[];
      this.all_menus.forEach((menu, index) => {
        this.all_menus_Select_box.push({
          label: this.$t(menu.title),
          key: menu.index
        });
      });
      this.selectBoxEditVisible = true;
    },
    confirm_roles(){
      this.selectBoxEditVisible = false;
      this.selectBoxKey++;
    },
    select_value_from(param){
      this.actions_select=param
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
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
                  var actions_name = root.$t("actions."+item2);
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
            this.$message.error(this.$t(rs.msg_i18n));
            if (rs.msg_i18n == "account.token_over_exprie") {
              accountService.clean_login_info(localStorage, this.$router);
            }
          } else if (rs && rs.msg_code == -1) {
            this.$message.error(this.$t(rs.msg));
          }
        });
    },
    getMenus() {
      fetch(this.local_settings)
        .then(r => r.json())
        .then(json => {
          this.add_menus = json["menus"];
        }); 
    },
    search() {
      this.is_search = true;
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
      // console.log(this.actions_select)
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    handleClose(){
      this.editVisible=false;
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.form, this.menus_select.join(","));
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
                this.$message.error(this.$t(rs.msg_i18n));
                if (rs.msg_i18n == "account.token_over_exprie") {
                  accountService.clean_login_info(localStorage, this.$router);
                }
              } else if (rs && rs.msg_code == -1) {
                this.$message.error(this.$t(rs.msg));
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
      // console.log("select delete =");
      // console.log(this.tableData[this.idx].role_id);
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
            this.$message.error(this.$t(rs.msg_i18n));
            if (rs.msg_i18n == "account.token_over_exprie") {
             accountService.clean_login_info(localStorage, this.$router);
            }
          } else if (rs && rs.msg_code == -1) {
            this.$message.error(this.$t(rs.msg));
          }
        });
    }
  }
};
</script>
<style scoped>
.handle-select{
  width: 200px;
}
.mgl10{
  margin-left:10px;
}
.mgb10{
  margin-bottom:10px;
}
.mgr10{
  margin-right:10px;
}
.menus-select-input{
  width:99%;
  display:inline-block;
}
.menus-select{
  text-align:center;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table{
  width: 100%;
  font-size: 14px;
}
.crumbs >>> .el-breadcrumb{
  font-size: 20px;
  height: 25px;
}
.menus-select>>>.el-transfer-panel{
  width:320px;
  height:500px;
}
.menus-select>>>.el-transfer-panel__list{
  height:500px;
}
.menus-select>>>.el-transfer-panel__list.is-filterable{
  height:398px;
}
.menus-select>>>.el-input__icon{
  margin-left:0px;
}
</style>