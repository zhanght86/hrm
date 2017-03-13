<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html>
<html>
<head>
    <title>培训通知管理</title>
    <%@ include file="/static/include/easyui.jsp" %>
    <script type="text/javascript" src="/modules/fbd/hrm/train/js/train_notice.js"></script>
    <script type="text/javascript" src="/modules/fbd/hrm/train/js/user_tree.js"></script>

</head>


<body class="easyui-layout">
<style type="text/css" rel="stylesheet">
    .fitem {
        padding: 10px 40px 10px 40px;
        line-height: 27px;
    }

</style>

<div id="tb" style="padding:5px;background:#eee;">
    <div>
        查询月份：
        <input id="month" class="easyui-datebox combox_width"    editable="false">
        <input type="hidden" id="month1" />
        培训名称：<input class="easyui-textbox" id="trainPlanTittle" style="width:140px" type="text"/>
        培训类型：
        <input id="type" class="easyui-combobox combox_width" panelHeight="auto" editable="false"  />
        状态：
        <input id="state" class="easyui-combobox combox_width"   editable="false" panelHeight="auto" />


        <a id="searchAllBtn" class="easyui-linkbutton" iconCls="icon-search">查询</a>
        <a id="clearBtn" class="easyui-linkbutton" iconCls="icon-cancel">清空</a>
    </div>
    <div>
        <a id="addBtn" class="easyui-linkbutton" data-options="iconCls:'icon-add'">新增</a>
        <a id="editBtn" class="easyui-linkbutton" data-options="iconCls:'icon-edit'">修改</a>
        <a id="delBtn" class="easyui-linkbutton" data-options="iconCls:'icon-remove'">删除</a>
        <a id="publishBtn" class="easyui-linkbutton" data-options="iconCls:'icon-ok'">发布</a>
        <a id="viewBtn" class="easyui-linkbutton" data-options="iconCls:'icon-tip'">查看</a>
    </div>
</div>


<table id="primaryGrid" class="easyui-datagrid"></table>
<div id="choosePerson" style="height: 500px;width:800px;" data-options="modal:true,footer:'#choose-buttons'">
    <div id="west" data-options="region:'west'" style="width:35%;height:100%;float: left;overflow:auto;">

        <ul id="userTree" class="easyui-tree"></ul>

    </div>
    <div id="center" data-options="region:'center'" style="width:10%;height:100%;float:left;">
        <div class="btn" style="margin-top: 200px">
            <a onclick="addPerson()" style="float: left" class="easyui-linkbutton"
               data-options="iconCls:'icon-redo'">添加</a>
        </div>
        <div class="btn" style="margin-top: 30px">
            <a onclick="removePerson()" style="float: left" class="easyui-linkbutton"
               data-options="iconCls:'icon-undo'">移除</a>
        </div>
    </div>
    <div id="east" data-options="region:'east'" style="width:55%;height:100%;float:left;">
        <table class="easyui-datagrid" title="已选人员" id="personGrid">
        </table>
    </div>

    <div style="padding:5px;text-align:right;" id="choose-buttons">
        <a onclick="savePerson()" class="easyui-linkbutton" icon="icon-ok">确定</a>
        <a onclick="cancelPerson()" class="easyui-linkbutton" icon="icon-cancel">取消</a>
    </div>
</div>

<div id="editWin" style="height:500px;width:810px;" data-options="modal:true,footer:'#dlg-buttons'">
    <form id="editForm" data-options="fit:true" method="post">
        <input type="hidden" id="id"/>
        <input type="hidden" id="flag"/>
        <table class="editTable">
            <div class="fitem">
                <label style="width: 60px;">培训名称：</label>
                <input id="name" class="easyui-textbox" style="height:27px;width: 266px"/>

                <label style="width: 80px;">培训地点：</label>
                <input id="editTrainPlace" class="easyui-textbox"
                       style="height:27px;width: 266px"/>
            </div>
            <div class="fitem">
                <label style="width: 60px;">培训类型：</label>
                <input id="editTrainPlanType" class="easyui-combobox" panelHeight="auto"   data-options="editable:false"
                       style="height:27px;width: 150px"/>

                <label style="width: 79px;">培训主题：</label>
                <input id="editTrainPlan" class="easyui-combobox" panelHeight="auto"    data-options="editable:false"
                       style="height:27px;width: 150px"/>


                <label style="width: 78px;">培训讲师：</label>
                <input class="easyui-textbox" id="editTrainTeacher" style="height:27px;width: 150px"/>
            </div>
            <div class="fitem">
                <label style="width: 60px">培训内容：</label>
                <textarea id="editTrainContent2" name="editTrainContent2" style="width:680px;height:200px;"></textarea>
            </div>

            <div class="fitem">
                <label style="width: 60px;">开始时间：</label>
                <input id="editStartDate" class="easyui-datetimebox"
                       data-options="showSeconds:false,multiline:true,editable:false" style="width:150px;height:27px"/>

                <label style="width: 80px;">结束时间：</label>
                <input id="editEndDate" class="easyui-datetimebox"
                       data-options="showSeconds:false,multiline:true,editable:false" style="width:150px;height:27px">

            </div>
            <div class="fitem">
                <label style="width: 60px;text-align: left" ><a href="#" class="easyui-linkbutton"  onclick="chooseUser()" >培训人员</a></label>
                <input class="easyui-textbox" id="editUserName" data-options="multiline:true,editable:false"
                       style="height:80px;width: 620px"/>
                <input type="hidden" id="editUserId"/>
                <input type="hidden" id="editDeptId"/>
                <input type="hidden" id="editDeptName"/>
                <input type="hidden" id="editUserFlag"/>
            </div>


        </table>
    </form>
</div>
<div id="dlg-buttons" style="padding:5px;text-align:right;">
    <a id="saveBtn" class="easyui-linkbutton" icon="icon-ok">保存</a>
    <a id="cancelBtn" class="easyui-linkbutton" icon="icon-cancel">取消</a>
</div>
<div id="infoWin" style="height:500px;width:810px;" data-options="modal:true">
        <table class="editTable">
            <div class="fitem">
                <label style="width: 60px;">培训名称：</label>
                <input id="name1" class="easyui-textbox" data-options="editable:false" style="height:27px;width: 266px"/>

                <label style="width: 80px;">培训地点：</label>
                <input id="TrainPlace" class="easyui-textbox" data-options="editable:false"
                       style="height:27px;width: 266px"/>
            </div>
            <div class="fitem">
                <label style="width: 60px;">培训类型：</label>
                <input id="TrainPlanType" class="easyui-textbox"    data-options="editable:false"
                       style="height:27px;width: 150px"/>

                <label style="width: 79px;">培训主题：</label>
                <input id="TrainPlan" class="easyui-textbox"     data-options="editable:false"
                       style="height:27px;width: 150px"/>


                <label style="width: 78px;">培训讲师：</label>
                <input class="easyui-textbox" id="TrainTeacher" data-options="editable:false" style="height:27px;width: 150px"/>
            </div>
            <div class="fitem">
                <label style="width: 60px">培训内容：</label>
                <textarea id="TrainContent" name="editTrainContent"data-options="editable:false"  style="width:680px;height:200px;"></textarea>
            </div>

            <div class="fitem">
                <label style="width: 60px;">开始时间：</label>
                <input id="StartDate" class="easyui-textbox"
                       data-options="multiline:true,editable:false" style="width:150px;height:27px"/>

                <label style="width: 80px;">结束时间：</label>
                <input id="EndDate" class="easyui-textbox"
                       data-options="multiline:true,editable:false" style="width:150px;height:27px">

            </div>
            <div class="fitem">
                <label style="width: 60px;text-align: left" >培训人员</label>
                <input class="easyui-textbox" id="UserName" data-options="multiline:true,editable:false"
                       style="height:80px;width: 620px"/>
            </div>

        </table>
</div>
</body>
<script type="text/javascript" src="/static/js/head.js"></script>

</html>
