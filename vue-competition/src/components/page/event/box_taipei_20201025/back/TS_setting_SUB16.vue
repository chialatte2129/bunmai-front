<template>
    <div class="setting-page">
        <div>
            <el-row class="mgb10">
                <el-col :span="12">
                    <scoreBoard :match_id="match_id" :screen="'1'" style="padding-right:5px;"/>
                </el-col>
                <el-col :span="12">
                    <scoreBoard :match_id="match_id" :screen="'2'" style="padding-left:5px;"/>
                </el-col>
            </el-row>
            <el-card shadow="hover" body-style="padding:10px" class="match-data mgb10">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">分數設定</span>
                    <el-button type="warning" size="large" icon="el-icon-refresh" class="card-header-r-btn" @click="refreshMatchData"> 重整</el-button>
                    <el-button type="info" size="large" plain icon="el-icon-connection" class="card-header-btn" @click="getLink('match')"> 取得對陣圖連結</el-button>
                </div>
                <div style="padding:10px;text-align:center;">
                    <el-form ref="match_form" :model="match_form" label-position="right" label-width="auto">
                        <el-row class="match-final mgb10">
                            <el-badge :value="1" class="item" type="danger">
                                <el-col :span="10" class="bg-blue">
                                    <span class="match-final-name" :class="result_status('g1_1')">{{show_name('g1_1')}}</span>
                                </el-col>
                                <el-col :span="4">
                                    <el-divider>FINAL</br>決賽</el-divider>
                                </el-col>
                                <el-col :span="10" class="bg-red">
                                    <span class="match-final-name" :class="result_status('g1_2')">{{show_name('g1_2')}}</span>
                                </el-col>
                            </el-badge>
                            <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('1')" @click="editScore('1', '0', 0, '1')"/>
                        </el-row>
                        <el-row class="match-final mgb10">
                            <el-badge :value="2" class="item" type="danger">
                                <el-col :span="10" class="bg-blue">
                                    <span class="match-final-name" :class="result_status('g2_1')">{{show_name('g2_1')}}</span>
                                </el-col>
                                <el-col :span="4">
                                    <el-divider>THIRD</br>季軍賽</el-divider>
                                </el-col>
                                <el-col :span="10" class="bg-red">
                                    <span class="match-final-name" :class="result_status('g2_2')">{{show_name('g2_2')}}</span>
                                </el-col>
                            </el-badge>
                            <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('2')" @click="editScore('2', '0', 0, '2')"/>
                        </el-row>
                        <el-row class="match-semifinal mgb10">
                            <el-col :span="10" style="position:relative;">
                                <el-badge :value="3" class="item" type="primary">
                                    <el-col :span="11" class="bg-blue">
                                        <span class="match-final-name" :class="result_status('g3_1')">{{show_name('g3_1')}}</span>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" class="bg-blue">
                                        <span class="match-final-name" :class="result_status('g3_2')">{{show_name('g3_2')}}</span>
                                    </el-col>
                                </el-badge>
                                <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('3')" @click="editScore('3', '1', 1, '1')"/>
                            </el-col>
                            <el-col :span="4">
                                <el-divider>SEMIFINALS</br>4 強賽</el-divider>
                            </el-col>
                            <el-col :span="10" style="position:relative;">
                                <el-badge :value="4" class="item" type="danger">
                                    <el-col :span="11" class="bg-red">
                                        <span class="match-final-name" :class="result_status('g4_1')">{{show_name('g4_1')}}</span>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" class="bg-red">
                                        <span class="match-final-name" :class="result_status('g4_2')">{{show_name('g4_2')}}</span>
                                    </el-col>
                                </el-badge>
                                <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('4')" @click="editScore('4', '1', 1, '2')"/>
                            </el-col>
                        </el-row>
                        <el-row class="match-quarterfinail mgb10">
                            <el-col :span="10">
                                <el-col :span="11" style="position:relative;">
                                    <el-badge :value="5" class="item" type="primary">
                                        <el-row class="bg-blue">
                                            <span class="match-final-name" :class="result_status('g5_1')">{{show_name('g5_1')}}</span>
                                        </el-row>
                                        <el-divider/>
                                        <el-row class="bg-blue">
                                            <span class="match-final-name" :class="result_status('g5_2')">{{show_name('g5_2')}}</span>
                                        </el-row>
                                    </el-badge>
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('5')" @click="editScore('5', '3', 2, '1')"/>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11" style="position:relative;">
                                    <el-badge :value="6" class="item" type="primary">
                                        <el-row class="bg-blue">
                                            <span class="match-final-name" :class="result_status('g6_1')">{{show_name('g6_1')}}</span>
                                        </el-row>
                                        <el-divider/>
                                        <el-row class="bg-blue">
                                            <span class="match-final-name" :class="result_status('g6_2')">{{show_name('g6_2')}}</span>
                                        </el-row>
                                    </el-badge>
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('6')" @click="editScore('6', '3', 2, '2')"/>
                                </el-col>
                            </el-col>
                            <el-col :span="4" class="quarterfinail-division">
                                <el-divider>QUARTERFINALS</br>8 強賽</el-divider>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="11" style="position:relative;">
                                    <el-badge :value="7" class="item" type="danger">
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g7_1')">{{show_name('g7_1')}}</span>
                                        </el-row>
                                        <el-divider/>
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g7_2')">{{show_name('g7_2')}}</span>
                                        </el-row>
                                    </el-badge>
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('7')" @click="editScore('7', '4', 2, '1')"/>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11" style="position:relative;">
                                    <el-badge :value="8" class="item" type="danger">
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g8_1')">{{show_name('g8_1')}}</span>
                                        </el-row>
                                        <el-divider/>
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g8_2')">{{show_name('g8_2')}}</span>
                                        </el-row>
                                    </el-badge>
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('8')" @click="editScore('8', '4', 2, '2')"/>
                                </el-col>
                            </el-col>
                        </el-row>
                        <el-row class="match-sixteen mgb10" :key="sixteenKey">
                            <el-col :span="10">
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="9" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g9_1')">{{show_name('g9_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g9_2')">{{show_name('g9_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('9')" @click="editScore('9', '5', 3, '1')"/>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="10" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g10_1')">{{show_name('g10_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g10_2')">{{show_name('g10_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('10')" @click="editScore('10', '5', 3, '2')"/>
                                    </el-col>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="11" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g11_1')">{{show_name('g11_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g11_2')">{{show_name('g11_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('11')" @click="editScore('11', '6', 3, '1')"/>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="12" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g12_1')">{{show_name('g12_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g12_2')">{{show_name('g12_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('12')" @click="editScore('12', '6', 3, '2')"/>
                                    </el-col>
                                </el-col>
                            </el-col>
                            <el-col :span="4" class="sixteen-division">
                                <el-divider>SIXTEEN</br>16 強賽</el-divider>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="13" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g13_1')">{{show_name('g13_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g13_2')">{{show_name('g13_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('13')" @click="editScore('13', '7', 3, '1')"/>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="14" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g14_1')">{{show_name('g14_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g14_2')">{{show_name('g14_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('14')" @click="editScore('14', '7', 3, '2')"/>
                                    </el-col>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="15" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g15_1')">{{show_name('g15_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g15_2')">{{show_name('g15_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('15')" @click="editScore('15', '8', 3, '1')"/>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="16" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g16_1')">{{show_name('g16_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g16_2')">{{show_name('g16_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('16')" @click="editScore('16', '8', 3, '2')"/>
                                    </el-col>
                                </el-col>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <el-card shadow="hover" body-style="padding:10px" class="group-setting mgb10">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">分組設定</span>
                    <el-button v-if="group_disabled" type="success" size="large" class="el-icon-lock card-header-r-btn" @click="group_disabled=false" :disabled="group_lock"> 鎖定分組中</el-button>
                    <el-button v-else type="danger" size="large" class="el-icon-unlock card-header-r-btn" @click="group_disabled=true" :disabled="group_lock"> 鎖定解除中</el-button>
                </div>
                <div style="padding:10px;text-align:center;">
                    <el-form ref="group_form" :model="group_form" label-position="right" label-width="auto">
                        <el-row class="match-sixteen mgb10">
                            <el-col :span="11">
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="9" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g9_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g9_1')" @change="createGroupSetting(group_form.g9_1, '9', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g9_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g9_2')" @change="createGroupSetting(group_form.g9_2, '9', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="10" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g10_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g10_1')" @change="createGroupSetting(group_form.g10_1, '10', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g10_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g10_2')" @change="createGroupSetting(group_form.g10_2, '10', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="11" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g11_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g11_1')" @change="createGroupSetting(group_form.g11_1, '11', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g11_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g11_2')" @change="createGroupSetting(group_form.g11_2, '11', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="12" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g12_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g12_1')" @change="createGroupSetting(group_form.g12_1, '12', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g12_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g12_2')" @change="createGroupSetting(group_form.g12_2, '12', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                </el-col>
                            </el-col>
                            <el-col :span="2" class="sixteen-division">
                                <el-divider>分組</el-divider>
                            </el-col>
                            <el-col :span="11">
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="13" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g13_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g13_1')" @change="createGroupSetting(group_form.g13_1, '13', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g13_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g13_2')" @change="createGroupSetting(group_form.g13_2, '13', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="14" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g14_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g14_1')" @change="createGroupSetting(group_form.g14_1, '14', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g14_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g14_2')" @change="createGroupSetting(group_form.g14_2, '14', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="15" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g15_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g15_1')" @change="createGroupSetting(group_form.g15_1, '15', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g15_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g15_2')" @change="createGroupSetting(group_form.g15_2, '15', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="16" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g16_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g16_1')" @change="createGroupSetting(group_form.g16_1, '16', '1')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g16_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g16_2')" @change="createGroupSetting(group_form.g16_2, '16', '2')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                </el-col>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <teamManage :match_id="match_id" @change="handleTeamChange"/>
        </div>
        <el-dialog ref="dialog" :title="`Group ${editScoreGroup}`" :visible.sync="editScoreView" :before-close="cancelEditScore" :close-on-click-modal="false" :key="scoreFormKey">
            <div v-loading.lock="dialog_loading">
                <el-form ref="edit_score_form" :model="{edit_score_form:edit_score_form}" :rules="rules" label-position="right" label-width="auto">
                    <el-table class="table" ref="table" :data="edit_score_form" :cell-style="{padding:'0',height:'28px',fontSize:'8px'}">
                        <el-table-column prop="name" label="隊伍名稱" width="200" align="left" headerAlign="center"/>
                        <el-table-column v-if="edit_score_rule.match>=1" prop="r1" label="R1" width="110" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="`edit_score_form.${scope.$index.toString()}.r1`" :rules="rules.score">
                                    <el-input v-model="scope.row.r1" class="score-input"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="edit_score_rule.match>=2" prop="r2" label="R2" width="110" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="`edit_score_form.${scope.$index.toString()}.r2`" :rules="rules.score">
                                    <el-input v-model="scope.row.r2" class="score-input"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="edit_score_rule.match>=3" prop="r3" label="R3" width="110" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="`edit_score_form.${scope.$index.toString()}.r3`" :rules="rules.score">
                                    <el-input v-model="scope.row.r3" class="score-input"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="edit_score_rule.match>=4" prop="r4" label="R4" width="110" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="`edit_score_form.${scope.$index.toString()}.r4`" :rules="rules.score">
                                    <el-input v-model="scope.row.r4" class="score-input"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="edit_score_rule.match>=5" prop="r5" label="R5" width="110" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="`edit_score_form.${scope.$index.toString()}.r5`" :rules="rules.score">
                                    <el-input v-model="scope.row.r5" class="score-input"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="edit_score_rule.match>=6" prop="r6" label="R6" width="110" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="`edit_score_form.${scope.$index.toString()}.r6`" :rules="rules.score">
                                    <el-input v-model="scope.row.r6" class="score-input"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="edit_score_rule.match>=7" prop="r7" label="R7" width="110" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="`edit_score_form.${scope.$index.toString()}.r7`" :rules="rules.score">
                                    <el-input v-model="scope.row.r7" class="score-input"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelEditScore">{{$t('btn.cancel')}}</el-button>
                    <el-button type="primary" @click="saveScore">{{$t('btn.confirm')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import teamManage from "./team_manage.vue";
import scoreBoard from "./score_board.vue";
import { eventService } from "@/_services";
export default {
    name:"TS_setting_16",
    components: {
        teamManage,
        scoreBoard
    },
    props: {
        match_id: String
    },

    data(){
        return {
            scoreFormKey:0,
            scoreboardKey:0,
            sixteenKey:0,
            dialog_loading:false,
            editScoreView:false,
            editScoreGroup:"",
            editDestinationGroup:"",
            editDestinationRound:null,
            editDestinationPosition:"",
            unknown_value:[null, "", undefined], 
            group_disabled:true,
            group_lock:true,
            group_form:{},
            match_form:{
                // g1_1:{ id: "00001", group_id: "1", name: "team_01", process: "D", is_win: 0, pos_id: "1"},
            },
            edit_score_form:[],
            edit_score_win:[],
            edit_score_rule:{},
            rules:{
                score:[
                    // { required: true, message: this.$t("common_msg.must_fill"), trigger:"blur" },
                    { pattern: /^[0-9.]*$/, message: this.$i18n.t("rules.only_numbers"), trigger: ["blur", "change"] },
                ]
            },
            options:{
                group:{
                    // "1":{"id":"1","label":"Group 1", "top":"01","btm":"02"},
                },
                title:{},
                teams:[],
            },
        }
    },
    computed: {
        
    },

    watch: {
        match_id(){
            this.getGroupSetting();
            this.refreshMatchData();
        }
    },

    created(){
        this.getGroupSetting();
        this.refreshMatchData();
    },

    methods:{
        handleTeamChange(data){
            this.options.teams=data;
        },

        startLoading(class_name){
            return this.$loading({
                lock:true,
                spinner:"el-icon-loading",
                background:"rgba(0, 0, 0, 0.6)",
                target: class_name
            });
        },

        async getGroupSetting(){
            await eventService.get_group_setting({match_id:this.match_id}).then(res => {
                if(res.code==1){
                    this.group_form = res.group_form;
                    this.group_lock = res.group_lock;
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        async createGroupSetting(team_id, group_id, pos){
            var param = {
                match_id:this.match_id,
                group_id:group_id,
                team_id:team_id,
                pos_id:pos
            };
            await eventService.create_group_setting(param).then(res => {
                if(res.code==1){
                    this.$message.success(res.msg);
                    var name = ""
                    var temp_team_id = "";
                    if(!this.unknown_value.includes(team_id)){
                        for(var row in this.options.teams){
                            if(this.options.teams[row].id==team_id){
                                name = this.options.teams[row].name;
                                temp_team_id = team_id
                            }
                        }
                    }
                    // g1_1:{ id: "00001", group_id: "1", name: "team_01", process: "D", is_win: 0, pos_id: "1"},
                    this.match_form[`g${group_id}_${(pos=='1')?1:2}`] = {id:temp_team_id, name:name, group_id:group_id, is_win:false, process:"D", pos_id:pos};
                    this.sixteenKey++;
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        groupSettingDisabled(group_pos){
            if(this.group_lock) return true;
            return !this.unknown_value.includes(this.group_form[group_pos])&&this.group_disabled;
        },

        saveScore(){
            this.$refs.edit_score_form.validate(valid => {
                if(valid){
                    this.dialog_loading=true;
                    var param = {
                        match_id:this.match_id,
                        group_id:this.editScoreGroup,
                        destination_group_id:this.editDestinationGroup,
                        destination_round:this.editDestinationRound,
                        destination_position:this.editDestinationPosition,
                        win:this.edit_score_win,
                        score_form:this.edit_score_form,
                    }
                    eventService.update_group_score(param).then(res => {
                        if(res.code==1||res.code==2){
                            // if(res.code==2){
                            //     this.refreshMatchData();
                            // }
                            this.refreshMatchData();
                            this.$message.success(res.msg);
                            this.group_lock=true;
                            this.group_disabled=true;
                            this.cancelEditScore();
                        }else{
                            this.$message.warning(res.msg);
                            this.dialog_loading = false;
                        }
                    })
                }
            })
        },

        async editScore(group_id, destination_group_id, destination_round, destination_position){
            this.editScoreView=true;
            this.dialog_loading=true;
            this.editScoreGroup=group_id;
            this.editDestinationGroup=destination_group_id;
            this.editDestinationRound=destination_round;
            this.editDestinationPosition=destination_position;
            await eventService.get_group_score_info({match_id:this.match_id, group_id:group_id}).then(res => {
                if(res.code==1){
                    this.edit_score_form = res.score_form;
                    this.edit_score_win = res.win;
                    this.edit_score_rule = res.rules;
                }else{
                    this.$message.warning(res.msg);
                }
            })
            this.dialog_loading = false;
        },
        
        cancelEditScore(){
            this.scoreFormKey++;
            this.editScoreView=false;
            this.editScoreGroup="";
            this.editDestinationGroup="";
            this.editDestinationRound=null;
            this.editDestinationPosition="";
            this.edit_score_win=[];
            this.edit_score_form=[];
            this.edit_score_rule={};
        },

        editDisabled(group_id){
            if(this.show_name(`g${group_id}_1`)==""||this.show_name(`g${group_id}_2`)=="") return true;
            return false;
        },

        refreshMatchData(){
            const loading = this.startLoading('.match-data');
            eventService.get_match_map({match_id:this.match_id}).then(res => {
                if(res.code==1){
                    this.match_form = res.match_form;
                }else{
                    this.$message.warning(res.msg);
                }
            })
            loading.close();
        },

        getLink(content){
			this.$copyText(`${process.env.VUE_APP_HOST}public/event/box_taipei/${content}/${this.match_id}`).then(
                res => {
				    this.$message.success(`${this.$i18n.t('common_msg.copy_ok')} ${process.env.VUE_APP_HOST}public/event/box_taipei/${content}/${this.match_id}`);
			    }, 
				err => { 
                    this.$message.error(err);
                } 
			)
        },

        show_name(game){
            if(this.match_form[game]!=undefined&&"name" in this.match_form[game]) return this.match_form[game].name;
            return "";
        },

        result_status(game){
            if(this.match_form[game]!=undefined&&"is_win" in this.match_form[game]&&"process" in this.match_form[game]){
                return {win:this.match_form[game].is_win&&this.match_form[game].process=="F", lose:!this.match_form[game].is_win&&this.match_form[game].process=="F"};
            }
            return ;
        },

        teamSelectDisabled(id){
            if(id==this.group_form.g9_1) return true;
            if(id==this.group_form.g9_2) return true;
            if(id==this.group_form.g10_1) return true;
            if(id==this.group_form.g10_2) return true;
            if(id==this.group_form.g11_1) return true;
            if(id==this.group_form.g11_2) return true;
            if(id==this.group_form.g12_1) return true;
            if(id==this.group_form.g12_2) return true;
            if(id==this.group_form.g13_1) return true;
            if(id==this.group_form.g13_2) return true;
            if(id==this.group_form.g14_1) return true;
            if(id==this.group_form.g14_2) return true;
            if(id==this.group_form.g15_1) return true;
            if(id==this.group_form.g15_2) return true;
            if(id==this.group_form.g16_1) return true;
            if(id==this.group_form.g16_2) return true;
            return false;
        },
    }
}
</script>
<style scoped>
    .mgb10{
        margin-bottom:10px;
    }
    .mgr10{
        margin-right:10px;
    }
    .mgl10{
        margin-left:10px;
    }
    .container{
        background-color:#f0f0f0;
        padding:25px;
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
    .team-selector-N{
        width:90%;
        margin:10px 0;
    }
    .team-selector-F{
        width:80%;
        margin:10px 0;
    }
    .match-final >>> .el-col{
        padding:2px;
        height:50px;
    }
    .match-final >>> .match-final-name{
        line-height:49px;
    }
    .match-semifinal >>> .el-col{
        height:50px;
    }
    .match-semifinal >>> .match-final-name{
        line-height:49px;
    }
    .match-semifinal >>> .el-divider--vertical{
        width:1px;
        height:50px;
    }
    .match-quarterfinail >>> .el-row{
        height:50px;
    }
    .match-quarterfinail >>> .match-final-name{
        line-height:49px;
    }
    .match-quarterfinail >>> .el-divider--vertical{
        width:1px;
        height:102px;
    }
    .match-quarterfinail >>> .el-divider--horizontal{
        margin:0;
    }
    .match-quarterfinail >>> .quarterfinail-division.el-col{
        margin-top:50px;
    }
    .match-sixteen >>> .el-row{
        height:50px;
    }
    .match-sixteen >>> .match-final-name{
        line-height:49px;
    }
    .match-sixteen >>> .el-divider--vertical{
        width:1px;
        height:102px;
    }
    .match-sixteen >>> .el-divider--horizontal{
        margin:0;
    }
    .match-sixteen >>> .sixteen-division.el-col{
        margin-top:50px;
    }
    .match-final-name.win{
        color:black;
        font-size:22px;
    }
    .match-final-name.lose{
        color:#858585;
        font-size:18px;
    }
    .bg-red{
        background:rgba(255, 140, 140, 0.3);
    }
    .bg-blue{
        background:rgba(140, 206, 255, 0.3);
    }
    .item{
        display:inline;
    }
    .btn-sixteen{
        position:absolute;
        top:37px;
        left:-10px;
        z-index:10;
    }
    .btn-final{
        position:absolute;
        top:10px;
        left:-10px;
        z-index:10;
    }
    .score-input{
        width:100%;
        margin:5px 0;
    }
    .table{
        font-size:14px;
    }
    .dialog-footer{
        text-align:right;
        margin-top:10px;
    }
</style>