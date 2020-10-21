<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-aim"></i> {{$t("menus.event_box_taipei_20201025")}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t("menus.DT_setting")}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-card shadow="hover" body-style="padding:10px" class="mgb10">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">分組設定</span>
                    <el-button v-if="group_disabled" type="success" size="large" class="el-icon-lock card-header-r-btn" @click="group_disabled=false"> 鎖定分組</el-button>
                    <el-button v-else type="danger" size="large" class="el-icon-unlock card-header-r-btn" @click="group_disabled=true"> 鎖定解除</el-button>
                </div>
                <div style="padding:10px;text-align:center;">
                    <el-form ref="group_form" :model="group_form" label-position="right" label-width="auto">
                        <el-row class="match-sixteen mgb10">
                            <el-col :span="11">
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="1" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g1_1" clearable filterable 
                                                :disabled="group_form.g1_1!=''&&group_disabled" @change="saveGroup(group_form.g1_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g1_2" clearable filterable 
                                                :disabled="group_form.g1_2!=''&&group_disabled" @change="saveGroup(group_form.g1_2, 'btm')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="2" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g2_1" clearable filterable 
                                                :disabled="group_form.g2_1!=''&&group_disabled" @change="saveGroup(group_form.g2_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g2_2" clearable filterable 
                                                :disabled="group_form.g2_2!=''&&group_disabled" @change="saveGroup(group_form.g2_2, 'btm')">
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
                                        <el-badge :value="3" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g3_1" clearable filterable 
                                                :disabled="group_form.g3_1!=''&&group_disabled" @change="saveGroup(group_form.g3_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g3_2" clearable filterable 
                                                :disabled="group_form.g3_2!=''&&group_disabled" @change="saveGroup(group_form.g3_2, 'btm')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="4" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g4_1" clearable filterable 
                                                :disabled="group_form.g4_1!=''&&group_disabled" @change="saveGroup(group_form.g4_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g4_2" clearable filterable 
                                                :disabled="group_form.g4_2!=''&&group_disabled" @change="saveGroup(group_form.g4_2, 'btm')">
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
                                        <el-badge :value="5" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g5_1" clearable filterable 
                                                :disabled="group_form.g5_1!=''&&group_disabled" @change="saveGroup(group_form.g5_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g5_2" clearable filterable 
                                                :disabled="group_form.g5_2!=''&&group_disabled" @change="saveGroup(group_form.g5_2, 'btm')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="6" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g6_1" clearable filterable 
                                                :disabled="group_form.g6_1!=''&&group_disabled" @change="saveGroup(group_form.g6_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g6_2" clearable filterable 
                                                :disabled="group_form.g6_2!=''&&group_disabled" @change="saveGroup(group_form.g6_2, 'btm')">
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
                                        <el-badge :value="7" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g7_1" clearable filterable 
                                                :disabled="group_form.g7_1!=''&&group_disabled" @change="saveGroup(group_form.g7_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g7_2" clearable filterable 
                                                :disabled="group_form.g7_2!=''&&group_disabled" @change="saveGroup(group_form.g7_2, 'btm')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                        </el-badge>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="8" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g8_1" clearable filterable 
                                                :disabled="group_form.g8_1!=''&&group_disabled" @change="saveGroup(group_form.g8_1, 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g8_2" clearable filterable 
                                                :disabled="group_form.g8_2!=''&&group_disabled" @change="saveGroup(group_form.g8_2, 'btm')">
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
            <el-card shadow="hover" body-style="padding:10px" class="match-data mgb10">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">分數設定</span>
                    <el-button type="warning" size="large" icon="el-icon-refresh" class="card-header-r-btn" @click="refreshMatchData"> 重整</el-button>
                    <el-button type="info" size="large" plain icon="el-icon-connection" class="card-header-btn" @click="getLink('match')"> 取得對陣圖連結</el-button>
                </div>
                <div style="padding:10px;text-align:center;">
                    <el-form ref="match_form" :model="match_form" label-position="right" label-width="auto">
                        <el-row class="match-final mgb10">
                            <el-badge :value="15" class="item" type="danger">
                                <el-col :span="10" class="bg-blue">
                                    <span class="match-final-name" :class="result_status('g15_1')">{{show_name('g15_1')}}</span>
                                </el-col>
                                <el-col :span="4">
                                    <el-divider>FINAL</br>決賽</el-divider>
                                </el-col>
                                <el-col :span="10" class="bg-red">
                                    <span class="match-final-name" :class="result_status('g15_2')">{{show_name('g15_2')}}</span>
                                </el-col>
                            </el-badge>
                            <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('15')" @click="editScore('15', '', '')"/>
                        </el-row>
                        <el-row class="match-final mgb10">
                            <el-badge :value="16" class="item" type="danger">
                                <el-col :span="10" class="bg-blue">
                                    <span class="match-final-name" :class="result_status('g16_1')">{{show_name('g16_1')}}</span>
                                </el-col>
                                <el-col :span="4">
                                    <el-divider>THIRD</br>季軍賽</el-divider>
                                </el-col>
                                <el-col :span="10" class="bg-red">
                                    <span class="match-final-name" :class="result_status('g16_2')">{{show_name('g16_2')}}</span>
                                </el-col>
                            </el-badge>
                            <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('16')" @click="editScore('16', '', '')"/>
                        </el-row>
                        <el-row class="match-semifinal mgb10">
                            <el-col :span="10" style="position:relative;">
                                <el-badge :value="13" class="item" type="primary">
                                    <el-col :span="11" class="bg-blue">
                                        <span class="match-final-name" :class="result_status('g13_1')">{{show_name('g13_1')}}</span>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" class="bg-blue">
                                        <span class="match-final-name" :class="result_status('g13_2')">{{show_name('g13_2')}}</span>
                                    </el-col>
                                </el-badge>
                                <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('13')" @click="editScore('13', '15', 'top')"/>
                            </el-col>
                            <el-col :span="4">
                                <el-divider>SEMIFINALS</br>4 強賽</el-divider>
                            </el-col>
                            <el-col :span="10" style="position:relative;">
                                <el-badge :value="14" class="item" type="danger">
                                    <el-col :span="11" class="bg-red">
                                        <span class="match-final-name" :class="result_status('g14_1')">{{show_name('g14_1')}}</span>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" class="bg-red">
                                        <span class="match-final-name" :class="result_status('g14_2')">{{show_name('g14_2')}}</span>
                                    </el-col>
                                </el-badge>
                                <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('14')" @click="editScore('14', '15', 'btm')"/>
                            </el-col>
                        </el-row>
                        <el-row class="match-quarterfinail mgb10">
                            <el-col :span="10">
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
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('9')" @click="editScore('9', '13', 'top')"/>
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
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('10')" @click="editScore('10', '13', 'btm')"/>
                                </el-col>
                            </el-col>
                            <el-col :span="4" class="quarterfinail-division">
                                <el-divider>QUARTERFINALS</br>8 強賽</el-divider>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="11" style="position:relative;">
                                    <el-badge :value="11" class="item" type="danger">
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g11_1')">{{show_name('g11_1')}}</span>
                                        </el-row>
                                        <el-divider/>
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g11_2')">{{show_name('g11_2')}}</span>
                                        </el-row>
                                    </el-badge>
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('11')" @click="editScore('11', '14', 'top')"/>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11" style="position:relative;">
                                    <el-badge :value="12" class="item" type="danger">
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g12_1')">{{show_name('g12_1')}}</span>
                                        </el-row>
                                        <el-divider/>
                                        <el-row class="bg-red">
                                            <span class="match-final-name" :class="result_status('g12_2')">{{show_name('g12_2')}}</span>
                                        </el-row>
                                    </el-badge>
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('12')" @click="editScore('12', '14', 'btm')"/>
                                </el-col>
                            </el-col>
                        </el-row>
                        <el-row class="match-sixteen mgb10">
                            <el-col :span="10">
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="1" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g1_1')">{{show_name('g1_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g1_2')">{{show_name('g1_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('1')" @click="editScore('1', '9', 'top')"/>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="2" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g2_1')">{{show_name('g2_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g2_2')">{{show_name('g2_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('2')" @click="editScore('2', '9', 'btm')"/>
                                    </el-col>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="3" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g3_1')">{{show_name('g3_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g3_2')">{{show_name('g3_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('3')" @click="editScore('3', '10', 'top')"/>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="4" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g4_1')">{{show_name('g4_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <span class="match-final-name" :class="result_status('g4_2')">{{show_name('g4_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('4')" @click="editScore('4', '10', 'btm')"/>
                                    </el-col>
                                </el-col>
                            </el-col>
                            <el-col :span="4" class="sixteen-division">
                                <el-divider>SIXTEEN</br>16 強賽</el-divider>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="11">
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="5" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g5_1')">{{show_name('g5_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g5_2')">{{show_name('g5_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('5')" @click="editScore('5', '11', 'top')"/>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" style="position:relative;">
                                        <el-badge :value="6" class="item" type="danger">
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g6_1')">{{show_name('g6_1')}}</span>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <span class="match-final-name" :class="result_status('g6_2')">{{show_name('g6_2')}}</span>
                                            </el-row>
                                        </el-badge>
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('6')" @click="editScore('6', '11', 'btm')"/>
                                    </el-col>
                                </el-col>
                                <el-col :span="2">
                                    <el-divider direction="vertical"/>
                                </el-col>
                                <el-col :span="11">
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('7')" @click="editScore('7', '12', 'top')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('8')" @click="editScore('8', '12', 'btm')"/>
                                    </el-col>
                                </el-col>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <el-card shadow="hover" body-style="padding:10px">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">顯示記分板設定</span>
                    <el-button type="primary" size="large" icon="el-icon-files" class="card-header-r-btn" :disabled="disabledScoreBoard()" @click="saveScoreBoard"> {{$t('btn.save')}}</el-button>
                    <el-button type="info" size="large" plain icon="el-icon-connection" class="card-header-btn" @click="getLink('score')"> 取得記分板連結</el-button>
                </div>
                <div style="padding:10px;">
                    <el-form ref="show_scoreboard_form" :model="show_scoreboard_form" label-position="right" label-width="auto">
                        <el-row>
                            <el-col :span="9">
                                <el-form-item label="記分板標題" prop="title">
                                    <el-select v-model="show_scoreboard_form.title" clearable placeholder="中文翻譯 - 顯示頁面標題" style="width:90%;" @change="scoreboardChange">
                                        <el-option v-for="option in options.title" :label="`${option.note} - ${option.label}`" :value="option.id" :key="option.id"/>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="show_scoreboard_form.status=='N'" label="左方組別">
                                    <el-select v-model="select_scoreboard.left" style="width:90%;" @change="selectScoreboardChange('left')">
                                        <el-option v-for="option in options.group" :label="`${option.label}`" :value="option.id" :key="option.id" :disabled="selectGroupDisabled(option.id)||selectGroup_disabled"/>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="show_scoreboard_form.status=='N'" label="右方組別">
                                    <el-select v-model="select_scoreboard.right" style="width:90%;" @change="selectScoreboardChange('right')">
                                        <el-option v-for="option in options.group" :label="`${option.label}`" :value="option.id" :key="option.id" :disabled="selectGroupDisabled(option.id)||selectGroup_disabled"/>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="show_scoreboard_form.status=='F'" label="中央組別">
                                    <el-select v-model="select_scoreboard.center" style="width:90%;" @change="selectScoreboardChange('center')">
                                        <el-option v-for="option in options.group" :label="`${option.label}`" :value="option.id" :key="option.id" :disabled="selectGroupDisabled(option.id)||selectGroup_disabled"/>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="15" v-if="show_scoreboard_form.title" style="text-align:center;">
                                <div class="scoreboard-stauts-N" v-if="show_scoreboard_form.status=='N'">
                                    <el-col :span="11" class="bg-blue">
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.left.top" placeholder="左上隊伍" disabled>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                        </el-select>
                                        <el-divider class="division"/>
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.left.btm" placeholder="左下隊伍" disabled>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="1">
                                        <el-divider direction="vertical"/>
                                    </el-col>
                                    <el-col :span="11" class="bg-red">
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.right.top" placeholder="右上隊伍" disabled>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                        </el-select>
                                        <el-divider class="division"/>
                                        <el-select class="team-selector-N" v-model="show_scoreboard_form.right.btm" placeholder="右下隊伍" disabled>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                        </el-select>
                                    </el-col>
                                </div>
                                <div class="scoreboard-stauts-F" v-else-if="show_scoreboard_form.status=='F'">
                                    <el-row class="bg-blue">
                                        <el-select class="team-selector-F" v-model="show_scoreboard_form.center.top" placeholder="上方隊伍" disabled>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                        </el-select>
                                    </el-row>
                                    <el-divider class="division"/>
                                    <el-row class="bg-red">
                                        <el-select class="team-selector-F" v-model="show_scoreboard_form.center.btm" placeholder="下方隊伍" disabled>
                                            <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id"/>
                                        </el-select>
                                    </el-row>
                                </div>
                                <div v-else>Unknown Status</div>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <teamManage :match_id="match_id" @change="handleTeamChange"></teamManage>
        </div>
        <el-dialog :title="`Group ${editScoreGroup}`" :visible.sync="editScoreView" :width="`${250+edit_score_rule.match*110}px`" :before-close="cancelEditScore" :close-on-click-modal="false" class="edit-Dialog">
            <el-form ref="edit_score_form" :model="{edit_score_form:edit_score_form}" :rules="rules" label-position="right" label-width="auto">
                <el-table ref="table" :data="edit_score_form" :cell-style="{padding:'0',height:'28px',fontSize:'8px'}">
                    <el-table-column prop="name" label="隊伍名稱" width="200" align="center"/>
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
                <div style="margin:20px 0 0 50px;" v-if="edit_score_form.length>0">
                    <span style="display:inline-block;">晉級隊伍&emsp;&emsp;&emsp;&emsp;</span>
                    <span style="display:inline-block;">
                        <el-checkbox-group v-model="edit_score_win" :min="0" :max="1">
                            <el-checkbox v-for="(row, idx) in edit_score_form" :label="row.name" :key="idx"/>
                        </el-checkbox-group>
                    </span>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEditScore">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="saveScore">{{$t('btn.confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import teamManage from "./team_manage.vue";
export default {
    name:"DT_setting",
    components: {
        teamManage
    },

    data(){
        return {
            match_id:"MATCH-DT-2020-10-25",
            editScoreView:false,
            editScoreGroup:"",
            editDestinationGroup:"",
            editDestinationPosition:"",
            selectGroup_disabled:false,
            unknown_value:[null, "", undefined], 
            show_scoreboard_form:{
                title:"",
                status:"",
                left:{ top:"", btm:"", },
                right:{ top:"", btm:"", },
                center:{ top:"", btm:"", }
            },
            select_scoreboard:{
                left:"",
                right:"",
                center:"",
            },
            group_disabled:true,
            group_form:{
                g1_1:"",
                g1_2:"",
                g2_1:"",
                g2_2:"",
                g3_1:"",
                g3_2:"",
                g4_1:"",
                g4_2:"",
                g5_1:"",
                g5_2:"",
                g6_1:"",
                g6_2:"",
                g7_1:"",
                g7_2:"",
                g8_1:"",
                g8_2:"",

            },
            match_form:{
                g1_1:{id:"", name:"", is_win:false, process:"D"},
                g1_2:{id:"", name:"", is_win:false, process:"D"},
                g2_1:{id:"", name:"", is_win:false, process:"D"},
                g2_2:{id:"", name:"", is_win:false, process:"D"},
                g3_1:{id:"", name:"", is_win:false, process:"D"},
                g3_2:{id:"", name:"", is_win:false, process:"D"},
                g4_1:{id:"", name:"", is_win:false, process:"D"},
                g4_2:{id:"", name:"", is_win:false, process:"D"},
                g5_1:{id:"", name:"", is_win:false, process:"D"},
                g5_2:{id:"", name:"", is_win:false, process:"D"},
                g6_1:{id:"", name:"", is_win:false, process:"D"},
                g6_2:{id:"", name:"", is_win:false, process:"D"},
                g7_1:{id:"", name:"", is_win:false, process:"D"},
                g7_2:{id:"", name:"", is_win:false, process:"D"},
                g8_1:{id:"", name:"", is_win:false, process:"D"},
                g8_2:{id:"", name:"", is_win:false, process:"D"},
                g9_1:{id:"", name:"", is_win:false, process:"D"},
                g9_2:{id:"", name:"", is_win:false, process:"D"},
                g10_1:{id:"", name:"", is_win:false, process:"D"},
                g10_2:{id:"", name:"", is_win:false, process:"D"},
                g11_1:{id:"", name:"", is_win:false, process:"D"},
                g11_2:{id:"", name:"", is_win:false, process:"D"},
                g12_1:{id:"", name:"", is_win:false, process:"D"},
                g12_2:{id:"", name:"", is_win:false, process:"D"},
                g13_1:{id:"", name:"", is_win:false, process:"D"},
                g13_2:{id:"", name:"", is_win:false, process:"D"},
                g14_1:{id:"", name:"", is_win:false, process:"D"},
                g14_2:{id:"", name:"", is_win:false, process:"D"},
                g15_1:{id:"", name:"", is_win:false, process:"D"},
                g15_2:{id:"", name:"", is_win:false, process:"D"},
                g16_1:{id:"", name:"", is_win:false, process:"D"},
                g16_2:{id:"", name:"", is_win:false, process:"D"},
            },
            edit_score_form:[
                {team_id:"01", name:"team-01", score:[500,400,null], r1:500, r2:400, r3:null},
                {team_id:"02", name:"team-02", score:[600,500,null], r1:600, r2:500, r3:null},
            ],
            edit_score_win:[],
            edit_score_rule:{
                match:5,
                win:2
            },
            rules:{
                score:[
                    // { required: true, message: this.$t("common_msg.must_fill"), trigger:"blur" },
                    { pattern: /^[0-9.]*$/, message: this.$i18n.t("rules.only_numbers"), trigger: ["blur", "change"] },
                ]
            },
            options:{
                group:{
                    "01":{"id":"01","label":"Group 1", "top":"01","btm":"02"},
                    "02":{"id":"02","label":"Group 2", "top":"03","btm":"04"},
                    "03":{"id":"03","label":"Group 3", "top":"","btm":""},
                    "04":{"id":"04","label":"Group 4", "top":"","btm":""},
                    "05":{"id":"05","label":"Group 5", "top":"","btm":""},
                    "06":{"id":"06","label":"Group 6", "top":"","btm":""},
                    "07":{"id":"07","label":"Group 7", "top":"","btm":""},
                    "08":{"id":"08","label":"Group 8", "top":"","btm":""},
                    "09":{"id":"09","label":"Group 9", "top":"","btm":""},
                    "10":{"id":"10","label":"Group 10", "top":"","btm":""},
                    "11":{"id":"11","label":"Group 11", "top":"","btm":""},
                    "12":{"id":"12","label":"Group 12", "top":"","btm":""},
                    "13":{"id":"13","label":"Group 13", "top":"","btm":""},
                    "14":{"id":"14","label":"Group 14", "top":"","btm":""},
                    "15":{"id":"15","label":"Group 15", "top":"","btm":""},
                    "16":{"id":"16","label":"Group 16", "top":"","btm":""},
                },
                title:{
                    "01":{"id":"01","label":"FINAL","note":"冠軍賽","status":"F","round":4},
                    "02":{"id":"02","label":"THIRD","note":"季軍賽","status":"F","round":4},
                    "03":{"id":"03","label":"SEMIFINALS","note":"4 強賽","status":"N","round":3},
                    "04":{"id":"04","label":"QUARTERFINALS","note":"8 強賽","status":"N","round":2},
                    "05":{"id":"05","label":"ROUND OF SIXTEEN","note":"16 強賽","status":"N","round":1}
                },
                teams:[
                    {"id":"01","name":"team-01"},
                    {"id":"02","name":"team-02"},
                    {"id":"03","name":"team-03"},
                    {"id":"04","name":"team-04"},
                    {"id":"05","name":"team-05"},
                    {"id":"06","name":"team-06"},
                    {"id":"07","name":"team-07"},
                    {"id":"08","name":"team-08"},
                    {"id":"09","name":"team-09"},
                    {"id":"10","name":"team-10"},
                    {"id":"11","name":"team-11"},
                    {"id":"12","name":"team-12"},
                    {"id":"13","name":"team-13"},
                    {"id":"14","name":"team-14"},
                    {"id":"15","name":"team-15"},
                    {"id":"16","name":"team-16"}
                ],
            },
        }
    },
    computed: {

    },
    watch: {
        
    },

    created(){
        this.getBaseOptions();
        this.getData();
    },

    methods:{
        handleTeamChange(data){
            console.log(data);
        },

        startLoading(class_name){
            return this.$loading({
                lock:true,
                spinner:"el-icon-loading",
                background:"rgba(0, 0, 0, 0.6)",
                target: document.querySelector(class_name)
            });
        },

        saveGroup(team_id, pos){
            
        },

        saveScore(){
            this.cancelEditScore();
        },

        editScore(group_id, destination_group_id, position){
            this.editScoreView=true;
            this.editScoreGroup=group_id;
            this.editDestinationGroup=destination_group_id;
            this.editDestinationPosition=position;
            const loading = this.startLoading('.edit-Dialog');
            // edit_score_rule
            loading.close();
        },
        
        cancelEditScore(){
            this.editScoreView=false;
            this.editScoreGroup="";
            this.editDestinationGroup="";
            this.editDestinationPosition="";
        },

        editDisabled(group_id){
            // if(this.show_name(`g${game_id}_1`)==""||this.show_name(`g${game_id}_2`)=="") return true;
            return false;
        },

        getBaseOptions(){
            // title
            // teams
        },

        getData(){

        },

        refreshMatchData(){
            const loading = this.startLoading('.match-data');
            //  get 分數設定表
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

        disabledScoreBoard(){
            if(this.unknown_value.includes(this.show_scoreboard_form.title)) return true;
            if(this.show_scoreboard_form.status=="N"){
                if(this.unknown_value.includes(this.show_scoreboard_form.left.top)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.left.btm)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.right.top)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.right.btm)) return true;
            }
            if(this.show_scoreboard_form.status=="F"){
                if(this.unknown_value.includes(this.show_scoreboard_form.center.top)) return true;
                if(this.unknown_value.includes(this.show_scoreboard_form.center.btm)) return true;
            }
            return false;
        },

        saveScoreBoard(){

        },

        async scoreboardChange(){
            this.show_scoreboard_form.status = (this.unknown_value.includes(this.show_scoreboard_form.title))?"":this.options.title[this.show_scoreboard_form.title].status;
            this.show_scoreboard_form = {
                title:this.show_scoreboard_form.title,
                status:this.show_scoreboard_form.status,
                left:{ top:"", btm:"", },
                right:{ top:"", btm:"", },
                center:{ top:"", btm:"", }
            };
            this.select_scoreboard = {
                left:"",
                right:"",
                center:"",
            };
            if(!this.unknown_value.includes(this.show_scoreboard_form.title)){
                await this.getGroups();
            }
        },

        getGroups(){
            this.selectGroup_disabled=true;
            // api
            this.selectGroup_disabled=false;
        },

        selectScoreboardChange(pos){
            if(pos=="left"){
                this.show_scoreboard_form.left.top = this.options.group[this.select_scoreboard.left].top;
                this.show_scoreboard_form.left.btm = this.options.group[this.select_scoreboard.left].btm;
            }else if(pos=="right"){
                this.show_scoreboard_form.right.top = this.options.group[this.select_scoreboard.right].top;
                this.show_scoreboard_form.right.btm = this.options.group[this.select_scoreboard.right].btm;
            }else if(pos=="center"){
                this.show_scoreboard_form.center.top = this.options.group[this.select_scoreboard.center].top;
                this.show_scoreboard_form.center.btm = this.options.group[this.select_scoreboard.center].btm;
            }
        },

        selectGroupDisabled(id){
            if(id==this.select_scoreboard.left) return true;
            if(id==this.select_scoreboard.right) return true;
            if(id==this.select_scoreboard.center) return true;
            return false;
        },

        teamSelectDisabled(id){
            if(id==this.group_form.g1_1) return true;
            if(id==this.group_form.g1_2) return true;
            if(id==this.group_form.g2_1) return true;
            if(id==this.group_form.g2_2) return true;
            if(id==this.group_form.g3_1) return true;
            if(id==this.group_form.g3_2) return true;
            if(id==this.group_form.g4_1) return true;
            if(id==this.group_form.g4_2) return true;
            if(id==this.group_form.g5_1) return true;
            if(id==this.group_form.g5_2) return true;
            if(id==this.group_form.g6_1) return true;
            if(id==this.group_form.g6_2) return true;
            if(id==this.group_form.g7_1) return true;
            if(id==this.group_form.g7_2) return true;
            if(id==this.group_form.g8_1) return true;
            if(id==this.group_form.g8_2) return true;
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
    .scoreboard-stauts-N >>> .el-divider--vertical{
        width:1px;
        height:105px;
    }
    .scoreboard-stauts-N >>> .el-divider--horizontal{
        margin:0;
    }
    .scoreboard-stauts-F >>> .el-divider--horizontal{
        margin:0;
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
    
</style>