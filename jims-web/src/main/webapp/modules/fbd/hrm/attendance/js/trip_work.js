/*
 *排班管理
 * @author yangchen
 * @version 2016-08-18
 *!/*/
var basePath = "/service";

var dg;
var d;
var flag;
var editIndex = undefined;
var page = '1';
var rows = '30';
var tripWorkVo = {};
var orgId = parent.config.org_Id;
var id = '999';
var startDate = '';
var endDate = '';
var userId = '';
var searchId = '';
var value = '';
var userName = '';
var label = '';
var obj1 = new Object();
var obj2 = new Object();
var obj3 = new Object();
var depts = [];
var treeDepts = [];
var approveStatus = '';
var deptId = '';
var deptIds = parent.orgids;
var search = false;
var lx = 'add';
var month = '';
$(function () {


    $.get(basePath + '/tool/find-list-by-type?type=APPROVE_STATUS&value=' + value, function (data) {
        $.each(data, function (index, item) {
            obj1[item.value] = item.label;
        });
    });

//查询条件：审批状态
    $("#approveStatus").combobox({
        idField: 'value',
        textField: 'label',
        value: '请选择',
        loadMsg: '数据正在加载',
        url: '/service/dict/find-list-by-type?type=' + 'APPROVE_STATUS',
        mode: 'remote',
        method: 'GET'
    });
    $.messager.progress({
        title: '提示！',
        msg: '数据量较大，请稍候...',
        text: '加载中.......'
    });
    $('#month').datebox({
        onShowPanel: function () {//显示日趋选择对象后再触发弹出月份层的事件，初始化时没有生成月份层
            span.trigger('click'); //触发click事件弹出月份层
            if (!tds) setTimeout(function () {//延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔
                tds = p.find('div.calendar-menu-month-inner td');
                tds.click(function (e) {
                    e.stopPropagation(); //禁止冒泡执行easyui给月份绑定的事件
                    var year = /\d{4}/.exec(span.html())[0]//得到年份
                    var month = parseInt($(this).attr('abbr'), 10); //月份
                    var month1 = month.toString();
                    if (month1 < 10) {
                        month1 = '0' + month1;
                    }
                    $("#month").datebox('hidePanel')//隐藏日期对象
                        .datebox('setValue', year + '-' + month); //设置日期的值
                    //alert(year + '-' + month);
                    $("#month1").val(year + '-' + month1);
                });
            }, 0);
            span.unbind();
            yearIpt.unbind();//解绑年份输入框中任何事件
        },
        parser: function (s) {
            if (!s) return new Date();
            var arr = s.split('-');
            return new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, 1);
        },
        formatter: function (d) {
            return d.getFullYear() + '-' + (d.getMonth() + 1);
            /*getMonth返回的是0开始的，忘记了。。已修正*/
        }
    });
    var p = $('#month').datebox('panel'), //日期选择对象
        tds = false, //日期选择对象中月份
        next = $('#month .calendar-prevyear');
    yearIpt = p.find('input.calendar-menu-year'),//年份输入框
        span = p.find('span.calendar-text'); //显示月份层的触发控件
    $("#primaryGrid").edatagrid({
        iconCls: 'icon-edit',//图标
        width: '100%',
        height: '100%',
        nowrap: false,
        striped: true,
        border: true,
        singleSelect: true,
        method: 'get',
        toolbar: '#tb',
        fitColumns: true,
        pageSize: 30,
        loadMsg: '数据正在加载中，请稍后.....',
        pagination: true,//分页控件
        collapsible: false,//是否可折叠的
        remoteSort: false,
        singleSelect: true,//是否单选
        rownumbers: true,//行号
        url: basePath + '/tripWork/trip-work-list?userId=' + searchId + '&orgId=' + orgId + '&approveStatus=' + approveStatus + '&deptIds=' + deptIds + '&month=' + month,
        columns: [[
            {field: 'orgId', title: '', width: '10%', hidden: true},
            {field: 'tripWorkId', title: '', width: '10%', hidden: true},
            {
                field: 'userId', title: '员工姓名', width: '10%', align: 'center',
                formatter: function (userId) {
                    return parent.personList[userId];
                }
            },
            {
                field: 'deptId', title: '员工部门', width: '20%', align: 'center',
                formatter: function (deptId) {
                    $.ajaxSettings.async = false;
                    $.get(basePath + '/tool/find-dept-list?deptId=' + deptId, function (data) {
                        deptName = data[0].deptName;
                    });
                    return deptName
                }
            },
            {field: 'startDate', title: '开始时间', width: '10%', align: 'center'},
            {field: 'endDate', title: '结束时间', width: '10%', align: 'center'},
            {field: 'tripWorkPlace', title: '出发地', width: '10%', align: 'center'},
            {field: 'tripWorkDestination', title: '目的地', width: '10%', align: 'center'},
            {field: 'tripWorkReason', title: '公出原因', width: '10%', align: 'center'},
            {
                field: 'approveStatus', title: '审批状态', width: '10%', align: 'center',
                formatter: function (value) {
                    return obj1[value];
                }
            },
            {
                field: 'approvePersonId', title: '审批人', width: '10%', align: 'center',
                formatter: function (approvePersonId) {
                    return parent.personList[approvePersonId];
                }
            },

            {field: 'approveDate', title: '审批时间', width: '10%', align: 'center'},
            {
                field: 'createBy', title: '提交人', width: '10%', align: 'center',
                formatter: function (createBy) {
                    return parent.personList[createBy];
                }
            },
            {field: 'updateDate', title: '提交时间', width: '13%', align: 'center'}
        ]],
        onLoadSuccess: function () {
            $.messager.progress('close');

        },
    });

    $("#primaryGrid").datagrid('getPager').pagination({
        pageList: [10, 20, 30, 40, 50], //可以设置每页记录条数的列表
        displayMsg: '当前显示从第{from}条到第{to}条，共{total}条记录',
        onSelectPage: function (pageNumber, pageSize) {
            var state = $('#primaryGrid').data('datagrid');
            var opts = state.options;
            page = opts.pageNumber = pageNumber;
            rows = opts.pageSize = pageSize;
            searchAllData(page, rows);
            return;

        }

    });
    //按条件查询(汇总)
    $("#searchAllBtn").on("click", function () {
        search = true;
        approveStatus = $("#approveStatus").textbox('getValue');
        if (approveStatus == '请选择') {
            approveStatus = '';
        }
        //获取姓名
        searchId = $("#userId").textbox('getValue');
        month = $("#month1").val();
        if (month == null || month == '' || month.length == 0) {
            month = '';
        }
        searchAllData(page, rows);

    });
    //按条件查询

    var searchAllData = function (page, rows) {


        $("#primaryGrid").datagrid('reload', basePath + '/tripWork/trip-work-list?userId=' + searchId + '&orgId=' + orgId + '&approveStatus=' + approveStatus + '&page=' + page + '&rows=' + rows + '&deptIds=' + deptIds + '&month=' + month);
        if (search) {
            search = false;
            $("#primaryGrid").datagrid('getPager').pagination('select', 1);
        }
    }


    //配置窗口
    $("#editWin").window({
        title: '公出管理',
        closed: true,
        modal: true,
        collapsible: true,
        minimizable: false,
        resizable: true,
        onClose: function () {

            $("#editUserName").textbox('enable')
            $("#editDeptName").textbox('enable')
            $("#editForm").form('reset');
        },
        onOpen: function () {
        }
    });
//配置窗口
    $("#infoWin").window({
        title: '公出管理详情',
        closed: true,
        modal: true,
        collapsible: true,
        minimizable: false,
        resizable: true,
        onClose: function () {
        },
        onOpen: function () {
        }
    });
    //新增
    $("#addBtn").on('click', function () {
        $("#editWin").window('open');
        $("#flag").val('0');
        $("#id").val('999');
        arrPerson = [];
        lx = 'add';
        $("#editForm").form('reset');
        $("#editUserId").val('');
    });


    //修改
    $("#editBtn").on("click", function () {
        //获取选择行
        var row = $('#primaryGrid').datagrid('getSelected');
        if (row) {
            if (row.approveStatus == 3) {
                lx = 'edit';
                $("#editWin").window('open');
                userId = row.userId
                $.get(basePath + '/tool/find-person-list?userId=' + userId, function (data) {
                    var userName = data[0].userName;
                    var deptId = data[0].deptId;
                    var deptName = data[0].deptName;
                    $("#editUserName").textbox('setValue', userId);
                    $("#editUserName").textbox('setText', userName);
                    $("#editUserId").val(userId);
                    $("#editDeptId").val(deptId);
                    $("#editDeptName").textbox('setValue', deptId);
                    $("#editDeptName").textbox('setText', deptName);
                });
                $("#editTripWorkReason").textbox('setValue', row.tripWorkReason);
                $("#editTripWorkPlace").textbox('setValue', row.tripWorkPlace);
                $("#editTripWorkDestination").textbox('setValue', row.tripWorkDestination);
                $("#editStartDate").datetimebox('setValue', row.startDate);
                $("#editEndDate").datetimebox('setValue', row.endDate);
                $("#id").val(row.tripWorkId);
                $("#flag").val('1');

            }
            else {
                $.messager.alert("提示", "只有被驳回的公出申请才能修改", "info");
            }
        }
        else {
            $.messager.alert("提示", "请选择一条记录", "info");
        }

    });
    //删除
    $("#delBtn").on('click', function () {
        flag = '0';
        var row = $("#primaryGrid").datagrid('getSelected');
        if (row) {
            if (row.approveStatus == 3) {
                tripWorkVo.tripWorkId = row.tripWorkId;
                ;
                $.messager.confirm('提示', '确定要进行删除操作吗', function (r) {
                    if (r) {
                        $.postJSON(basePath + "/tripWork/trip-work-del", JSON.stringify(tripWorkVo), function (data) {

                            $('#primaryGrid').datagrid('reload');
                            row.length = 0;
                        });
                    }
                })
            } else {
                $.messager.alert("提示", "只有被驳回的公出申请才能删除", "info");
                return;

            }

        } else {
            $.messager.alert("提示", "请选择一条记录", "info");
            return;

        }
    });
    //详情
    $("#infoBtn").on('click', function () {
        var row = $("#primaryGrid").datagrid('getSelected');
        if (row) {
            var userId = row.userId;
            $.get(basePath + '/tool/find-person-list?userId=' + userId, function (data) {
                var userName = data[0].userName;
                var deptId = data[0].deptId;
                var deptName = data[0].deptName;
                $("#UserName").textbox('setValue', userName);
                $("#DeptName").textbox('setValue', deptName);
            });
            $("#StartDate").textbox('setValue', row.startDate);
            $("#EndDate").textbox('setValue', row.endDate);
            $("#TripWorkReason").textbox('setValue', row.tripWorkReason);
            $("#TripWorkPlace").textbox('setValue', row.tripWorkPlace);
            $("#TripWorkDestination").textbox('setValue', row.tripWorkDestination);
            $("#infoWin").window('open');
        } else {
            $.messager.alert("提示", "请选择一条记录!", "info");
        }
    });
    //保存数据
    $("#saveBtn").on('click', function () {

        startDate = $("#editStartDate").datetimebox('getValue');
        endDate = $("#editEndDate").datetimebox('getValue');
        id = $("#id").val();
        flag = $("#flag").val();
        userId = $("#editUserId").val();
        deptId = $("#editDeptId").val();

        var tripWorkReason = $("#editTripWorkReason").textbox('getValue');
        var tripWorkPlace = $("#editTripWorkPlace").textbox('getValue');
        var tripWorkDestination = $("#editTripWorkDestination").textbox('getValue');

        var date1 = startDate.replace(/-/g, "\/");

        var date2 = endDate.replace(/-/g, "\/");
        var start = new Date(date1);
        var end = new Date(date2);
        if (userId == '') {
            $.messager.alert("提示", "请选择公出人员!", "info");
            return
        }
        if (start > end) {
            $.messager.alert("提示", "结束时间不能早于开始时间!", "info");
            return
        }
        if (date1 == date2) {
            $.messager.alert("提示", "开始时间和结束时间不能相等!", "info");
            return
        }
        if (startDate == '') {
            $.messager.alert("提示", "请选择公出开始时间!", "info");
            return
        }
        if (endDate == '') {
            $.messager.alert("提示", "请选择公出结束时间!", "info");
            return
        }


        if (tripWorkPlace == '') {
            $.messager.alert("提示", "请输入出发地!", "info");
            return
        }
        if (tripWorkDestination == '') {
            $.messager.alert("提示", "请输入目的地!", "info");
            return
        }
        if (tripWorkReason == '') {
            $.messager.alert("提示", "请输入公出原因!", "info");
            return
        }
        if (getRealLen(tripWorkReason) > 200) {
            $.messager.alert("提示", "公出原因输入过长！", 'info');
            return;
        }
        tripWorkVo.orgId = parent.config.org_Id;
        tripWorkVo.startDate = startDate;
        tripWorkVo.endDate = endDate;
        tripWorkVo.tripWorkPlace = tripWorkPlace;
        tripWorkVo.tripWorkDestination = tripWorkDestination;
        tripWorkVo.tripWorkReason = tripWorkReason;
        tripWorkVo.tripWorkId = id;
        tripWorkVo.deptId = deptId;
        tripWorkVo.userId = userId;
        $.postJSON(basePath + "/tripWork/merge", JSON.stringify(tripWorkVo), function (data) {
            $("#editForm").form('reset');
            $("#editWin").window('close');
            $("#primaryGrid").datagrid('reload');
        })

    });

    //取消
    $("#cancelBtn").on('click', function () {
        $("#editForm").form('reset');
        $("#editWin").window('close');
    });
    $("#clearBtn").on('click', function () {
        $("#userId").textbox('setValue', '');
        $("#approveStatus").combobox('setValue', '');
        $("#approveStatus").combobox('setText', '请选择');
        //清空月份
        $("#month").datebox('clear');
        $("#month1").val('');
        month = '';
        page = '1';
    });

});


