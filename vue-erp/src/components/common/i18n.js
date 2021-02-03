import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import jaLocale from 'element-ui/lib/locale/lang/ja';
import twLocale from 'element-ui/lib/locale/lang/zh-TW';
export const messages = {
  
    'zh_TW': {
        ...twLocale,
        public:{
            reset_ps:{
                must_fill:"必填",
                password_form:'使用6個或更多字符，混合使用字母和數字，其中需包含1個數字跟1個英文字母',
                min_six:'請使用6個或更多字符',
                charactor:'需包含1個數字跟1個英文字母',
                new_ps:'輸入您的新密碼',
                re_new_ps:'再次輸入您的新密碼',
                reset_ps:'變更密碼',
                error_token:'此連結已失效，請使用最新連結。',
                connect_expired:'此連結已過期，請重新申請。',
                internet_error:'發生錯誤，請聯絡客服人員。',
                reset_success:'密碼重設成功，請使用新密碼登入'
            },
            sign_up:{
                contact_mail : "<p style='color:#F56C6C;display:inline-block'>*</p> 聯絡用 Email : ",
                mail_placeholder : "請輸入 Email",
                mail_pattern : "Email 格式",
                required : "必填",
                both_required : "<p style='color:#F56C6C;display:inline-block;'>*區碼及電話必填</p>",
                name : "<p style='color:#F56C6C;display:inline-block'>*</p> 姓名 : ",
                first_name : "名字",
                last_name : "姓氏",
                first_name_placeholder : "請輸入 名字",
                last_name_placeholder : "請輸入 姓氏",
                identification_or_passport : "<p style='color:#F56C6C;display:inline-block'>*</p> 身份證字號 / 護照號碼 : ",
                id_pass_placeholder : "請輸入身份證字號 / 護照號碼",
                id_pass_description : "若沒有中華民國國籍，請輸入護照號碼。",
                gender : "<p style='color:#F56C6C;display:inline-block'>*</p> 性別 : ",
                male : "男性",
                female : "女性",
                birthdate : "<p style='color:#F56C6C;display:inline-block'>*</p> 出生年月日 : ",
                birthdate_placeholder : "請輸入 生日",
                contact_phone : "<p style='color:#F56C6C;display:inline-block'>*</p> 連絡電話 : ",
                phone_placeholder : "請輸入 聯絡電話",
                phone_codes : "電話區碼",
                phone_codes_placeholder : "請選擇 電話區碼",
                country: "<p style='color:#F56C6C;display:inline-block'>*</p> 國家 : ",
                country_placeholder : "請選擇 國家",
                zip_code : "郵遞區號 : ",
                zip_code_placeholder : "請輸入 郵遞區號",
                address : "聯絡地址 : ",
                address_placeholder : "請輸入 聯絡地址",
                reset_form : "重填表單",
                confirm : "送出表單",
                policy_checkbox : "我已閱讀報名注意事項及隱私權確認。",
                not_match : "限定英文數字",
                thx_registration : "感謝您的報名",
                submit_success_and_leave_page : "秒後將離開本頁...",
                expired_signup : "報名已經截止，感謝您的參與",
                error_message : "如有任何異常請聯絡客服<div style='color:A4A4A4;font-size:18px;'>維亞娛樂客服 : cs@varlivetech.com</div>",
            }
        },
        app:{ 
            title_short: 'VAR ERP', 
            title_mobile :'OPMS 行動版',
            title: 'VAR ERP 企業資源管理系統', 
            full_screen: '全屏',
            not_full_screen: '取消全屏',
            tag_options : '標籤選項',
            tag_close_other:'關閉其他標籤',
            tag_close_all :'關閉所有標籤',
            lang_en_US:'English',
            lang_zh_TW:'中文'
        },
        menus:{
            acl: '權限管理',
            role_edit: '角色管理',         
            user_edit: '帳號管理',
            dict_setting: '字典檔設定',
            dictionary_setting: '字典檔設定',
            project_manage: '專案管理系統',
            work_items: '專案管理',
            daily_report:"每日工作彙報",
            day_item_person:"填寫工作彙報",
            day_item_review:"檢視工作彙報",
            project_report_download:"下載工作彙報",
            overtime_manage:"補休管理",
            overtime_person_record:"個人補休紀錄",
            overtime_process:"補休審核",
            overtime_filing:"補休歸檔",
            overtime_report:"補休紀錄下載",
        },
        table_title:{
            role :'角色代號',
            description :'說明',
            menus :'功能清單',
            account :'帳號',
            email :'電子郵件',
            last_name : '別名',
            actions :'動作權限清單',
            info:"說明",
            action:"動作權限",
            has_selected:'已選擇',
        },
        dict:{
            category_quantity: '分類數量 : ',
            setting_quantity: '字典數量 : ',
            category_title: '字典分類',
            key_title: '字典主鍵',
            description_title: '字典說明',
            content_title: '字典內容',
            alert_input_new_keystr: '請輸入[字典主鍵]',
            alert_input_new_category: '請輸入[字典分類]',
            alert_input_new_description: '請輸入[字典說明]',
            alert_input_new_content: '請輸入[字典內容]',
            content_must_json: '字典內容格式必須為 JSON!',
            dict_setting: '字典檔設定',
            dict_list: '字典列表',
            sample:'顯示範例',
            content_example: '<b>字典內容範例 :</b><br>(單一值) : {"label":"動作a", "label_i18n":"dict.action_a", "value":"action_a"},<br>(多重值) : [{"label":"動作a", "label_i18n":"dict.action_a", "value":"action_a"}, {"label":"動作b", "label_i18n":"dict.action_b", "value":"action_b"}]',
            menu_action:{
                create: '建立字典檔',
                delete: '刪除字典檔'
            },
            

        },
        actions:{
            create_outer_project:"創建外部專案",
            edit_outer_project:"編輯外部專案",
            delete_outer_project:"作廢外部專案",
            create_inner_project:"創建專案",
            edit_inner_project:"編輯專案",
            delete_inner_project:"作廢專案",
        },
        btn:{
            key_word:"關鍵字查詢",
            add : '加入',        
            i18n_lang:'語言',
            confirm: '確定',
            cancel: '取消',
            edit: '編輯',
            delete: '刪除',
            delete_all: '全部刪除',
            search: '搜尋',
            clear: '清空',
            action:'操作',
            new:'新增',
            view:'檢視',
            save:'存檔',
            clean:'清除',
            enter_test : '進入測試介面',
            leave:'離開',
            copy:'複製',
            submit:"提交",
            check_submit:"確認提交",
            select_options:'請選擇',
            select_no_limit: '沒有選擇視同與 使用期限 或 活動期限 的最小期限相同',
            select_coupon_no_limit: '沒有選擇視同與 使用期限 或 對應系統設定期限 的最小期限相同',
            select_no_expire: '沒有選擇視同 永久有效',
            input_no_limit: '沒有輸入視同 沒有限制',
            view_detail: '檢視細節',
            sort_setting: '排序設定',
            next:'下一步',
            previous:'上一部',
            check:"檢查",
            apply:"套用",
            apply_manual:"手動套用",
            auto_apply:"自動套用",
            download_excel_file:"下載成excel檔",
            download_excel:"下載 Excel 檔案",
            reset:"重置",
            all_select:"全選",
            close:"關閉",
        },
        common_msg:{
            pass:"通過",
            reject:"退回",
            yes:"是",
            no:"否",
            tip:'提示',
            warning:'警示',
            select_date:"選擇日期",
            new : '新增',
            edit_title: '編輯',
            date_title: '日期',
            name_title: '名稱',
            save_ok:'存檔成功',
            delete_ok:'刪除成功',
            copy_ok:'複製成功',
            apply_ok:"套用成功",
            delete_confirm:'刪除後不可回復，是否確定刪除?',
            action_cancel:'取消動作',
            must_fill: '必填',
            isdigit : '請輸入機台ID (數字型別)',
            open: '開',
            close: '關',
            return: '返回',
            max_len: '最大長度 : ',
            min_len: '最小長度 : ',
            input_number: '請輸入數字',
            input_number_lgt_0: '請輸入數字並且大於 0',
            input_string: '請輸入字串',
            update_ok:'更新成功',
            ask_for_copy: '是否確定複製',
            detail_info:"詳細資料",
            content_must_json:"內容格式必須為 JSON",
            time_must_select:"開始與結束時間必須選擇",
            no_shop_deal_logs:"選擇期間內店鋪沒有販賣點數交易紀錄",
            no_reward_logs:"選擇期間內沒有獎勵配發紀錄",
            time_range_too_large:"開始與結束日期不得大於 3 個月",
            post_error_datatype:"參數格式錯誤",
            post_error_param:"參數錯誤",
            delete_game_tips:"此場比賽的所有設定將全數刪除",
            delete_team_tips:"此隊伍的設定含隊員將全數刪除",
            ask_for_delete:'刪除不可恢復，是否確定刪除',
            no_data:"沒有資料",
            draft:"草稿中",
            publish:"已發布",
            abandon:"已廢棄",
            not_working:"目前無功能",
            team_delete_ng_tips:"無法刪除，因有細項設定已設定",
            go_to_foreign_url:"即將前往外部連結",
            action_error:"操作動作錯誤",
            odoo_user_reader_err:"[Odoo] 取得使用者讀取權限異常",
            odoo_user_editor_err:"[Odoo] 取得使用者編輯權限異常",
            odoo_user_dept_mgr_err:"[Odoo] 取得使用者主管資訊權限異常",
            odoo_dept_info_err:"[Odoo] 取得員工部門資訊異常",
            odoo_dept_tree_err:"[Odoo] 取得部門資訊異常",            
            dict_error:"字典檔異常",
            non_essential:"選填非必要",
            select:"請選擇",
            contact_maintainer:"發生未知錯誤請聯絡維護工程師，謝謝您"
        },
        common_column:{
            id:"ID",
            name:"名稱",
            category:"類別",
            status:"狀態",
            start_date:"起始日期",
            end_date:"結束日期",
            action:"操作"
        },
        account:{
            login: '登入', 
            logout: '登出',
            old_password_not_match:'舊密碼不符合',  
            new_confirm_pass_not_match: '新密碼與確認密碼不一致',        
            new_pass_changed: '密碼已更改，下次請用新密碼登入',
            name_and_pass_not_match :'登入帳號與密碼不符合',
            token_over_exprie:'令牌已過期',
            input_login_name:'請輸入帳號',
            input_login_pass:'請輸入密碼',
            input_account:'請輸入帳號',
            input_alias:'請輸入別名',
            change_password: '修改密碼',
            input_old_pass: '舊密碼',
            input_new_pass: '新密碼',
            input_confirm_pass: '確認新密碼',
            alert_input_new_account:'請輸入[帳號]',
            alert_input_new_alias :'請輸入[別名]',
            alert_input_old_pass:'請輸入[舊密碼]',
            alert_input_new_pass:'請輸入[新密碼]',
            alert_input_confirm_pass:'請輸入[確認新密碼]' ,
            id_is_exist:'帳號已存在，請重新輸入'    ,
            id_is_not_exist:'帳號不存在.',
            id_has_deleted : '帳號已刪除',
        },
        role:{
            alert_id_must_fill:'角色代號必須填寫',
            id_is_exist:'角色代號已存在，請重新輸入',
            id_is_not_exist:'角色代號不存在.',
            id_has_deleted : '角色代號已刪除',
            input_role:"請輸入角色代號",
            input_description:"請輸入角色說明",
        },
        rules:{
            password_len:'密碼長度 6 到 12 字元之間',    
            no_special_characters:'不支援特殊字元',
            only_english_characters:'只支援英文字元',
            only_two_characters:'長度限制2字元',
            only_three_characters:'長度限制3字元',
            only_numbers:'只支援數字字元',
            invalidate_email:'請輸入正確電子郵件形式'
        },
        overtime:{
            apply_comp_time:"申請補休",
            comp_time:"補休時數",
            comp_time_placeholder:"請填入申請補休時數",
            comp_time_tips:"如有申請，需填寫內容敘述",
            delete_status_err:"此補休表單已審核，無法刪除",
            form_id:"申請單號",
            to_be_processed:"待審核",
            processed:"已審核",

            status:{
                D:"草稿",
                O:"作廢",
                P:"審核中",
                R:"退回",
                F:"完成",
                A:"歸檔",
            },
        },
        employee:{
            name:"員工名稱",
            dept:"部門名稱",
            work_hour:"工作時數",
            work_date:"工作日期",
            copy_date:"複製日期",
            description:"內容敘述",
            start_date:"開始時間",
            end_date:"結束時間",
            date_range:"至",
            week:"一周",
            month:"一個月",
            three_months:"三個月",
            create_day_item:"建立每日工作彙報",
            update_day_item:"編輯每日工作彙報",
            copy_day_item:"複製每日工作彙報",
            duplicated_project_same_day:"同一天重複的彙報",
            duplicated_tag:"重複的標籤",
            pid_invalid:"無效的會員編號",
            p_name_invalid:"無效的會員名稱",
            dept_name_invalid:"無效的部門名稱",
            item_id_invalid:"無效的專案",
            work_date_invalid:"無效的工作日期",
            work_hour_invalid:"無效的工作時數",
            over_24_hours:"同一天超過 24 小時",
            dept_tree:"部門分類",
            nobody:"沒有部門成員",
            daily_details:"每日細節",
            edit_personal_tags:"個人標籤管理",
            use_tag_tip:"填寫可幫助日後統計專案細項",
            clear_tag_tip:"會刪除已設定的標籤，請注意",
            manage_tag_tip:"背景為紅色代表此專案有被啟用專案標籤管理，盡管有設定個人標籤但標籤結果仍然為專案標籤",
        },
        project:{
            name:"專案名稱",
            description:"專案說明",
            category:"專案類別",
            status:"專案狀態",
            keyword:"專案名稱ID搜尋",
            create_outter_project:"新增專案",
            id:"專案編號",
            date:"專案日期",
            delete:"作廢",
            ask_delete: "您要作廢此專案嗎 ?",
            edit_outter_project:"編輯外部專案",
            edit_project:"編輯專案",
            create_inner_project:"新增專案",
            edit_inner_project:"編輯專案",
            owner:"專案負責人",
            is_open_tags:"是否啟用分類標籤",
            tag1:"分類標籤",
            tags:"分類標籤",
            add_tags:"新增標籤",
            tag_tips:"如果開啟則工作彙報分類標籤會使用專案預設標籤，反之則使用專案個人標籤",
            list:"專案清單",
            personal_tag:"專案個人標籤",
            unknown_item_id:"未知專案",
        },
    },
    'en_US': {
        ...enLocale,
            public:{
                reset_ps:{
                must_fill:"Required",
                password_form:"Use 6 or more characters with a mix of letters & numbers which include at least one number and one letter.",
                min_six:'Require 6 or more characters',
                charactor:'Require at least one number and one letter.',
                new_ps:"Confirm your new password",
                re_new_ps:"Re-enter your new password",
                reset_ps:"Change Password",
                error_token:"This link is already invalid, please use the latest link.",
                connect_expired:"This link has expired, please apply again.",
                internet_error:"Error had occurred. Please contact customer service center.",
                reset_success:"Your password has been reset successfully. Please log in with your new password."
            },
            sign_up:{
                contact_mail : "<p style='color:#F56C6C;display:inline-block'>*</p> Contact Email : ",
                mail_placeholder : "Please enter contact Email",
                mail_pattern : "Email pattern",
                required : "Required",
                both_required : "<p style='color:#F56C6C;display:inline-block;'>*Region codes and contact phone both are Required</p>",
                name : "<p style='color:#F56C6C;display:inline-block'>*</p> Name : ",
                first_name : "First Name",
                last_name : "Last Name",
                first_name_placeholder : "Please enter first name",
                last_name_placeholder : "Please enter last name",
                identification_or_passport : "<p style='color:#F56C6C;display:inline-block'>*</p> Identification / Passport : ",
                id_pass_placeholder : "Please enter identification / passport",
                id_pass_description : "*If you do not have a citizenship in the Republic of China, please enter your passport number.",
                gender : "<p style='color:#F56C6C;display:inline-block'>*</p> Gender : ",
                male : "Male",
                female : "Female",
                birthdate : "<p style='color:#F56C6C;display:inline-block'>*</p> Birthdate : ",
                birthdate_placeholder : "Please enter Birthdate",
                contact_phone : "<p style='color:#F56C6C;display:inline-block'>*</p> Contact Phone : ",
                phone_placeholder : "Please enter contact phone",
                phone_codes : "Region Codes",
                phone_codes_placeholder : "Please select region codes",
                country: "<p style='color:#F56C6C;display:inline-block'>*</p> Country : ",
                country_placeholder : "Please select country",
                zip_code : "Zip Code : ",
                zip_code_placeholder : "Please enter zip code",
                address : "Contact Address : ",
                address_placeholder : "Please enter contact address",
                reset_form : "Reset",
                confirm : "Confirm",
                policy_checkbox : "I have read the registration notice and privacy policy confirmation.",
                not_match : "Only English or Number",
                thx_registration : "Thanks your Registration",
                submit_success_and_leave_page : "seconds will close this page...",
                expired_signup : "Registration has expired, thanks for your participation",
                error_message : "Please contact customer service<div style='color:A4A4A4;font-size:18px;'>customer service mail : cs@varlivetech.com</div>",
            }
        },
        app: { 
            title_short: 'VAR ERP', 
            title_mobile :'VAR ERP Mobile',
            title: 'VAR ERP Manage System', 
            full_screen: 'full screen',
            not_full_screen: 'close full screen',
            tag_options : 'tag option',
            tag_close_other:'close others',
            tag_close_all :'close all',
            lang_en_US:'English',
            lang_zh_TW:'中文'
        },
        menus:{
            acl: 'Access Control',
            role_edit: 'Role Control',         
            user_edit: 'Account Control',
            dict_setting: 'Dictionary Setting',
            dictionary_setting: 'Dictionary Setting',
            project_manage: 'Project Manage',
            work_items: 'Project',
            daily_report:"Daily Report",
            day_item_person:"Fill In",
            day_item_review:"Review",
            project_report_download:"Downlaod Report",
            overtime_manage:"Overtime Manage",
            overtime_person_record:"Personal Record",
            overtime_process:"Process ",
            overtime_filing:"Filing",
            overtime_report:"Download Report",
        },
        table_title :{
            role :'Role id',
            description :'Description',
            menus :'Menus List',
            account :'Account',
            email :'E-mail',
            last_name : 'Alias',
            actions :'Actions',
            info:"Information",
            action:"Action",
            has_selected:'Has Selected',
        },
        dict: {
            category_quantity: 'Category Quantity : ',
            setting_quantity: 'Dictionary Quantity : ',
            category_title: 'Category',
            key_title: 'Dictionary Key',
            description_title: 'Description',
            content_title: 'Content',
            alert_input_new_keystr: 'Please fill [Dictionary Key]',
            alert_input_new_category: 'Please fill [Category]',
            alert_input_new_description: 'Please fill [Description]',
            alert_input_new_content: 'Please fill [Content]',
            content_must_json: 'Content format must be JSON!',
            content_example: '<b>Content example :</b><br>(single value):  {"label":"action a","label_i18n":"dict.action_a","value":"action_a"},<br>(multiple value):  [{"label":"action a","label_i18n":"dict.action_a","value":"action_a"},{"label":"action b","label_i18n":"dict.action_b","value":"action_b"}]',
            dict_setting: 'Dictionary Setting',
            dict_list: 'Dictionary List',
            Sample:'sample',
            menu_action: {
            create: 'create dictionary',
            delete: 'delete dictionary'
            }
        },
        btn: {
            key_word:"Key Words",
            add : 'Add',
            i18n_lang:'Language',
            confirm: 'Confirm',
            cancel: 'Cancel',
            edit: 'Edit',
            delete: 'Delete',
            delete_all: 'Delete All',
            search: 'Search',
            clear: 'Clear',
            action:'Action',
            new:'New',
            view:'View',
            save:'Save',
            save_toSetting:'Save for following Reward Settings',
            clean:'Clean',
            leave:'Leave',
            copy:'Copy',
            submit:"Submit",
            check_submit:"Check Submission",
            enter_test : 'Enter TEST Interface',
            select_options:'Select Options',
            select_no_limit: "Without Options will be Same with tha Min Date between Events' Expired and Use's Expired",
            select_coupon_no_limit: "Without Options will be Same with tha Min Date between System's Expired and Use's Expired",
            select_no_expire: 'Without Options will be Permanent',
            input_no_limit: 'Without Inputs will be No Limit',
            view_detail: 'Details',
            sort_setting: 'Sort Settings',
            next:'Next Step',
            previous:'Previous Step',
            check:"Check",
            apply:"Apply",
            apply_manual:"Manual Apply",
            auto_apply:"Auto Apply",
            download_excel_file:"Download as excel",
            download_excel:"Download as Excel",
            reset:"Reset",
            all_select:"All",
            close:"Close",
        },
        common_msg:{
            pass:"Pass",
            reject:"Reject",
            yes:"Yes",
            no:"No",
            tip:'Tip',
            warning:'Warning',
            select_date:"Select Date",
            new : 'Create',
            edit_title: 'Edit',
            date_title: 'Date',
            name_title: 'Name',
            save_ok:'Save OK',
            delete_ok:'Delete OK',
            copy_ok:'Copy OK',
            apply_ok:"Apply OK",
            delete_confirm:'Confirm to delete?',
            action_cancel:'Action Cancel',
            must_fill : 'Required',
            isdigit : 'Please Input Machine ID (digit)',
            open: 'True',
            close: 'False',
            return: 'Return',
            max_len: 'Max Length : ',
            min_len: 'Min Length : ',
            input_number: 'Please Input Number',
            input_number_lgt_0: 'Please Input Number Larger than 0',
            input_string: 'Please Input String',
            update_ok:'Update OK',
            ask_for_copy: 'Confirm to copy',
            detail_info:"Detail Information",
            content_must_json: 'Content format must be JSON',
            time_must_select:"Start & End time must be selected",
            no_shop_deal_logs:"There isn't credits deal logs during the period",
            no_reward_logs:"There isn't reward logs during the period",
            time_range_too_large:"The period can't be larger than three months",
            post_error_datatype:"Post parameter data type error",
            post_error_param:"Parameter error",
            delete_game_tips:"All settings in this game will be deleted",
            delete_team_tips:"All settings in this team will be deleted",
            ask_for_delete:"All settings can't rollback, Confirm to delete",
            no_data:"No Data",
            draft:"Draft",
            publish:"Published",
            abandon:"Abandoned",
            not_working:"Not Working Now",
            team_delete_ng_tips:"Delete Failed, detail settings have already used",
            go_to_foreign_url:"Go to foreign URL",
            action_error:"Action Error",
            odoo_user_reader_err:"[Odoo] Get User Reader Error",
            odoo_user_editor_err:"[Odoo] Get User Editor Error",
            odoo_user_dept_mgr_err:"[Odoo] Get User Dept. Manager Info Editor",
            odoo_dept_info_err:"[Odoo] Get EE. Dept. Information Error",
            odoo_dept_tree_err:"[Odoo] Get Dept. Information Error",
            dict_error:"Dictionary Setting Error",
            non_essential:"Non-essential",
            select:"Select",
            contact_maintainer:"Unknown Error happened, contact maintainer please, thanks for your help"
        },
        common_column:{
            id:"ID",
            name:"Name",
            category:"CAT",
            status:"Status",
            start_date:"Start Date",
            end_date:"End Date",
            action:"Action"
        },
        account: {
            login: 'Login', 
            logout: 'Logout',
            old_password_not_match:'Old password is not match',  
            new_confirm_pass_not_match: 'New password and confirm password must the same',        
            new_pass_changed: 'Password has changed，please use new password at next login',
            name_and_pass_not_match :'Account and password is not match',
            token_over_exprie:'Token is exprie',
            input_login_name:'Please fill account',
            input_login_pass:'Please fill password',
            input_account:'Input Account',
            input_alias:'Input Alias',
            change_password: 'Change Password',
            input_old_pass: 'Old Password',
            input_new_pass: 'New Password',
            input_confirm_pass: 'Confirm Password',
            alert_input_new_account:'Please fill [Account]',
            alert_input_new_alias :'Please fill account[Alias]',
            alert_input_old_pass:'Please fill [Old password]',
            alert_input_new_pass:'Please fill [New password]',
            alert_input_confirm_pass:'Please fill [Confirm password]',
            id_is_exist:'The account name already exists, please re-enter',
            id_is_not_exist:'Account does not exist',
            id_has_deleted : 'Account has deleted'
        },
        role :{
            alert_id_must_fill:'Role id must be filled in',
            id_is_exist:'The Role id already exists, please re-enter',
            id_is_not_exist:'Role id does not exist',
            id_has_deleted : 'Role id has deleted',
            input_role:"Input Role id",
            input_description:"Input Role description",
        },
        rules: {
            password_len:'password length must between 6 ~ 12 ',
            no_special_characters:'No Special Characters Allow',
            only_english_characters:'Only Allow English Characters',
            only_two_characters:'Only 2 Characters Allow',
            only_three_characters:'Only 3 Characters Allow',
            only_numbers:'Only Allow Numbers',
            invalidate_email:'Please enter validate email'      
        },
        overtime:{
            apply_comp_time:"Comp. Time",
            comp_time:"Comp. Time",
            comp_time_placeholder:"Overtime Hours * Overtime Rate",
            comp_time_tips:"Description must be required if applying",
            delete_status_err:"The comp time has been reviewed",
            form_id:"Form ID",
            to_be_processed:"To be processed",
            processed:"Processed",

            status:{
                D:"Draft",
                O:"Obsolete",
                P:"Processing",
                R:"Reject",
                F:"Finish",
                A:"Archive",
            },
        },
        employee:{
            name:"EE. Name",
            dept:"Dept. Name",
            work_hour:"Working Hour",
            work_date:"Working Date",
            copy_date:"Copy To Date",
            description:"Description",
            start_date:"Start Date",
            end_date:"End Date",
            date_range:"To",
            week:"Week",
            month:"Month",
            three_months:"3 Months",
            create_day_item:"Create Daily Report",
            update_day_item:"Update Daily Report",
            copy_day_item:"Copy Daily Report",
            duplicated_project_same_day:"Duplicated report project at same day",
            duplicated_tag:"Duplicated tag",
            pid_invalid:"Invalid ee. id",
            p_name_invalid:"Invalid ee. name",
            dept_name_invalid:"Invalid dept. name",
            item_id_invalid:"Invalid project",
            work_date_invalid:"Invalid work date",
            work_hour_invalid:"Invalid work hour",
            over_24_hours:"Over 24 hours",
            dept_tree:"Dept. Tree",
            nobody:"Nobody",
            daily_details:"Daily Details",
            edit_personal_tags:"Personal Tags",
            use_tag_tip:"Fill in the tag that can help future statistics of the project",
            clear_tag_tip:"Delete tags that you set",
            manage_tag_tip:"The background is red, which means that the project has been actived for project tag management. Although the personal tag is set, the tag result is still the project tag",
        },
        project:{
            name:"Proj. Name",
            description:"Description",
            category:"Category",
            status:"Status",
            keyword:"Search for Name & ID",
            create_outter_project:"Create Project",
            id:"ID",
            date:"Date",
            delete:"Delete",
            ask_delete:"Do you want to delete this project ? ",
            edit_outter_project:"Edit Outter Project",
            edit_project:"Edit Project",
            create_inner_project:"Create Project",
            edit_inner_project:"Edit Project",
            owner:"Project Owner",
            is_open_tags:"Active Category Tag",
            tag1:"Category Tag",
            tags:"Category Tag",
            add_tags:"Add Tags",
            tag_tips:"If open tags manager, tags category defaulted by project, else by project-employee",
            list:"Project List",
            personal_tag:"Personal Project Tag",
            unknown_item_id:"Unknown Project",
        },
    },
    'ja_JP':{
        ...jaLocale,
            public:{
                reset_ps:{
                must_fill:"必須",
                password_form:"数字とアルファベットを組み合わせて６文字以上で設定してください。",
                min_six:'わせ６文字以上で設定してください。',
                charactor:'数字とアルファベットを組み合わせ',
                new_ps:"新しいパスワードを入力してください",
                re_new_ps:"新しいパスワードをもう一度入力してください",
                reset_ps:"新しいパスワードを設定する",
                error_token:"このリンクは既に無効です。最新のリンクを使用してください。",
                connect_expired:"このリンクは有効期限が切れています。もう一度送信してください。",
                internet_error:"エラーが発生しました。カスタマーサービスセンターに連絡してください。",
                reset_success:"パスワードのリセットが完了しました。新しいパスワードでログインしてください。"
                },
            sign_up:{
            contact_mail : "<p style='color:#F56C6C;display:inline-block'>*</p> Contact Email : ",
            mail_placeholder : "Please enter contact Email",
            mail_pattern : "Email pattern",
            required : "Required",
            both_required : "<p style='color:#F56C6C;display:inline-block;'>*Region codes and contact phone both are Required</p>",
            name : "<p style='color:#F56C6C;display:inline-block'>*</p> Name : ",
            first_name : "First Name",
            last_name : "Last Name",
            first_name_placeholder : "Please enter first name",
            last_name_placeholder : "Please enter last name",
            identification_or_passport : "<p style='color:#F56C6C;display:inline-block'>*</p> Identification / Passport : ",
            id_pass_placeholder : "Please enter identification / passport",
            id_pass_description : "*If you do not have a citizenship in the Republic of China, please enter your passport number.",
            gender : "<p style='color:#F56C6C;display:inline-block'>*</p> Gender : ",
            male : "Male",
            female : "Female",
            birthdate : "<p style='color:#F56C6C;display:inline-block'>*</p> Birthdate : ",
            birthdate_placeholder : "Please enter Birthdate",
            contact_phone : "<p style='color:#F56C6C;display:inline-block'>*</p> Contact Phone : ",
            phone_placeholder : "Please enter contact phone",
            phone_codes : "Region Codes",
            phone_codes_placeholder : "Please select region codes",
            country: "<p style='color:#F56C6C;display:inline-block'>*</p> Country : ",
            country_placeholder : "Please select country",
            zip_code : "Zip Code : ",
            zip_code_placeholder : "Please enter zip code",
            address : "Contact Address : ",
            address_placeholder : "Please enter contact address",
            reset_form : "Reset",
            confirm : "Confirm",
            policy_checkbox : "I have read the registration notice and privacy policy confirmation.",
            not_match : "Only English or Number",
            thx_registration : "Thanks your Registration",
            submit_success_and_leave_page : "seconds will close this page...",
            expired_signup : "Registration has expired, thanks for your participation",
            error_message : "Please contact customer service<div style='color:A4A4A4;font-size:18px;'>customer service mail : cs@varlivetech.com</div>",
            }
        }
    },
    'zh_CN':{
        ...zhLocale,
        public:{
            reset_ps:{
                must_fill:"必填",
                password_form:"使用6个或更多字符，混合使用字母和数字，其中需包含1个数字跟1个英文字母",
                min_six:'請使用6个或更多字符',
                charactor:'需包含1个数字跟1个英文字母',
                new_ps:"输入您的新密码",
                re_new_ps:"再次输入您的新密码",
                reset_ps:"变更密码",
                error_token:"此连结已失效，请使用最新连结。",
                connect_expired:"此连结已过期，请重新申请。",
                internet_error:"发生错误，请联络客服人员。",
                reset_success:"密码重设成功，请使用新密码登入。"
            },
            sign_up:{
                contact_mail : "<p style='color:#F56C6C;display:inline-block'>*</p> Contact Email : ",
                mail_placeholder : "Please enter contact Email",
                mail_pattern : "Email pattern",
                required : "Required",
                both_required : "<p style='color:#F56C6C;display:inline-block;'>*Region codes and contact phone both are Required</p>",
                name : "<p style='color:#F56C6C;display:inline-block'>*</p> Name : ",
                first_name : "First Name",
                last_name : "Last Name",
                first_name_placeholder : "Please enter first name",
                last_name_placeholder : "Please enter last name",
                identification_or_passport : "<p style='color:#F56C6C;display:inline-block'>*</p> Identification / Passport : ",
                id_pass_placeholder : "Please enter identification / passport",
                id_pass_description : "*If you do not have a citizenship in the Republic of China, please enter your passport number.",
                gender : "<p style='color:#F56C6C;display:inline-block'>*</p> Gender : ",
                male : "Male",
                female : "Female",
                birthdate : "<p style='color:#F56C6C;display:inline-block'>*</p> Birthdate : ",
                birthdate_placeholder : "Please enter Birthdate",
                contact_phone : "<p style='color:#F56C6C;display:inline-block'>*</p> Contact Phone : ",
                phone_placeholder : "Please enter contact phone",
                phone_codes : "Region Codes",
                phone_codes_placeholder : "Please select region codes",
                country: "<p style='color:#F56C6C;display:inline-block'>*</p> Country : ",
                country_placeholder : "Please select country",
                zip_code : "Zip Code : ",
                zip_code_placeholder : "Please enter zip code",
                address : "Contact Address : ",
                address_placeholder : "Please enter contact address",
                reset_form : "Reset",
                confirm : "Confirm",
                policy_checkbox : "I have read the registration notice and privacy policy confirmation.",
                not_match : "Only English or Number",
                thx_registration : "Thanks your Registration",
                submit_success_and_leave_page : "seconds will close this page...",
                expired_signup : "Registration has expired, thanks for your participation",
                error_message : "Please contact customer service<div style='color:A4A4A4;font-size:18px;'>customer service mail : cs@varlivetech.com</div>",
            }
        }
    }
}
