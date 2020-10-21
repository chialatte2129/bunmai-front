<template>
    <div class="setting-page">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-aim"></i> {{$t("menus.event_box_taipei_20201025")}}</el-breadcrumb-item>
                <el-breadcrumb-item><b>{{$t("menus.OK_setting")}}</b></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-card shadow="hover" body-style="padding:10px" class="mgb10">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px;">顯示記分板設定</span>
                    <el-button type="primary" size="large" icon="el-icon-files" class="card-header-r-btn" :disabled="disabledScoreBoard()" @click="saveScoreBoard(false)"> {{$t('btn.save')}}</el-button>
                    <el-button type="info" size="large" plain icon="el-icon-connection" class="card-header-btn" @click="getLink('score')"> 取得記分板連結</el-button>
                    <el-button type="success" size="large" plain class="card-header-btn" @click="saveScoreBoard(true)"> 重置</el-button>
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
                            <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('15')" @click="editScore('15', '-1', -1, 'top')"/>
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
                            <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('16')" @click="editScore('16', '-1', -1, 'btm')"/>
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
                                <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('13')" @click="editScore('13', '15', 4, 'top')"/>
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
                                <el-button type="warning" size="mini" circle class="el-icon-setting btn-final" :disabled="editDisabled('14')" @click="editScore('14', '15', 4, 'btm')"/>
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
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('9')" @click="editScore('9', '13', 3, 'top')"/>
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
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('10')" @click="editScore('10', '13', 3, 'btm')"/>
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
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('11')" @click="editScore('11', '14', 3, 'top')"/>
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
                                    <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('12')" @click="editScore('12', '14', 3, 'btm')"/>
                                </el-col>
                            </el-col>
                        </el-row>
                        <el-row class="match-sixteen mgb10" :key="sixteenKey">
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('1')" @click="editScore('1', '9', 2, 'top')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('2')" @click="editScore('2', '9', 2, 'btm')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('3')" @click="editScore('3', '10', 2, 'top')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('4')" @click="editScore('4', '10', 2, 'btm')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('5')" @click="editScore('5', '11', 2, 'top')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('6')" @click="editScore('6', '11', 2, 'btm')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('7')" @click="editScore('7', '12', 2, 'top')"/>
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
                                        <el-button type="warning" size="mini" circle class="el-icon-setting btn-sixteen" :disabled="editDisabled('8')" @click="editScore('8', '12', 2, 'btm')"/>
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
                                        <el-badge :value="1" class="item" type="primary">
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g1_1" clearable filterable 
                                                :disabled="groupSettingDisabled('g1_1')" @change="createGroupSetting(group_form.g1_1, '1', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g1_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g1_2')" @change="createGroupSetting(group_form.g1_2, '1', 'btm')">
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
                                                :disabled="groupSettingDisabled('g2_1')" @change="createGroupSetting(group_form.g2_1, '2', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g2_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g2_2')" @change="createGroupSetting(group_form.g2_2, '2', 'btm')">
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
                                                :disabled="groupSettingDisabled('g3_1')" @change="createGroupSetting(group_form.g3_1, '3', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g3_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g3_2')" @change="createGroupSetting(group_form.g3_2, '3', 'btm')">
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
                                                :disabled="groupSettingDisabled('g4_1')" @change="createGroupSetting(group_form.g4_1, '4', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-blue">
                                                <el-select class="team-selector-N" v-model="group_form.g4_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g4_2')" @change="createGroupSetting(group_form.g4_2, '4', 'btm')">
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
                                                :disabled="groupSettingDisabled('g5_1')" @change="createGroupSetting(group_form.g5_1, '5', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g5_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g5_2')" @change="createGroupSetting(group_form.g5_2, '5', 'btm')">
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
                                                :disabled="groupSettingDisabled('g6_1')" @change="createGroupSetting(group_form.g6_1, '6', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g6_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g6_2')" @change="createGroupSetting(group_form.g6_2, '6', 'btm')">
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
                                                :disabled="groupSettingDisabled('g7_1')" @change="createGroupSetting(group_form.g7_1, '7', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g7_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g7_2')" @change="createGroupSetting(group_form.g7_2, '7', 'btm')">
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
                                                :disabled="groupSettingDisabled('g8_1')" @change="createGroupSetting(group_form.g8_1, '8', 'top')">
                                                    <el-option v-for="option in options.teams" :label="`${option.name}`" :value="option.id" :key="option.id" :disabled="teamSelectDisabled(option.id)"/>
                                                </el-select>
                                            </el-row>
                                            <el-divider/>
                                            <el-row class="bg-red">
                                                <el-select class="team-selector-N" v-model="group_form.g8_2" clearable filterable 
                                                :disabled="groupSettingDisabled('g8_2')" @change="createGroupSetting(group_form.g8_2, '8', 'btm')">
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
            <teamManage :match_id="match_id" @change="handleTeamChange"></teamManage>
        </div>
        <el-dialog ref="dialog" :title="`Group ${editScoreGroup}`" :visible.sync="editScoreView" :before-close="cancelEditScore" :close-on-click-modal="false" :key="scoreFormKey">
            <!-- :width="`${250+edit_score_rule.match*110}px`" -->
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
                    <!-- <div style="margin:20px 0 0 70px;" v-if="edit_score_form.length>0">
                        <span style="display:inline-block;">晉級隊伍&emsp;&emsp;&emsp;&emsp;</span>
                        <span style="display:inline-block;">
                            <el-checkbox-group v-model="edit_score_win" :max="1">
                                <el-checkbox v-for="(row, idx) in edit_score_form" :label="row.name" :key="idx" border/>
                            </el-checkbox-group>
                        </span>
                    </div> -->
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
import { eventService } from "@/_services";
export default {
    name:"OK_setting",
    components: {
        teamManage
    },

    data(){
        return {
            match_id:"MATCH-OK-2020-10-25",
            scoreFormKey:0,
            scoreboardKey:0,
            sixteenKey:0,
            dialog_loading:false,
            editScoreView:false,
            editScoreGroup:"",
            editDestinationGroup:"",
            editDestinationRound:null,
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
            group_lock:true,
            group_form:{},
            match_form:{
                // g1_1:{ id: "00001", group_id: "1", name: "team_01", process: "D", is_win: 0, pos_id: "top"},
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
        
    },

    created(){
        this.getTitle();
        this.getGroupSetting();
        this.refreshMatchData();
        this.getScoreBoard();
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
            await eventService.get_group_setting({match_id:this.match_id, round:1}).then(res => {
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
                    // g1_1:{ id: "00001", group_id: "1", name: "team_01", process: "D", is_win: 0, pos_id: "top"},
                    this.match_form[`g${group_id}_${(pos=='top')?1:2}`] = {id:temp_team_id, name:name, group_id:group_id, is_win:false, process:"D", pos_id:pos};
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

        async getTitle(){
            await eventService.get_title({match_id:this.match_id}).then(res => {
                if(res.code==1){
                    this.options.title = res.title;
                }else{
                    this.$message.warning(res.msg);
                }
            })
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

        async getScoreBoard(){
            await eventService.get_scoreboard_setting({match_id:this.match_id}).then(res => {
                if(res.code==1){
                    this.show_scoreboard_form = res.scoreboard;
                    this.select_scoreboard = res.select;
                    if(!this.unknown_value.includes(this.show_scoreboard_form.title)){
                        this.getGroups();
                    }
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        saveScoreBoard(status){
            eventService.save_scoreboard_setting({match_id:this.match_id, scoreboard:this.show_scoreboard_form, is_reset:status}).then(res => {
                if(res.code==1){
                    this.$message.success(res.msg);
                    if(status){
                        this.resetScoreboard();
                        this.show_scoreboard_form.title = "";
                        this.show_scoreboard_form.status = "";
                    }
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        resetScoreboard(){
            this.show_scoreboard_form.left = { top:"", btm:"" };
            this.show_scoreboard_form.right = { top:"", btm:"" };
            this.show_scoreboard_form.center = { top:"", btm:"" };
            this.select_scoreboard = {
                left:"",
                right:"",
                center:"",
            };
        },

        async scoreboardChange(){
            this.resetScoreboard();
            this.show_scoreboard_form.status = (this.unknown_value.includes(this.show_scoreboard_form.title))?"":this.options.title[this.show_scoreboard_form.title].status;
            if(!this.unknown_value.includes(this.show_scoreboard_form.title)){
                await this.getGroups();
            }
        },

        async getGroups(){
            this.selectGroup_disabled=true;
            await eventService.get_group_option({match_id:this.match_id, title_id:this.show_scoreboard_form.title}).then(res => {
                if(res.code==1){
                    this.options.group = res.group;
                }else{
                    this.$message.warning(res.msg);
                }
            })
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
    .table{
        font-size:14px;
    }
    .dialog-footer{
        text-align:right;
        margin-top:10px;
    }
</style>