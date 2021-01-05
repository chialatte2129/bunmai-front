<template>
  <div>
    <el-select v-model="actions_list" :class="formClass" :placeholder="$t('btn.search')" filterable :multiple="isMultiple" @change="$emit('select_menu',actions_list)">
      <el-option
        v-for="item in all_menus"
        :key="item.value"
        :label="show_label(item)"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { dictService } from "@/_services";
export default {
  name: "dict_menu",
  props: {
    keystr: String,
    isMultiple : false,
    i18nAsLabel :false,
    formClass: String,
    menus_select_value: Array
    
  },
  data() {
    return {
      actions_list:[],
      all_menus: []
    };
  },
  computed: {
    
  },
  
  created() {
    this.getMenus();
    this.showMenus();
  },
  updated(){
    this.showMenus();
  },

  methods: {
    showMenus(){
      this.actions_list=this.menus_select_value;
    },
    show_label(item) {
      return this.i18nAsLabel ? (item.label_i18n==undefined?item.label:this.$t(item.label_i18n)):item.label;
    },
    getMenus() {
      dictService
        .get_setting_by_key(this.keystr)
        .then(result => {
          if (result.msg_code == 1) {
            this.all_menus = JSON.parse(result.data.jsonvalue);
          } else {
            return result;
          }
        })
        .then(rs => {
          if (rs && rs.msg_code == 0) {
            this.$message.error(this.$t(rs.msg_i18n));
          } else if (rs && rs.msg_code == -1) {
            this.$message.error(this.$t(rs.msg));
          }
        });
    }
  }
};
</script>
<style>
.menus-select-input{
  width:99%;
  display:inline-block;
}
</style>
