<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-lock"></i> 
          <b> {{$t('menus.dict_setting')}}</b>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" >
      <div class="background-wrap">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-row :gutter="10">
              <el-card shadow="hover" class="mgb10 mgr20" :body-style="{ padding:'10px'}" style="min-height:693px;height:auto">
                <div slot="header" class="clearfix">
                  <div>
                    <span><b>{{$t('dict.dict_list')}}</b></span>
                    <span style="float:right;font-size:12px;margin-top:-4px;">
                      <div>{{count_total_setting.category_quantity}}</div>
                      <div>{{count_total_setting.setting_quantity}}</div>
                    </span>
                  </div>
                </div>
                <div class="scrollBar">
                  <el-input class="tree_filter" :placeholder="$t('btn.key_word')" v-model="filterText" clearable/>
                  <el-scrollbar
                  ref="scroll" 
                  wrap-class="list" 
                  view-class="view-box" 
                  :native="false" 
                  style="height:600px;">
                    <el-tree
                      id="dictionary"
                      node-key="id"
                      ref="dict_tree"
                      :data="dict_tree"
                      :props="dictTreeProps"
                      :filter-node-method="filterNode"
                      :default-expanded-keys="this.expand_key"
                      highlight-current
                      @node-expand="handleNodeExpand"
                      @node-collapse="handleNodeCollapse">
                        <span class="custom-tree-node" slot-scope="{node, data}">
                          <span class="node_label_1" v-if="node.level===1">{{data.label_show}}</span>
                          <span class="node_label_2" v-if="node.level===2" @click="dict_edit_click(data)">{{data.label_show}}</span>
                          <span class="node_icon">
                            <span class="node_plus">
                              <el-button size=mini type=warning icon="el-icon-edit" circle v-if="node.level==2" @click="dict_edit_click(data)"></el-button>
                              <el-button size=mini type=danger icon="el-icon-delete" circle v-if="node.level==2" @click="dict_delete_click(data)"></el-button>
                            </span>
                          </span>
                        </span>
                      </el-tree>
                  </el-scrollbar>
                </div>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="18">
            <el-row :gutter="10">
             <el-card shadow="hover" class="mgb10" style="min-height:690px;height:auto">
                <div slot="header" class="clearfix">
                  <span><b>{{$t('dict.dict_setting')}}</b></span>
                  <el-button size="large" type="primary" class="card-header-r-btn" @click="dict_save_click('dict_content')" icon="el-icon-files">{{$t('btn.save')}}</el-button>
                  <el-button size="large" type="info" class="card-header-btn" @click="dict_clear_click">{{$t('btn.clean')}}</el-button>
                </div>
                <el-form
                  ref="dict_content"
                  :model="dict_content"
                  label-width="120px"
                  :rules="computed_rules">
                  <el-form-item :label="$t('dict.key_title')" prop="keystr">
                    <el-input :disabled="!dict_content.is_new" v-model="dict_content.keystr" maxlength="50"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('dict.category_title')" prop="category">
                    <el-input v-model="dict_content.category" maxlength="50"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('dict.description_title')" prop="description">
                    <el-input v-model="dict_content.description" maxlength="50"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('dict.content_title')" prop="jsonvalue">
                    <el-input type="textarea" :rows="21" v-model="dict_content.jsonvalue"></el-input>
                  </el-form-item>
                </el-form>
            </el-card>
            </el-row>
          </el-col>
        </el-row>
        </el-col>
        </el-card>
      </el-col>
      </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { dictService } from "@/_services";
import { Message } from "element-ui";
export default {
  name: "varbox_management",
  components: {

},
  data() {
    return {
      test_select:"",
      dialogVisible: false,
      summary_info: {},
      filterText:"",
      category_quantity:"",
      setting_quantity:"",
      dict_content: { is_new: true },
      dict_tree: [],
      dictTreeProps: {
        level: "level",
        id: "id",
        children: "children",
        label: "label_show"
      },
      expand_key:[],
      computed_rules: {
        keystr: [
          {
            required: true,
            message: this.$i18n.t("dict.alert_input_new_keystr"),
            trigger: "blur"
          }
        ],
        category: [
          {
            required: true,
            message: this.$i18n.t("dict.alert_input_new_category"),
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: this.$i18n.t("dict.alert_input_new_description"),
            trigger: "blur"
          }
        ],
        jsonvalue: [
          {
            required: true,
            message: this.$i18n.t("dict.alert_input_new_content"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    count_total_setting() {
      this.page_first_enter();
      this.summary_info = {
        "category_quantity":this.category_quantity,
        "setting_quantity":this.setting_quantity
      }
      return this.summary_info;
    }
  },
  methods: {
    filterNode(value, data){
      if(!value.toUpperCase()) return true;
      return `${data.label_show}${data.id}`.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    handleNodeExpand(data){
        let flag = false
        this.expand_key.some(item => {
            if(item === data.id){
                flag = true;
                return true
            }
        })
        if(!flag){
            this.expand_key.push(data.id);
        }
    },
    handleNodeCollapse(data){
        this.expand_key.some((item, i) => {
            if (item === data.id) {
                this.expand_key.splice(i, 1);
            }
        })
    },



    select_value_from(param){
         this.test_select=param
    },
    dict_clear_click() {
      this.$refs.dict_content.clearValidate();
      this.dict_content = { is_new: true };
    },
    dict_save_click(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isJsonString(this.dict_content.jsonvalue)) {
            dictService
              .update_dict_content(
                localStorage.getItem("ms_user_token"),
                this.dict_content
              )
              .then(result => {
                if (result.msg_code == 1) {
                  this.dict_content["is_new"] = false;
                  this.page_first_enter();
                  Message({
                    type: "success",
                    message: this.$t(result.msg_i18n)
                  });
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
                } else if (rs && rs.msg_code == -1) {
                  Message({
                    type: "error",
                    message: this.$t(rs.msg)
                  });
                }
              });
          } else {
            Message({
              type: "error",
              message: this.$t("dict.content_must_json")
            });
          }
        }
      });
    },
    dict_delete_click(keystr) {
      this.$confirm(
        this.$t("common_msg.delete_confirm"),
        this.$t("common_msg.warning"),
        {
          confirmButtonText: this.$t("btn.confirm"),
          cancelButtonText: this.$t("btn.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          dictService
            .delete_dict_by_key(
              localStorage.getItem("ms_user_token"),
              keystr["id"]
            )
            .then(result => {
              if (result.msg_code == 1) {
                if (keystr["id"] == this.dict_content["keystr"]) {
                  this.dict_clear_click();
                }
                this.page_first_enter();
                Message({
                  type: "success",
                  message: this.$t(result.msg_i18n)
                });
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
              } else if (rs && rs.msg_code == -1) {
                Message({
                  type: "error",
                  message: this.$t(rs.msg)
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common_msg.action_cancel")
          });
        });
    },
    isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    page_first_enter() {
      if (
        localStorage.getItem("ms_local_new") ||
        localStorage.getItem("ms_local_new") == undefined
      ) {
        localStorage.setItem("ms_local_new", false);
        this.getTree();
      }
    },
    getTree() {
      dictService
        .get_category_tree()
        .then(result => {
          if (result.msg_code == 1) {
            this.dict_tree = result.data;
            this.category_quantity=this.$t("dict.category_quantity") + String(result.data.length);
            this.setting_quantity=this.$t("dict.setting_quantity") + String(result.setting_count);
          } else {
            return result;
          }
        })
        .then(rs => {
          if (rs && rs.msg_code == 0) {
            Message({
              type: "error",
              message: this.$t(rs.msg)
            });
          } else if (rs && rs.msg_code == -1) {
            Message({
              type: "error",
              message: this.$t(rs.msg)
            });
          }
        });
    },
    dict_edit_click(data) {
      if (data["level"] == 2) {
        this.$refs.dict_content.clearValidate();
        dictService
          .get_setting_by_key(data["id"])
          .then(result => {
            if (result.msg_code == 1) {
              this.dict_content = result.data;
              this.dict_content["is_new"] = false;
            } else {
              return result;
            }
          })
          .then(rs => {
            if (rs && rs.msg_code == 0) {
              Message({
                type: "error",
                message: this.$t(rs.msg)
              });
            } else if (rs && rs.msg_code == -1) {
              Message({
                type: "error",
                message: this.$t(rs.msg)
              });
            }
          });
      }
    },
    beforeCreate() {
      console.log("beforeCreate");
    },
    created() {
      console.log("created");
    },
    beforeMount() {
      console.log("beforeMount");
    },
    mounted() {
      console.log("mounted");
      // this.getTree();
    },
    beforeUpdate() {
      console.log("beforeUpdate");
    },
    updated() {
      console.log("updated");
    }
  },
  watch: {
    filterText(val){
        this.$refs.dict_tree.filter(val);
    },

    dict_tree(newValue) {
      if (newValue != undefined) {
        var children_arr = newValue;
        var total_shop = 0;
        var total_machine = 0;
        var categoryQuantity = 0;
        for (let j = 0; j < children_arr.length; j++) {
          var c_showText = children_arr[j]["label"];
          var children_count = children_arr[j]["children"].length;
          total_shop = total_shop + children_count;
          categoryQuantity = total_shop
          children_arr[j]["label_show"] =
            c_showText +
            " (" +
            this.$t("dict.category_quantity") +
            String(children_count) +
            ")";
          var level2_arr = children_arr[j]["children"];
          for (let i = 0; i < level2_arr.length; i++) {
            level2_arr[i]["label_show"] = level2_arr[i]["label"];
            total_machine = total_machine + level2_arr[i]["count"];
          }
          children_arr[j]["children"] = level2_arr;
        }
        this.dict_tree = children_arr;
      }
    }
  }
};
</script>


<style scoped>
#dictionary >>> .el-tree-node__content {
  height: 35px;
}

.el-tree-node__content {
  height: 35px;
}

#varbox_log {
  width: auto;
}

.pagination {
  text-align: center;
}

.el-table {
  font-size: 14px;
}

.tip {
  color: #000000;
}
.mgr20 {
  margin-right: 20px;
}
.mgb10{
  margin-bottom: 10px;
}
.container {
  background-color:#f0f0f0;
}



#dictionary >>> .el-tree-node__children{
  position:relative
}
.scrollBar{ 
  height:615px; 
  overflow:hidden; 
} 
.list{ 
  max-height:10px; 
}
.node_icon >>> .el-button--danger.el-button--mini.is-circle{
  padding: 5px;
  position:absolute;
  right:4%;
}
.node_icon >>> .el-button--warning.el-button--mini.is-circle{
  padding: 5px;
  position:absolute;
  right:calc(4% + 30px);
}
.custom-tree-node >>> .node_label_1{
  width:150px; 
  font-size: 17px!important;
}
.custom-tree-node >>> .node_label_2{
  width:100%; 
}
.custom-tree-node{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  padding-right: 15px;
}
.node_plus{
  margin-right:10px;
  z-index:2;
}
.tree_filter{
  min-width:100px;
}
.crumbs >>> .el-breadcrumb{
    font-size: 20px;
    height: 25px;
}
.clearfix{
  line-height:1.23;
}
.card-header-r-btn{
  position:relative;
  float:right;
  margin:-10px -10px 0 0;
}
.card-header-btn{
  position:relative;
  float:right;
  margin:-10px 10px 0 0;
}
</style>