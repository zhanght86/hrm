/**
 * 招聘发布
 * @author 
 * @version 2016-09-25
 */
var page='1';
var rows='30';
var orgId= parent.config.org_Id;
var personId= parent.config.persion_Id;
var name = '';
var deptId = '';
var post = '';
var employ = {};
var state = '';
var orgCount=0;
var deptIds=parent.orgids;
var search=false;
$(function () {
    /**
     * 数据列表
     */
    $("#dataGrid").datagrid({
        iconCls: 'icon-edit',//图标
        width: '100%',
        height: '100%',
        nowrap: false,
        fit: true,
        fitColumns: true,
        toolbar: '#tb',
        method: 'GET',
        striped: true,
        border: true,
        pagination: true,//分页控件
        pageSize: 30,
        pageList: [10, 20, 30, 40, 50],//可以设置每页记录条数的列表
        loadMsg: '数据正在加载中，请稍后.....',
        collapsible: false,//是否可折叠的
        url: basePath +'/employ/employ-list?orgId='+orgId+'&name='+name+'&deptId='+deptId+'&post='+post+'&state='+state+'&deptIds='+deptIds,
        remoteSort: false,
        //idField: 'employId',
        singleSelect: false,//是否单选
        rownumbers: true,//行号
        columns: [[
            {field: 'ck', title: '', checkbox: true},
            {field: 'employId', title: '', hidden: true},
            {field: 'orgId', title: '组织机构编码', hidden: true},
            {field: 'orgName', title: '招聘机构', width:'13%', align: 'center'},
            {field: 'deptId', title: '招聘科室ID', hidden: true},
            {field: 'deptName', title: '招聘科室', width:'14%', align: 'center'},
            {field: 'name', title: '招聘主题', width:'18%', align: 'center'},
            /*{field: 'required', title: '任职要求', width:'30%', align: 'center'},*/
            {field: 'state', title: '当前状态', width:'8%', align: 'center',
                formatter: function (value, row, index) {
                    if (value == "0") {
                        return "起草";
                    }
                    if (value == "1") {
                        return "已发布";
                    }
                    if (value == "2") {
                        return "结束";
                    }
                    if (value == "3") {
                        return "已到期";
                    }
                }
            },
            {field: 'post', title: '招聘岗位', width:'10%', align: 'center'},
            {field: 'property', title: '招聘性质', width:'10%', align: 'center'},
            {field: 'education', title: '学历要求', width:'10%', align: 'center'},
            {field: 'experience', title: '工作经验', width:'10%', align: 'center'},
            {field: 'salary', title: '薪资', width:'10%', align: 'center'},
            {field: 'province', title: '工作省份', hidden: true},
            {field: 'city', title: '工作城市', hidden: true},
            {field: 'county', title: '工作县区',hidden: true},
            {field: 'address1', title: '详细地址',hidden: true},
            {field: 'address', title: '工作地址', width:'24%', align: 'center'},
            {field: 'tel', title: '联系电话', width:'10%', align: 'center'},
            {field: 'email', title: '联系邮箱', width:'10%', align: 'center'},
            {field: 'until', title: '有效期至', width:'10%', align: 'center',
                formatter: formatDatebox1
            },
            {field: 'createBy', title: '创建人', width:'8%', align: 'center'},
            {field: 'createDeptname', title: '创建科室', width:'10%', align:'center'},
            {field: 'createDept', title: '创建科室编号', hidden:true},
            {field: 'createDate', title: '创建时间', width:'14%',align: 'center'},
            {field: 'updateBy', title: '更新人', width:'7%', align: 'center'},
            {field: 'updateDate', title: '更新时间', width:'14%', align: 'center'},
            {field: 'publishBy', title: '发布人', width:'7%', align: 'center'},
            {field: 'publishDate', title: '发布时间', width:'14%', align: 'center',formatter: formatDatebox}
        ]],
        onLoadSuccess:function(data){
            $('#newDialog').css('display','block');
            $('#newDialog1').css('display','block');
            $('#tb').css('display','block');
            $("#dataGrid").datagrid('getPager').pagination({
                pageList: [10, 20, 30, 40, 50], //可以设置每页记录条数的列表
                displayMsg: '当前显示从第{from}条到第{to}条，共{total}条记录',
                onSelectPage: function (pageNumber, pageSize) {
                    var state = $('#dataGrid').data('datagrid');
                    var opts = state.options;
                    page=opts.pageNumber = pageNumber;
                    rows=opts.pageSize = pageSize;
                    searchData(page,rows);
                }
            });
        }
    });


    //格式化时间：时分秒
    function formatDatebox(value) {
        if (value == null || value == '') {
            return '';
        }
        var dt;
        if (value instanceof Date) {
            dt = value;
        } else {
            dt = new Date(value);
        }
        return dt.format("yyyy-MM-dd hh:mm:ss"); //扩展的Date的format方法(上述插件实现)
    }
    //格式化时间：年月日
    function formatDatebox1(value) {
        if (value == null || value == '') {
            return '';
        }
        var dt;
        if (value instanceof Date) {
            dt = value;
        } else {
            dt = new Date(value);
        }
        return dt.format("yyyy-MM-dd"); //扩展的Date的format方法(上述插件实现)
    }

    //查询、新增条件：招聘岗位
    $("#EMPLOY_POST1").combobox({
        //url: basePath + '/dict/find-list-by-type?type=' + 'POST_DICT',
        idField: 'value',
        textField: 'label',
        value:'请选择',
        panelWidth: '136px',
        panelHeight: 'auto',
        method: 'GET',
        loadMsg: '数据正在加载',
        mode: 'remote',
        onLoadSuccess:function(data){
            orgCount=data.length;
        },
        onShowPanel:function(){
            //动态调整高度
            if(orgCount>8){
                $(this).combobox('panel').height(140);
            }
            $.get(basePath + '/dict/find-list-by-type?type=' + 'POST_DICT', function (data) {
                $("#EMPLOY_POST1").combobox('loadData',data);
            });
        }
    });
    $("#EMPLOY_POST").combobox({
        //url: basePath + '/dict/find-list-by-type?type=' + 'POST_DICT',
        idField: 'value',
        textField: 'label',
        panelWidth: '136px',
        panelHeight: 'auto',
        method: 'GET',
        loadMsg: '数据正在加载',
        mode: 'remote',
        onLoadSuccess:function(data){
            orgCount=data.length;
        },
        onShowPanel:function(){
            //动态调整高度
            if(orgCount>8){
                $(this).combobox('panel').height(140);
            }
            $.get(basePath + '/dict/find-list-by-type?type=' + 'POST_DICT', function (data) {
                $("#EMPLOY_POST").combobox('loadData',data);
            });
        }
    });
    //新增条件：招聘性质
    $("#EMPLOY_PROPERTY").combobox({
        //url: basePath + '/dict/find-list-by-type?type=' + 'EMPLOY_PROPERTY',
        idField: 'value',
        textField: 'label',
        panelWidth: '136px',
        panelHeight: 'auto',
        method: 'GET',
        loadMsg: '数据正在加载',
        mode: 'remote',
        onLoadSuccess:function(data){
            orgCount=data.length;
        },
        onShowPanel:function(){
            //动态调整高度
            if(orgCount>8){
                $(this).combobox('panel').height(140);
            }
            $.get(basePath + '/dict/find-list-by-type?type=' + 'EMPLOY_PROPERTY', function (data) {
                $("#EMPLOY_PROPERTY").combobox('loadData',data);
            });
        }
    });
    //新增条件：学历要求
    $("#EDUCATION_REQUIRE").combobox({
        //url: basePath + '/dict/find-list-by-type?type=' + 'EDUCATION_DICT',
        idField: 'value',
        textField: 'label',
        panelWidth: '136px',
        panelHeight: 'auto',
        method: 'GET',
        multiple:false,
        loadMsg: '数据正在加载',
        mode: 'remote',
        onLoadSuccess:function(data){
            orgCount=data.length;
        },
        onShowPanel:function(){
            //动态调整高度
            if(orgCount>8){
                $(this).combobox('panel').height(140);
            }
            $.get(basePath + '/dict/find-list-by-type?type=' + 'EDUCATION_DICT', function (data) {
                $("#EDUCATION_REQUIRE").combobox('loadData',data);
            });
        }
    });
    //新增条件：工作经验
    $("#WORK_EXPERIENCE").combobox({
        //url: basePath + '/dict/find-list-by-type?type=' + 'WORK_EXPERIENCE',
        idField: 'value',
        textField: 'label',
        panelWidth: '136px',
        panelHeight: 'auto',
        method: 'GET',
        loadMsg: '数据正在加载',
        mode: 'remote',
        onLoadSuccess:function(data){
            orgCount=data.length;
        },
        onShowPanel:function(){
            //动态调整高度
            if(orgCount>8){
                $(this).combobox('panel').height(140);
            }
            $.get(basePath + '/dict/find-list-by-type?type=' + 'WORK_EXPERIENCE', function (data) {
                $("#WORK_EXPERIENCE").combobox('loadData',data);
            });
        }
    });
    //新增条件：薪资
    $("#SALARY").combobox({
        //url: basePath + '/dict/find-list-by-type?type=' + 'SALARY',
        idField: 'value',
        textField: 'label',
        panelWidth: '136px',
        panelHeight: 'auto',
        method: 'GET',
        loadMsg: '数据正在加载',
        mode: 'remote',
        onLoadSuccess:function(data){
            orgCount=data.length;
        },
        onShowPanel:function(){
            //动态调整高度
            if(orgCount>8){
                $(this).combobox('panel').height(140);
            }
            $.get(basePath + '/dict/find-list-by-type?type=' + 'SALARY', function (data) {
                $("#SALARY").combobox('loadData',data);
            });
        }
    });

    //查询、新增条件:招聘科室树选择
    $("#EMPLOY_DEPT_ID1").combotree({
        panelWidth: '160px',
        fitColumns: true,
        striped: true,
        singleSelect: true,
        value:'请选择',
        text:'请选择',
        loadMsg: '数据正在加载中，请稍后.....',
        columns: [[{
            title: 'id',
            field: "id",
            hidden: true
        }, {
            title: '科室名称',
            field: 'text',
            width: '100%'
        }]],
        onSelect: function (node) {
            //返回树对象
            var tree = $(this).tree;
            //选中的节点是否为叶子节点,如果不是叶子节点,清除选中
            var isLeaf = tree('isLeaf', node.target);
            if (!isLeaf) {
                //清除选中
                $('#EMPLOY_DEPT_ID1').combotree('clear');
                $.messager.alert("提示", "请选择具体科室!", "info");
            }
        }
    });
    $("#EMPLOY_DEPT_ID").combotree({
        panelWidth: '160px',
        fitColumns: true,
        striped: true,
        singleSelect: true,
        value:'请选择',
        text:'请选择',
        loadMsg: '数据正在加载中，请稍后.....',
        columns: [[{
            title: 'id',
            field: "id",
            hidden: true
        }, {
            title: '科室名称',
            field: 'text',
            width: '100%'
        }]],
        onSelect: function (node) {
            //返回树对象
            var tree = $(this).tree;
            //选中的节点是否为叶子节点,如果不是叶子节点,清除选中
            var isLeaf = tree('isLeaf', node.target);
            if (!isLeaf) {
                //清除选中
                $('#EMPLOY_DEPT_ID').combotree('clear');
                $.messager.alert("提示", "请选择具体科室!", "info");
            }
        }
    });
    var loadDept = function () {
        var depts = [];
        var treeDepts = [];
        var loadPromise = $.get("/service/dept-dict/list?orgId=" + orgId, function (data) {
            $.each(data, function (index, item) {
                var obj = {};
                obj.text = item.deptName;
                obj.id = item.id;
                obj.deptCode = item.deptCode;
                obj.deptPropertity = item.deptPropertity;
                obj.parentId = item.parentId;
                obj.children = [];
                depts.push(obj);
            });
        });

        loadPromise.done(function () {
            for (var i = 0; i < depts.length; i++) {
                for (var j = 0; j < depts.length; j++) {
                    if (depts[i].id == depts[j].parentId) {
                        depts[i].children.push(depts[j]);
                    }
                }
                if (depts[i].children.length > 0 && !depts[i].parentId) {
                    treeDepts.push(depts[i]);
                }
                if (!depts[i].parentId && depts[i].children <= 0) {
                    treeDepts.push(depts[i])
                }
            }
            $("#EMPLOY_DEPT_ID").combotree('loadData', treeDepts);
        })
    };
    var loadDept1 = function () {
        var depts = [];
        var treeDepts = [];
        var loadPromise = $.get("/service/dept-dict/list?orgId=" + orgId, function (data) {
            $.each(data, function (index, item) {
                var obj = {};
                obj.text = item.deptName;
                obj.id = item.id;
                obj.deptCode = item.deptCode;
                obj.deptPropertity = item.deptPropertity;
                obj.parentId = item.parentId;
                obj.children = [];
                depts.push(obj);
            });
        });

        loadPromise.done(function () {
            for (var i = 0; i < depts.length; i++) {
                for (var j = 0; j < depts.length; j++) {
                    if (depts[i].id == depts[j].parentId) {
                        depts[i].children.push(depts[j]);
                    }
                }
                if (depts[i].children.length > 0 && !depts[i].parentId) {
                    treeDepts.push(depts[i]);
                }
                if (!depts[i].parentId && depts[i].children <= 0) {
                    treeDepts.push(depts[i])
                }
            }
            $("#EMPLOY_DEPT_ID1").combotree('loadData', treeDepts);
        })
    };
    loadDept();
    loadDept1();
    /**
     * 查询条件搜索
     */
    $("#searchBtn").on("click", function () {
        search=true;
        searchData(page,rows);
    });

    var searchData= function (page,rows){
        //获取数据
         name = $("#NAME1").textbox('getValue');
         deptId = $("#EMPLOY_DEPT_ID1").combotree('getValue');
         post = $("#EMPLOY_POST1").combobox('getText');
        if(post=='请选择'){
            post='';
        }
         state = $("#STATE").combobox('getValue');
        if(state=='请选择'){
            state='';
        }
            /*$.get(basePath + '/employ/employ-list?orgId='+orgId+'&name='+name+'&deptId='+deptId+'&post='+post+'&state='+state+'&page='+page+'&rows='+rows, function (data) {
                $("#dataGrid").datagrid('loadData', data);*/
                $("#dataGrid").datagrid('reload', basePath + '/employ/employ-list?orgId='+orgId+'&name='+name+'&deptId='+deptId+'&post='+post+'&state='+state+'&page='+page+'&rows='+rows);
                if(search){
                    search=false;
                    if(page!='1') {
                        $("#dataGrid").datagrid('getPager').pagination('select', 1);
                    }
                }
                $("#dataGrid").datagrid('clearSelections');
    };
    /**
     * 清空查询条件
     */
    $("#clearBtn").on("click", function () {
        clearKey();
        page='1';
    });


    /**
     * 清空方法
     */
    var clearKey = function () {
        $("#NAME1").textbox('clear');
        $("#NAME1").textbox("setValue","");
        $("#EMPLOY_DEPT_ID1").combobox('clear');
        $("#EMPLOY_DEPT_ID1").combobox("setValue","");
        $("#EMPLOY_POST1").combobox('clear');
        $("#EMPLOY_POST1").combobox("setValue","请选择");
        $("#STATE").combobox('clear');
        $("#STATE").combobox("setValue","请选择");
    };

    /**
     * 新增弹出框
     */
    $("#newDialog").dialog({
        title: '新增招聘',
        modal: true,
        closed:true,
        collapsible: true,
        minimizable: false,
        maximizable: true,
        resizable: true
    });
    /**
     * 新增弹出框
     */
    $("#newDialog2").dialog({
        title: '招聘详情',
        modal: true,
        closed:true,
        collapsible: true,
        minimizable: false,
        maximizable: true,
        resizable: true
    });
    /**
     * 重新发布弹出框
     */
    $("#newDialog1").dialog({
        title: '重新发布',
        modal: true,
        closed:true,
        collapsible: true,
        minimizable: false,
        maximizable: true,
        resizable: true
    });
    /**
     * 新增
     */
    $("#addBtn").on('click', function () {
        $("#newDialog").dialog("open");
        $("#submitBtn").show();
        $("#EMPLOY_ID").val('');
        $("#province").val('');
        $("#province").find("option:selected").text('');
        $("#citys").val('');
        $("#citys").find("option:selected").text('');
        $("#county").val('');
        $("#county").find("option:selected").text('');
        $("#NAME").textbox("setValue", "");
        $("#EMPLOY_DEPT_ID").combobox("setValue", "");
        $("#EMPLOY_POST").combobox("setValue", "");
        $("#EMPLOY_PROPERTY").combobox("setValue", "");
        $("#EDUCATION_REQUIRE").combobox("setValue", "");
        $("#WORK_EXPERIENCE").combobox("setValue", "");
        $("#SALARY").combobox("setValue", "");
        $("#WORK_PLACE").textbox("setValue", "");
        $("#TEL").textbox("setValue", "");
        $("#EMAIL").textbox("setValue", "");
        $("#WORK_REQUIRE").textbox("setValue", "");
        $("#TIME_UNTIL").datebox("setValue", "");
        $("#newForm").form('reset');
        //取消元素只读属性
        $("#EMPLOY_ID").removeAttr("readonly", true);
        $("#province").removeAttr("disabled", "disabled");
        $("#citys").removeAttr("disabled", "disabled");
        $("#county").removeAttr("disabled", "disabled");
        $("#NAME").textbox('textbox').removeAttr("readonly", true);
        $("#EMPLOY_DEPT_ID").combobox('enable');
        $("#EMPLOY_POST").combobox('enable');
        $("#EMPLOY_PROPERTY").combobox('enable');
        $("#EDUCATION_REQUIRE").combobox('enable');
        $("#WORK_EXPERIENCE").combobox('enable');
        $("#SALARY").combobox('enable');
        $("#WORK_PLACE").textbox('textbox').removeAttr("readonly", true);
        $("#TEL").textbox('textbox').removeAttr("readonly", true);
        $("#EMAIL").textbox('textbox').removeAttr("readonly", true);
        $("#WORK_REQUIRE").textbox('textbox').removeAttr("readonly", true);
        $("#TIME" ).css("display", "block");
        //$("#TIME_UNTIL").hide();
    });
    /**
     * 修改
     */
    $("#editBtn").on('click', function () {
        $("#submitBtn").show();
        var row = $("#dataGrid").datagrid("getSelected");
        var row1 = $("#dataGrid").datagrid("getSelections");
        if(!row){
            $.messager.alert("提示","请选择一条数据!",'info');
            return;
        }
        if (row.state == '1') {
            $.messager.alert("提示", "该条招聘信息已经发布，不可修改!","info");
            return;
        }
        if (row1.length != 1) {
            $.messager.alert("提示", "请选择一条数据进行操作!","info");
            return;
        }
        $("#newDialog").dialog("setTitle","招聘信息修改").dialog("open");
        $("#EMPLOY_ID").val(row.employId);
        if(row.province==null||row.province==''){
            $("#province").find("option:selected").text('');
        }
        else{
            $("#province").find("option:selected").text(row.province);
        }
        if(row.city==null||row.city==''){
            $("#citys").find("option:selected").text('');
        }
        else{
            $("#citys").find("option:selected").text(row.city);
        }
        if(row.county==null||row.county==''){
            $("#county").find("option:selected").text('');
        }
        else{
            $("#county").find("option:selected").text(row.county);
        }
        $("#NAME").textbox("setValue",row.name);
        $("#EMPLOY_DEPT_ID").combobox("setValue",row.deptId);
        $("#EMPLOY_DEPT_ID").combobox("setText",row.deptName);
        $("#EMPLOY_POST").combobox("setText",row.post);
        $("#EMPLOY_PROPERTY").combobox("setText",row.property);
        $("#EDUCATION_REQUIRE").combobox("setText",row.education);
        $("#WORK_EXPERIENCE").combobox("setText",row.experience);
        $("#SALARY").combobox("setText",row.salary);
        $("#WORK_PLACE").textbox("setValue",row.address1);
        $("#TEL").textbox("setValue",row.tel);
        $("#EMAIL").textbox("setValue",row.email);
        $("#WORK_REQUIRE").textbox("setValue",row.required);
        $("#TIME_UNTIL").datebox("setValue",row.until);
        //取消元素只读属性
        $("#EMPLOY_ID").removeAttr("readonly", true);
        $("#province").removeAttr("disabled", "disabled");
        $("#citys").removeAttr("disabled", "disabled");
        $("#county").removeAttr("disabled", "disabled");
        $("#NAME").textbox('textbox').removeAttr("readonly", true);
        $("#EMPLOY_DEPT_ID").combobox('enable');
        $("#EMPLOY_POST").combobox('enable');
        $("#EMPLOY_PROPERTY").combobox('enable');
        $("#EDUCATION_REQUIRE").combobox('enable');
        $("#WORK_EXPERIENCE").combobox('enable');
        $("#SALARY").combobox('enable');
        $("#WORK_PLACE").textbox('textbox').removeAttr("readonly", true);
        $("#TEL").textbox('textbox').removeAttr("readonly", true);
        $("#EMAIL").textbox('textbox').removeAttr("readonly", true);
        $("#WORK_REQUIRE").textbox('textbox').removeAttr("readonly", true);
        $("#TIME" ).css("display", "block");
    });
    /**
     * 新增修改保存
     */
    $("#submitBtn").on('click', function () {
        if(!$("#NAME").textbox("getValue")||$("#NAME").textbox("getValue").indexOf(" ") >=0){
            $.messager.alert("提示","请输入有效的招聘主题，不能包含空格！",'info');
            return ;
        }
        if($("#NAME").textbox("getValue").length>30){
            $.messager.alert("提示","招聘主题内容输入过长！",'info');
            return ;
        }
        if(!$("#EMPLOY_DEPT_ID").combobox("getValue")){
            $.messager.alert("提示","请选择招聘科室！",'info');
            return ;
        }
        if(!$("#EMPLOY_POST").combobox("getText")){
            $.messager.alert("提示","请选择招聘岗位！",'info');
            return ;
        }
        if(!$("#EMPLOY_PROPERTY").combobox("getText")){
            $.messager.alert("提示","请选择招聘性质！",'info');
            return ;
        }
        if(!$("#EDUCATION_REQUIRE").combobox("getText")){
            $.messager.alert("提示","请选择学历要求！",'info');
            return ;
        }
        if(!$("#WORK_EXPERIENCE").combobox("getText")){
            $.messager.alert("提示","请选择学工作经验要求！",'info');
            return ;
        }
        if(!$("#SALARY").combobox("getText")){
            $.messager.alert("提示","请选择薪资条件！",'info');
            return ;
        }
        if(!$("#WORK_PLACE").textbox("getValue")||$("#WORK_PLACE").textbox("getValue").indexOf(" ") >=0){
            $.messager.alert("提示","请填写有效的工作详细地址！",'info');
            return ;
        }
        if($("#WORK_PLACE").textbox("getValue").length>80){
            $.messager.alert("提示","工作详细地址内容输入过长！",'info');
            return ;
        }
        if(!$("#TEL").textbox("getValue")||$("#TEL").textbox("getValue").indexOf(" ") >=0){
            $.messager.alert("提示","请填写有效的联系电话！",'info');
            return ;
        }
        if($("#TEL").textbox("getValue").length>20){
            $.messager.alert("提示","联系电话内容输入过长！",'info');
            return ;
        }
        if($("#EMAIL").textbox("getValue").length>25){
            $.messager.alert("提示","联系邮箱内容输入过长！",'info');
            return ;
        }
        if(!$("#WORK_REQUIRE").textbox("getValue")){
            $.messager.alert("提示","请填写任职要求！",'info');
            return ;
        }
        if($("#WORK_REQUIRE").textbox("getValue").length>1000){
            $.messager.alert("提示","任职要求内容输入过长！",'info');
            return ;
        }
        if(!$("#TIME_UNTIL").datebox("getValue")){
            $.messager.alert("提示","请选择有效期！",'info');
            return ;
        }
        var startDate= new Date();
        var endDate=$("#TIME_UNTIL").datebox('getValue');
        //var date1 = startDate.replace(/-/g,"\/");
        var date2 = endDate.replace(/-/g,"\/");
        var start = new Date(startDate);
        var end = new Date(date2);

        if (start > end) {
            $.messager.alert("提示", "不能选择今天之前的日期作为有效期!","info");
            return;
        }
        employ.orgId = parent.config.org_Id;
       // salaryPart.id = $("#ID").val();
        employ.employId = $("#EMPLOY_ID").val();
        employ.name = $("#NAME").textbox('getValue');
        employ.deptId = $("#EMPLOY_DEPT_ID").combobox('getValue');
        employ.post = $("#EMPLOY_POST").combobox('getText');
        employ.property = $("#EMPLOY_PROPERTY").combobox('getText');
        employ.education = $("#EDUCATION_REQUIRE").combobox('getText');
        employ.experience = $("#WORK_EXPERIENCE").combobox('getText');
        employ.salary = $("#SALARY").combobox('getText');
        employ.province = $("#province").find("option:selected").text();
        employ.city = $("#citys").find("option:selected").text();
        employ.county = $("#county").find("option:selected").text();
        employ.address = $("#WORK_PLACE").textbox('getValue');
        employ.tel = $("#TEL").textbox('getValue');
        employ.email = $("#EMAIL").textbox('getValue');
        employ.required = $("#WORK_REQUIRE").textbox('getValue');
        employ.until = $("#TIME_UNTIL").datebox('getValue');
        employ.publishBy = personId;
        employ.createBy = personId;
        employ.updateBy = personId;
            //如果不重复，执行保存
            $.postJSON(basePath + "/employ/merge", JSON.stringify(employ), function (data) {
                if(data.data=="success")
                {
                    // $.messager.alert('系统提示', '保存成功', 'info');
                    $('#newDialog').window('close');
                    $("#dataGrid").datagrid('reload');
                    $("#newForm").form('reset');
                    $("#dataGrid").datagrid('clearSelections');
                }
                else{
                    $.messager.alert('提示', '保存失败', 'info');
                }
            })
    });
    /**
     * 删除
     */
    $("#delBtn").on('click', function () {
        var row = $("#dataGrid").datagrid('getSelections');
        if (row == null||row.length ==0) {
            $.messager.alert("提示", "请选择要删除的招聘信息!","info");
            return;
        }
        if (row.length>0) {
            for (var i = 0; i < row.length; i++) {
                row[i].delFlag = '1';
            }
            $.messager.confirm('提示', '确定要删除所选中的招聘信息么？', function (r) {
                if (r) {
                    $.postJSON(basePath + "/employ/del-employ", JSON.stringify(row), function (data) {
                        /*$.messager.alert('系统提示', '删除成功', 'info');*/
                        $('#dataGrid').datagrid('reload');
                        row.length = 0;
                        $("#dataGrid").datagrid('clearSelections');
                    })
                }
            });
        }

    });
    /**
     * 详情
     */
    $("#infoBtn").on('click', function () {
        var row = $("#dataGrid").datagrid("getSelected");
        var row1 = $("#dataGrid").datagrid("getSelections");
        if (!row) {
            $.messager.alert("提示", "请选择一条数据!", 'info');
            return;
        }
        if (row1.length!=1) {
            $.messager.alert("提示", "请选择一条数据进行操作!", 'info');
            return;
        }
        $("#newDialog2").dialog("setTitle", "招聘信息详情").dialog("open");
        $("#EMPLOY_ID2").val(row.employId);
        $("#province2").textbox("setValue", row.province);
        $("#citys2").textbox("setValue", row.city);
        $("#county2").textbox("setValue", row.county);
        $("#NAME2").textbox("setValue", row.name);
        $("#EMPLOY_DEPT_ID2").textbox("setValue", row.deptName);
        $("#EMPLOY_POST2").textbox("setValue", row.post);
        $("#EMPLOY_PROPERTY2").textbox("setValue", row.property);
        $("#EDUCATION_REQUIRE2").textbox("setValue", row.education);
        $("#WORK_EXPERIENCE2").textbox("setValue", row.experience);
        $("#SALARY2").textbox("setValue", row.salary);
        $("#WORK_PLACE2").textbox("setValue", row.address1);
        $("#TEL2").textbox("setValue", row.tel);
        $("#EMAIL2").textbox("setValue", row.email);
        $("#WORK_REQUIRE2").textbox("setValue", row.required);
        $("#TIME_UNTIL2").textbox("setValue", row.until);
        //元素不可编辑
        $("#EMPLOY_ID2").attr("readonly", true);
        $("#province2").textbox('textbox').attr("readonly", true);
        //$("#province").attr("readonly", "readonly");
        $("#citys2").textbox('textbox').attr("readonly", true);
        //$("#citys").attr("readonly", "readonly");
        $("#county2").textbox('textbox').attr("readonly", true);
        //$("#county").attr("readonly", "readonly");
        $("#NAME2").textbox('textbox').attr("readonly", true);
        $("#EMPLOY_DEPT_ID2").textbox('textbox').attr("readonly", true);
        //$("#EMPLOY_DEPT_ID").attr("readonly", "readonly");
        $("#EMPLOY_POST2").textbox('textbox').attr("readonly", true);
        //$("#EMPLOY_POST").attr("readonly", "readonly");
        $("#EMPLOY_PROPERTY2").textbox('textbox').attr("readonly", true);
        //$("#EMPLOY_PROPERTY").attr("readonly", "readonly");
        $("#WORK_EXPERIENCE2").textbox('textbox').attr("readonly", true);
        //$("#WORK_EXPERIENCE").attr("readonly", "readonly");
        $("#SALARY2").textbox('textbox').attr("readonly", true);
        //$("#SALARY").attr("readonly", "readonly");
        $("#WORK_PLACE2").textbox('textbox').attr("readonly", true);
        $("#TEL2").textbox('textbox').attr("readonly", true);
        $("#EMAIL2").textbox('textbox').attr("readonly", true);
        $("#WORK_REQUIRE2").textbox('textbox').attr("readonly", true);
        $("#TIME2" ).css("display", "none");
    });

    /**
     * 发布
     */
    $("#dealBtn").on('click', function () {
        var row = $("#dataGrid").datagrid('getSelections');
        if (row == null||row.length ==0) {
            $.messager.alert("提示", "请选择要发布的招聘信息!","info");
            return;
        }
        var row1 = $("#dataGrid").datagrid("getSelections");
        if (row1.length != 1) {
            $.messager.alert("提示", "请选择一条数据进行操作!","info");
            return;
        }
        //alert(row[0].state);
        if (row[0].state == '1') {
            $.messager.alert("提示", "该条招聘信息已经发布，不可重复发布!","info");
            return;
        }
        if (row[0].state == '2') {
            $.messager.alert("提示", "该条招聘信息已经结束，如需再次发布请点击重新发布按钮!","info");
            return;
        }
        if (row[0].state == '3') {
            $.messager.alert("提示", "该条招聘信息已经到期，如需再次发布请点击重新发布按钮!","info");
            return;
        }
        /*for (var i = 0; i < row.length; i++) {
                alert(row);
                row[i].state = '1';*/
          $.messager.confirm('提示', '确定要发布所选的数据么？注意:发布后该条招聘将不可修改！', function (r) {
                if (r) {
                    $.postJSON(basePath + "/employ/publish-employ", JSON.stringify(row), function (data) {
                        /*$.messager.alert('系统提示', '删除成功', 'info');*/
                        $('#dataGrid').datagrid('reload');
                        row.length = 0;
                        $("#dataGrid").datagrid('clearSelections');
                    })
                }
            });
        /*}*/

    });
    /**
     * 结束
     */
    $("#endBtn").on('click', function () {
        var row = $("#dataGrid").datagrid('getSelections');
        if (row == null||row.length ==0) {
            $.messager.alert("提示", "请选择要结束的招聘信息!","info");
            return;
        }
        var row1 = $("#dataGrid").datagrid("getSelections");
        if (row1.length != 1) {
            $.messager.alert("提示", "请选择一条数据进行操作!","info");
            return;
        }
        if (row[0].state == '2') {
            $.messager.alert("提示", "该条招聘信息已经结束,不可重复操作!","info");
            return;
        }
        if (row.length>0) {

            $.messager.confirm('提示', '确定要结束所选的招聘信息么？注意:结束后该条招聘将不在招聘查询页面中显示！', function (r) {
                if (r) {
                    for (var i = 0; i < row.length; i++) {
                        row[i].state = '2';
                    }
                    $.postJSON(basePath + "/employ/end-employ", JSON.stringify(row), function (data) {
                        /*$.messager.alert('系统提示', '删除成功', 'info');*/
                        $('#dataGrid').datagrid('reload');
                        row.length = 0;
                        $("#dataGrid").datagrid('clearSelections');
                    })
                }
            });
        }

    });

    /**
     * 重新发布
     */
    $("#redealBtn").on('click', function () {

        var row = $("#dataGrid").datagrid('getSelections');
        if (row == null||row.length ==0) {
            $.messager.alert("提示", "请选择要重新发布的招聘信息!","info");
            return;
        }
        //var row1 = $("#dataGrid").datagrid("getSelections");
        if (row.length != 1) {
            $.messager.alert("提示", "请选择一条数据进行操作!","info");
            return;
        }
        if (row[0].state == '0'||row[0].state == '1') {
            $.messager.alert("提示", "只有结束和已到期的招聘信息可以重新发布！","info");
            return;
        }
                $("#newDialog1").dialog("open");
                $("#TIME_UNTIL1").datebox("setValue", "");
                $("#newForm1").form('reset');
    });
    /**
     * 重新发布保存
     */
    $("#submitBtn1").on('click', function () {
        var val1 = $("#TIME_UNTIL1").datebox("getValue");
        if (val1 == null||val1=='') {
            $.messager.alert("提示", "请选择有效期！",'info');
            return;
        }
        var startDate= new Date();
        var endDate=$("#TIME_UNTIL1").datebox('getValue');
        //var date1 = startDate.replace(/-/g,"\/");
        var date2 = endDate.replace(/-/g,"\/");
        var start = new Date(startDate);
        var end = new Date(date2);

        if (start > end) {
            $.messager.alert("提示", "不能选择今天之前的日期作为有效期!","info");
            return;
        }
        var row = $("#dataGrid").datagrid('getSelections');
        if (row.length>0) {
            for (var i = 0; i < row.length; i++) {
                row[i].until = val1;
            }
            $.messager.confirm('提示', '确定要重新发布吗？', function (r) {
                if (r) {
                    $.postJSON(basePath + "/employ/redeal", JSON.stringify(row), function (data) {
                        if (data.data == "success") {
                            //alert(data);
                            // $.messager.alert('系统提示', '保存成功', 'info');
                            $('#newDialog1').window('close');
                            $("#dataGrid").datagrid('reload');
                            $("#newForm1").form('reset');
                            $("#dataGrid").datagrid('clearSelections');
                        }
                        else {
                            $.messager.alert('提示', '保存失败!', 'info');
                        }
                    })
                }
            });
        }

    });





});


//省市县三级联动
var cityJson = [
    {"item_code":"110000","item_name":"北京市"},
    {"item_code":"120000","item_name":"天津市"},
    {"item_code":"130000","item_name":"河北省"},
    {"item_code":"140000","item_name":"山西省"},
    {"item_code":"150000","item_name":"内蒙古自治区"},
    {"item_code":"210000","item_name":"辽宁省"},
    {"item_code":"220000","item_name":"吉林省"},
    {"item_code":"230000","item_name":"黑龙江省"},
    {"item_code":"310000","item_name":"上海市"},
    {"item_code":"320000","item_name":"江苏省"},
    {"item_code":"330000","item_name":"浙江省"},
    {"item_code":"340000","item_name":"安徽省"},
    {"item_code":"350000","item_name":"福建省"},
    {"item_code":"360000","item_name":"江西省"},
    {"item_code":"370000","item_name":"山东省"},
    {"item_code":"410000","item_name":"河南省"},
    {"item_code":"420000","item_name":"湖北省"},
    {"item_code":"430000","item_name":"湖南省"},
    {"item_code":"440000","item_name":"广东省"},
    {"item_code":"450000","item_name":"广西壮族自治区"},
    {"item_code":"460000","item_name":"海南省"},
    {"item_code":"500000","item_name":"重庆市"},
    {"item_code":"510000","item_name":"四川省"},
    {"item_code":"520000","item_name":"贵州省"},
    {"item_code":"530000","item_name":"云南省"},
    {"item_code":"540000","item_name":"西藏自治区"},
    {"item_code":"610000","item_name":"陕西省"},
    {"item_code":"620000","item_name":"甘肃省"},
    {"item_code":"630000","item_name":"青海省"},
    {"item_code":"640000","item_name":"宁夏回族自治区"},
    {"item_code":"650000","item_name":"新疆维吾尔自治区"},


    {"item_code":"110100","item_name":"北京市"},
    {"item_code":"120100","item_name":"天津市"},
    {"item_code":"130100","item_name":"石家庄市"},
    {"item_code":"130200","item_name":"唐山市"},
    {"item_code":"130300","item_name":"秦皇岛市"},
    {"item_code":"130400","item_name":"邯郸市"},
    {"item_code":"130500","item_name":"邢台市"},
    {"item_code":"130600","item_name":"保定市"},
    {"item_code":"130700","item_name":"张家口市"},
    {"item_code":"130800","item_name":"承德市"},
    {"item_code":"130900","item_name":"沧州市"},
    {"item_code":"131000","item_name":"廊坊市"},
    {"item_code":"131100","item_name":"衡水市"},
    {"item_code":"140100","item_name":"太原市"},
    {"item_code":"140200","item_name":"大同市"},
    {"item_code":"140300","item_name":"阳泉市"},
    {"item_code":"140400","item_name":"长治市"},
    {"item_code":"140500","item_name":"晋城市"},
    {"item_code":"140600","item_name":"朔州市"},
    {"item_code":"140700","item_name":"晋中市"},
    {"item_code":"140800","item_name":"运城市"},
    {"item_code":"140900","item_name":"忻州市"},
    {"item_code":"141000","item_name":"临汾市"},
    {"item_code":"141100","item_name":"吕梁市"},
    {"item_code":"150100","item_name":"呼和浩特市"},
    {"item_code":"150200","item_name":"包头市"},
    {"item_code":"150300","item_name":"乌海市"},
    {"item_code":"150400","item_name":"赤峰市"},
    {"item_code":"150500","item_name":"通辽市"},
    {"item_code":"150600","item_name":"鄂尔多斯市"},
    {"item_code":"150700","item_name":"呼伦贝尔市"},
    {"item_code":"150800","item_name":"巴彦淖尔市"},
    {"item_code":"150900","item_name":"乌兰察布市"},
    {"item_code":"152200","item_name":"兴安盟"},
    {"item_code":"152500","item_name":"锡林郭勒盟"},
    {"item_code":"152900","item_name":"阿拉善盟"},
    {"item_code":"210100","item_name":"沈阳市"},
    {"item_code":"210200","item_name":"大连市"},
    {"item_code":"210300","item_name":"鞍山市"},
    {"item_code":"210400","item_name":"抚顺市"},
    {"item_code":"210500","item_name":"本溪市"},
    {"item_code":"210600","item_name":"丹东市"},
    {"item_code":"210700","item_name":"锦州市"},
    {"item_code":"210800","item_name":"营口市"},
    {"item_code":"210900","item_name":"阜新市"},
    {"item_code":"211000","item_name":"辽阳市"},
    {"item_code":"211100","item_name":"盘锦市"},
    {"item_code":"211200","item_name":"铁岭市"},
    {"item_code":"211300","item_name":"朝阳市"},
    {"item_code":"211400","item_name":"葫芦岛市"},
    {"item_code":"220100","item_name":"长春市"},
    {"item_code":"220200","item_name":"吉林市"},
    {"item_code":"220300","item_name":"四平市"},
    {"item_code":"220400","item_name":"辽源市"},
    {"item_code":"220500","item_name":"通化市"},
    {"item_code":"220600","item_name":"白山市"},
    {"item_code":"220700","item_name":"松原市"},
    {"item_code":"220800","item_name":"白城市"},
    {"item_code":"222400","item_name":"延边朝鲜族自治州"},
    {"item_code":"230100","item_name":"哈尔滨市"},
    {"item_code":"230200","item_name":"齐齐哈尔市"},
    {"item_code":"230300","item_name":"鸡西市"},
    {"item_code":"230400","item_name":"鹤岗市"},
    {"item_code":"230500","item_name":"双鸭山市"},
    {"item_code":"230600","item_name":"大庆市"},
    {"item_code":"230700","item_name":"伊春市"},
    {"item_code":"230800","item_name":"佳木斯市"},
    {"item_code":"230900","item_name":"七台河市"},
    {"item_code":"231000","item_name":"牡丹江市"},
    {"item_code":"231100","item_name":"黑河市"},
    {"item_code":"231200","item_name":"绥化市"},
    {"item_code":"232700","item_name":"大兴安岭地区"},
    {"item_code":"310100","item_name":"上海市"},
    {"item_code":"320100","item_name":"南京市"},
    {"item_code":"320200","item_name":"无锡市"},
    {"item_code":"320300","item_name":"徐州市"},
    {"item_code":"320400","item_name":"常州市"},
    {"item_code":"320500","item_name":"苏州市"},
    {"item_code":"320600","item_name":"南通市"},
    {"item_code":"320700","item_name":"连云港市"},
    {"item_code":"320800","item_name":"淮安市"},
    {"item_code":"320900","item_name":"盐城市"},
    {"item_code":"321000","item_name":"扬州市"},
    {"item_code":"321100","item_name":"镇江市"},
    {"item_code":"321200","item_name":"泰州市"},
    {"item_code":"321300","item_name":"宿迁市"},
    {"item_code":"330100","item_name":"杭州市"},
    {"item_code":"330200","item_name":"宁波市"},
    {"item_code":"330300","item_name":"温州市"},
    {"item_code":"330400","item_name":"嘉兴市"},
    {"item_code":"330500","item_name":"湖州市"},
    {"item_code":"330600","item_name":"绍兴市"},
    {"item_code":"330700","item_name":"金华市"},
    {"item_code":"330800","item_name":"衢州市"},
    {"item_code":"330900","item_name":"舟山市"},
    {"item_code":"331000","item_name":"台州市"},
    {"item_code":"331100","item_name":"丽水市"},
    {"item_code":"340100","item_name":"合肥市"},
    {"item_code":"340200","item_name":"芜湖市"},
    {"item_code":"340300","item_name":"蚌埠市"},
    {"item_code":"340400","item_name":"淮南市"},
    {"item_code":"340500","item_name":"马鞍山市"},
    {"item_code":"340600","item_name":"淮北市"},
    {"item_code":"340700","item_name":"铜陵市"},
    {"item_code":"340800","item_name":"安庆市"},
    {"item_code":"341000","item_name":"黄山市"},
    {"item_code":"341100","item_name":"滁州市"},
    {"item_code":"341200","item_name":"阜阳市"},
    {"item_code":"341300","item_name":"宿州市"},
    {"item_code":"341500","item_name":"六安市"},
    {"item_code":"341600","item_name":"亳州市"},
    {"item_code":"341700","item_name":"池州市"},
    {"item_code":"341800","item_name":"宣城市"},
    {"item_code":"350100","item_name":"福州市"},
    {"item_code":"350200","item_name":"厦门市"},
    {"item_code":"350300","item_name":"莆田市"},
    {"item_code":"350400","item_name":"三明市"},
    {"item_code":"350500","item_name":"泉州市"},
    {"item_code":"350600","item_name":"漳州市"},
    {"item_code":"350700","item_name":"南平市"},
    {"item_code":"350800","item_name":"龙岩市"},
    {"item_code":"350900","item_name":"宁德市"},
    {"item_code":"360100","item_name":"南昌市"},
    {"item_code":"360200","item_name":"景德镇市"},
    {"item_code":"360300","item_name":"萍乡市"},
    {"item_code":"360400","item_name":"九江市"},
    {"item_code":"360500","item_name":"新余市"},
    {"item_code":"360600","item_name":"鹰潭市"},
    {"item_code":"360700","item_name":"赣州市"},
    {"item_code":"360800","item_name":"吉安市"},
    {"item_code":"360900","item_name":"宜春市"},
    {"item_code":"361000","item_name":"抚州市"},
    {"item_code":"361100","item_name":"上饶市"},
    {"item_code":"370100","item_name":"济南市"},
    {"item_code":"370200","item_name":"青岛市"},
    {"item_code":"370300","item_name":"淄博市"},
    {"item_code":"370400","item_name":"枣庄市"},
    {"item_code":"370500","item_name":"东营市"},
    {"item_code":"370600","item_name":"烟台市"},
    {"item_code":"370700","item_name":"潍坊市"},
    {"item_code":"370800","item_name":"济宁市"},
    {"item_code":"370900","item_name":"泰安市"},
    {"item_code":"371000","item_name":"威海市"},
    {"item_code":"371100","item_name":"日照市"},
    {"item_code":"371200","item_name":"莱芜市"},
    {"item_code":"371300","item_name":"临沂市"},
    {"item_code":"371400","item_name":"德州市"},
    {"item_code":"371500","item_name":"聊城市"},
    {"item_code":"371600","item_name":"滨州市"},
    {"item_code":"371700","item_name":"菏泽市"},
    {"item_code":"410100","item_name":"郑州市"},
    {"item_code":"410200","item_name":"开封市"},
    {"item_code":"410300","item_name":"洛阳市"},
    {"item_code":"410400","item_name":"平顶山市"},
    {"item_code":"410500","item_name":"安阳市"},
    {"item_code":"410600","item_name":"鹤壁市"},
    {"item_code":"410700","item_name":"新乡市"},
    {"item_code":"410800","item_name":"焦作市"},
    {"item_code":"410900","item_name":"濮阳市"},
    {"item_code":"411000","item_name":"许昌市"},
    {"item_code":"411100","item_name":"漯河市"},
    {"item_code":"411200","item_name":"三门峡市"},
    {"item_code":"411300","item_name":"南阳市"},
    {"item_code":"411400","item_name":"商丘市"},
    {"item_code":"411500","item_name":"信阳市"},
    {"item_code":"411600","item_name":"周口市"},
    {"item_code":"411700","item_name":"驻马店市"},
    {"item_code":"420100","item_name":"武汉市"},
    {"item_code":"420200","item_name":"黄石市"},
    {"item_code":"420300","item_name":"十堰市"},
    {"item_code":"420500","item_name":"宜昌市"},
    {"item_code":"420600","item_name":"襄樊市"},
    {"item_code":"420700","item_name":"鄂州市"},
    {"item_code":"420800","item_name":"荆门市"},
    {"item_code":"420900","item_name":"孝感市"},
    {"item_code":"421000","item_name":"荆州市"},
    {"item_code":"421100","item_name":"黄冈市"},
    {"item_code":"421200","item_name":"咸宁市"},
    {"item_code":"421300","item_name":"随州市"},
    {"item_code":"422800","item_name":"恩施土家族苗族自治州"},
    {"item_code":"430100","item_name":"长沙市"},
    {"item_code":"430200","item_name":"株洲市"},
    {"item_code":"430300","item_name":"湘潭市"},
    {"item_code":"430400","item_name":"衡阳市"},
    {"item_code":"430500","item_name":"邵阳市"},
    {"item_code":"430600","item_name":"岳阳市"},
    {"item_code":"430700","item_name":"常德市"},
    {"item_code":"430800","item_name":"张家界市"},
    {"item_code":"430900","item_name":"益阳市"},
    {"item_code":"431000","item_name":"郴州市"},
    {"item_code":"431100","item_name":"永州市"},
    {"item_code":"431200","item_name":"怀化市"},
    {"item_code":"431300","item_name":"娄底市"},
    {"item_code":"433100","item_name":"湘西土家族苗族自治州"},
    {"item_code":"440100","item_name":"广州市"},
    {"item_code":"440200","item_name":"韶关市"},
    {"item_code":"440300","item_name":"深圳市"},
    {"item_code":"440400","item_name":"珠海市"},
    {"item_code":"440500","item_name":"汕头市"},
    {"item_code":"440600","item_name":"佛山市"},
    {"item_code":"440700","item_name":"江门市"},
    {"item_code":"440800","item_name":"湛江市"},
    {"item_code":"440900","item_name":"茂名市"},
    {"item_code":"441200","item_name":"肇庆市"},
    {"item_code":"441300","item_name":"惠州市"},
    {"item_code":"441400","item_name":"梅州市"},
    {"item_code":"441500","item_name":"汕尾市"},
    {"item_code":"441600","item_name":"河源市"},
    {"item_code":"441700","item_name":"阳江市"},
    {"item_code":"441800","item_name":"清远市"},
    {"item_code":"441900","item_name":"东莞市"},
    {"item_code":"442000","item_name":"中山市"},
    {"item_code":"445100","item_name":"潮州市"},
    {"item_code":"445200","item_name":"揭阳市"},
    {"item_code":"445300","item_name":"云浮市"},
    {"item_code":"450100","item_name":"南宁市"},
    {"item_code":"450200","item_name":"柳州市"},
    {"item_code":"450300","item_name":"桂林市"},
    {"item_code":"450400","item_name":"梧州市"},
    {"item_code":"450500","item_name":"北海市"},
    {"item_code":"450600","item_name":"防城港市"},
    {"item_code":"450700","item_name":"钦州市"},
    {"item_code":"450800","item_name":"贵港市"},
    {"item_code":"450900","item_name":"玉林市"},
    {"item_code":"451000","item_name":"百色市"},
    {"item_code":"451100","item_name":"贺州市"},
    {"item_code":"451200","item_name":"河池市"},
    {"item_code":"451300","item_name":"来宾市"},
    {"item_code":"451400","item_name":"崇左市"},
    {"item_code":"460100","item_name":"海口市"},
    {"item_code":"460200","item_name":"三亚市"},
    {"item_code":"500100","item_name":"重庆市"},
    {"item_code":"510100","item_name":"成都市"},
    {"item_code":"510300","item_name":"自贡市"},
    {"item_code":"510400","item_name":"攀枝花市"},
    {"item_code":"510500","item_name":"泸州市"},
    {"item_code":"510600","item_name":"德阳市"},
    {"item_code":"510700","item_name":"绵阳市"},
    {"item_code":"510800","item_name":"广元市"},
    {"item_code":"510900","item_name":"遂宁市"},
    {"item_code":"511000","item_name":"内江市"},
    {"item_code":"511100","item_name":"乐山市"},
    {"item_code":"511300","item_name":"南充市"},
    {"item_code":"511400","item_name":"眉山市"},
    {"item_code":"511500","item_name":"宜宾市"},
    {"item_code":"511600","item_name":"广安市"},
    {"item_code":"511700","item_name":"达州市"},
    {"item_code":"511800","item_name":"雅安市"},
    {"item_code":"511900","item_name":"巴中市"},
    {"item_code":"512000","item_name":"资阳市"},
    {"item_code":"513200","item_name":"阿坝藏族羌族自治州"},
    {"item_code":"513300","item_name":"甘孜藏族自治州"},
    {"item_code":"513400","item_name":"凉山彝族自治州"},
    {"item_code":"520100","item_name":"贵阳市"},
    {"item_code":"520200","item_name":"六盘水市"},
    {"item_code":"520300","item_name":"遵义市"},
    {"item_code":"520400","item_name":"安顺市"},
    {"item_code":"520500","item_name":"毕节市"},
    {"item_code":"520601","item_name":"铜仁市"},
    {"item_code":"522300","item_name":"黔西南布依族苗族自治州"},
    {"item_code":"522600","item_name":"黔东南苗族侗族自治州"},
    {"item_code":"522700","item_name":"黔南布依族苗族自治州"},
    {"item_code":"530100","item_name":"昆明市"},
    {"item_code":"530300","item_name":"曲靖市"},
    {"item_code":"530400","item_name":"玉溪市"},
    {"item_code":"530500","item_name":"保山市"},
    {"item_code":"530600","item_name":"昭通市"},
    {"item_code":"530700","item_name":"丽江市"},
    {"item_code":"530800","item_name":"普洱市"},
    {"item_code":"530900","item_name":"临沧市"},
    {"item_code":"532300","item_name":"楚雄彝族自治州"},
    {"item_code":"532500","item_name":"红河哈尼族彝族自治州"},
    {"item_code":"532600","item_name":"文山壮族苗族自治州"},
    {"item_code":"532800","item_name":"西双版纳傣族自治州"},
    {"item_code":"532900","item_name":"大理白族自治州"},
    {"item_code":"533100","item_name":"德宏傣族景颇族自治州"},
    {"item_code":"533300","item_name":"怒江傈僳族自治州"},
    {"item_code":"533400","item_name":"迪庆藏族自治州"},
    {"item_code":"540100","item_name":"拉萨市"},
    {"item_code":"542100","item_name":"昌都地区"},
    {"item_code":"542200","item_name":"山南地区"},
    {"item_code":"542300","item_name":"日喀则地区"},
    {"item_code":"542400","item_name":"那曲地区"},
    {"item_code":"542500","item_name":"阿里地区"},
    {"item_code":"542600","item_name":"林芝地区"},
    {"item_code":"610100","item_name":"西安市"},
    {"item_code":"610200","item_name":"铜川市"},
    {"item_code":"610300","item_name":"宝鸡市"},
    {"item_code":"610400","item_name":"咸阳市"},
    {"item_code":"610500","item_name":"渭南市"},
    {"item_code":"610600","item_name":"延安市"},
    {"item_code":"610700","item_name":"汉中市"},
    {"item_code":"610800","item_name":"榆林市"},
    {"item_code":"610900","item_name":"安康市"},
    {"item_code":"611000","item_name":"商洛市"},
    {"item_code":"620100","item_name":"兰州市"},
    {"item_code":"620200","item_name":"嘉峪关市"},
    {"item_code":"620300","item_name":"金昌市"},
    {"item_code":"620400","item_name":"白银市"},
    {"item_code":"620500","item_name":"天水市"},
    {"item_code":"620600","item_name":"武威市"},
    {"item_code":"620700","item_name":"张掖市"},
    {"item_code":"620800","item_name":"平凉市"},
    {"item_code":"620900","item_name":"酒泉市"},
    {"item_code":"621000","item_name":"庆阳市"},
    {"item_code":"621100","item_name":"定西市"},
    {"item_code":"621200","item_name":"陇南市"},
    {"item_code":"622900","item_name":"临夏回族自治州"},
    {"item_code":"623000","item_name":"甘南藏族自治州"},
    {"item_code":"630100","item_name":"西宁市"},
    {"item_code":"632100","item_name":"海东地区"},
    {"item_code":"632200","item_name":"海北藏族自治州"},
    {"item_code":"632300","item_name":"黄南藏族自治州"},
    {"item_code":"632500","item_name":"海南藏族自治州"},
    {"item_code":"632600","item_name":"果洛藏族自治州"},
    {"item_code":"632700","item_name":"玉树藏族自治州"},
    {"item_code":"632800","item_name":"海西蒙古族藏族自治州"},
    {"item_code":"640100","item_name":"银川市"},
    {"item_code":"640200","item_name":"石嘴山市"},
    {"item_code":"640300","item_name":"吴忠市"},
    {"item_code":"640400","item_name":"固原市"},
    {"item_code":"640500","item_name":"中卫市"},
    {"item_code":"650100","item_name":"乌鲁木齐市"},
    {"item_code":"650200","item_name":"克拉玛依市"},
    {"item_code":"652100","item_name":"吐鲁番地区"},
    {"item_code":"652200","item_name":"哈密地区"},
    {"item_code":"652300","item_name":"昌吉回族自治州"},
    {"item_code":"652700","item_name":"博尔塔拉蒙古自治州"},
    {"item_code":"652800","item_name":"巴音郭楞蒙古自治州"},
    {"item_code":"652900","item_name":"阿克苏地区"},
    {"item_code":"653000","item_name":"克孜勒苏柯尔克孜自治州"},
    {"item_code":"653100","item_name":"喀什地区"},
    {"item_code":"653200","item_name":"和田地区"},
    {"item_code":"654000","item_name":"伊犁哈萨克自治州"},
    {"item_code":"654200","item_name":"塔城地区"},
    {"item_code":"654300","item_name":"阿勒泰地区"},


    {"item_code":"110101","item_name":"东城区"},
    {"item_code":"110102","item_name":"西城区"},
    {"item_code":"110105","item_name":"朝阳区"},
    {"item_code":"110106","item_name":"丰台区"},
    {"item_code":"110107","item_name":"石景山区"},
    {"item_code":"110108","item_name":"海淀区"},
    {"item_code":"110109","item_name":"门头沟区"},
    {"item_code":"110111","item_name":"房山区"},
    {"item_code":"110112","item_name":"通州区"},
    {"item_code":"110113","item_name":"顺义区"},
    {"item_code":"110114","item_name":"昌平区"},
    {"item_code":"110115","item_name":"大兴区"},
    {"item_code":"110116","item_name":"怀柔区"},
    {"item_code":"110117","item_name":"平谷区"},
    {"item_code":"110228","item_name":"密云县"},
    {"item_code":"110229","item_name":"延庆县"},
    {"item_code":"120101","item_name":"和平区"},
    {"item_code":"120102","item_name":"河东区"},
    {"item_code":"120103","item_name":"河西区"},
    {"item_code":"120104","item_name":"南开区"},
    {"item_code":"120105","item_name":"河北区"},
    {"item_code":"120106","item_name":"红桥区"},
    {"item_code":"120110","item_name":"东丽区"},
    {"item_code":"120111","item_name":"西青区"},
    {"item_code":"120112","item_name":"津南区"},
    {"item_code":"120113","item_name":"北辰区"},
    {"item_code":"120114","item_name":"武清区"},
    {"item_code":"120115","item_name":"宝坻区"},
    {"item_code":"120116","item_name":"滨海新区"},
    {"item_code":"120221","item_name":"宁河县"},
    {"item_code":"120223","item_name":"静海县"},
    {"item_code":"120225","item_name":"蓟县"},
    {"item_code":"130102","item_name":"长安区"},
    {"item_code":"130103","item_name":"桥东区"},
    {"item_code":"130104","item_name":"桥西区"},
    {"item_code":"130105","item_name":"新华区"},
    {"item_code":"130107","item_name":"井陉矿区"},
    {"item_code":"130108","item_name":"裕华区"},
    {"item_code":"130121","item_name":"井陉县"},
    {"item_code":"130123","item_name":"正定县"},
    {"item_code":"130124","item_name":"栾城县"},
    {"item_code":"130125","item_name":"行唐县"},
    {"item_code":"130126","item_name":"灵寿县"},
    {"item_code":"130127","item_name":"高邑县"},
    {"item_code":"130128","item_name":"深泽县"},
    {"item_code":"130129","item_name":"赞皇县"},
    {"item_code":"130130","item_name":"无极县"},
    {"item_code":"130131","item_name":"平山县"},
    {"item_code":"130132","item_name":"元氏县"},
    {"item_code":"130133","item_name":"赵县"},
    {"item_code":"130181","item_name":"辛集市"},
    {"item_code":"130182","item_name":"藁城市"},
    {"item_code":"130183","item_name":"晋州市"},
    {"item_code":"130184","item_name":"新乐市"},
    {"item_code":"130185","item_name":"鹿泉市"},
    {"item_code":"130202","item_name":"路南区"},
    {"item_code":"130203","item_name":"路北区"},
    {"item_code":"130204","item_name":"古冶区"},
    {"item_code":"130205","item_name":"开平区"},
    {"item_code":"130207","item_name":"丰南区"},
    {"item_code":"130208","item_name":"丰润区"},
    {"item_code":"130223","item_name":"滦县"},
    {"item_code":"130224","item_name":"滦南县"},
    {"item_code":"130225","item_name":"乐亭县"},
    {"item_code":"130227","item_name":"迁西县"},
    {"item_code":"130229","item_name":"玉田县"},
    {"item_code":"130230","item_name":"唐海县"},
    {"item_code":"130281","item_name":"遵化市"},
    {"item_code":"130283","item_name":"迁安市"},
    {"item_code":"130302","item_name":"海港区"},
    {"item_code":"130303","item_name":"山海关区"},
    {"item_code":"130304","item_name":"北戴河区"},
    {"item_code":"130321","item_name":"青龙满族自治县"},
    {"item_code":"130322","item_name":"昌黎县"},
    {"item_code":"130323","item_name":"抚宁县"},
    {"item_code":"130324","item_name":"卢龙县"},
    {"item_code":"130402","item_name":"邯山区"},
    {"item_code":"130403","item_name":"丛台区"},
    {"item_code":"130404","item_name":"复兴区"},
    {"item_code":"130406","item_name":"峰峰矿区"},
    {"item_code":"130421","item_name":"邯郸县"},
    {"item_code":"130423","item_name":"临漳县"},
    {"item_code":"130424","item_name":"成安县"},
    {"item_code":"130425","item_name":"大名县"},
    {"item_code":"130426","item_name":"涉县"},
    {"item_code":"130427","item_name":"磁县"},
    {"item_code":"130428","item_name":"肥乡县"},
    {"item_code":"130429","item_name":"永年县"},
    {"item_code":"130430","item_name":"邱县"},
    {"item_code":"130431","item_name":"鸡泽县"},
    {"item_code":"130432","item_name":"广平县"},
    {"item_code":"130433","item_name":"馆陶县"},
    {"item_code":"130434","item_name":"魏县"},
    {"item_code":"130435","item_name":"曲周县"},
    {"item_code":"130481","item_name":"武安市"},
    {"item_code":"130502","item_name":"桥东区"},
    {"item_code":"130503","item_name":"桥西区"},
    {"item_code":"130521","item_name":"邢台县"},
    {"item_code":"130522","item_name":"临城县"},
    {"item_code":"130523","item_name":"内丘县"},
    {"item_code":"130524","item_name":"柏乡县"},
    {"item_code":"130525","item_name":"隆尧县"},
    {"item_code":"130526","item_name":"任县"},
    {"item_code":"130527","item_name":"南和县"},
    {"item_code":"130528","item_name":"宁晋县"},
    {"item_code":"130529","item_name":"巨鹿县"},
    {"item_code":"130530","item_name":"新河县"},
    {"item_code":"130531","item_name":"广宗县"},
    {"item_code":"130532","item_name":"平乡县"},
    {"item_code":"130533","item_name":"威县"},
    {"item_code":"130534","item_name":"清河县"},
    {"item_code":"130535","item_name":"临西县"},
    {"item_code":"130581","item_name":"南宫市"},
    {"item_code":"130582","item_name":"沙河市"},
    {"item_code":"130502","item_name":"桥东区"},
    {"item_code":"130503","item_name":"桥西区"},
    {"item_code":"130521","item_name":"邢台县"},
    {"item_code":"130522","item_name":"临城县"},
    {"item_code":"130523","item_name":"内丘县"},
    {"item_code":"130524","item_name":"柏乡县"},
    {"item_code":"130525","item_name":"隆尧县"},
    {"item_code":"130526","item_name":"任县"},
    {"item_code":"130527","item_name":"南和县"},
    {"item_code":"130528","item_name":"宁晋县"},
    {"item_code":"130529","item_name":"巨鹿县"},
    {"item_code":"130530","item_name":"新河县"},
    {"item_code":"130531","item_name":"广宗县"},
    {"item_code":"130532","item_name":"平乡县"},
    {"item_code":"130533","item_name":"威县"},
    {"item_code":"130534","item_name":"清河县"},
    {"item_code":"130535","item_name":"临西县"},
    {"item_code":"130581","item_name":"南宫市"},
    {"item_code":"130582","item_name":"沙河市"},
    {"item_code":"130602","item_name":"新市区"},
    {"item_code":"130603","item_name":"北市区"},
    {"item_code":"130604","item_name":"南市区"},
    {"item_code":"130621","item_name":"满城县"},
    {"item_code":"130622","item_name":"清苑县"},
    {"item_code":"130623","item_name":"涞水县"},
    {"item_code":"130624","item_name":"阜平县"},
    {"item_code":"130625","item_name":"徐水县"},
    {"item_code":"130626","item_name":"定兴县"},
    {"item_code":"130627","item_name":"唐县"},
    {"item_code":"130628","item_name":"高阳县"},
    {"item_code":"130629","item_name":"容城县"},
    {"item_code":"130630","item_name":"涞源县"},
    {"item_code":"130631","item_name":"望都县"},
    {"item_code":"130632","item_name":"安新县"},
    {"item_code":"130633","item_name":"易县"},
    {"item_code":"130634","item_name":"曲阳县"},
    {"item_code":"130635","item_name":"蠡县"},
    {"item_code":"130636","item_name":"顺平县"},
    {"item_code":"130637","item_name":"博野县"},
    {"item_code":"130638","item_name":"雄县"},
    {"item_code":"130681","item_name":"涿州市"},
    {"item_code":"130682","item_name":"定州市"},
    {"item_code":"130683","item_name":"安国市"},
    {"item_code":"130684","item_name":"高碑店市"},
    {"item_code":"130702","item_name":"桥东区"},
    {"item_code":"130703","item_name":"桥西区"},
    {"item_code":"130705","item_name":"宣化区"},
    {"item_code":"130706","item_name":"下花园区"},
    {"item_code":"130721","item_name":"宣化县"},
    {"item_code":"130722","item_name":"张北县"},
    {"item_code":"130723","item_name":"康保县"},
    {"item_code":"130724","item_name":"沽源县"},
    {"item_code":"130725","item_name":"尚义县"},
    {"item_code":"130726","item_name":"蔚县"},
    {"item_code":"130727","item_name":"阳原县"},
    {"item_code":"130728","item_name":"怀安县"},
    {"item_code":"130729","item_name":"万全县"},
    {"item_code":"130730","item_name":"怀来县"},
    {"item_code":"130731","item_name":"涿鹿县"},
    {"item_code":"130732","item_name":"赤城县"},
    {"item_code":"130733","item_name":"崇礼县"},
    {"item_code":"130802","item_name":"双桥区"},
    {"item_code":"130803","item_name":"双滦区"},
    {"item_code":"130804","item_name":"鹰手营子矿区"},
    {"item_code":"130821","item_name":"承德县"},
    {"item_code":"130822","item_name":"兴隆县"},
    {"item_code":"130823","item_name":"平泉县"},
    {"item_code":"130824","item_name":"滦平县"},
    {"item_code":"130825","item_name":"隆化县"},
    {"item_code":"130826","item_name":"丰宁满族自治县"},
    {"item_code":"130827","item_name":"宽城满族自治县"},
    {"item_code":"130828","item_name":"围场满族蒙古族自治县"},
    {"item_code":"130902","item_name":"新华区"},
    {"item_code":"130903","item_name":"运河区"},
    {"item_code":"130921","item_name":"沧县"},
    {"item_code":"130922","item_name":"青县"},
    {"item_code":"130923","item_name":"东光县"},
    {"item_code":"130924","item_name":"海兴县"},
    {"item_code":"130925","item_name":"盐山县"},
    {"item_code":"130926","item_name":"肃宁县"},
    {"item_code":"130927","item_name":"南皮县"},
    {"item_code":"130928","item_name":"吴桥县"},
    {"item_code":"130929","item_name":"献县"},
    {"item_code":"130930","item_name":"孟村回族自治县"},
    {"item_code":"130981","item_name":"泊头市"},
    {"item_code":"130982","item_name":"任丘市"},
    {"item_code":"130983","item_name":"黄骅市"},
    {"item_code":"130984","item_name":"河间市"},
    {"item_code":"131002","item_name":"安次区"},
    {"item_code":"131003","item_name":"广阳区"},
    {"item_code":"131022","item_name":"固安县"},
    {"item_code":"131023","item_name":"永清县"},
    {"item_code":"131024","item_name":"香河县"},
    {"item_code":"131025","item_name":"大城县"},
    {"item_code":"131026","item_name":"文安县"},
    {"item_code":"131028","item_name":"大厂回族自治县"},
    {"item_code":"131081","item_name":"霸州市"},
    {"item_code":"131082","item_name":"三河市"},
    {"item_code":"131102","item_name":"桃城区"},
    {"item_code":"131121","item_name":"枣强县"},
    {"item_code":"131122","item_name":"武邑县"},
    {"item_code":"131123","item_name":"武强县"},
    {"item_code":"131124","item_name":"饶阳县"},
    {"item_code":"131125","item_name":"安平县"},
    {"item_code":"131126","item_name":"故城县"},
    {"item_code":"131127","item_name":"景县"},
    {"item_code":"131128","item_name":"阜城县"},
    {"item_code":"131181","item_name":"冀州市"},
    {"item_code":"131182","item_name":"深州市"},
    {"item_code":"140105","item_name":"小店区"},
    {"item_code":"140106","item_name":"迎泽区"},
    {"item_code":"140107","item_name":"杏花岭区"},
    {"item_code":"140108","item_name":"尖草坪区"},
    {"item_code":"140109","item_name":"万柏林区"},
    {"item_code":"140110","item_name":"晋源区"},
    {"item_code":"140121","item_name":"清徐县"},
    {"item_code":"140122","item_name":"阳曲县"},
    {"item_code":"140123","item_name":"娄烦县"},
    {"item_code":"140181","item_name":"古交市"},
    {"item_code":"140202","item_name":"城区"},
    {"item_code":"140203","item_name":"矿区"},
    {"item_code":"140211","item_name":"南郊区"},
    {"item_code":"140212","item_name":"新荣区"},
    {"item_code":"140221","item_name":"阳高县"},
    {"item_code":"140222","item_name":"天镇县"},
    {"item_code":"140223","item_name":"广灵县"},
    {"item_code":"140224","item_name":"灵丘县"},
    {"item_code":"140225","item_name":"浑源县"},
    {"item_code":"140226","item_name":"左云县"},
    {"item_code":"140227","item_name":"大同县"},
    {"item_code":"140302","item_name":"城区"},
    {"item_code":"140303","item_name":"矿区"},
    {"item_code":"140311","item_name":"郊区"},
    {"item_code":"140321","item_name":"平定县"},
    {"item_code":"140322","item_name":"盂县"},
    {"item_code":"140402","item_name":"城区"},
    {"item_code":"140411","item_name":"郊区"},
    {"item_code":"140421","item_name":"长治县"},
    {"item_code":"140423","item_name":"襄垣县"},
    {"item_code":"140424","item_name":"屯留县"},
    {"item_code":"140425","item_name":"平顺县"},
    {"item_code":"140426","item_name":"黎城县"},
    {"item_code":"140427","item_name":"壶关县"},
    {"item_code":"140428","item_name":"长子县"},
    {"item_code":"140429","item_name":"武乡县"},
    {"item_code":"140430","item_name":"沁县"},
    {"item_code":"140431","item_name":"沁源县"},
    {"item_code":"140481","item_name":"潞城市"},
    {"item_code":"140502","item_name":"城区"},
    {"item_code":"140521","item_name":"沁水县"},
    {"item_code":"140522","item_name":"阳城县"},
    {"item_code":"140524","item_name":"陵川县"},
    {"item_code":"140525","item_name":"泽州县"},
    {"item_code":"140581","item_name":"高平市"},
    {"item_code":"140602","item_name":"朔城区"},
    {"item_code":"140603","item_name":"平鲁区"},
    {"item_code":"140621","item_name":"山阴县"},
    {"item_code":"140622","item_name":"应县"},
    {"item_code":"140623","item_name":"右玉县"},
    {"item_code":"140624","item_name":"怀仁县"},
    {"item_code":"140702","item_name":"榆次区"},
    {"item_code":"140721","item_name":"榆社县"},
    {"item_code":"140722","item_name":"左权县"},
    {"item_code":"140723","item_name":"和顺县"},
    {"item_code":"140724","item_name":"昔阳县"},
    {"item_code":"140725","item_name":"寿阳县"},
    {"item_code":"140726","item_name":"太谷县"},
    {"item_code":"140727","item_name":"祁县"},
    {"item_code":"140728","item_name":"平遥县"},
    {"item_code":"140729","item_name":"灵石县"},
    {"item_code":"140781","item_name":"介休市"},
    {"item_code":"140802","item_name":"盐湖区"},
    {"item_code":"140821","item_name":"临猗县"},
    {"item_code":"140822","item_name":"万荣县"},
    {"item_code":"140823","item_name":"闻喜县"},
    {"item_code":"140824","item_name":"稷山县"},
    {"item_code":"140825","item_name":"新绛县"},
    {"item_code":"140826","item_name":"绛县"},
    {"item_code":"140827","item_name":"垣曲县"},
    {"item_code":"140828","item_name":"夏县"},
    {"item_code":"140829","item_name":"平陆县"},
    {"item_code":"140830","item_name":"芮城县"},
    {"item_code":"140881","item_name":"永济市"},
    {"item_code":"140882","item_name":"河津市"},
    {"item_code":"140902","item_name":"忻府区"},
    {"item_code":"140921","item_name":"定襄县"},
    {"item_code":"140922","item_name":"五台县"},
    {"item_code":"140923","item_name":"代县"},
    {"item_code":"140924","item_name":"繁峙县"},
    {"item_code":"140925","item_name":"宁武县"},
    {"item_code":"140926","item_name":"静乐县"},
    {"item_code":"140927","item_name":"神池县"},
    {"item_code":"140928","item_name":"五寨县"},
    {"item_code":"140929","item_name":"岢岚县"},
    {"item_code":"140930","item_name":"河曲县"},
    {"item_code":"140931","item_name":"保德县"},
    {"item_code":"140932","item_name":"偏关县"},
    {"item_code":"140981","item_name":"原平市"},
    {"item_code":"141002","item_name":"尧都区"},
    {"item_code":"141021","item_name":"曲沃县"},
    {"item_code":"141022","item_name":"翼城县"},
    {"item_code":"141023","item_name":"襄汾县"},
    {"item_code":"141024","item_name":"洪洞县"},
    {"item_code":"141025","item_name":"古县"},
    {"item_code":"141026","item_name":"安泽县"},
    {"item_code":"141027","item_name":"浮山县"},
    {"item_code":"141028","item_name":"吉县"},
    {"item_code":"141029","item_name":"乡宁县"},
    {"item_code":"141030","item_name":"大宁县"},
    {"item_code":"141031","item_name":"隰县"},
    {"item_code":"141032","item_name":"永和县"},
    {"item_code":"141033","item_name":"蒲县"},
    {"item_code":"141034","item_name":"汾西县"},
    {"item_code":"141081","item_name":"侯马市"},
    {"item_code":"141082","item_name":"霍州市"},
    {"item_code":"141102","item_name":"离石区"},
    {"item_code":"141121","item_name":"文水县"},
    {"item_code":"141122","item_name":"交城县"},
    {"item_code":"141123","item_name":"兴县"},
    {"item_code":"141124","item_name":"临县"},
    {"item_code":"141125","item_name":"柳林县"},
    {"item_code":"141126","item_name":"石楼县"},
    {"item_code":"141127","item_name":"岚县"},
    {"item_code":"141128","item_name":"方山县"},
    {"item_code":"141129","item_name":"中阳县"},
    {"item_code":"141130","item_name":"交口县"},
    {"item_code":"141181","item_name":"孝义市"},
    {"item_code":"141182","item_name":"汾阳市"},
    {"item_code":"150102","item_name":"新城区"},
    {"item_code":"150103","item_name":"回民区"},
    {"item_code":"150104","item_name":"玉泉区"},
    {"item_code":"150105","item_name":"赛罕区"},
    {"item_code":"150121","item_name":"土默特左旗"},
    {"item_code":"150122","item_name":"托克托县"},
    {"item_code":"150123","item_name":"和林格尔县"},
    {"item_code":"150124","item_name":"清水河县"},
    {"item_code":"150125","item_name":"武川县"},
    {"item_code":"150202","item_name":"东河区"},
    {"item_code":"150203","item_name":"昆都仑区"},
    {"item_code":"150204","item_name":"青山区"},
    {"item_code":"150205","item_name":"石拐区"},
    {"item_code":"150206","item_name":"白云鄂博矿区"},
    {"item_code":"150207","item_name":"九原区"},
    {"item_code":"150221","item_name":"土默特右旗"},
    {"item_code":"150222","item_name":"固阳县"},
    {"item_code":"150223","item_name":"达尔罕茂明安联合旗"},
    {"item_code":"150302","item_name":"海勃湾区"},
    {"item_code":"150303","item_name":"海南区"},
    {"item_code":"150304","item_name":"乌达区"},
    {"item_code":"150402","item_name":"红山区"},
    {"item_code":"150403","item_name":"元宝山区"},
    {"item_code":"150404","item_name":"松山区"},
    {"item_code":"150421","item_name":"阿鲁科尔沁旗"},
    {"item_code":"150422","item_name":"巴林左旗"},
    {"item_code":"150423","item_name":"巴林右旗"},
    {"item_code":"150424","item_name":"林西县"},
    {"item_code":"150425","item_name":"克什克腾旗"},
    {"item_code":"150426","item_name":"翁牛特旗"},
    {"item_code":"150428","item_name":"喀喇沁旗"},
    {"item_code":"150429","item_name":"宁城县"},
    {"item_code":"150430","item_name":"敖汉旗"},
    {"item_code":"150502","item_name":"科尔沁区"},
    {"item_code":"150521","item_name":"科尔沁左翼中旗"},
    {"item_code":"150522","item_name":"科尔沁左翼后旗"},
    {"item_code":"150523","item_name":"开鲁县"},
    {"item_code":"150524","item_name":"库伦旗"},
    {"item_code":"150525","item_name":"奈曼旗"},
    {"item_code":"150526","item_name":"扎鲁特旗"},
    {"item_code":"150581","item_name":"霍林郭勒市"},
    {"item_code":"150602","item_name":"东胜区"},
    {"item_code":"150621","item_name":"达拉特旗"},
    {"item_code":"150622","item_name":"准格尔旗"},
    {"item_code":"150623","item_name":"鄂托克前旗"},
    {"item_code":"150624","item_name":"鄂托克旗"},
    {"item_code":"150625","item_name":"杭锦旗"},
    {"item_code":"150626","item_name":"乌审旗"},
    {"item_code":"150627","item_name":"伊金霍洛旗"},
    {"item_code":"150702","item_name":"海拉尔区"},
    {"item_code":"150721","item_name":"阿荣旗"},
    {"item_code":"150722","item_name":"莫力达瓦达斡尔族自治旗"},
    {"item_code":"150723","item_name":"鄂伦春自治旗"},
    {"item_code":"150724","item_name":"鄂温克族自治旗"},
    {"item_code":"150725","item_name":"陈巴尔虎旗"},
    {"item_code":"150726","item_name":"新巴尔虎左旗"},
    {"item_code":"150727","item_name":"新巴尔虎右旗"},
    {"item_code":"150781","item_name":"满洲里市"},
    {"item_code":"150782","item_name":"牙克石市"},
    {"item_code":"150783","item_name":"扎兰屯市"},
    {"item_code":"150784","item_name":"额尔古纳市"},
    {"item_code":"150785","item_name":"根河市"},
    {"item_code":"150802","item_name":"临河区"},
    {"item_code":"150821","item_name":"五原县"},
    {"item_code":"150822","item_name":"磴口县"},
    {"item_code":"150823","item_name":"乌拉特前旗"},
    {"item_code":"150824","item_name":"乌拉特中旗"},
    {"item_code":"150825","item_name":"乌拉特后旗"},
    {"item_code":"150826","item_name":"杭锦后旗"},
    {"item_code":"150902","item_name":"集宁区"},
    {"item_code":"150921","item_name":"卓资县"},
    {"item_code":"150922","item_name":"化德县"},
    {"item_code":"150923","item_name":"商都县"},
    {"item_code":"150924","item_name":"兴和县"},
    {"item_code":"150925","item_name":"凉城县"},
    {"item_code":"150926","item_name":"察哈尔右翼前旗"},
    {"item_code":"150927","item_name":"察哈尔右翼中旗"},
    {"item_code":"150928","item_name":"察哈尔右翼后旗"},
    {"item_code":"150929","item_name":"四子王旗"},
    {"item_code":"150981","item_name":"丰镇市"},
    {"item_code":"152201","item_name":"乌兰浩特市"},
    {"item_code":"152202","item_name":"阿尔山市"},
    {"item_code":"152221","item_name":"科尔沁右翼前旗"},
    {"item_code":"152222","item_name":"科尔沁右翼中旗"},
    {"item_code":"152223","item_name":"扎赉特旗"},
    {"item_code":"152224","item_name":"突泉县"},
    {"item_code":"152501","item_name":"二连浩特市"},
    {"item_code":"152502","item_name":"锡林浩特市"},
    {"item_code":"152522","item_name":"阿巴嘎旗"},
    {"item_code":"152523","item_name":"苏尼特左旗"},
    {"item_code":"152524","item_name":"苏尼特右旗"},
    {"item_code":"152525","item_name":"东乌珠穆沁旗"},
    {"item_code":"152526","item_name":"西乌珠穆沁旗"},
    {"item_code":"152527","item_name":"太仆寺旗"},
    {"item_code":"152528","item_name":"镶黄旗"},
    {"item_code":"152529","item_name":"正镶白旗"},
    {"item_code":"152530","item_name":"正蓝旗"},
    {"item_code":"152531","item_name":"多伦县"},
    {"item_code":"152921","item_name":"阿拉善左旗"},
    {"item_code":"152922","item_name":"阿拉善右旗"},
    {"item_code":"152923","item_name":"额济纳旗"},
    {"item_code":"210102","item_name":"和平区"},
    {"item_code":"210103","item_name":"沈河区"},
    {"item_code":"210104","item_name":"大东区"},
    {"item_code":"210105","item_name":"皇姑区"},
    {"item_code":"210106","item_name":"铁西区"},
    {"item_code":"210111","item_name":"苏家屯区"},
    {"item_code":"210112","item_name":"东陵区"},
    {"item_code":"210113","item_name":"沈北新区"},
    {"item_code":"210114","item_name":"于洪区"},
    {"item_code":"210122","item_name":"辽中县"},
    {"item_code":"210123","item_name":"康平县"},
    {"item_code":"210124","item_name":"法库县"},
    {"item_code":"210181","item_name":"新民市"},
    {"item_code":"210202","item_name":"中山区"},
    {"item_code":"210203","item_name":"西岗区"},
    {"item_code":"210204","item_name":"沙河口区"},
    {"item_code":"210211","item_name":"甘井子区"},
    {"item_code":"210212","item_name":"旅顺口区"},
    {"item_code":"210213","item_name":"金州区"},
    {"item_code":"210224","item_name":"长海县"},
    {"item_code":"210281","item_name":"瓦房店市"},
    {"item_code":"210282","item_name":"普兰店市"},
    {"item_code":"210283","item_name":"庄河市"},
    {"item_code":"210302","item_name":"铁东区"},
    {"item_code":"210303","item_name":"铁西区"},
    {"item_code":"210304","item_name":"立山区"},
    {"item_code":"210311","item_name":"千山区"},
    {"item_code":"210321","item_name":"台安县"},
    {"item_code":"210323","item_name":"岫岩满族自治县"},
    {"item_code":"210381","item_name":"海城市"},
    {"item_code":"210402","item_name":"新抚区"},
    {"item_code":"210403","item_name":"东洲区"},
    {"item_code":"210404","item_name":"望花区"},
    {"item_code":"210411","item_name":"顺城区"},
    {"item_code":"210421","item_name":"抚顺县"},
    {"item_code":"210422","item_name":"新宾满族自治县"},
    {"item_code":"210423","item_name":"清原满族自治县"},
    {"item_code":"210502","item_name":"平山区"},
    {"item_code":"210503","item_name":"溪湖区"},
    {"item_code":"210504","item_name":"明山区"},
    {"item_code":"210505","item_name":"南芬区"},
    {"item_code":"210521","item_name":"本溪满族自治县"},
    {"item_code":"210522","item_name":"桓仁满族自治县"},
    {"item_code":"210602","item_name":"元宝区"},
    {"item_code":"210603","item_name":"振兴区"},
    {"item_code":"210604","item_name":"振安区"},
    {"item_code":"210624","item_name":"宽甸满族自治县"},
    {"item_code":"210681","item_name":"东港市"},
    {"item_code":"210682","item_name":"凤城市"},
    {"item_code":"210702","item_name":"古塔区"},
    {"item_code":"210703","item_name":"凌河区"},
    {"item_code":"210711","item_name":"太和区"},
    {"item_code":"210726","item_name":"黑山县"},
    {"item_code":"210727","item_name":"义县"},
    {"item_code":"210781","item_name":"凌海市"},
    {"item_code":"210782","item_name":"北镇市"},
    {"item_code":"210802","item_name":"站前区"},
    {"item_code":"210803","item_name":"西市区"},
    {"item_code":"210804","item_name":"鲅鱼圈区"},
    {"item_code":"210811","item_name":"老边区"},
    {"item_code":"210881","item_name":"盖州市"},
    {"item_code":"210882","item_name":"大石桥市"},
    {"item_code":"210902","item_name":"海州区"},
    {"item_code":"210903","item_name":"新邱区"},
    {"item_code":"210904","item_name":"太平区"},
    {"item_code":"210905","item_name":"清河门区"},
    {"item_code":"210911","item_name":"细河区"},
    {"item_code":"210921","item_name":"阜新蒙古族自治县"},
    {"item_code":"210922","item_name":"彰武县"},
    {"item_code":"211002","item_name":"白塔区"},
    {"item_code":"211003","item_name":"文圣区"},
    {"item_code":"211004","item_name":"宏伟区"},
    {"item_code":"211005","item_name":"弓长岭区"},
    {"item_code":"211011","item_name":"太子河区"},
    {"item_code":"211021","item_name":"辽阳县"},
    {"item_code":"211081","item_name":"灯塔市"},
    {"item_code":"211102","item_name":"双台子区"},
    {"item_code":"211103","item_name":"兴隆台区"},
    {"item_code":"211121","item_name":"大洼县"},
    {"item_code":"211122","item_name":"盘山县"},
    {"item_code":"211202","item_name":"银州区"},
    {"item_code":"211204","item_name":"清河区"},
    {"item_code":"211221","item_name":"铁岭县"},
    {"item_code":"211223","item_name":"西丰县"},
    {"item_code":"211224","item_name":"昌图县"},
    {"item_code":"211281","item_name":"调兵山市"},
    {"item_code":"211282","item_name":"开原市"},
    {"item_code":"211302","item_name":"双塔区"},
    {"item_code":"211303","item_name":"龙城区"},
    {"item_code":"211321","item_name":"朝阳县"},
    {"item_code":"211322","item_name":"建平县"},
    {"item_code":"211324","item_name":"喀喇沁左翼蒙古族自治县"},
    {"item_code":"211381","item_name":"北票市"},
    {"item_code":"211382","item_name":"凌源市"},
    {"item_code":"211402","item_name":"连山区"},
    {"item_code":"211403","item_name":"龙港区"},
    {"item_code":"211404","item_name":"南票区"},
    {"item_code":"211421","item_name":"绥中县"},
    {"item_code":"211422","item_name":"建昌县"},
    {"item_code":"211481","item_name":"兴城市"},
    {"item_code":"220102","item_name":"南关区"},
    {"item_code":"220103","item_name":"宽城区"},
    {"item_code":"220104","item_name":"朝阳区"},
    {"item_code":"220105","item_name":"二道区"},
    {"item_code":"220106","item_name":"绿园区"},
    {"item_code":"220112","item_name":"双阳区"},
    {"item_code":"220122","item_name":"农安县"},
    {"item_code":"220181","item_name":"九台市"},
    {"item_code":"220182","item_name":"榆树市"},
    {"item_code":"220183","item_name":"德惠市"},
    {"item_code":"220202","item_name":"昌邑区"},
    {"item_code":"220203","item_name":"龙潭区"},
    {"item_code":"220204","item_name":"船营区"},
    {"item_code":"220211","item_name":"丰满区"},
    {"item_code":"220221","item_name":"永吉县"},
    {"item_code":"220281","item_name":"蛟河市"},
    {"item_code":"220282","item_name":"桦甸市"},
    {"item_code":"220283","item_name":"舒兰市"},
    {"item_code":"220284","item_name":"磐石市"},
    {"item_code":"220302","item_name":"铁西区"},
    {"item_code":"220303","item_name":"铁东区"},
    {"item_code":"220322","item_name":"梨树县"},
    {"item_code":"220323","item_name":"伊通满族自治县"},
    {"item_code":"220381","item_name":"公主岭市"},
    {"item_code":"220382","item_name":"双辽市"},
    {"item_code":"220402","item_name":"龙山区"},
    {"item_code":"220403","item_name":"西安区"},
    {"item_code":"220421","item_name":"东丰县"},
    {"item_code":"220422","item_name":"东辽县"},
    {"item_code":"220502","item_name":"东昌区"},
    {"item_code":"220503","item_name":"二道江区"},
    {"item_code":"220521","item_name":"通化县"},
    {"item_code":"220523","item_name":"辉南县"},
    {"item_code":"220524","item_name":"柳河县"},
    {"item_code":"220581","item_name":"梅河口市"},
    {"item_code":"220582","item_name":"集安市"},
    {"item_code":"220602","item_name":"八道江区"},
    {"item_code":"220605","item_name":"江源区"},
    {"item_code":"220621","item_name":"抚松县"},
    {"item_code":"220622","item_name":"靖宇县"},
    {"item_code":"220623","item_name":"长白朝鲜族自治县"},
    {"item_code":"220681","item_name":"临江市"},
    {"item_code":"220702","item_name":"宁江区"},
    {"item_code":"220721","item_name":"前郭尔罗斯蒙古族自治县"},
    {"item_code":"220722","item_name":"长岭县"},
    {"item_code":"220723","item_name":"乾安县"},
    {"item_code":"220724","item_name":"扶余县"},
    {"item_code":"220802","item_name":"洮北区"},
    {"item_code":"220821","item_name":"镇赉县"},
    {"item_code":"220822","item_name":"通榆县"},
    {"item_code":"220881","item_name":"洮南市"},
    {"item_code":"220882","item_name":"大安市"},
    {"item_code":"222401","item_name":"延吉市"},
    {"item_code":"222402","item_name":"图们市"},
    {"item_code":"222403","item_name":"敦化市"},
    {"item_code":"222404","item_name":"珲春市"},
    {"item_code":"222405","item_name":"龙井市"},
    {"item_code":"222406","item_name":"和龙市"},
    {"item_code":"222424","item_name":"汪清县"},
    {"item_code":"222426","item_name":"安图县"},
    {"item_code":"230102","item_name":"道里区"},
    {"item_code":"230103","item_name":"南岗区"},
    {"item_code":"230104","item_name":"道外区"},
    {"item_code":"230108","item_name":"平房区"},
    {"item_code":"230109","item_name":"松北区"},
    {"item_code":"230110","item_name":"香坊区"},
    {"item_code":"230111","item_name":"呼兰区"},
    {"item_code":"230112","item_name":"阿城区"},
    {"item_code":"230123","item_name":"依兰县"},
    {"item_code":"230124","item_name":"方正县"},
    {"item_code":"230125","item_name":"宾县"},
    {"item_code":"230126","item_name":"巴彦县"},
    {"item_code":"230127","item_name":"木兰县"},
    {"item_code":"230128","item_name":"通河县"},
    {"item_code":"230129","item_name":"延寿县"},
    {"item_code":"230182","item_name":"双城市"},
    {"item_code":"230183","item_name":"尚志市"},
    {"item_code":"230184","item_name":"五常市"},
    {"item_code":"230202","item_name":"龙沙区"},
    {"item_code":"230203","item_name":"建华区"},
    {"item_code":"230204","item_name":"铁锋区"},
    {"item_code":"230205","item_name":"昂昂溪区"},
    {"item_code":"230206","item_name":"富拉尔基区"},
    {"item_code":"230207","item_name":"碾子山区"},
    {"item_code":"230208","item_name":"梅里斯达斡尔族区"},
    {"item_code":"230221","item_name":"龙江县"},
    {"item_code":"230223","item_name":"依安县"},
    {"item_code":"230224","item_name":"泰来县"},
    {"item_code":"230225","item_name":"甘南县"},
    {"item_code":"230227","item_name":"富裕县"},
    {"item_code":"230229","item_name":"克山县"},
    {"item_code":"230230","item_name":"克东县"},
    {"item_code":"230231","item_name":"拜泉县"},
    {"item_code":"230281","item_name":"讷河市"},
    {"item_code":"230302","item_name":"鸡冠区"},
    {"item_code":"230303","item_name":"恒山区"},
    {"item_code":"230304","item_name":"滴道区"},
    {"item_code":"230305","item_name":"梨树区"},
    {"item_code":"230306","item_name":"城子河区"},
    {"item_code":"230307","item_name":"麻山区"},
    {"item_code":"230321","item_name":"鸡东县"},
    {"item_code":"230381","item_name":"虎林市"},
    {"item_code":"230382","item_name":"密山市"},
    {"item_code":"230402","item_name":"向阳区"},
    {"item_code":"230403","item_name":"工农区"},
    {"item_code":"230404","item_name":"南山区"},
    {"item_code":"230405","item_name":"兴安区"},
    {"item_code":"230406","item_name":"东山区"},
    {"item_code":"230407","item_name":"兴山区"},
    {"item_code":"230421","item_name":"萝北县"},
    {"item_code":"230422","item_name":"绥滨县"},
    {"item_code":"230502","item_name":"尖山区"},
    {"item_code":"230503","item_name":"岭东区"},
    {"item_code":"230505","item_name":"四方台区"},
    {"item_code":"230506","item_name":"宝山区"},
    {"item_code":"230521","item_name":"集贤县"},
    {"item_code":"230522","item_name":"友谊县"},
    {"item_code":"230523","item_name":"宝清县"},
    {"item_code":"230524","item_name":"饶河县"},
    {"item_code":"230602","item_name":"萨尔图区"},
    {"item_code":"230603","item_name":"龙凤区"},
    {"item_code":"230604","item_name":"让胡路区"},
    {"item_code":"230605","item_name":"红岗区"},
    {"item_code":"230606","item_name":"大同区"},
    {"item_code":"230621","item_name":"肇州县"},
    {"item_code":"230622","item_name":"肇源县"},
    {"item_code":"230623","item_name":"林甸县"},
    {"item_code":"230624","item_name":"杜尔伯特蒙古族自治县"},
    {"item_code":"230702","item_name":"伊春区"},
    {"item_code":"230703","item_name":"南岔区"},
    {"item_code":"230704","item_name":"友好区"},
    {"item_code":"230705","item_name":"西林区"},
    {"item_code":"230706","item_name":"翠峦区"},
    {"item_code":"230707","item_name":"新青区"},
    {"item_code":"230708","item_name":"美溪区"},
    {"item_code":"230709","item_name":"金山屯区"},
    {"item_code":"230710","item_name":"五营区"},
    {"item_code":"230711","item_name":"乌马河区"},
    {"item_code":"230712","item_name":"汤旺河区"},
    {"item_code":"230713","item_name":"带岭区"},
    {"item_code":"230714","item_name":"乌伊岭区"},
    {"item_code":"230715","item_name":"红星区"},
    {"item_code":"230716","item_name":"上甘岭区"},
    {"item_code":"230722","item_name":"嘉荫县"},
    {"item_code":"230781","item_name":"铁力市"},
    {"item_code":"230803","item_name":"向阳区"},
    {"item_code":"230804","item_name":"前进区"},
    {"item_code":"230805","item_name":"东风区"},
    {"item_code":"230811","item_name":"郊区"},
    {"item_code":"230822","item_name":"桦南县"},
    {"item_code":"230826","item_name":"桦川县"},
    {"item_code":"230828","item_name":"汤原县"},
    {"item_code":"230833","item_name":"抚远县"},
    {"item_code":"230881","item_name":"同江市"},
    {"item_code":"230882","item_name":"富锦市"},
    {"item_code":"230902","item_name":"新兴区"},
    {"item_code":"230903","item_name":"桃山区"},
    {"item_code":"230904","item_name":"茄子河区"},
    {"item_code":"230921","item_name":"勃利县"},
    {"item_code":"231002","item_name":"东安区"},
    {"item_code":"231003","item_name":"阳明区"},
    {"item_code":"231004","item_name":"爱民区"},
    {"item_code":"231005","item_name":"西安区"},
    {"item_code":"231024","item_name":"东宁县"},
    {"item_code":"231025","item_name":"林口县"},
    {"item_code":"231081","item_name":"绥芬河市"},
    {"item_code":"231083","item_name":"海林市"},
    {"item_code":"231084","item_name":"宁安市"},
    {"item_code":"231085","item_name":"穆棱市"},
    {"item_code":"231102","item_name":"爱辉区"},
    {"item_code":"231121","item_name":"嫩江县"},
    {"item_code":"231123","item_name":"逊克县"},
    {"item_code":"231124","item_name":"孙吴县"},
    {"item_code":"231181","item_name":"北安市"},
    {"item_code":"231182","item_name":"五大连池市"},
    {"item_code":"231202","item_name":"北林区"},
    {"item_code":"231221","item_name":"望奎县"},
    {"item_code":"231222","item_name":"兰西县"},
    {"item_code":"231223","item_name":"青冈县"},
    {"item_code":"231224","item_name":"庆安县"},
    {"item_code":"231225","item_name":"明水县"},
    {"item_code":"231226","item_name":"绥棱县"},
    {"item_code":"231281","item_name":"安达市"},
    {"item_code":"231282","item_name":"肇东市"},
    {"item_code":"231283","item_name":"海伦市"},
    {"item_code":"232721","item_name":"呼玛县"},
    {"item_code":"232722","item_name":"塔河县"},
    {"item_code":"232723","item_name":"漠河县"},
    {"item_code":"310101","item_name":"黄浦区"},
    {"item_code":"310104","item_name":"徐汇区"},
    {"item_code":"310105","item_name":"长宁区"},
    {"item_code":"310106","item_name":"静安区"},
    {"item_code":"310107","item_name":"普陀区"},
    {"item_code":"310108","item_name":"闸北区"},
    {"item_code":"310109","item_name":"虹口区"},
    {"item_code":"310110","item_name":"杨浦区"},
    {"item_code":"310112","item_name":"闵行区"},
    {"item_code":"310113","item_name":"宝山区"},
    {"item_code":"310114","item_name":"嘉定区"},
    {"item_code":"310115","item_name":"浦东新区"},
    {"item_code":"310116","item_name":"金山区"},
    {"item_code":"310117","item_name":"松江区"},
    {"item_code":"310118","item_name":"青浦区"},
    {"item_code":"310120","item_name":"奉贤区"},
    {"item_code":"310230","item_name":"崇明县"},
    {"item_code":"320102","item_name":"玄武区"},
    {"item_code":"320103","item_name":"白下区"},
    {"item_code":"320104","item_name":"秦淮区"},
    {"item_code":"320105","item_name":"建邺区"},
    {"item_code":"320106","item_name":"鼓楼区"},
    {"item_code":"320107","item_name":"下关区"},
    {"item_code":"320111","item_name":"浦口区"},
    {"item_code":"320113","item_name":"栖霞区"},
    {"item_code":"320114","item_name":"雨花台区"},
    {"item_code":"320115","item_name":"江宁区"},
    {"item_code":"320116","item_name":"六合区"},
    {"item_code":"320124","item_name":"溧水县"},
    {"item_code":"320125","item_name":"高淳县"},
    {"item_code":"320202","item_name":"崇安区"},
    {"item_code":"320203","item_name":"南长区"},
    {"item_code":"320204","item_name":"北塘区"},
    {"item_code":"320205","item_name":"锡山区"},
    {"item_code":"320206","item_name":"惠山区"},
    {"item_code":"320211","item_name":"滨湖区"},
    {"item_code":"320281","item_name":"江阴市"},
    {"item_code":"320282","item_name":"宜兴市"},
    {"item_code":"320302","item_name":"鼓楼区"},
    {"item_code":"320303","item_name":"云龙区"},
    {"item_code":"320305","item_name":"贾汪区"},
    {"item_code":"320311","item_name":"泉山区"},
    {"item_code":"320312","item_name":"铜山区"},
    {"item_code":"320321","item_name":"丰县"},
    {"item_code":"320322","item_name":"沛县"},
    {"item_code":"320324","item_name":"睢宁县"},
    {"item_code":"320381","item_name":"新沂市"},
    {"item_code":"320382","item_name":"邳州市"},
    {"item_code":"320402","item_name":"天宁区"},
    {"item_code":"320404","item_name":"钟楼区"},
    {"item_code":"320405","item_name":"戚墅堰区"},
    {"item_code":"320411","item_name":"新北区"},
    {"item_code":"320412","item_name":"武进区"},
    {"item_code":"320481","item_name":"溧阳市"},
    {"item_code":"320482","item_name":"金坛市"},
    {"item_code":"320502","item_name":"沧浪区"},
    {"item_code":"320503","item_name":"平江区"},
    {"item_code":"320504","item_name":"金阊区"},
    {"item_code":"320505","item_name":"虎丘区"},
    {"item_code":"320506","item_name":"吴中区"},
    {"item_code":"320507","item_name":"相城区"},
    {"item_code":"320581","item_name":"常熟市"},
    {"item_code":"320582","item_name":"张家港市"},
    {"item_code":"320583","item_name":"昆山市"},
    {"item_code":"320584","item_name":"吴江市"},
    {"item_code":"320585","item_name":"太仓市"},
    {"item_code":"320602","item_name":"崇川区"},
    {"item_code":"320611","item_name":"港闸区"},
    {"item_code":"320612","item_name":"通州区"},
    {"item_code":"320621","item_name":"海安县"},
    {"item_code":"320623","item_name":"如东县"},
    {"item_code":"320681","item_name":"启东市"},
    {"item_code":"320682","item_name":"如皋市"},
    {"item_code":"320684","item_name":"海门市"},
    {"item_code":"320703","item_name":"连云区"},
    {"item_code":"320705","item_name":"新浦区"},
    {"item_code":"320706","item_name":"海州区"},
    {"item_code":"320721","item_name":"赣榆县"},
    {"item_code":"320722","item_name":"东海县"},
    {"item_code":"320723","item_name":"灌云县"},
    {"item_code":"320724","item_name":"灌南县"},
    {"item_code":"320802","item_name":"清河区"},
    {"item_code":"320803","item_name":"楚州区"},
    {"item_code":"320804","item_name":"淮阴区"},
    {"item_code":"320811","item_name":"清浦区"},
    {"item_code":"320826","item_name":"涟水县"},
    {"item_code":"320829","item_name":"洪泽县"},
    {"item_code":"320830","item_name":"盱眙县"},
    {"item_code":"320831","item_name":"金湖县"},
    {"item_code":"320902","item_name":"亭湖区"},
    {"item_code":"320903","item_name":"盐都区"},
    {"item_code":"320921","item_name":"响水县"},
    {"item_code":"320922","item_name":"滨海县"},
    {"item_code":"320923","item_name":"阜宁县"},
    {"item_code":"320924","item_name":"射阳县"},
    {"item_code":"320925","item_name":"建湖县"},
    {"item_code":"320981","item_name":"东台市"},
    {"item_code":"320982","item_name":"大丰市"},
    {"item_code":"321002","item_name":"广陵区"},
    {"item_code":"321003","item_name":"邗江区"},
    {"item_code":"321012","item_name":"江都区"},
    {"item_code":"321023","item_name":"宝应县"},
    {"item_code":"321081","item_name":"仪征市"},
    {"item_code":"321084","item_name":"高邮市"},
    {"item_code":"321102","item_name":"京口区"},
    {"item_code":"321111","item_name":"润州区"},
    {"item_code":"321112","item_name":"丹徒区"},
    {"item_code":"321181","item_name":"丹阳市"},
    {"item_code":"321182","item_name":"扬中市"},
    {"item_code":"321183","item_name":"句容市"},
    {"item_code":"321202","item_name":"海陵区"},
    {"item_code":"321203","item_name":"高港区"},
    {"item_code":"321281","item_name":"兴化市"},
    {"item_code":"321282","item_name":"靖江市"},
    {"item_code":"321283","item_name":"泰兴市"},
    {"item_code":"321284","item_name":"姜堰市"},
    {"item_code":"321302","item_name":"宿城区"},
    {"item_code":"321311","item_name":"宿豫区"},
    {"item_code":"321322","item_name":"沭阳县"},
    {"item_code":"321323","item_name":"泗阳县"},
    {"item_code":"321324","item_name":"泗洪县"},
    {"item_code":"330102","item_name":"上城区"},
    {"item_code":"330103","item_name":"下城区"},
    {"item_code":"330104","item_name":"江干区"},
    {"item_code":"330105","item_name":"拱墅区"},
    {"item_code":"330106","item_name":"西湖区"},
    {"item_code":"330108","item_name":"滨江区"},
    {"item_code":"330109","item_name":"萧山区"},
    {"item_code":"330110","item_name":"余杭区"},
    {"item_code":"330122","item_name":"桐庐县"},
    {"item_code":"330127","item_name":"淳安县"},
    {"item_code":"330182","item_name":"建德市"},
    {"item_code":"330183","item_name":"富阳市"},
    {"item_code":"330185","item_name":"临安市"},
    {"item_code":"330203","item_name":"海曙区"},
    {"item_code":"330204","item_name":"江东区"},
    {"item_code":"330205","item_name":"江北区"},
    {"item_code":"330206","item_name":"北仑区"},
    {"item_code":"330211","item_name":"镇海区"},
    {"item_code":"330212","item_name":"鄞州区"},
    {"item_code":"330225","item_name":"象山县"},
    {"item_code":"330226","item_name":"宁海县"},
    {"item_code":"330281","item_name":"余姚市"},
    {"item_code":"330282","item_name":"慈溪市"},
    {"item_code":"330283","item_name":"奉化市"},
    {"item_code":"330302","item_name":"鹿城区"},
    {"item_code":"330303","item_name":"龙湾区"},
    {"item_code":"330304","item_name":"瓯海区"},
    {"item_code":"330322","item_name":"洞头县"},
    {"item_code":"330324","item_name":"永嘉县"},
    {"item_code":"330326","item_name":"平阳县"},
    {"item_code":"330327","item_name":"苍南县"},
    {"item_code":"330328","item_name":"文成县"},
    {"item_code":"330329","item_name":"泰顺县"},
    {"item_code":"330381","item_name":"瑞安市"},
    {"item_code":"330382","item_name":"乐清市"},
    {"item_code":"330402","item_name":"南湖区"},
    {"item_code":"330411","item_name":"秀洲区"},
    {"item_code":"330421","item_name":"嘉善县"},
    {"item_code":"330424","item_name":"海盐县"},
    {"item_code":"330481","item_name":"海宁市"},
    {"item_code":"330482","item_name":"平湖市"},
    {"item_code":"330483","item_name":"桐乡市"},
    {"item_code":"330502","item_name":"吴兴区"},
    {"item_code":"330503","item_name":"南浔区"},
    {"item_code":"330521","item_name":"德清县"},
    {"item_code":"330522","item_name":"长兴县"},
    {"item_code":"330523","item_name":"安吉县"},
    {"item_code":"330602","item_name":"越城区"},
    {"item_code":"330621","item_name":"绍兴县"},
    {"item_code":"330624","item_name":"新昌县"},
    {"item_code":"330681","item_name":"诸暨市"},
    {"item_code":"330682","item_name":"上虞市"},
    {"item_code":"330683","item_name":"嵊州市"},
    {"item_code":"330702","item_name":"婺城区"},
    {"item_code":"330703","item_name":"金东区"},
    {"item_code":"330723","item_name":"武义县"},
    {"item_code":"330726","item_name":"浦江县"},
    {"item_code":"330727","item_name":"磐安县"},
    {"item_code":"330781","item_name":"兰溪市"},
    {"item_code":"330782","item_name":"义乌市"},
    {"item_code":"330783","item_name":"东阳市"},
    {"item_code":"330784","item_name":"永康市"},
    {"item_code":"330802","item_name":"柯城区"},
    {"item_code":"330803","item_name":"衢江区"},
    {"item_code":"330822","item_name":"常山县"},
    {"item_code":"330824","item_name":"开化县"},
    {"item_code":"330825","item_name":"龙游县"},
    {"item_code":"330881","item_name":"江山市"},
    {"item_code":"330902","item_name":"定海区"},
    {"item_code":"330903","item_name":"普陀区"},
    {"item_code":"330921","item_name":"岱山县"},
    {"item_code":"330922","item_name":"嵊泗县"},
    {"item_code":"331002","item_name":"椒江区"},
    {"item_code":"331003","item_name":"黄岩区"},
    {"item_code":"331004","item_name":"路桥区"},
    {"item_code":"331021","item_name":"玉环县"},
    {"item_code":"331022","item_name":"三门县"},
    {"item_code":"331023","item_name":"天台县"},
    {"item_code":"331024","item_name":"仙居县"},
    {"item_code":"331081","item_name":"温岭市"},
    {"item_code":"331082","item_name":"临海市"},
    {"item_code":"331102","item_name":"莲都区"},
    {"item_code":"331121","item_name":"青田县"},
    {"item_code":"331122","item_name":"缙云县"},
    {"item_code":"331123","item_name":"遂昌县"},
    {"item_code":"331124","item_name":"松阳县"},
    {"item_code":"331125","item_name":"云和县"},
    {"item_code":"331126","item_name":"庆元县"},
    {"item_code":"331127","item_name":"景宁畲族自治县"},
    {"item_code":"331181","item_name":"龙泉市"},
    {"item_code":"340102","item_name":"瑶海区"},
    {"item_code":"340103","item_name":"庐阳区"},
    {"item_code":"340104","item_name":"蜀山区"},
    {"item_code":"340111","item_name":"包河区"},
    {"item_code":"340121","item_name":"长丰县"},
    {"item_code":"340122","item_name":"肥东县"},
    {"item_code":"340123","item_name":"肥西县"},
    {"item_code":"340124","item_name":"庐江县"},
    {"item_code":"340181","item_name":"巢湖市"},
    {"item_code":"340202","item_name":"镜湖区"},
    {"item_code":"340203","item_name":"弋江区"},
    {"item_code":"340207","item_name":"鸠江区"},
    {"item_code":"340208","item_name":"三山区"},
    {"item_code":"340221","item_name":"芜湖县"},
    {"item_code":"340222","item_name":"繁昌县"},
    {"item_code":"340223","item_name":"南陵县"},
    {"item_code":"340225","item_name":"无为县"},
    {"item_code":"340302","item_name":"龙子湖区"},
    {"item_code":"340303","item_name":"蚌山区"},
    {"item_code":"340304","item_name":"禹会区"},
    {"item_code":"340311","item_name":"淮上区"},
    {"item_code":"340321","item_name":"怀远县"},
    {"item_code":"340322","item_name":"五河县"},
    {"item_code":"340323","item_name":"固镇县"},
    {"item_code":"340402","item_name":"大通区"},
    {"item_code":"340403","item_name":"田家庵区"},
    {"item_code":"340404","item_name":"谢家集区"},
    {"item_code":"340405","item_name":"八公山区"},
    {"item_code":"340406","item_name":"潘集区"},
    {"item_code":"340421","item_name":"凤台县"},
    {"item_code":"340502","item_name":"金家庄区"},
    {"item_code":"340503","item_name":"花山区"},
    {"item_code":"340504","item_name":"雨山区"},
    {"item_code":"340521","item_name":"当涂县"},
    {"item_code":"340522","item_name":"含山县"},
    {"item_code":"340523","item_name":"和县"},
    {"item_code":"340602","item_name":"杜集区"},
    {"item_code":"340603","item_name":"相山区"},
    {"item_code":"340604","item_name":"烈山区"},
    {"item_code":"340621","item_name":"濉溪县"},
    {"item_code":"340702","item_name":"铜官山区"},
    {"item_code":"340703","item_name":"狮子山区"},
    {"item_code":"340711","item_name":"郊区"},
    {"item_code":"340721","item_name":"铜陵县"},
    {"item_code":"340802","item_name":"迎江区"},
    {"item_code":"340803","item_name":"大观区"},
    {"item_code":"340811","item_name":"宜秀区"},
    {"item_code":"340822","item_name":"怀宁县"},
    {"item_code":"340823","item_name":"枞阳县"},
    {"item_code":"340824","item_name":"潜山县"},
    {"item_code":"340825","item_name":"太湖县"},
    {"item_code":"340826","item_name":"宿松县"},
    {"item_code":"340827","item_name":"望江县"},
    {"item_code":"340828","item_name":"岳西县"},
    {"item_code":"340881","item_name":"桐城市"},
    {"item_code":"341002","item_name":"屯溪区"},
    {"item_code":"341003","item_name":"黄山区"},
    {"item_code":"341004","item_name":"徽州区"},
    {"item_code":"341021","item_name":"歙县"},
    {"item_code":"341022","item_name":"休宁县"},
    {"item_code":"341023","item_name":"黟县"},
    {"item_code":"341024","item_name":"祁门县"},
    {"item_code":"341102","item_name":"琅琊区"},
    {"item_code":"341103","item_name":"南谯区"},
    {"item_code":"341122","item_name":"来安县"},
    {"item_code":"341124","item_name":"全椒县"},
    {"item_code":"341125","item_name":"定远县"},
    {"item_code":"341126","item_name":"凤阳县"},
    {"item_code":"341181","item_name":"天长市"},
    {"item_code":"341182","item_name":"明光市"},
    {"item_code":"341202","item_name":"颍州区"},
    {"item_code":"341203","item_name":"颍东区"},
    {"item_code":"341204","item_name":"颍泉区"},
    {"item_code":"341221","item_name":"临泉县"},
    {"item_code":"341222","item_name":"太和县"},
    {"item_code":"341225","item_name":"阜南县"},
    {"item_code":"341226","item_name":"颍上县"},
    {"item_code":"341282","item_name":"界首市"},
    {"item_code":"341302","item_name":"?桥区"},
    {"item_code":"341321","item_name":"砀山县"},
    {"item_code":"341322","item_name":"萧县"},
    {"item_code":"341323","item_name":"灵璧县"},
    {"item_code":"341324","item_name":"泗县"},
    {"item_code":"341502","item_name":"金安区"},
    {"item_code":"341503","item_name":"裕安区"},
    {"item_code":"341521","item_name":"寿县"},
    {"item_code":"341522","item_name":"霍邱县"},
    {"item_code":"341523","item_name":"舒城县"},
    {"item_code":"341524","item_name":"金寨县"},
    {"item_code":"341525","item_name":"霍山县"},
    {"item_code":"341602","item_name":"谯城区"},
    {"item_code":"341621","item_name":"涡阳县"},
    {"item_code":"341622","item_name":"蒙城县"},
    {"item_code":"341623","item_name":"利辛县"},
    {"item_code":"341702","item_name":"贵池区"},
    {"item_code":"341721","item_name":"东至县"},
    {"item_code":"341722","item_name":"石台县"},
    {"item_code":"341723","item_name":"青阳县"},
    {"item_code":"341802","item_name":"宣州区"},
    {"item_code":"341821","item_name":"郎溪县"},
    {"item_code":"341822","item_name":"广德县"},
    {"item_code":"341823","item_name":"泾县"},
    {"item_code":"341824","item_name":"绩溪县"},
    {"item_code":"341825","item_name":"旌德县"},
    {"item_code":"341881","item_name":"宁国市"},
    {"item_code":"350102","item_name":"鼓楼区"},
    {"item_code":"350103","item_name":"台江区"},
    {"item_code":"350104","item_name":"仓山区"},
    {"item_code":"350105","item_name":"马尾区"},
    {"item_code":"350111","item_name":"晋安区"},
    {"item_code":"350121","item_name":"闽侯县"},
    {"item_code":"350122","item_name":"连江县"},
    {"item_code":"350123","item_name":"罗源县"},
    {"item_code":"350124","item_name":"闽清县"},
    {"item_code":"350125","item_name":"永泰县"},
    {"item_code":"350128","item_name":"平潭县"},
    {"item_code":"350181","item_name":"福清市"},
    {"item_code":"350182","item_name":"长乐市"},
    {"item_code":"350203","item_name":"思明区"},
    {"item_code":"350205","item_name":"海沧区"},
    {"item_code":"350206","item_name":"湖里区"},
    {"item_code":"350211","item_name":"集美区"},
    {"item_code":"350212","item_name":"同安区"},
    {"item_code":"350213","item_name":"翔安区"},
    {"item_code":"350302","item_name":"城厢区"},
    {"item_code":"350303","item_name":"涵江区"},
    {"item_code":"350304","item_name":"荔城区"},
    {"item_code":"350305","item_name":"秀屿区"},
    {"item_code":"350322","item_name":"仙游县"},
    {"item_code":"350402","item_name":"梅列区"},
    {"item_code":"350403","item_name":"三元区"},
    {"item_code":"350421","item_name":"明溪县"},
    {"item_code":"350423","item_name":"清流县"},
    {"item_code":"350424","item_name":"宁化县"},
    {"item_code":"350425","item_name":"大田县"},
    {"item_code":"350426","item_name":"尤溪县"},
    {"item_code":"350427","item_name":"沙县"},
    {"item_code":"350428","item_name":"将乐县"},
    {"item_code":"350429","item_name":"泰宁县"},
    {"item_code":"350430","item_name":"建宁县"},
    {"item_code":"350481","item_name":"永安市"},
    {"item_code":"350502","item_name":"鲤城区"},
    {"item_code":"350503","item_name":"丰泽区"},
    {"item_code":"350504","item_name":"洛江区"},
    {"item_code":"350505","item_name":"泉港区"},
    {"item_code":"350521","item_name":"惠安县"},
    {"item_code":"350524","item_name":"安溪县"},
    {"item_code":"350525","item_name":"永春县"},
    {"item_code":"350526","item_name":"德化县"},
    {"item_code":"350527","item_name":"金门县"},
    {"item_code":"350581","item_name":"石狮市"},
    {"item_code":"350582","item_name":"晋江市"},
    {"item_code":"350583","item_name":"南安市"},
    {"item_code":"350602","item_name":"芗城区"},
    {"item_code":"350603","item_name":"龙文区"},
    {"item_code":"350622","item_name":"云霄县"},
    {"item_code":"350623","item_name":"漳浦县"},
    {"item_code":"350624","item_name":"诏安县"},
    {"item_code":"350625","item_name":"长泰县"},
    {"item_code":"350626","item_name":"东山县"},
    {"item_code":"350627","item_name":"南靖县"},
    {"item_code":"350628","item_name":"平和县"},
    {"item_code":"350629","item_name":"华安县"},
    {"item_code":"350681","item_name":"龙海市"},
    {"item_code":"350702","item_name":"延平区"},
    {"item_code":"350721","item_name":"顺昌县"},
    {"item_code":"350722","item_name":"浦城县"},
    {"item_code":"350723","item_name":"光泽县"},
    {"item_code":"350724","item_name":"松溪县"},
    {"item_code":"350725","item_name":"政和县"},
    {"item_code":"350781","item_name":"邵武市"},
    {"item_code":"350782","item_name":"武夷山市"},
    {"item_code":"350783","item_name":"建瓯市"},
    {"item_code":"350784","item_name":"建阳市"},
    {"item_code":"350802","item_name":"新罗区"},
    {"item_code":"350821","item_name":"长汀县"},
    {"item_code":"350822","item_name":"永定县"},
    {"item_code":"350823","item_name":"上杭县"},
    {"item_code":"350824","item_name":"武平县"},
    {"item_code":"350825","item_name":"连城县"},
    {"item_code":"350881","item_name":"漳平市"},
    {"item_code":"350902","item_name":"蕉城区"},
    {"item_code":"350921","item_name":"霞浦县"},
    {"item_code":"350922","item_name":"古田县"},
    {"item_code":"350923","item_name":"屏南县"},
    {"item_code":"350924","item_name":"寿宁县"},
    {"item_code":"350925","item_name":"周宁县"},
    {"item_code":"350926","item_name":"柘荣县"},
    {"item_code":"350981","item_name":"福安市"},
    {"item_code":"350982","item_name":"福鼎市"},
    {"item_code":"360102","item_name":"东湖区"},
    {"item_code":"360103","item_name":"西湖区"},
    {"item_code":"360104","item_name":"青云谱区"},
    {"item_code":"360105","item_name":"湾里区"},
    {"item_code":"360111","item_name":"青山湖区"},
    {"item_code":"360121","item_name":"南昌县"},
    {"item_code":"360122","item_name":"新建县"},
    {"item_code":"360123","item_name":"安义县"},
    {"item_code":"360124","item_name":"进贤县"},
    {"item_code":"360202","item_name":"昌江区"},
    {"item_code":"360203","item_name":"珠山区"},
    {"item_code":"360222","item_name":"浮梁县"},
    {"item_code":"360281","item_name":"乐平市"},
    {"item_code":"360302","item_name":"安源区"},
    {"item_code":"360313","item_name":"湘东区"},
    {"item_code":"360321","item_name":"莲花县"},
    {"item_code":"360322","item_name":"上栗县"},
    {"item_code":"360323","item_name":"芦溪县"},
    {"item_code":"360402","item_name":"庐山区"},
    {"item_code":"360403","item_name":"浔阳区"},
    {"item_code":"360421","item_name":"九江县"},
    {"item_code":"360423","item_name":"武宁县"},
    {"item_code":"360424","item_name":"修水县"},
    {"item_code":"360425","item_name":"永修县"},
    {"item_code":"360426","item_name":"德安县"},
    {"item_code":"360427","item_name":"星子县"},
    {"item_code":"360428","item_name":"都昌县"},
    {"item_code":"360429","item_name":"湖口县"},
    {"item_code":"360430","item_name":"彭泽县"},
    {"item_code":"360481","item_name":"瑞昌市"},
    {"item_code":"360482","item_name":"共青城市"},
    {"item_code":"360502","item_name":"渝水区"},
    {"item_code":"360521","item_name":"分宜县"},
    {"item_code":"360602","item_name":"月湖区"},
    {"item_code":"360622","item_name":"余江县"},
    {"item_code":"360681","item_name":"贵溪市"},
    {"item_code":"360702","item_name":"章贡区"},
    {"item_code":"360721","item_name":"赣县"},
    {"item_code":"360722","item_name":"信丰县"},
    {"item_code":"360723","item_name":"大余县"},
    {"item_code":"360724","item_name":"上犹县"},
    {"item_code":"360725","item_name":"崇义县"},
    {"item_code":"360726","item_name":"安远县"},
    {"item_code":"360727","item_name":"龙南县"},
    {"item_code":"360728","item_name":"定南县"},
    {"item_code":"360729","item_name":"全南县"},
    {"item_code":"360730","item_name":"宁都县"},
    {"item_code":"360731","item_name":"于都县"},
    {"item_code":"360732","item_name":"兴国县"},
    {"item_code":"360733","item_name":"会昌县"},
    {"item_code":"360734","item_name":"寻乌县"},
    {"item_code":"360735","item_name":"石城县"},
    {"item_code":"360781","item_name":"瑞金市"},
    {"item_code":"360782","item_name":"南康市"},
    {"item_code":"360802","item_name":"吉州区"},
    {"item_code":"360803","item_name":"青原区"},
    {"item_code":"360821","item_name":"吉安县"},
    {"item_code":"360822","item_name":"吉水县"},
    {"item_code":"360823","item_name":"峡江县"},
    {"item_code":"360824","item_name":"新干县"},
    {"item_code":"360825","item_name":"永丰县"},
    {"item_code":"360826","item_name":"泰和县"},
    {"item_code":"360827","item_name":"遂川县"},
    {"item_code":"360828","item_name":"万安县"},
    {"item_code":"360829","item_name":"安福县"},
    {"item_code":"360830","item_name":"永新县"},
    {"item_code":"360881","item_name":"井冈山市"},
    {"item_code":"360902","item_name":"袁州区"},
    {"item_code":"360921","item_name":"奉新县"},
    {"item_code":"360922","item_name":"万载县"},
    {"item_code":"360923","item_name":"上高县"},
    {"item_code":"360924","item_name":"宜丰县"},
    {"item_code":"360925","item_name":"靖安县"},
    {"item_code":"360926","item_name":"铜鼓县"},
    {"item_code":"360981","item_name":"丰城市"},
    {"item_code":"360982","item_name":"樟树市"},
    {"item_code":"360983","item_name":"高安市"},
    {"item_code":"361002","item_name":"临川区"},
    {"item_code":"361021","item_name":"南城县"},
    {"item_code":"361022","item_name":"黎川县"},
    {"item_code":"361023","item_name":"南丰县"},
    {"item_code":"361024","item_name":"崇仁县"},
    {"item_code":"361025","item_name":"乐安县"},
    {"item_code":"361026","item_name":"宜黄县"},
    {"item_code":"361027","item_name":"金溪县"},
    {"item_code":"361028","item_name":"资溪县"},
    {"item_code":"361029","item_name":"东乡县"},
    {"item_code":"361030","item_name":"广昌县"},
    {"item_code":"361102","item_name":"信州区"},
    {"item_code":"361121","item_name":"上饶县"},
    {"item_code":"361122","item_name":"广丰县"},
    {"item_code":"361123","item_name":"玉山县"},
    {"item_code":"361124","item_name":"铅山县"},
    {"item_code":"361125","item_name":"横峰县"},
    {"item_code":"361126","item_name":"弋阳县"},
    {"item_code":"361127","item_name":"余干县"},
    {"item_code":"361128","item_name":"鄱阳县"},
    {"item_code":"361129","item_name":"万年县"},
    {"item_code":"361130","item_name":"婺源县"},
    {"item_code":"361181","item_name":"德兴市"},
    {"item_code":"370102","item_name":"历下区"},
    {"item_code":"370103","item_name":"市中区"},
    {"item_code":"370104","item_name":"槐荫区"},
    {"item_code":"370105","item_name":"天桥区"},
    {"item_code":"370112","item_name":"历城区"},
    {"item_code":"370113","item_name":"长清区"},
    {"item_code":"370124","item_name":"平阴县"},
    {"item_code":"370125","item_name":"济阳县"},
    {"item_code":"370126","item_name":"商河县"},
    {"item_code":"370181","item_name":"章丘市"},
    {"item_code":"370202","item_name":"市南区"},
    {"item_code":"370203","item_name":"市北区"},
    {"item_code":"370205","item_name":"四方区"},
    {"item_code":"370211","item_name":"黄岛区"},
    {"item_code":"370212","item_name":"崂山区"},
    {"item_code":"370213","item_name":"李沧区"},
    {"item_code":"370214","item_name":"城阳区"},
    {"item_code":"370281","item_name":"胶州市"},
    {"item_code":"370282","item_name":"即墨市"},
    {"item_code":"370283","item_name":"平度市"},
    {"item_code":"370284","item_name":"胶南市"},
    {"item_code":"370285","item_name":"莱西市"},
    {"item_code":"370302","item_name":"淄川区"},
    {"item_code":"370303","item_name":"张店区"},
    {"item_code":"370304","item_name":"博山区"},
    {"item_code":"370305","item_name":"临淄区"},
    {"item_code":"370306","item_name":"周村区"},
    {"item_code":"370321","item_name":"桓台县"},
    {"item_code":"370322","item_name":"高青县"},
    {"item_code":"370323","item_name":"沂源县"},
    {"item_code":"370402","item_name":"市中区"},
    {"item_code":"370403","item_name":"薛城区"},
    {"item_code":"370404","item_name":"峄城区"},
    {"item_code":"370405","item_name":"台儿庄区"},
    {"item_code":"370406","item_name":"山亭区"},
    {"item_code":"370481","item_name":"滕州市"},
    {"item_code":"370502","item_name":"东营区"},
    {"item_code":"370503","item_name":"河口区"},
    {"item_code":"370521","item_name":"垦利县"},
    {"item_code":"370522","item_name":"利津县"},
    {"item_code":"370523","item_name":"广饶县"},
    {"item_code":"370602","item_name":"芝罘区"},
    {"item_code":"370611","item_name":"福山区"},
    {"item_code":"370612","item_name":"牟平区"},
    {"item_code":"370613","item_name":"莱山区"},
    {"item_code":"370634","item_name":"长岛县"},
    {"item_code":"370681","item_name":"龙口市"},
    {"item_code":"370682","item_name":"莱阳市"},
    {"item_code":"370683","item_name":"莱州市"},
    {"item_code":"370684","item_name":"蓬莱市"},
    {"item_code":"370685","item_name":"招远市"},
    {"item_code":"370686","item_name":"栖霞市"},
    {"item_code":"370687","item_name":"海阳市"},
    {"item_code":"370702","item_name":"潍城区"},
    {"item_code":"370703","item_name":"寒亭区"},
    {"item_code":"370704","item_name":"坊子区"},
    {"item_code":"370705","item_name":"奎文区"},
    {"item_code":"370724","item_name":"临朐县"},
    {"item_code":"370725","item_name":"昌乐县"},
    {"item_code":"370781","item_name":"青州市"},
    {"item_code":"370782","item_name":"诸城市"},
    {"item_code":"370783","item_name":"寿光市"},
    {"item_code":"370784","item_name":"安丘市"},
    {"item_code":"370785","item_name":"高密市"},
    {"item_code":"370786","item_name":"昌邑市"},
    {"item_code":"370802","item_name":"市中区"},
    {"item_code":"370811","item_name":"任城区"},
    {"item_code":"370826","item_name":"微山县"},
    {"item_code":"370827","item_name":"鱼台县"},
    {"item_code":"370828","item_name":"金乡县"},
    {"item_code":"370829","item_name":"嘉祥县"},
    {"item_code":"370830","item_name":"汶上县"},
    {"item_code":"370831","item_name":"泗水县"},
    {"item_code":"370832","item_name":"梁山县"},
    {"item_code":"370881","item_name":"曲阜市"},
    {"item_code":"370882","item_name":"兖州市"},
    {"item_code":"370883","item_name":"邹城市"},
    {"item_code":"370902","item_name":"泰山区"},
    {"item_code":"370911","item_name":"岱岳区"},
    {"item_code":"370921","item_name":"宁阳县"},
    {"item_code":"370923","item_name":"东平县"},
    {"item_code":"370982","item_name":"新泰市"},
    {"item_code":"370983","item_name":"肥城市"},
    {"item_code":"371002","item_name":"环翠区"},
    {"item_code":"371081","item_name":"文登市"},
    {"item_code":"371082","item_name":"荣成市"},
    {"item_code":"371083","item_name":"乳山市"},
    {"item_code":"371102","item_name":"东港区"},
    {"item_code":"371103","item_name":"岚山区"},
    {"item_code":"371121","item_name":"五莲县"},
    {"item_code":"371122","item_name":"莒县"},
    {"item_code":"371202","item_name":"莱城区"},
    {"item_code":"371203","item_name":"钢城区"},
    {"item_code":"371302","item_name":"兰山区"},
    {"item_code":"371311","item_name":"罗庄区"},
    {"item_code":"371312","item_name":"河东区"},
    {"item_code":"371321","item_name":"沂南县"},
    {"item_code":"371322","item_name":"郯城县"},
    {"item_code":"371323","item_name":"沂水县"},
    {"item_code":"371324","item_name":"苍山县"},
    {"item_code":"371325","item_name":"费县"},
    {"item_code":"371326","item_name":"平邑县"},
    {"item_code":"371327","item_name":"莒南县"},
    {"item_code":"371328","item_name":"蒙阴县"},
    {"item_code":"371329","item_name":"临沭县"},
    {"item_code":"371402","item_name":"德城区"},
    {"item_code":"371421","item_name":"陵县"},
    {"item_code":"371422","item_name":"宁津县"},
    {"item_code":"371423","item_name":"庆云县"},
    {"item_code":"371424","item_name":"临邑县"},
    {"item_code":"371425","item_name":"齐河县"},
    {"item_code":"371426","item_name":"平原县"},
    {"item_code":"371427","item_name":"夏津县"},
    {"item_code":"371428","item_name":"武城县"},
    {"item_code":"371481","item_name":"乐陵市"},
    {"item_code":"371482","item_name":"禹城市"},
    {"item_code":"371502","item_name":"东昌府区"},
    {"item_code":"371521","item_name":"阳谷县"},
    {"item_code":"371522","item_name":"莘县"},
    {"item_code":"371523","item_name":"茌平县"},
    {"item_code":"371524","item_name":"东阿县"},
    {"item_code":"371525","item_name":"冠县"},
    {"item_code":"371526","item_name":"高唐县"},
    {"item_code":"371581","item_name":"临清市"},
    {"item_code":"371602","item_name":"滨城区"},
    {"item_code":"371621","item_name":"惠民县"},
    {"item_code":"371622","item_name":"阳信县"},
    {"item_code":"371623","item_name":"无棣县"},
    {"item_code":"371624","item_name":"沾化县"},
    {"item_code":"371625","item_name":"博兴县"},
    {"item_code":"371626","item_name":"邹平县"},
    {"item_code":"371702","item_name":"牡丹区"},
    {"item_code":"371721","item_name":"曹县"},
    {"item_code":"371722","item_name":"单县"},
    {"item_code":"371723","item_name":"成武县"},
    {"item_code":"371724","item_name":"巨野县"},
    {"item_code":"371725","item_name":"郓城县"},
    {"item_code":"371726","item_name":"鄄城县"},
    {"item_code":"371727","item_name":"定陶县"},
    {"item_code":"371728","item_name":"东明县"},
    {"item_code":"410102","item_name":"中原区"},
    {"item_code":"410103","item_name":"二七区"},
    {"item_code":"410104","item_name":"管城回族区"},
    {"item_code":"410105","item_name":"金水区"},
    {"item_code":"410106","item_name":"上街区"},
    {"item_code":"410108","item_name":"惠济区"},
    {"item_code":"410122","item_name":"中牟县"},
    {"item_code":"410181","item_name":"巩义市"},
    {"item_code":"410182","item_name":"荥阳市"},
    {"item_code":"410183","item_name":"新密市"},
    {"item_code":"410184","item_name":"新郑市"},
    {"item_code":"410185","item_name":"登封市"},
    {"item_code":"410202","item_name":"龙亭区"},
    {"item_code":"410203","item_name":"顺河回族区"},
    {"item_code":"410204","item_name":"鼓楼区"},
    {"item_code":"410205","item_name":"禹王台区"},
    {"item_code":"410211","item_name":"金明区"},
    {"item_code":"410221","item_name":"杞县"},
    {"item_code":"410222","item_name":"通许县"},
    {"item_code":"410223","item_name":"尉氏县"},
    {"item_code":"410224","item_name":"开封县"},
    {"item_code":"410225","item_name":"兰考县"},
    {"item_code":"410302","item_name":"老城区"},
    {"item_code":"410303","item_name":"西工区"},
    {"item_code":"410304","item_name":"?河回族区"},
    {"item_code":"410305","item_name":"涧西区"},
    {"item_code":"410306","item_name":"吉利区"},
    {"item_code":"410311","item_name":"洛龙区"},
    {"item_code":"410322","item_name":"孟津县"},
    {"item_code":"410323","item_name":"新安县"},
    {"item_code":"410324","item_name":"栾川县"},
    {"item_code":"410325","item_name":"嵩县"},
    {"item_code":"410326","item_name":"汝阳县"},
    {"item_code":"410327","item_name":"宜阳县"},
    {"item_code":"410328","item_name":"洛宁县"},
    {"item_code":"410329","item_name":"伊川县"},
    {"item_code":"410381","item_name":"偃师市"},
    {"item_code":"410402","item_name":"新华区"},
    {"item_code":"410403","item_name":"卫东区"},
    {"item_code":"410404","item_name":"石龙区"},
    {"item_code":"410411","item_name":"湛河区"},
    {"item_code":"410421","item_name":"宝丰县"},
    {"item_code":"410422","item_name":"叶县"},
    {"item_code":"410423","item_name":"鲁山县"},
    {"item_code":"410425","item_name":"郏县"},
    {"item_code":"410481","item_name":"舞钢市"},
    {"item_code":"410482","item_name":"汝州市"},
    {"item_code":"410502","item_name":"文峰区"},
    {"item_code":"410503","item_name":"北关区"},
    {"item_code":"410505","item_name":"殷都区"},
    {"item_code":"410506","item_name":"龙安区"},
    {"item_code":"410522","item_name":"安阳县"},
    {"item_code":"410523","item_name":"汤阴县"},
    {"item_code":"410526","item_name":"滑县"},
    {"item_code":"410527","item_name":"内黄县"},
    {"item_code":"410581","item_name":"林州市"},
    {"item_code":"410602","item_name":"鹤山区"},
    {"item_code":"410603","item_name":"山城区"},
    {"item_code":"410611","item_name":"淇滨区"},
    {"item_code":"410621","item_name":"浚县"},
    {"item_code":"410622","item_name":"淇县"},
    {"item_code":"410702","item_name":"红旗区"},
    {"item_code":"410703","item_name":"卫滨区"},
    {"item_code":"410704","item_name":"凤泉区"},
    {"item_code":"410711","item_name":"牧野区"},
    {"item_code":"410721","item_name":"新乡县"},
    {"item_code":"410724","item_name":"获嘉县"},
    {"item_code":"410725","item_name":"原阳县"},
    {"item_code":"410726","item_name":"延津县"},
    {"item_code":"410727","item_name":"封丘县"},
    {"item_code":"410728","item_name":"长垣县"},
    {"item_code":"410781","item_name":"卫辉市"},
    {"item_code":"410782","item_name":"辉县市"},
    {"item_code":"410802","item_name":"解放区"},
    {"item_code":"410803","item_name":"中站区"},
    {"item_code":"410804","item_name":"马村区"},
    {"item_code":"410811","item_name":"山阳区"},
    {"item_code":"410821","item_name":"修武县"},
    {"item_code":"410822","item_name":"博爱县"},
    {"item_code":"410823","item_name":"武陟县"},
    {"item_code":"410825","item_name":"温县"},
    {"item_code":"410882","item_name":"沁阳市"},
    {"item_code":"410883","item_name":"孟州市"},
    {"item_code":"410902","item_name":"华龙区"},
    {"item_code":"410922","item_name":"清丰县"},
    {"item_code":"410923","item_name":"南乐县"},
    {"item_code":"410926","item_name":"范县"},
    {"item_code":"410927","item_name":"台前县"},
    {"item_code":"410928","item_name":"濮阳县"},
    {"item_code":"411002","item_name":"魏都区"},
    {"item_code":"411023","item_name":"许昌县"},
    {"item_code":"411024","item_name":"鄢陵县"},
    {"item_code":"411025","item_name":"襄城县"},
    {"item_code":"411081","item_name":"禹州市"},
    {"item_code":"411082","item_name":"长葛市"},
    {"item_code":"411102","item_name":"源汇区"},
    {"item_code":"411103","item_name":"郾城区"},
    {"item_code":"411104","item_name":"召陵区"},
    {"item_code":"411121","item_name":"舞阳县"},
    {"item_code":"411122","item_name":"临颍县"},
    {"item_code":"411202","item_name":"湖滨区"},
    {"item_code":"411221","item_name":"渑池县"},
    {"item_code":"411222","item_name":"陕县"},
    {"item_code":"411224","item_name":"卢氏县"},
    {"item_code":"411281","item_name":"义马市"},
    {"item_code":"411282","item_name":"灵宝市"},
    {"item_code":"411302","item_name":"宛城区"},
    {"item_code":"411303","item_name":"卧龙区"},
    {"item_code":"411321","item_name":"南召县"},
    {"item_code":"411322","item_name":"方城县"},
    {"item_code":"411323","item_name":"西峡县"},
    {"item_code":"411324","item_name":"镇平县"},
    {"item_code":"411325","item_name":"内乡县"},
    {"item_code":"411326","item_name":"淅川县"},
    {"item_code":"411327","item_name":"社旗县"},
    {"item_code":"411328","item_name":"唐河县"},
    {"item_code":"411329","item_name":"新野县"},
    {"item_code":"411330","item_name":"桐柏县"},
    {"item_code":"411381","item_name":"邓州市"},
    {"item_code":"411402","item_name":"梁园区"},
    {"item_code":"411403","item_name":"睢阳区"},
    {"item_code":"411421","item_name":"民权县"},
    {"item_code":"411422","item_name":"睢县"},
    {"item_code":"411423","item_name":"宁陵县"},
    {"item_code":"411424","item_name":"柘城县"},
    {"item_code":"411425","item_name":"虞城县"},
    {"item_code":"411426","item_name":"夏邑县"},
    {"item_code":"411481","item_name":"永城市"},
    {"item_code":"411502","item_name":"?河区"},
    {"item_code":"411503","item_name":"平桥区"},
    {"item_code":"411521","item_name":"罗山县"},
    {"item_code":"411522","item_name":"光山县"},
    {"item_code":"411523","item_name":"新县"},
    {"item_code":"411524","item_name":"商城县"},
    {"item_code":"411525","item_name":"固始县"},
    {"item_code":"411526","item_name":"潢川县"},
    {"item_code":"411527","item_name":"淮滨县"},
    {"item_code":"411528","item_name":"息县"},
    {"item_code":"411602","item_name":"川汇区"},
    {"item_code":"411621","item_name":"扶沟县"},
    {"item_code":"411622","item_name":"西华县"},
    {"item_code":"411623","item_name":"商水县"},
    {"item_code":"411624","item_name":"沈丘县"},
    {"item_code":"411625","item_name":"郸城县"},
    {"item_code":"411626","item_name":"淮阳县"},
    {"item_code":"411627","item_name":"太康县"},
    {"item_code":"411628","item_name":"鹿邑县"},
    {"item_code":"411681","item_name":"项城市"},
    {"item_code":"411702","item_name":"驿城区"},
    {"item_code":"411721","item_name":"西平县"},
    {"item_code":"411722","item_name":"上蔡县"},
    {"item_code":"411723","item_name":"平舆县"},
    {"item_code":"411724","item_name":"正阳县"},
    {"item_code":"411725","item_name":"确山县"},
    {"item_code":"411726","item_name":"泌阳县"},
    {"item_code":"411727","item_name":"汝南县"},
    {"item_code":"411728","item_name":"遂平县"},
    {"item_code":"411729","item_name":"新蔡县"},
    {"item_code":"419001","item_name":"济源市"},
    {"item_code":"420102","item_name":"江岸区"},
    {"item_code":"420103","item_name":"江汉区"},
    {"item_code":"420104","item_name":"?口区"},
    {"item_code":"420105","item_name":"汉阳区"},
    {"item_code":"420106","item_name":"武昌区"},
    {"item_code":"420107","item_name":"青山区"},
    {"item_code":"420111","item_name":"洪山区"},
    {"item_code":"420112","item_name":"东西湖区"},
    {"item_code":"420113","item_name":"汉南区"},
    {"item_code":"420114","item_name":"蔡甸区"},
    {"item_code":"420115","item_name":"江夏区"},
    {"item_code":"420116","item_name":"黄陂区"},
    {"item_code":"420117","item_name":"新洲区"},
    {"item_code":"420202","item_name":"黄石港区"},
    {"item_code":"420203","item_name":"西塞山区"},
    {"item_code":"420204","item_name":"下陆区"},
    {"item_code":"420205","item_name":"铁山区"},
    {"item_code":"420222","item_name":"阳新县"},
    {"item_code":"420281","item_name":"大冶市"},
    {"item_code":"420302","item_name":"茅箭区"},
    {"item_code":"420303","item_name":"张湾区"},
    {"item_code":"420321","item_name":"郧县"},
    {"item_code":"420322","item_name":"郧西县"},
    {"item_code":"420323","item_name":"竹山县"},
    {"item_code":"420324","item_name":"竹溪县"},
    {"item_code":"420325","item_name":"房县"},
    {"item_code":"420381","item_name":"丹江口市"},
    {"item_code":"420502","item_name":"西陵区"},
    {"item_code":"420503","item_name":"伍家岗区"},
    {"item_code":"420504","item_name":"点军区"},
    {"item_code":"420505","item_name":"?亭区"},
    {"item_code":"420506","item_name":"夷陵区"},
    {"item_code":"420525","item_name":"远安县"},
    {"item_code":"420526","item_name":"兴山县"},
    {"item_code":"420527","item_name":"秭归县"},
    {"item_code":"420528","item_name":"长阳土家族自治县"},
    {"item_code":"420529","item_name":"五峰土家族自治县"},
    {"item_code":"420581","item_name":"宜都市"},
    {"item_code":"420582","item_name":"当阳市"},
    {"item_code":"420583","item_name":"枝江市"},
    {"item_code":"420602","item_name":"襄城区"},
    {"item_code":"420606","item_name":"樊城区"},
    {"item_code":"420607","item_name":"襄州区"},
    {"item_code":"420624","item_name":"南漳县"},
    {"item_code":"420625","item_name":"谷城县"},
    {"item_code":"420626","item_name":"保康县"},
    {"item_code":"420682","item_name":"老河口市"},
    {"item_code":"420683","item_name":"枣阳市"},
    {"item_code":"420684","item_name":"宜城市"},
    {"item_code":"420702","item_name":"梁子湖区"},
    {"item_code":"420703","item_name":"华容区"},
    {"item_code":"420704","item_name":"鄂城区"},
    {"item_code":"420802","item_name":"东宝区"},
    {"item_code":"420804","item_name":"掇刀区"},
    {"item_code":"420821","item_name":"京山县"},
    {"item_code":"420822","item_name":"沙洋县"},
    {"item_code":"420881","item_name":"钟祥市"},
    {"item_code":"420902","item_name":"孝南区"},
    {"item_code":"420921","item_name":"孝昌县"},
    {"item_code":"420922","item_name":"大悟县"},
    {"item_code":"420923","item_name":"云梦县"},
    {"item_code":"420981","item_name":"应城市"},
    {"item_code":"420982","item_name":"安陆市"},
    {"item_code":"420984","item_name":"汉川市"},
    {"item_code":"421002","item_name":"沙市区"},
    {"item_code":"421003","item_name":"荆州区"},
    {"item_code":"421022","item_name":"公安县"},
    {"item_code":"421023","item_name":"监利县"},
    {"item_code":"421024","item_name":"江陵县"},
    {"item_code":"421081","item_name":"石首市"},
    {"item_code":"421083","item_name":"洪湖市"},
    {"item_code":"421087","item_name":"松滋市"},
    {"item_code":"421102","item_name":"黄州区"},
    {"item_code":"421121","item_name":"团风县"},
    {"item_code":"421122","item_name":"红安县"},
    {"item_code":"421123","item_name":"罗田县"},
    {"item_code":"421124","item_name":"英山县"},
    {"item_code":"421125","item_name":"浠水县"},
    {"item_code":"421126","item_name":"蕲春县"},
    {"item_code":"421127","item_name":"黄梅县"},
    {"item_code":"421181","item_name":"麻城市"},
    {"item_code":"421182","item_name":"武穴市"},
    {"item_code":"421202","item_name":"咸安区"},
    {"item_code":"421221","item_name":"嘉鱼县"},
    {"item_code":"421222","item_name":"通城县"},
    {"item_code":"421223","item_name":"崇阳县"},
    {"item_code":"421224","item_name":"通山县"},
    {"item_code":"421281","item_name":"赤壁市"},
    {"item_code":"421303","item_name":"曾都区"},
    {"item_code":"421321","item_name":"随县"},
    {"item_code":"421381","item_name":"广水市"},
    {"item_code":"422801","item_name":"恩施市"},
    {"item_code":"422802","item_name":"利川市"},
    {"item_code":"422822","item_name":"建始县"},
    {"item_code":"422823","item_name":"巴东县"},
    {"item_code":"422825","item_name":"宣恩县"},
    {"item_code":"422826","item_name":"咸丰县"},
    {"item_code":"422827","item_name":"来凤县"},
    {"item_code":"422828","item_name":"鹤峰县"},
    {"item_code":"429004","item_name":"仙桃市"},
    {"item_code":"429005","item_name":"潜江市"},
    {"item_code":"429006","item_name":"天门市"},
    {"item_code":"429021","item_name":"神农架林区"},
    {"item_code":"430102","item_name":"芙蓉区"},
    {"item_code":"430103","item_name":"天心区"},
    {"item_code":"430104","item_name":"岳麓区"},
    {"item_code":"430105","item_name":"开福区"},
    {"item_code":"430111","item_name":"雨花区"},
    {"item_code":"430112","item_name":"望城区"},
    {"item_code":"430121","item_name":"长沙县"},
    {"item_code":"430124","item_name":"宁乡县"},
    {"item_code":"430181","item_name":"浏阳市"},
    {"item_code":"430202","item_name":"荷塘区"},
    {"item_code":"430203","item_name":"芦淞区"},
    {"item_code":"430204","item_name":"石峰区"},
    {"item_code":"430211","item_name":"天元区"},
    {"item_code":"430221","item_name":"株洲县"},
    {"item_code":"430223","item_name":"攸县"},
    {"item_code":"430224","item_name":"茶陵县"},
    {"item_code":"430225","item_name":"炎陵县"},
    {"item_code":"430281","item_name":"醴陵市"},
    {"item_code":"430302","item_name":"雨湖区"},
    {"item_code":"430304","item_name":"岳塘区"},
    {"item_code":"430321","item_name":"湘潭县"},
    {"item_code":"430381","item_name":"湘乡市"},
    {"item_code":"430382","item_name":"韶山市"},
    {"item_code":"430405","item_name":"珠晖区"},
    {"item_code":"430406","item_name":"雁峰区"},
    {"item_code":"430407","item_name":"石鼓区"},
    {"item_code":"430408","item_name":"蒸湘区"},
    {"item_code":"430412","item_name":"南岳区"},
    {"item_code":"430421","item_name":"衡阳县"},
    {"item_code":"430422","item_name":"衡南县"},
    {"item_code":"430423","item_name":"衡山县"},
    {"item_code":"430424","item_name":"衡东县"},
    {"item_code":"430426","item_name":"祁东县"},
    {"item_code":"430481","item_name":"耒阳市"},
    {"item_code":"430482","item_name":"常宁市"},
    {"item_code":"430502","item_name":"双清区"},
    {"item_code":"430503","item_name":"大祥区"},
    {"item_code":"430511","item_name":"北塔区"},
    {"item_code":"430521","item_name":"邵东县"},
    {"item_code":"430522","item_name":"新邵县"},
    {"item_code":"430523","item_name":"邵阳县"},
    {"item_code":"430524","item_name":"隆回县"},
    {"item_code":"430525","item_name":"洞口县"},
    {"item_code":"430527","item_name":"绥宁县"},
    {"item_code":"430528","item_name":"新宁县"},
    {"item_code":"430529","item_name":"城步苗族自治县"},
    {"item_code":"430581","item_name":"武冈市"},
    {"item_code":"430602","item_name":"岳阳楼区"},
    {"item_code":"430603","item_name":"云溪区"},
    {"item_code":"430611","item_name":"君山区"},
    {"item_code":"430621","item_name":"岳阳县"},
    {"item_code":"430623","item_name":"华容县"},
    {"item_code":"430624","item_name":"湘阴县"},
    {"item_code":"430626","item_name":"平江县"},
    {"item_code":"430681","item_name":"汨罗市"},
    {"item_code":"430682","item_name":"临湘市"},
    {"item_code":"430702","item_name":"武陵区"},
    {"item_code":"430703","item_name":"鼎城区"},
    {"item_code":"430721","item_name":"安乡县"},
    {"item_code":"430722","item_name":"汉寿县"},
    {"item_code":"430723","item_name":"澧县"},
    {"item_code":"430724","item_name":"临澧县"},
    {"item_code":"430725","item_name":"桃源县"},
    {"item_code":"430726","item_name":"石门县"},
    {"item_code":"430781","item_name":"津市市"},
    {"item_code":"430802","item_name":"永定区"},
    {"item_code":"430811","item_name":"武陵源区"},
    {"item_code":"430821","item_name":"慈利县"},
    {"item_code":"430822","item_name":"桑植县"},
    {"item_code":"430902","item_name":"资阳区"},
    {"item_code":"430903","item_name":"赫山区"},
    {"item_code":"430921","item_name":"南县"},
    {"item_code":"430922","item_name":"桃江县"},
    {"item_code":"430923","item_name":"安化县"},
    {"item_code":"430981","item_name":"沅江市"},
    {"item_code":"431002","item_name":"北湖区"},
    {"item_code":"431003","item_name":"苏仙区"},
    {"item_code":"431021","item_name":"桂阳县"},
    {"item_code":"431022","item_name":"宜章县"},
    {"item_code":"431023","item_name":"永兴县"},
    {"item_code":"431024","item_name":"嘉禾县"},
    {"item_code":"431025","item_name":"临武县"},
    {"item_code":"431026","item_name":"汝城县"},
    {"item_code":"431027","item_name":"桂东县"},
    {"item_code":"431028","item_name":"安仁县"},
    {"item_code":"431081","item_name":"资兴市"},
    {"item_code":"431102","item_name":"零陵区"},
    {"item_code":"431103","item_name":"冷水滩区"},
    {"item_code":"431121","item_name":"祁阳县"},
    {"item_code":"431122","item_name":"东安县"},
    {"item_code":"431123","item_name":"双牌县"},
    {"item_code":"431124","item_name":"道县"},
    {"item_code":"431125","item_name":"江永县"},
    {"item_code":"431126","item_name":"宁远县"},
    {"item_code":"431127","item_name":"蓝山县"},
    {"item_code":"431128","item_name":"新田县"},
    {"item_code":"431129","item_name":"江华瑶族自治县"},
    {"item_code":"431202","item_name":"鹤城区"},
    {"item_code":"431221","item_name":"中方县"},
    {"item_code":"431222","item_name":"沅陵县"},
    {"item_code":"431223","item_name":"辰溪县"},
    {"item_code":"431224","item_name":"溆浦县"},
    {"item_code":"431225","item_name":"会同县"},
    {"item_code":"431226","item_name":"麻阳苗族自治县"},
    {"item_code":"431227","item_name":"新晃侗族自治县"},
    {"item_code":"431228","item_name":"芷江侗族自治县"},
    {"item_code":"431229","item_name":"靖州苗族侗族自治县"},
    {"item_code":"431230","item_name":"通道侗族自治县"},
    {"item_code":"431281","item_name":"洪江市"},
    {"item_code":"431302","item_name":"娄星区"},
    {"item_code":"431321","item_name":"双峰县"},
    {"item_code":"431322","item_name":"新化县"},
    {"item_code":"431381","item_name":"冷水江市"},
    {"item_code":"431382","item_name":"涟源市"},
    {"item_code":"433101","item_name":"吉首市"},
    {"item_code":"433122","item_name":"泸溪县"},
    {"item_code":"433123","item_name":"凤凰县"},
    {"item_code":"433124","item_name":"花垣县"},
    {"item_code":"433125","item_name":"保靖县"},
    {"item_code":"433126","item_name":"古丈县"},
    {"item_code":"433127","item_name":"永顺县"},
    {"item_code":"433130","item_name":"龙山县"},
    {"item_code":"440103","item_name":"荔湾区"},
    {"item_code":"440104","item_name":"越秀区"},
    {"item_code":"440105","item_name":"海珠区"},
    {"item_code":"440106","item_name":"天河区"},
    {"item_code":"440111","item_name":"白云区"},
    {"item_code":"440112","item_name":"黄埔区"},
    {"item_code":"440113","item_name":"番禺区"},
    {"item_code":"440114","item_name":"花都区"},
    {"item_code":"440115","item_name":"南沙区"},
    {"item_code":"440116","item_name":"萝岗区"},
    {"item_code":"440183","item_name":"增城市"},
    {"item_code":"440184","item_name":"从化市"},
    {"item_code":"440203","item_name":"武江区"},
    {"item_code":"440204","item_name":"浈江区"},
    {"item_code":"440205","item_name":"曲江区"},
    {"item_code":"440222","item_name":"始兴县"},
    {"item_code":"440224","item_name":"仁化县"},
    {"item_code":"440229","item_name":"翁源县"},
    {"item_code":"440232","item_name":"乳源瑶族自治县"},
    {"item_code":"440233","item_name":"新丰县"},
    {"item_code":"440281","item_name":"乐昌市"},
    {"item_code":"440282","item_name":"南雄市"},
    {"item_code":"440303","item_name":"罗湖区"},
    {"item_code":"440304","item_name":"福田区"},
    {"item_code":"440305","item_name":"南山区"},
    {"item_code":"440306","item_name":"宝安区"},
    {"item_code":"440307","item_name":"龙岗区"},
    {"item_code":"440308","item_name":"盐田区"},
    {"item_code":"440402","item_name":"香洲区"},
    {"item_code":"440403","item_name":"斗门区"},
    {"item_code":"440404","item_name":"金湾区"},
    {"item_code":"440507","item_name":"龙湖区"},
    {"item_code":"440511","item_name":"金平区"},
    {"item_code":"440512","item_name":"濠江区"},
    {"item_code":"440513","item_name":"潮阳区"},
    {"item_code":"440514","item_name":"潮南区"},
    {"item_code":"440515","item_name":"澄海区"},
    {"item_code":"440523","item_name":"南澳县"},
    {"item_code":"440604","item_name":"禅城区"},
    {"item_code":"440605","item_name":"南海区"},
    {"item_code":"440606","item_name":"顺德区"},
    {"item_code":"440607","item_name":"三水区"},
    {"item_code":"440608","item_name":"高明区"},
    {"item_code":"440703","item_name":"蓬江区"},
    {"item_code":"440704","item_name":"江海区"},
    {"item_code":"440705","item_name":"新会区"},
    {"item_code":"440781","item_name":"台山市"},
    {"item_code":"440783","item_name":"开平市"},
    {"item_code":"440784","item_name":"鹤山市"},
    {"item_code":"440785","item_name":"恩平市"},
    {"item_code":"440802","item_name":"赤坎区"},
    {"item_code":"440803","item_name":"霞山区"},
    {"item_code":"440804","item_name":"坡头区"},
    {"item_code":"440811","item_name":"麻章区"},
    {"item_code":"440823","item_name":"遂溪县"},
    {"item_code":"440825","item_name":"徐闻县"},
    {"item_code":"440881","item_name":"廉江市"},
    {"item_code":"440882","item_name":"雷州市"},
    {"item_code":"440883","item_name":"吴川市"},
    {"item_code":"440902","item_name":"茂南区"},
    {"item_code":"440903","item_name":"茂港区"},
    {"item_code":"440923","item_name":"电白县"},
    {"item_code":"440981","item_name":"高州市"},
    {"item_code":"440982","item_name":"化州市"},
    {"item_code":"440983","item_name":"信宜市"},
    {"item_code":"441202","item_name":"端州区"},
    {"item_code":"441203","item_name":"鼎湖区"},
    {"item_code":"441223","item_name":"广宁县"},
    {"item_code":"441224","item_name":"怀集县"},
    {"item_code":"441225","item_name":"封开县"},
    {"item_code":"441226","item_name":"德庆县"},
    {"item_code":"441283","item_name":"高要市"},
    {"item_code":"441284","item_name":"四会市"},
    {"item_code":"441302","item_name":"惠城区"},
    {"item_code":"441303","item_name":"惠阳区"},
    {"item_code":"441322","item_name":"博罗县"},
    {"item_code":"441323","item_name":"惠东县"},
    {"item_code":"441324","item_name":"龙门县"},
    {"item_code":"441402","item_name":"梅江区"},
    {"item_code":"441421","item_name":"梅县"},
    {"item_code":"441422","item_name":"大埔县"},
    {"item_code":"441423","item_name":"丰顺县"},
    {"item_code":"441424","item_name":"五华县"},
    {"item_code":"441426","item_name":"平远县"},
    {"item_code":"441427","item_name":"蕉岭县"},
    {"item_code":"441481","item_name":"兴宁市"},
    {"item_code":"441502","item_name":"城区"},
    {"item_code":"441521","item_name":"海丰县"},
    {"item_code":"441523","item_name":"陆河县"},
    {"item_code":"441581","item_name":"陆丰市"},
    {"item_code":"441602","item_name":"源城区"},
    {"item_code":"441621","item_name":"紫金县"},
    {"item_code":"441622","item_name":"龙川县"},
    {"item_code":"441623","item_name":"连平县"},
    {"item_code":"441624","item_name":"和平县"},
    {"item_code":"441625","item_name":"东源县"},
    {"item_code":"441702","item_name":"江城区"},
    {"item_code":"441721","item_name":"阳西县"},
    {"item_code":"441723","item_name":"阳东县"},
    {"item_code":"441781","item_name":"阳春市"},
    {"item_code":"441802","item_name":"清城区"},
    {"item_code":"441821","item_name":"佛冈县"},
    {"item_code":"441823","item_name":"阳山县"},
    {"item_code":"441825","item_name":"连山壮族瑶族自治县"},
    {"item_code":"441826","item_name":"连南瑶族自治县"},
    {"item_code":"441827","item_name":"清新县"},
    {"item_code":"441881","item_name":"英德市"},
    {"item_code":"441882","item_name":"连州市"},
    {"item_code":"445102","item_name":"湘桥区"},
    {"item_code":"445121","item_name":"潮安县"},
    {"item_code":"445122","item_name":"饶平县"},
    {"item_code":"445202","item_name":"榕城区"},
    {"item_code":"445221","item_name":"揭东县"},
    {"item_code":"445222","item_name":"揭西县"},
    {"item_code":"445224","item_name":"惠来县"},
    {"item_code":"445281","item_name":"普宁市"},
    {"item_code":"445302","item_name":"云城区"},
    {"item_code":"445321","item_name":"新兴县"},
    {"item_code":"445322","item_name":"郁南县"},
    {"item_code":"445323","item_name":"云安县"},
    {"item_code":"445381","item_name":"罗定市"},
    {"item_code":"450102","item_name":"兴宁区"},
    {"item_code":"450103","item_name":"青秀区"},
    {"item_code":"450105","item_name":"江南区"},
    {"item_code":"450107","item_name":"西乡塘区"},
    {"item_code":"450108","item_name":"良庆区"},
    {"item_code":"450109","item_name":"邕宁区"},
    {"item_code":"450122","item_name":"武鸣县"},
    {"item_code":"450123","item_name":"隆安县"},
    {"item_code":"450124","item_name":"马山县"},
    {"item_code":"450125","item_name":"上林县"},
    {"item_code":"450126","item_name":"宾阳县"},
    {"item_code":"450127","item_name":"横县"},
    {"item_code":"450202","item_name":"城中区"},
    {"item_code":"450203","item_name":"鱼峰区"},
    {"item_code":"450204","item_name":"柳南区"},
    {"item_code":"450205","item_name":"柳北区"},
    {"item_code":"450221","item_name":"柳江县"},
    {"item_code":"450222","item_name":"柳城县"},
    {"item_code":"450223","item_name":"鹿寨县"},
    {"item_code":"450224","item_name":"融安县"},
    {"item_code":"450225","item_name":"融水苗族自治县"},
    {"item_code":"450226","item_name":"三江侗族自治县"},
    {"item_code":"450302","item_name":"秀峰区"},
    {"item_code":"450303","item_name":"叠彩区"},
    {"item_code":"450304","item_name":"象山区"},
    {"item_code":"450305","item_name":"七星区"},
    {"item_code":"450311","item_name":"雁山区"},
    {"item_code":"450321","item_name":"阳朔县"},
    {"item_code":"450322","item_name":"临桂县"},
    {"item_code":"450323","item_name":"灵川县"},
    {"item_code":"450324","item_name":"全州县"},
    {"item_code":"450325","item_name":"兴安县"},
    {"item_code":"450326","item_name":"永福县"},
    {"item_code":"450327","item_name":"灌阳县"},
    {"item_code":"450328","item_name":"龙胜各族自治县"},
    {"item_code":"450329","item_name":"资源县"},
    {"item_code":"450330","item_name":"平乐县"},
    {"item_code":"450331","item_name":"荔蒲县"},
    {"item_code":"450332","item_name":"恭城瑶族自治县"},
    {"item_code":"450403","item_name":"万秀区"},
    {"item_code":"450404","item_name":"蝶山区"},
    {"item_code":"450405","item_name":"长洲区"},
    {"item_code":"450421","item_name":"苍梧县"},
    {"item_code":"450422","item_name":"藤县"},
    {"item_code":"450423","item_name":"蒙山县"},
    {"item_code":"450481","item_name":"岑溪市"},
    {"item_code":"450502","item_name":"海城区"},
    {"item_code":"450503","item_name":"银海区"},
    {"item_code":"450512","item_name":"铁山港区"},
    {"item_code":"450521","item_name":"合浦县"},
    {"item_code":"450602","item_name":"港口区"},
    {"item_code":"450603","item_name":"防城区"},
    {"item_code":"450621","item_name":"上思县"},
    {"item_code":"450681","item_name":"东兴市"},
    {"item_code":"450702","item_name":"钦南区"},
    {"item_code":"450703","item_name":"钦北区"},
    {"item_code":"450721","item_name":"灵山县"},
    {"item_code":"450722","item_name":"浦北县"},
    {"item_code":"450802","item_name":"港北区"},
    {"item_code":"450803","item_name":"港南区"},
    {"item_code":"450804","item_name":"覃塘区"},
    {"item_code":"450821","item_name":"平南县"},
    {"item_code":"450881","item_name":"桂平市"},
    {"item_code":"450902","item_name":"玉州区"},
    {"item_code":"450921","item_name":"容县"},
    {"item_code":"450922","item_name":"陆川县"},
    {"item_code":"450923","item_name":"博白县"},
    {"item_code":"450924","item_name":"兴业县"},
    {"item_code":"450981","item_name":"北流市"},
    {"item_code":"451002","item_name":"右江区"},
    {"item_code":"451021","item_name":"田阳县"},
    {"item_code":"451022","item_name":"田东县"},
    {"item_code":"451023","item_name":"平果县"},
    {"item_code":"451024","item_name":"德保县"},
    {"item_code":"451025","item_name":"靖西县"},
    {"item_code":"451026","item_name":"那坡县"},
    {"item_code":"451027","item_name":"凌云县"},
    {"item_code":"451028","item_name":"乐业县"},
    {"item_code":"451029","item_name":"田林县"},
    {"item_code":"451030","item_name":"西林县"},
    {"item_code":"451031","item_name":"隆林各族自治县"},
    {"item_code":"451102","item_name":"八步区"},
    {"item_code":"451121","item_name":"昭平县"},
    {"item_code":"451122","item_name":"钟山县"},
    {"item_code":"451123","item_name":"富川瑶族自治县"},
    {"item_code":"451202","item_name":"金城江区"},
    {"item_code":"451221","item_name":"南丹县"},
    {"item_code":"451222","item_name":"天峨县"},
    {"item_code":"451223","item_name":"凤山县"},
    {"item_code":"451224","item_name":"东兰县"},
    {"item_code":"451225","item_name":"罗城仫佬族自治县"},
    {"item_code":"451226","item_name":"环江毛南族自治县"},
    {"item_code":"451227","item_name":"巴马瑶族自治县"},
    {"item_code":"451228","item_name":"都安瑶族自治县"},
    {"item_code":"451229","item_name":"大化瑶族自治县"},
    {"item_code":"451281","item_name":"宜州市"},
    {"item_code":"451302","item_name":"兴宾区"},
    {"item_code":"451321","item_name":"忻城县"},
    {"item_code":"451322","item_name":"象州县"},
    {"item_code":"451323","item_name":"武宣县"},
    {"item_code":"451324","item_name":"金秀瑶族自治县"},
    {"item_code":"451381","item_name":"合山市"},
    {"item_code":"451402","item_name":"江洲区"},
    {"item_code":"451421","item_name":"扶绥县"},
    {"item_code":"451422","item_name":"宁明县"},
    {"item_code":"451423","item_name":"龙州县"},
    {"item_code":"451424","item_name":"大新县"},
    {"item_code":"451425","item_name":"天等县"},
    {"item_code":"451481","item_name":"凭祥市"},
    {"item_code":"460105","item_name":"秀英区"},
    {"item_code":"460106","item_name":"龙华区"},
    {"item_code":"460107","item_name":"琼山区"},
    {"item_code":"460108","item_name":"美兰区"},
    {"item_code":"469001","item_name":"五指山市"},
    {"item_code":"469002","item_name":"琼海市"},
    {"item_code":"469003","item_name":"儋州市"},
    {"item_code":"469005","item_name":"文昌市"},
    {"item_code":"469006","item_name":"万宁市"},
    {"item_code":"469007","item_name":"东方市"},
    {"item_code":"469021","item_name":"定安县"},
    {"item_code":"469022","item_name":"屯昌县"},
    {"item_code":"469023","item_name":"澄迈县"},
    {"item_code":"469024","item_name":"临高县"},
    {"item_code":"469025","item_name":"白沙黎族自治县"},
    {"item_code":"469026","item_name":"昌江黎族自治县"},
    {"item_code":"469027","item_name":"乐东黎族自治县"},
    {"item_code":"469028","item_name":"陵水黎族自治县"},
    {"item_code":"469029","item_name":"保亭黎族苗族自治县"},
    {"item_code":"469030","item_name":"琼中黎族苗族自治县"},
    {"item_code":"469031","item_name":"西沙群岛"},
    {"item_code":"469032","item_name":"南沙群岛"},
    {"item_code":"469033","item_name":"中沙群岛的岛礁及其海域"},
    {"item_code":"500101","item_name":"万州区"},
    {"item_code":"500102","item_name":"涪陵区"},
    {"item_code":"500103","item_name":"渝中区"},
    {"item_code":"500104","item_name":"大渡口区"},
    {"item_code":"500105","item_name":"江北区"},
    {"item_code":"500106","item_name":"沙坪坝区"},
    {"item_code":"500107","item_name":"九龙坡区"},
    {"item_code":"500108","item_name":"南岸区"},
    {"item_code":"500109","item_name":"北碚区"},
    {"item_code":"500110","item_name":"綦江区"},
    {"item_code":"500111","item_name":"大足区"},
    {"item_code":"500112","item_name":"渝北区"},
    {"item_code":"500113","item_name":"巴南区"},
    {"item_code":"500114","item_name":"黔江区"},
    {"item_code":"500115","item_name":"长寿区"},
    {"item_code":"500116","item_name":"江津区"},
    {"item_code":"500117","item_name":"合川区"},
    {"item_code":"500118","item_name":"永川区"},
    {"item_code":"500119","item_name":"南川区"},
    {"item_code":"500223","item_name":"潼南县"},
    {"item_code":"500224","item_name":"铜梁县"},
    {"item_code":"500226","item_name":"荣昌县"},
    {"item_code":"500227","item_name":"璧山县"},
    {"item_code":"500228","item_name":"梁平县"},
    {"item_code":"500229","item_name":"城口县"},
    {"item_code":"500230","item_name":"丰都县"},
    {"item_code":"500231","item_name":"垫江县"},
    {"item_code":"500232","item_name":"武隆县"},
    {"item_code":"500233","item_name":"忠县"},
    {"item_code":"500234","item_name":"开县"},
    {"item_code":"500235","item_name":"云阳县"},
    {"item_code":"500236","item_name":"奉节县"},
    {"item_code":"500237","item_name":"巫山县"},
    {"item_code":"500238","item_name":"巫溪县"},
    {"item_code":"500240","item_name":"石柱土家族自治县"},
    {"item_code":"500241","item_name":"秀山土家族苗族自治县"},
    {"item_code":"500242","item_name":"酉阳土家族苗族自治县"},
    {"item_code":"500243","item_name":"彭水苗族土家族自治县"},
    {"item_code":"510104","item_name":"锦江区"},
    {"item_code":"510105","item_name":"青羊区"},
    {"item_code":"510106","item_name":"金牛区"},
    {"item_code":"510107","item_name":"武侯区"},
    {"item_code":"510108","item_name":"成华区"},
    {"item_code":"510112","item_name":"龙泉驿区"},
    {"item_code":"510113","item_name":"青白江区"},
    {"item_code":"510114","item_name":"新都区"},
    {"item_code":"510115","item_name":"温江区"},
    {"item_code":"510121","item_name":"金堂县"},
    {"item_code":"510122","item_name":"双流县"},
    {"item_code":"510124","item_name":"郫县"},
    {"item_code":"510129","item_name":"大邑县"},
    {"item_code":"510131","item_name":"蒲江县"},
    {"item_code":"510132","item_name":"新津县"},
    {"item_code":"510181","item_name":"都江堰市"},
    {"item_code":"510182","item_name":"彭州市"},
    {"item_code":"510183","item_name":"邛崃市"},
    {"item_code":"510184","item_name":"崇州市"},
    {"item_code":"510302","item_name":"自流井区"},
    {"item_code":"510303","item_name":"贡井区"},
    {"item_code":"510304","item_name":"大安区"},
    {"item_code":"510311","item_name":"沿滩区"},
    {"item_code":"510321","item_name":"荣县"},
    {"item_code":"510322","item_name":"富顺县"},
    {"item_code":"510402","item_name":"东区"},
    {"item_code":"510403","item_name":"西区"},
    {"item_code":"510411","item_name":"仁和区"},
    {"item_code":"510421","item_name":"米易县"},
    {"item_code":"510422","item_name":"盐边县"},
    {"item_code":"510502","item_name":"江阳区"},
    {"item_code":"510503","item_name":"纳溪区"},
    {"item_code":"510504","item_name":"龙马潭区"},
    {"item_code":"510521","item_name":"泸县"},
    {"item_code":"510522","item_name":"合江县"},
    {"item_code":"510524","item_name":"叙永县"},
    {"item_code":"510525","item_name":"古蔺县"},
    {"item_code":"510603","item_name":"旌阳区"},
    {"item_code":"510623","item_name":"中江县"},
    {"item_code":"510626","item_name":"罗江县"},
    {"item_code":"510681","item_name":"广汉市"},
    {"item_code":"510682","item_name":"什邡市"},
    {"item_code":"510683","item_name":"绵竹市"},
    {"item_code":"510703","item_name":"涪城区"},
    {"item_code":"510704","item_name":"游仙区"},
    {"item_code":"510722","item_name":"三台县"},
    {"item_code":"510723","item_name":"盐亭县"},
    {"item_code":"510724","item_name":"安县"},
    {"item_code":"510725","item_name":"梓潼县"},
    {"item_code":"510726","item_name":"北川羌族自治县"},
    {"item_code":"510727","item_name":"平武县"},
    {"item_code":"510781","item_name":"江油市"},
    {"item_code":"510802","item_name":"利州区"},
    {"item_code":"510811","item_name":"元坝区"},
    {"item_code":"510812","item_name":"朝天区"},
    {"item_code":"510821","item_name":"旺苍县"},
    {"item_code":"510822","item_name":"青川县"},
    {"item_code":"510823","item_name":"剑阁县"},
    {"item_code":"510824","item_name":"苍溪县"},
    {"item_code":"510903","item_name":"船山区"},
    {"item_code":"510904","item_name":"安居区"},
    {"item_code":"510921","item_name":"蓬溪县"},
    {"item_code":"510922","item_name":"射洪县"},
    {"item_code":"510923","item_name":"大英县"},
    {"item_code":"511002","item_name":"市中区"},
    {"item_code":"511011","item_name":"东兴区"},
    {"item_code":"511024","item_name":"威远县"},
    {"item_code":"511025","item_name":"资中县"},
    {"item_code":"511028","item_name":"隆昌县"},
    {"item_code":"511102","item_name":"市中区"},
    {"item_code":"511111","item_name":"沙湾区"},
    {"item_code":"511112","item_name":"五通桥区"},
    {"item_code":"511113","item_name":"金口河区"},
    {"item_code":"511123","item_name":"犍为县"},
    {"item_code":"511124","item_name":"井研县"},
    {"item_code":"511126","item_name":"夹江县"},
    {"item_code":"511129","item_name":"沐川县"},
    {"item_code":"511132","item_name":"峨边彝族自治县"},
    {"item_code":"511133","item_name":"马边彝族自治县"},
    {"item_code":"511181","item_name":"峨眉山市"},
    {"item_code":"511302","item_name":"顺庆区"},
    {"item_code":"511303","item_name":"高坪区"},
    {"item_code":"511304","item_name":"嘉陵区"},
    {"item_code":"511321","item_name":"南部县"},
    {"item_code":"511322","item_name":"营山县"},
    {"item_code":"511323","item_name":"蓬安县"},
    {"item_code":"511324","item_name":"仪陇县"},
    {"item_code":"511325","item_name":"西充县"},
    {"item_code":"511381","item_name":"阆中市"},
    {"item_code":"511402","item_name":"东坡区"},
    {"item_code":"511421","item_name":"仁寿县"},
    {"item_code":"511422","item_name":"彭山县"},
    {"item_code":"511423","item_name":"洪雅县"},
    {"item_code":"511424","item_name":"丹棱县"},
    {"item_code":"511425","item_name":"青神县"},
    {"item_code":"511502","item_name":"翠屏区"},
    {"item_code":"511503","item_name":"南溪区"},
    {"item_code":"511521","item_name":"宜宾县"},
    {"item_code":"511523","item_name":"江安县"},
    {"item_code":"511524","item_name":"长宁县"},
    {"item_code":"511525","item_name":"高县"},
    {"item_code":"511526","item_name":"珙县"},
    {"item_code":"511527","item_name":"筠连县"},
    {"item_code":"511528","item_name":"兴文县"},
    {"item_code":"511529","item_name":"屏山县"},
    {"item_code":"511602","item_name":"广安区"},
    {"item_code":"511621","item_name":"岳池县"},
    {"item_code":"511622","item_name":"武胜县"},
    {"item_code":"511623","item_name":"邻水县"},
    {"item_code":"511681","item_name":"华蓥市"},
    {"item_code":"511702","item_name":"通川区"},
    {"item_code":"511721","item_name":"达县"},
    {"item_code":"511722","item_name":"宣汉县"},
    {"item_code":"511723","item_name":"开江县"},
    {"item_code":"511724","item_name":"大竹县"},
    {"item_code":"511725","item_name":"渠县"},
    {"item_code":"511781","item_name":"万源市"},
    {"item_code":"511802","item_name":"雨城区"},
    {"item_code":"511821","item_name":"名山县"},
    {"item_code":"511822","item_name":"荥经县"},
    {"item_code":"511823","item_name":"汉源县"},
    {"item_code":"511824","item_name":"石棉县"},
    {"item_code":"511825","item_name":"天全县"},
    {"item_code":"511826","item_name":"芦山县"},
    {"item_code":"511827","item_name":"宝兴县"},
    {"item_code":"511902","item_name":"巴州区"},
    {"item_code":"511921","item_name":"通江县"},
    {"item_code":"511922","item_name":"南江县"},
    {"item_code":"511923","item_name":"平昌县"},
    {"item_code":"512002","item_name":"雁江区"},
    {"item_code":"512021","item_name":"安岳县"},
    {"item_code":"512022","item_name":"乐至县"},
    {"item_code":"512081","item_name":"简阳市"},
    {"item_code":"513221","item_name":"汶川县"},
    {"item_code":"513222","item_name":"理县"},
    {"item_code":"513223","item_name":"茂县"},
    {"item_code":"513224","item_name":"松潘县"},
    {"item_code":"513225","item_name":"九寨沟县"},
    {"item_code":"513226","item_name":"金川县"},
    {"item_code":"513227","item_name":"小金县"},
    {"item_code":"513228","item_name":"黑水县"},
    {"item_code":"513229","item_name":"马尔康县"},
    {"item_code":"513230","item_name":"壤塘县"},
    {"item_code":"513231","item_name":"阿坝县"},
    {"item_code":"513232","item_name":"若尔盖县"},
    {"item_code":"513233","item_name":"红原县"},
    {"item_code":"513321","item_name":"康定县"},
    {"item_code":"513322","item_name":"泸定县"},
    {"item_code":"513323","item_name":"丹巴县"},
    {"item_code":"513324","item_name":"九龙县"},
    {"item_code":"513325","item_name":"雅江县"},
    {"item_code":"513326","item_name":"道孚县"},
    {"item_code":"513327","item_name":"炉霍县"},
    {"item_code":"513328","item_name":"甘孜县"},
    {"item_code":"513329","item_name":"新龙县"},
    {"item_code":"513330","item_name":"德格县"},
    {"item_code":"513331","item_name":"白玉县"},
    {"item_code":"513332","item_name":"石渠县"},
    {"item_code":"513333","item_name":"色达县"},
    {"item_code":"513334","item_name":"理塘县"},
    {"item_code":"513335","item_name":"巴塘县"},
    {"item_code":"513336","item_name":"乡城县"},
    {"item_code":"513337","item_name":"稻城县"},
    {"item_code":"513338","item_name":"得荣县"},
    {"item_code":"513401","item_name":"西昌市"},
    {"item_code":"513422","item_name":"木里藏族自治县"},
    {"item_code":"513423","item_name":"盐源县"},
    {"item_code":"513424","item_name":"德昌县"},
    {"item_code":"513425","item_name":"会理县"},
    {"item_code":"513426","item_name":"会东县"},
    {"item_code":"513427","item_name":"宁南县"},
    {"item_code":"513428","item_name":"普格县"},
    {"item_code":"513429","item_name":"布拖县"},
    {"item_code":"513430","item_name":"金阳县"},
    {"item_code":"513431","item_name":"昭觉县"},
    {"item_code":"513432","item_name":"喜德县"},
    {"item_code":"513433","item_name":"冕宁县"},
    {"item_code":"513434","item_name":"越西县"},
    {"item_code":"513435","item_name":"甘洛县"},
    {"item_code":"513436","item_name":"美姑县"},
    {"item_code":"513437","item_name":"雷波县"},
    {"item_code":"520102","item_name":"南明区"},
    {"item_code":"520103","item_name":"云岩区"},
    {"item_code":"520111","item_name":"花溪区"},
    {"item_code":"520112","item_name":"乌当区"},
    {"item_code":"520113","item_name":"白云区"},
    {"item_code":"520114","item_name":"小河区"},
    {"item_code":"520121","item_name":"开阳县"},
    {"item_code":"520122","item_name":"息烽县"},
    {"item_code":"520123","item_name":"修文县"},
    {"item_code":"520181","item_name":"清镇市"},
    {"item_code":"520201","item_name":"钟山区"},
    {"item_code":"520203","item_name":"六枝特区"},
    {"item_code":"520221","item_name":"水城县"},
    {"item_code":"520222","item_name":"盘县"},
    {"item_code":"520302","item_name":"红花岗区"},
    {"item_code":"520303","item_name":"汇川区"},
    {"item_code":"520321","item_name":"遵义县"},
    {"item_code":"520322","item_name":"桐梓县"},
    {"item_code":"520323","item_name":"绥阳县"},
    {"item_code":"520324","item_name":"正安县"},
    {"item_code":"520325","item_name":"道真仡佬族苗族自治县"},
    {"item_code":"520326","item_name":"务川仡佬族苗族自治县"},
    {"item_code":"520327","item_name":"凤冈县"},
    {"item_code":"520328","item_name":"湄潭县"},
    {"item_code":"520329","item_name":"余庆县"},
    {"item_code":"520330","item_name":"习水县"},
    {"item_code":"520381","item_name":"赤水市"},
    {"item_code":"520382","item_name":"仁怀市"},
    {"item_code":"520402","item_name":"西秀区"},
    {"item_code":"520421","item_name":"平坝县"},
    {"item_code":"520422","item_name":"普定县"},
    {"item_code":"520423","item_name":"镇宁布依族苗族自治县"},
    {"item_code":"520424","item_name":"关岭布依族苗族自治县"},
    {"item_code":"520425","item_name":"紫云苗族布依族自治县"},
    {"item_code":"520502","item_name":"七星关区"},
    {"item_code":"520521","item_name":"大方县"},
    {"item_code":"520522","item_name":"黔西县"},
    {"item_code":"520523","item_name":"金沙县"},
    {"item_code":"520524","item_name":"织金县"},
    {"item_code":"520525","item_name":"纳雍县"},
    {"item_code":"520526","item_name":"威宁彝族回族苗族自治县"},
    {"item_code":"520527","item_name":"赫章县"},
    {"item_code":"520602","item_name":"碧江区"},
    {"item_code":"520603","item_name":"万山区"},
    {"item_code":"520621","item_name":"江口县"},
    {"item_code":"520622","item_name":"玉屏侗族自治县"},
    {"item_code":"520623","item_name":"石阡县"},
    {"item_code":"520624","item_name":"思南县"},
    {"item_code":"520625","item_name":"印江土家族苗族自治县"},
    {"item_code":"520626","item_name":"德江县"},
    {"item_code":"520627","item_name":"沿河土家族自治县"},
    {"item_code":"520628","item_name":"松桃苗族自治县"},
    {"item_code":"522301","item_name":"兴义市"},
    {"item_code":"522322","item_name":"兴仁县"},
    {"item_code":"522323","item_name":"普安县"},
    {"item_code":"522324","item_name":"晴隆县"},
    {"item_code":"522325","item_name":"贞丰县"},
    {"item_code":"522326","item_name":"望谟县"},
    {"item_code":"522327","item_name":"册亨县"},
    {"item_code":"522328","item_name":"安龙县"},
    {"item_code":"522601","item_name":"凯里市"},
    {"item_code":"522622","item_name":"黄平县"},
    {"item_code":"522623","item_name":"施秉县"},
    {"item_code":"522624","item_name":"三穗县"},
    {"item_code":"522625","item_name":"镇远县"},
    {"item_code":"522626","item_name":"岑巩县"},
    {"item_code":"522627","item_name":"天柱县"},
    {"item_code":"522628","item_name":"锦屏县"},
    {"item_code":"522629","item_name":"剑河县"},
    {"item_code":"522630","item_name":"台江县"},
    {"item_code":"522631","item_name":"黎平县"},
    {"item_code":"522632","item_name":"榕江县"},
    {"item_code":"522633","item_name":"从江县"},
    {"item_code":"522634","item_name":"雷山县"},
    {"item_code":"522635","item_name":"麻江县"},
    {"item_code":"522636","item_name":"丹寨县"},
    {"item_code":"522701","item_name":"都匀市"},
    {"item_code":"522702","item_name":"福泉市"},
    {"item_code":"522722","item_name":"荔波县"},
    {"item_code":"522723","item_name":"贵定县"},
    {"item_code":"522725","item_name":"瓮安县"},
    {"item_code":"522726","item_name":"独山县"},
    {"item_code":"522727","item_name":"平塘县"},
    {"item_code":"522728","item_name":"罗甸县"},
    {"item_code":"522729","item_name":"长顺县"},
    {"item_code":"522730","item_name":"龙里县"},
    {"item_code":"522731","item_name":"惠水县"},
    {"item_code":"522732","item_name":"三都水族自治县"},
    {"item_code":"530102","item_name":"五华区"},
    {"item_code":"530103","item_name":"盘龙区"},
    {"item_code":"530111","item_name":"官渡区"},
    {"item_code":"530112","item_name":"西山区"},
    {"item_code":"530113","item_name":"东川区"},
    {"item_code":"530114","item_name":"呈贡区"},
    {"item_code":"530122","item_name":"晋宁县"},
    {"item_code":"530124","item_name":"富民县"},
    {"item_code":"530125","item_name":"宜良县"},
    {"item_code":"530126","item_name":"石林彝族自治县"},
    {"item_code":"530127","item_name":"嵩明县"},
    {"item_code":"530128","item_name":"禄劝彝族苗族自治县"},
    {"item_code":"530129","item_name":"寻甸回族彝族自治县"},
    {"item_code":"530181","item_name":"安宁市"},
    {"item_code":"530302","item_name":"麒麟区"},
    {"item_code":"530321","item_name":"马龙县"},
    {"item_code":"530322","item_name":"陆良县"},
    {"item_code":"530323","item_name":"师宗县"},
    {"item_code":"530324","item_name":"罗平县"},
    {"item_code":"530325","item_name":"富源县"},
    {"item_code":"530326","item_name":"会泽县"},
    {"item_code":"530328","item_name":"沾益县"},
    {"item_code":"530381","item_name":"宣威市"},
    {"item_code":"530402","item_name":"红塔区"},
    {"item_code":"530421","item_name":"江川县"},
    {"item_code":"530422","item_name":"澄江县"},
    {"item_code":"530423","item_name":"通海县"},
    {"item_code":"530424","item_name":"华宁县"},
    {"item_code":"530425","item_name":"易门县"},
    {"item_code":"530426","item_name":"峨山彝族自治县"},
    {"item_code":"530427","item_name":"新平彝族傣族自治县"},
    {"item_code":"530428","item_name":"元江哈尼族彝族傣族自治县"},
    {"item_code":"530502","item_name":"隆阳区"},
    {"item_code":"530521","item_name":"施甸县"},
    {"item_code":"530522","item_name":"腾冲县"},
    {"item_code":"530523","item_name":"龙陵县"},
    {"item_code":"530524","item_name":"昌宁县"},
    {"item_code":"530602","item_name":"昭阳区"},
    {"item_code":"530621","item_name":"鲁甸县"},
    {"item_code":"530622","item_name":"巧家县"},
    {"item_code":"530623","item_name":"盐津县"},
    {"item_code":"530624","item_name":"大关县"},
    {"item_code":"530625","item_name":"永善县"},
    {"item_code":"530626","item_name":"绥江县"},
    {"item_code":"530627","item_name":"镇雄县"},
    {"item_code":"530628","item_name":"彝良县"},
    {"item_code":"530629","item_name":"威信县"},
    {"item_code":"530630","item_name":"水富县"},
    {"item_code":"530702","item_name":"古城区"},
    {"item_code":"530721","item_name":"玉龙纳西族自治县"},
    {"item_code":"530722","item_name":"永胜县"},
    {"item_code":"530723","item_name":"华坪县"},
    {"item_code":"530724","item_name":"宁蒗彝族自治县"},
    {"item_code":"530802","item_name":"思茅区"},
    {"item_code":"530821","item_name":"宁洱哈尼族彝族自治县"},
    {"item_code":"530822","item_name":"墨江哈尼族自治县"},
    {"item_code":"530823","item_name":"景东彝族自治县"},
    {"item_code":"530824","item_name":"景谷傣族彝族自治县"},
    {"item_code":"530825","item_name":"镇沅彝族哈尼族拉祜族自治县"},
    {"item_code":"530826","item_name":"江城哈尼族彝族自治县"},
    {"item_code":"530827","item_name":"孟连傣族拉祜族佤族自治县"},
    {"item_code":"530828","item_name":"澜沧拉祜族自治县"},
    {"item_code":"530829","item_name":"西盟佤族自治县"},
    {"item_code":"530902","item_name":"临翔区"},
    {"item_code":"530921","item_name":"凤庆县"},
    {"item_code":"530922","item_name":"云县"},
    {"item_code":"530923","item_name":"永德县"},
    {"item_code":"530924","item_name":"镇康县"},
    {"item_code":"530925","item_name":"双江拉祜族佤族布朗族傣族自治县"},
    {"item_code":"530926","item_name":"耿马傣族佤族自治县"},
    {"item_code":"530927","item_name":"沧源佤族自治县"},
    {"item_code":"532301","item_name":"楚雄市"},
    {"item_code":"532322","item_name":"双柏县"},
    {"item_code":"532323","item_name":"牟定县"},
    {"item_code":"532324","item_name":"南华县"},
    {"item_code":"532325","item_name":"姚安县"},
    {"item_code":"532326","item_name":"大姚县"},
    {"item_code":"532327","item_name":"永仁县"},
    {"item_code":"532328","item_name":"元谋县"},
    {"item_code":"532329","item_name":"武定县"},
    {"item_code":"532331","item_name":"禄丰县"},
    {"item_code":"532501","item_name":"个旧市"},
    {"item_code":"532502","item_name":"开远市"},
    {"item_code":"532503","item_name":"蒙自市"},
    {"item_code":"532523","item_name":"屏边苗族自治县"},
    {"item_code":"532524","item_name":"建水县"},
    {"item_code":"532525","item_name":"石屏县"},
    {"item_code":"532526","item_name":"弥勒县"},
    {"item_code":"532527","item_name":"泸西县"},
    {"item_code":"532528","item_name":"元阳县"},
    {"item_code":"532529","item_name":"红河县"},
    {"item_code":"532530","item_name":"金平苗族瑶族傣族自治县"},
    {"item_code":"532531","item_name":"绿春县"},
    {"item_code":"532532","item_name":"河口瑶族自治县"},
    {"item_code":"532601","item_name":"文山市"},
    {"item_code":"532622","item_name":"砚山县"},
    {"item_code":"532623","item_name":"西畴县"},
    {"item_code":"532624","item_name":"麻栗坡县"},
    {"item_code":"532625","item_name":"马关县"},
    {"item_code":"532626","item_name":"丘北县"},
    {"item_code":"532627","item_name":"广南县"},
    {"item_code":"532628","item_name":"富宁县"},
    {"item_code":"532801","item_name":"景洪市"},
    {"item_code":"532822","item_name":"勐海县"},
    {"item_code":"532823","item_name":"勐腊县"},
    {"item_code":"532901","item_name":"大理市"},
    {"item_code":"532922","item_name":"漾濞彝族自治县"},
    {"item_code":"532923","item_name":"祥云县"},
    {"item_code":"532924","item_name":"宾川县"},
    {"item_code":"532925","item_name":"弥渡县"},
    {"item_code":"532926","item_name":"南涧彝族自治县"},
    {"item_code":"532927","item_name":"巍山彝族回族自治县"},
    {"item_code":"532928","item_name":"永平县"},
    {"item_code":"532929","item_name":"云龙县"},
    {"item_code":"532930","item_name":"洱源县"},
    {"item_code":"532931","item_name":"剑川县"},
    {"item_code":"532932","item_name":"鹤庆县"},
    {"item_code":"533102","item_name":"瑞丽市"},
    {"item_code":"533103","item_name":"芒市"},
    {"item_code":"533122","item_name":"梁河县"},
    {"item_code":"533123","item_name":"盈江县"},
    {"item_code":"533124","item_name":"陇川县"},
    {"item_code":"533321","item_name":"泸水县"},
    {"item_code":"533323","item_name":"福贡县"},
    {"item_code":"533324","item_name":"贡山独龙族怒族自治县"},
    {"item_code":"533325","item_name":"兰坪白族普米族自治县"},
    {"item_code":"533421","item_name":"香格里拉县"},
    {"item_code":"533422","item_name":"德钦县"},
    {"item_code":"533423","item_name":"维西傈僳族自治县"},
    {"item_code":"540102","item_name":"城关区"},
    {"item_code":"540121","item_name":"林周县"},
    {"item_code":"540122","item_name":"当雄县"},
    {"item_code":"540123","item_name":"尼木县"},
    {"item_code":"540124","item_name":"曲水县"},
    {"item_code":"540125","item_name":"堆龙德庆县"},
    {"item_code":"540126","item_name":"达孜县"},
    {"item_code":"540127","item_name":"墨竹工卡县"},
    {"item_code":"542121","item_name":"昌都县"},
    {"item_code":"542122","item_name":"江达县"},
    {"item_code":"542123","item_name":"贡觉县"},
    {"item_code":"542124","item_name":"类乌齐县"},
    {"item_code":"542125","item_name":"丁青县"},
    {"item_code":"542126","item_name":"察雅县"},
    {"item_code":"542127","item_name":"八宿县"},
    {"item_code":"542128","item_name":"左贡县"},
    {"item_code":"542129","item_name":"芒康县"},
    {"item_code":"542132","item_name":"洛隆县"},
    {"item_code":"542133","item_name":"边坝县"},
    {"item_code":"542221","item_name":"乃东县"},
    {"item_code":"542222","item_name":"扎囊县"},
    {"item_code":"542223","item_name":"贡嘎县"},
    {"item_code":"542224","item_name":"桑日县"},
    {"item_code":"542225","item_name":"琼结县"},
    {"item_code":"542226","item_name":"曲松县"},
    {"item_code":"542227","item_name":"措美县"},
    {"item_code":"542228","item_name":"洛扎县"},
    {"item_code":"542229","item_name":"加查县"},
    {"item_code":"542231","item_name":"隆子县"},
    {"item_code":"542232","item_name":"错那县"},
    {"item_code":"542233","item_name":"浪卡子县"},
    {"item_code":"542301","item_name":"日喀则市"},
    {"item_code":"542322","item_name":"南木林县"},
    {"item_code":"542323","item_name":"江孜县"},
    {"item_code":"542324","item_name":"定日县"},
    {"item_code":"542325","item_name":"萨迦县"},
    {"item_code":"542326","item_name":"拉孜县"},
    {"item_code":"542327","item_name":"昂仁县"},
    {"item_code":"542328","item_name":"谢通门县"},
    {"item_code":"542329","item_name":"白朗县"},
    {"item_code":"542330","item_name":"仁布县"},
    {"item_code":"542331","item_name":"康马县"},
    {"item_code":"542332","item_name":"定结县"},
    {"item_code":"542333","item_name":"仲巴县"},
    {"item_code":"542334","item_name":"亚东县"},
    {"item_code":"542335","item_name":"吉隆县"},
    {"item_code":"542336","item_name":"聂拉木县"},
    {"item_code":"542337","item_name":"萨嘎县"},
    {"item_code":"542338","item_name":"岗巴县"},
    {"item_code":"542421","item_name":"那曲县"},
    {"item_code":"542422","item_name":"嘉黎县"},
    {"item_code":"542423","item_name":"比如县"},
    {"item_code":"542424","item_name":"聂荣县"},
    {"item_code":"542425","item_name":"安多县"},
    {"item_code":"542426","item_name":"申扎县"},
    {"item_code":"542427","item_name":"索县"},
    {"item_code":"542428","item_name":"班戈县"},
    {"item_code":"542429","item_name":"巴青县"},
    {"item_code":"542430","item_name":"尼玛县"},
    {"item_code":"542521","item_name":"普兰县"},
    {"item_code":"542522","item_name":"札达县"},
    {"item_code":"542523","item_name":"噶尔县"},
    {"item_code":"542524","item_name":"日土县"},
    {"item_code":"542525","item_name":"革吉县"},
    {"item_code":"542526","item_name":"改则县"},
    {"item_code":"542527","item_name":"措勤县"},
    {"item_code":"542621","item_name":"林芝县"},
    {"item_code":"542622","item_name":"工布江达县"},
    {"item_code":"542623","item_name":"米林县"},
    {"item_code":"542624","item_name":"墨脱县"},
    {"item_code":"542625","item_name":"波密县"},
    {"item_code":"542626","item_name":"察隅县"},
    {"item_code":"542627","item_name":"朗县"},
    {"item_code":"610102","item_name":"新城区"},
    {"item_code":"610103","item_name":"碑林区"},
    {"item_code":"610104","item_name":"莲湖区"},
    {"item_code":"610111","item_name":"灞桥区"},
    {"item_code":"610112","item_name":"未央区"},
    {"item_code":"610113","item_name":"雁塔区"},
    {"item_code":"610114","item_name":"阎良区"},
    {"item_code":"610115","item_name":"临潼区"},
    {"item_code":"610116","item_name":"长安区"},
    {"item_code":"610122","item_name":"蓝田县"},
    {"item_code":"610124","item_name":"周至县"},
    {"item_code":"610125","item_name":"户县"},
    {"item_code":"610126","item_name":"高陵县"},
    {"item_code":"610202","item_name":"王益区"},
    {"item_code":"610203","item_name":"印台区"},
    {"item_code":"610204","item_name":"耀州区"},
    {"item_code":"610222","item_name":"宜君县"},
    {"item_code":"610302","item_name":"渭滨区"},
    {"item_code":"610303","item_name":"金台区"},
    {"item_code":"610304","item_name":"陈仓区"},
    {"item_code":"610322","item_name":"凤翔县"},
    {"item_code":"610323","item_name":"岐山县"},
    {"item_code":"610324","item_name":"扶风县"},
    {"item_code":"610326","item_name":"眉县"},
    {"item_code":"610327","item_name":"陇县"},
    {"item_code":"610328","item_name":"千阳县"},
    {"item_code":"610329","item_name":"麟游县"},
    {"item_code":"610330","item_name":"凤县"},
    {"item_code":"610331","item_name":"太白县"},
    {"item_code":"610402","item_name":"秦都区"},
    {"item_code":"610403","item_name":"杨陵区"},
    {"item_code":"610404","item_name":"渭城区"},
    {"item_code":"610422","item_name":"三原县"},
    {"item_code":"610423","item_name":"泾阳县"},
    {"item_code":"610424","item_name":"乾县"},
    {"item_code":"610425","item_name":"礼泉县"},
    {"item_code":"610426","item_name":"永寿县"},
    {"item_code":"610427","item_name":"彬县"},
    {"item_code":"610428","item_name":"长武县"},
    {"item_code":"610429","item_name":"旬邑县"},
    {"item_code":"610430","item_name":"淳化县"},
    {"item_code":"610431","item_name":"武功县"},
    {"item_code":"610481","item_name":"兴平市"},
    {"item_code":"610502","item_name":"临渭区"},
    {"item_code":"610521","item_name":"华县"},
    {"item_code":"610522","item_name":"潼关县"},
    {"item_code":"610523","item_name":"大荔县"},
    {"item_code":"610524","item_name":"合阳县"},
    {"item_code":"610525","item_name":"澄城县"},
    {"item_code":"610526","item_name":"蒲城县"},
    {"item_code":"610527","item_name":"白水县"},
    {"item_code":"610528","item_name":"富平县"},
    {"item_code":"610581","item_name":"韩城市"},
    {"item_code":"610582","item_name":"华阴市"},
    {"item_code":"610602","item_name":"宝塔区"},
    {"item_code":"610621","item_name":"延长县"},
    {"item_code":"610622","item_name":"延川县"},
    {"item_code":"610623","item_name":"子长县"},
    {"item_code":"610624","item_name":"安塞县"},
    {"item_code":"610625","item_name":"志丹县"},
    {"item_code":"610626","item_name":"吴起县"},
    {"item_code":"610627","item_name":"甘泉县"},
    {"item_code":"610628","item_name":"富县"},
    {"item_code":"610629","item_name":"洛川县"},
    {"item_code":"610630","item_name":"宜川县"},
    {"item_code":"610631","item_name":"黄龙县"},
    {"item_code":"610632","item_name":"黄陵县"},
    {"item_code":"610702","item_name":"汉台区"},
    {"item_code":"610721","item_name":"南郑县"},
    {"item_code":"610722","item_name":"城固县"},
    {"item_code":"610723","item_name":"洋县"},
    {"item_code":"610724","item_name":"西乡县"},
    {"item_code":"610725","item_name":"勉县"},
    {"item_code":"610726","item_name":"宁强县"},
    {"item_code":"610727","item_name":"略阳县"},
    {"item_code":"610728","item_name":"镇巴县"},
    {"item_code":"610729","item_name":"留坝县"},
    {"item_code":"610730","item_name":"佛坪县"},
    {"item_code":"610802","item_name":"榆阳区"},
    {"item_code":"610821","item_name":"神木县"},
    {"item_code":"610822","item_name":"府谷县"},
    {"item_code":"610823","item_name":"横山县"},
    {"item_code":"610824","item_name":"靖边县"},
    {"item_code":"610825","item_name":"定边县"},
    {"item_code":"610826","item_name":"绥德县"},
    {"item_code":"610827","item_name":"米脂县"},
    {"item_code":"610828","item_name":"佳县"},
    {"item_code":"610829","item_name":"吴堡县"},
    {"item_code":"610830","item_name":"清涧县"},
    {"item_code":"610831","item_name":"子洲县"},
    {"item_code":"610902","item_name":"汉滨区"},
    {"item_code":"610921","item_name":"汉阴县"},
    {"item_code":"610922","item_name":"石泉县"},
    {"item_code":"610923","item_name":"宁陕县"},
    {"item_code":"610924","item_name":"紫阳县"},
    {"item_code":"610925","item_name":"岚皋县"},
    {"item_code":"610926","item_name":"平利县"},
    {"item_code":"610927","item_name":"镇坪县"},
    {"item_code":"610928","item_name":"旬阳县"},
    {"item_code":"610929","item_name":"白河县"},
    {"item_code":"611002","item_name":"商州区"},
    {"item_code":"611021","item_name":"洛南县"},
    {"item_code":"611022","item_name":"丹凤县"},
    {"item_code":"611023","item_name":"商南县"},
    {"item_code":"611024","item_name":"山阳县"},
    {"item_code":"611025","item_name":"镇安县"},
    {"item_code":"611026","item_name":"柞水县"},
    {"item_code":"620102","item_name":"城关区"},
    {"item_code":"620103","item_name":"七里河区"},
    {"item_code":"620104","item_name":"西固区"},
    {"item_code":"620105","item_name":"安宁区"},
    {"item_code":"620111","item_name":"红古区"},
    {"item_code":"620121","item_name":"永登县"},
    {"item_code":"620122","item_name":"皋兰县"},
    {"item_code":"620123","item_name":"榆中县"},
    {"item_code":"620302","item_name":"金川区"},
    {"item_code":"620321","item_name":"永昌县"},
    {"item_code":"620402","item_name":"白银区"},
    {"item_code":"620403","item_name":"平川区"},
    {"item_code":"620421","item_name":"靖远县"},
    {"item_code":"620422","item_name":"会宁县"},
    {"item_code":"620423","item_name":"景泰县"},
    {"item_code":"620502","item_name":"秦州区"},
    {"item_code":"620503","item_name":"麦积区"},
    {"item_code":"620521","item_name":"清水县"},
    {"item_code":"620522","item_name":"秦安县"},
    {"item_code":"620523","item_name":"甘谷县"},
    {"item_code":"620524","item_name":"武山县"},
    {"item_code":"620525","item_name":"张家川回族自治县"},
    {"item_code":"620602","item_name":"凉州区"},
    {"item_code":"620621","item_name":"民勤县"},
    {"item_code":"620622","item_name":"古浪县"},
    {"item_code":"620623","item_name":"天祝藏族自治县"},
    {"item_code":"620702","item_name":"甘州区"},
    {"item_code":"620721","item_name":"肃南裕固族自治县"},
    {"item_code":"620722","item_name":"民乐县"},
    {"item_code":"620723","item_name":"临泽县"},
    {"item_code":"620724","item_name":"高台县"},
    {"item_code":"620725","item_name":"山丹县"},
    {"item_code":"620802","item_name":"崆峒区"},
    {"item_code":"620821","item_name":"泾川县"},
    {"item_code":"620822","item_name":"灵台县"},
    {"item_code":"620823","item_name":"崇信县"},
    {"item_code":"620824","item_name":"华亭县"},
    {"item_code":"620825","item_name":"庄浪县"},
    {"item_code":"620826","item_name":"静宁县"},
    {"item_code":"620902","item_name":"肃州区"},
    {"item_code":"620921","item_name":"金塔县"},
    {"item_code":"620922","item_name":"瓜州县"},
    {"item_code":"620923","item_name":"肃北蒙古族自治县"},
    {"item_code":"620924","item_name":"阿克塞哈萨克族自治县"},
    {"item_code":"620981","item_name":"玉门市"},
    {"item_code":"620982","item_name":"敦煌市"},
    {"item_code":"621002","item_name":"西峰区"},
    {"item_code":"621021","item_name":"庆城县"},
    {"item_code":"621022","item_name":"环县"},
    {"item_code":"621023","item_name":"华池县"},
    {"item_code":"621024","item_name":"合水县"},
    {"item_code":"621025","item_name":"正宁县"},
    {"item_code":"621026","item_name":"宁县"},
    {"item_code":"621027","item_name":"镇原县"},
    {"item_code":"621102","item_name":"安定区"},
    {"item_code":"621121","item_name":"通渭县"},
    {"item_code":"621122","item_name":"陇西县"},
    {"item_code":"621123","item_name":"渭源县"},
    {"item_code":"621124","item_name":"临洮县"},
    {"item_code":"621125","item_name":"漳县"},
    {"item_code":"621126","item_name":"岷县"},
    {"item_code":"621202","item_name":"武都区"},
    {"item_code":"621221","item_name":"成县"},
    {"item_code":"621222","item_name":"文县"},
    {"item_code":"621223","item_name":"宕昌县"},
    {"item_code":"621224","item_name":"康县"},
    {"item_code":"621225","item_name":"西和县"},
    {"item_code":"621226","item_name":"礼县"},
    {"item_code":"621227","item_name":"徽县"},
    {"item_code":"621228","item_name":"两当县"},
    {"item_code":"622901","item_name":"临夏市"},
    {"item_code":"622921","item_name":"临夏县"},
    {"item_code":"622922","item_name":"康乐县"},
    {"item_code":"622923","item_name":"永靖县"},
    {"item_code":"622924","item_name":"广河县"},
    {"item_code":"622925","item_name":"和政县"},
    {"item_code":"622926","item_name":"东乡族自治县"},
    {"item_code":"622927","item_name":"积石山保安族东乡族撒拉族自治县"},
    {"item_code":"623001","item_name":"合作市"},
    {"item_code":"623021","item_name":"临潭县"},
    {"item_code":"623022","item_name":"卓尼县"},
    {"item_code":"623023","item_name":"舟曲县"},
    {"item_code":"623024","item_name":"迭部县"},
    {"item_code":"623025","item_name":"玛曲县"},
    {"item_code":"623026","item_name":"碌曲县"},
    {"item_code":"623027","item_name":"夏河县"},
    {"item_code":"630102","item_name":"城东区"},
    {"item_code":"630103","item_name":"城中区"},
    {"item_code":"630104","item_name":"城西区"},
    {"item_code":"630105","item_name":"城北区"},
    {"item_code":"630121","item_name":"大通回族土族自治县"},
    {"item_code":"630122","item_name":"湟中县"},
    {"item_code":"630123","item_name":"湟源县"},
    {"item_code":"632121","item_name":"平安县"},
    {"item_code":"632122","item_name":"民和回族土族自治县"},
    {"item_code":"632123","item_name":"乐都县"},
    {"item_code":"632126","item_name":"互助土族自治县"},
    {"item_code":"632127","item_name":"化隆回族自治县"},
    {"item_code":"632128","item_name":"循化撒拉族自治县"},
    {"item_code":"632221","item_name":"门源回族自治县"},
    {"item_code":"632222","item_name":"祁连县"},
    {"item_code":"632223","item_name":"海晏县"},
    {"item_code":"632224","item_name":"刚察县"},
    {"item_code":"632321","item_name":"同仁县"},
    {"item_code":"632322","item_name":"尖扎县"},
    {"item_code":"632323","item_name":"泽库县"},
    {"item_code":"632324","item_name":"河南蒙古族自治县"},
    {"item_code":"632521","item_name":"共和县"},
    {"item_code":"632522","item_name":"同德县"},
    {"item_code":"632523","item_name":"贵德县"},
    {"item_code":"632524","item_name":"兴海县"},
    {"item_code":"632525","item_name":"贵南县"},
    {"item_code":"632621","item_name":"玛沁县"},
    {"item_code":"632622","item_name":"班玛县"},
    {"item_code":"632623","item_name":"甘德县"},
    {"item_code":"632624","item_name":"达日县"},
    {"item_code":"632625","item_name":"久治县"},
    {"item_code":"632626","item_name":"玛多县"},
    {"item_code":"632721","item_name":"玉树县"},
    {"item_code":"632722","item_name":"杂多县"},
    {"item_code":"632723","item_name":"称多县"},
    {"item_code":"632724","item_name":"治多县"},
    {"item_code":"632725","item_name":"囊谦县"},
    {"item_code":"632726","item_name":"曲麻莱县"},
    {"item_code":"632801","item_name":"格尔木市"},
    {"item_code":"632802","item_name":"德令哈市"},
    {"item_code":"632821","item_name":"乌兰县"},
    {"item_code":"632822","item_name":"都兰县"},
    {"item_code":"632823","item_name":"天峻县"},
    {"item_code":"640104","item_name":"兴庆区"},
    {"item_code":"640105","item_name":"西夏区"},
    {"item_code":"640106","item_name":"金凤区"},
    {"item_code":"640121","item_name":"永宁县"},
    {"item_code":"640122","item_name":"贺兰县"},
    {"item_code":"640181","item_name":"灵武市"},
    {"item_code":"640202","item_name":"大武口区"},
    {"item_code":"640205","item_name":"惠农区"},
    {"item_code":"640221","item_name":"平罗县"},
    {"item_code":"640302","item_name":"利通区"},
    {"item_code":"640303","item_name":"红寺堡区"},
    {"item_code":"640323","item_name":"盐池县"},
    {"item_code":"640324","item_name":"同心县"},
    {"item_code":"640381","item_name":"青铜峡市"},
    {"item_code":"640402","item_name":"原州区"},
    {"item_code":"640422","item_name":"西吉县"},
    {"item_code":"640423","item_name":"隆德县"},
    {"item_code":"640424","item_name":"泾源县"},
    {"item_code":"640425","item_name":"彭阳县"},
    {"item_code":"640502","item_name":"沙坡头区"},
    {"item_code":"640521","item_name":"中宁县"},
    {"item_code":"640522","item_name":"海原县"},
    {"item_code":"650102","item_name":"天山区"},
    {"item_code":"650103","item_name":"沙依巴克区"},
    {"item_code":"650104","item_name":"新市区"},
    {"item_code":"650105","item_name":"水磨沟区"},
    {"item_code":"650106","item_name":"头屯河区"},
    {"item_code":"650107","item_name":"达坂城区"},
    {"item_code":"650109","item_name":"米东区"},
    {"item_code":"650121","item_name":"乌鲁木齐县"},
    {"item_code":"650202","item_name":"独山子区"},
    {"item_code":"650203","item_name":"克拉玛依区"},
    {"item_code":"650204","item_name":"白碱滩区"},
    {"item_code":"650205","item_name":"乌尔禾区"},
    {"item_code":"652101","item_name":"吐鲁番市"},
    {"item_code":"652122","item_name":"鄯善县"},
    {"item_code":"652123","item_name":"托克逊县"},
    {"item_code":"652201","item_name":"哈密市"},
    {"item_code":"652222","item_name":"巴里坤哈萨克自治县"},
    {"item_code":"652223","item_name":"伊吾县"},
    {"item_code":"652301","item_name":"昌吉市"},
    {"item_code":"652302","item_name":"阜康市"},
    {"item_code":"652323","item_name":"呼图壁县"},
    {"item_code":"652324","item_name":"玛纳斯县"},
    {"item_code":"652325","item_name":"奇台县"},
    {"item_code":"652327","item_name":"吉木萨尔县"},
    {"item_code":"652328","item_name":"木垒哈萨克自治县"},
    {"item_code":"652701","item_name":"博乐市"},
    {"item_code":"652722","item_name":"精河县"},
    {"item_code":"652723","item_name":"温泉县"},
    {"item_code":"652801","item_name":"库尔勒市"},
    {"item_code":"652822","item_name":"轮台县"},
    {"item_code":"652823","item_name":"尉犁县"},
    {"item_code":"652824","item_name":"若羌县"},
    {"item_code":"652825","item_name":"且末县"},
    {"item_code":"652826","item_name":"焉耆回族自治县"},
    {"item_code":"652827","item_name":"和静县"},
    {"item_code":"652828","item_name":"和硕县"},
    {"item_code":"652829","item_name":"博湖县"},
    {"item_code":"652901","item_name":"阿克苏市"},
    {"item_code":"652922","item_name":"温宿县"},
    {"item_code":"652923","item_name":"库车县"},
    {"item_code":"652924","item_name":"沙雅县"},
    {"item_code":"652925","item_name":"新和县"},
    {"item_code":"652926","item_name":"拜城县"},
    {"item_code":"652927","item_name":"乌什县"},
    {"item_code":"652928","item_name":"阿瓦提县"},
    {"item_code":"652929","item_name":"柯坪县"},
    {"item_code":"653001","item_name":"阿图什市"},
    {"item_code":"653022","item_name":"阿克陶县"},
    {"item_code":"653023","item_name":"阿合奇县"},
    {"item_code":"653024","item_name":"乌恰县"},
    {"item_code":"653101","item_name":"喀什市"},
    {"item_code":"653121","item_name":"疏附县"},
    {"item_code":"653122","item_name":"疏勒县"},
    {"item_code":"653123","item_name":"英吉沙县"},
    {"item_code":"653124","item_name":"泽普县"},
    {"item_code":"653125","item_name":"莎车县"},
    {"item_code":"653126","item_name":"叶城县"},
    {"item_code":"653127","item_name":"麦盖提县"},
    {"item_code":"653128","item_name":"岳普湖县"},
    {"item_code":"653129","item_name":"伽师县"},
    {"item_code":"653130","item_name":"巴楚县"},
    {"item_code":"653131","item_name":"塔什库尔干塔吉克自治县"},
    {"item_code":"653201","item_name":"和田市"},
    {"item_code":"653221","item_name":"和田县"},
    {"item_code":"653222","item_name":"墨玉县"},
    {"item_code":"653223","item_name":"皮山县"},
    {"item_code":"653224","item_name":"洛浦县"},
    {"item_code":"653225","item_name":"策勒县"},
    {"item_code":"653226","item_name":"于田县"},
    {"item_code":"653227","item_name":"民丰县"},
    {"item_code":"654002","item_name":"伊宁市"},
    {"item_code":"654003","item_name":"奎屯市"},
    {"item_code":"654021","item_name":"伊宁县"},
    {"item_code":"654022","item_name":"察布查尔锡伯自治县"},
    {"item_code":"654023","item_name":"霍城县"},
    {"item_code":"654024","item_name":"巩留县"},
    {"item_code":"654025","item_name":"新源县"},
    {"item_code":"654026","item_name":"昭苏县"},
    {"item_code":"654027","item_name":"特克斯县"},
    {"item_code":"654028","item_name":"尼勒克县"},
    {"item_code":"654201","item_name":"塔城市"},
    {"item_code":"654202","item_name":"乌苏市"},
    {"item_code":"654221","item_name":"额敏县"},
    {"item_code":"654223","item_name":"沙湾县"},
    {"item_code":"654224","item_name":"托里县"},
    {"item_code":"654225","item_name":"裕民县"},
    {"item_code":"654226","item_name":"和布克赛尔蒙古自治县"},
    {"item_code":"654301","item_name":"阿勒泰市"},
    {"item_code":"654321","item_name":"布尔津县"},
    {"item_code":"654322","item_name":"富蕴县"},
    {"item_code":"654323","item_name":"福海县"},
    {"item_code":"654324","item_name":"哈巴河县"},
    {"item_code":"654325","item_name":"青河县"},
    {"item_code":"654326","item_name":"吉木乃县"},
    {"item_code":"659001","item_name":"石河子市"},
    {"item_code":"659002","item_name":"阿拉尔市"},
    {"item_code":"659003","item_name":"图木舒克市"},
    {"item_code":"659004","item_name":"五家渠市"}
];
$(function() {
    //load city.json

    var sb = new StringBuffer();
    $.each(cityJson,
        function(i, val) {
            if (val.item_code.substr(2, 4) == '0000') {
                sb.append("<option value='" + val.item_code + "'>" + val.item_name + "</option>");
            }
        });
    $("#choosePro").after(sb.toString());

}); // 省值变化时 处理市
function doProvAndCityRelation() {
    var city = $("#citys");
    var county = $("#county");
    if (city.children().length > 1) {
        city.empty();
    }
    if (county.children().length > 1) {
        county.empty();
    }
    if ($("#chooseCity").length === 0) {
        city.append("<option id='chooseCity' value=''></option>");
    }
    if ($("#chooseCounty").length === 0) {
        county.append("<option id='chooseCounty' value=''></option>");
    }
    var sb = new StringBuffer();
    $.each(cityJson,
        function(i, val) {
            if (val.item_code.substr(0, 2) == $("#province").val().substr(0, 2) && val.item_code.substr(2, 4) != '0000' && val.item_code.substr(4, 2) == '00') {
                sb.append("<option value='" + val.item_code + "'>" + val.item_name + "</option>");
            }
        });
    $("#chooseCity").after(sb.toString());
} // 市值变化时 处理区/县
function doCityAndCountyRelation() {
    var cityVal = $("#citys").val();
    var county = $("#county");
    if (county.children().length > 1) {
        county.empty();
    }
    if ($("#chooseCounty").length === 0) {
        county.append("<option id='chooseCounty' value=''></option>");
    }
    var sb = new StringBuffer();
    $.each(cityJson,
        function(i, val) {
            if (cityVal == '110100' || cityVal == "120100" || cityVal == "310100" || cityVal == "500100") {
                if (val.item_code.substr(0, 3) == cityVal.substr(0, 3) && val.item_code.substr(4, 2) != '00') {
                    sb.append("<option value='" + val.item_code + "'>" + val.item_name + "</option>");
                }
            } else {
                if (val.item_code.substr(0, 4) == cityVal.substr(0, 4) && val.item_code.substr(4, 2) != '00') {
                    sb.append("<option value='" + val.item_code + "'>" + val.item_name + "</option>");
                }
            }
        });
    $("#chooseCounty").after(sb.toString());

}

function StringBuffer(str) {
    var arr = [];
    str = str || "";
    var size = 0; // 存放数组大小
    arr.push(str);
    // 追加字符串
    this.append = function(str1) {
        arr.push(str1);
        return this;
    };
    // 返回字符串
    this.toString = function() {
        return arr.join("");
    };
    // 清空
    this.clear = function(key) {
        size = 0;
        arr = [];
    };
    // 返回数组大小
    this.size = function() {
        return size;
    };
    // 返回数组
    this.toArray = function() {
        return buffer;
    };
    // 倒序返回字符串
    this.doReverse = function() {
        var str = buffer.join('');
        str = str.split('');
        return str.reverse().join('');
    };
}