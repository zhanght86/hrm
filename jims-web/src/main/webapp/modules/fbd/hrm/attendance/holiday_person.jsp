<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
<head>
    <title>假日人员设置</title>
    <%@ include file="/static/include/easyui.jsp"%>
    <script type="text/javascript" src="/static/js/head.js"></script>
    <script type="text/javascript" src="/modules/fbd/hrm/attendance/js/holiday_person.js"></script>
    <script type="text/javascript" src="/modules/fbd/hrm/attendance/js/user_tree.js"></script>

</head>


<body class="easyui-layout">
<style type="text/css" rel="stylesheet">
    .fitem  {
        padding: 10px 40px 10px 40px;
        line-height:27px;
    }

</style>

<div id="tb"  style="padding:5px;background:#eee;">
    <div >
        员工姓名:<input class="easyui-textbox" id="userId" style="width:140px" />



        <a id="searchAllBtn" class="easyui-linkbutton" iconCls="icon-search">查询</a>
        <a id="clearBtn" class="easyui-linkbutton" iconCls="icon-cancel">清空</a>
    </div>
    <div  >
        <a  id="addBtn" class="easyui-linkbutton" data-options="iconCls:'icon-add'">新增</a>
      <a  id="editBtn" class="easyui-linkbutton" data-options="iconCls:'icon-edit'">修改</a>
        <a  id="removeBtn" class="easyui-linkbutton" data-options="iconCls:'icon-remove'">删除</a>
    </div>
</div>


<table id="primaryGrid"  class="easyui-datagrid" ></table>

<div id="editWin"  style="height:300px;width:350px;"   data-options="modal:true,footer:'#dlg-buttons'">
    <form id="editForm" data-options="fit:true" method="post">
        <input type="hidden"  id="id" />
        <input type="hidden"  id="flag" />

        <table class="editTable">
            <div  class="fitem">
                <label style="width: 60px;" >年份:</label>
                <input  id="editYearId" class="easyui-combobox" style="width: 150px;" editable="false" />
            </div>
            <div  class="fitem">
            <label style="width: 60px;" >人员:</label>
            <input class="easyui-textbox" id="editUserName"  editable="false" style="height:27px;width: 150px"/>
            <a id="chooseUser" class="easyui-linkbutton"  onclick="chooseUser()" >选择</a>
            <input type="hidden"  id="editUserId" />
            <input type="hidden"  id="editDeptId" />
            <input type="hidden"  id="editDeptName" />
            <input type="hidden"  id="editUserFlag" />
            </div>
            <div  class="fitem">
                <label style="width: 60px;" >假日:</label>
                <input  id="editHoliday" style="width: 150px;" editable="false" />
            </div>
            <div class="fitem">
                <label style="width: 60px;">总天数:</label>
                <input id="editSumDays" class="easyui-textbox"  style="width:150px;height:27px" />
            </div>

        </table>
    </form>
</div>

<div id="dlg-buttons" style="padding:5px;text-align:right;" >
    <a  id="saveBtn" class="easyui-linkbutton" icon="icon-ok">确定</a>
    <a  id="cancelBtn" class="easyui-linkbutton" icon="icon-cancel">取消</a>
</div>
<div id="choosePerson"  style="height: 560px;width:800px;display: none"   data-options="modal:true,footer:'#choose-buttons'">
    <div id="west" data-options="region:'west'"  style="width:35%;height:100%;float: left;overflow:auto;">

        <ul  id="userTree" class="easyui-tree" ></ul >

    </div>
    <div id="center" data-options="region:'center'"  style="width:10%;height:100%;float:left;">
        <div class="btn" style="margin-top: 200px">
            <a  onclick="addPerson()" style="float: left" class="easyui-linkbutton" data-options="iconCls:'icon-redo'">添加</a>
        </div>
        <div class="btn" style="margin-top: 30px">
            <a  onclick="removePerson()"style="float: left"  class="easyui-linkbutton" data-options="iconCls:'icon-undo'">移除</a>
        </div>
    </div>
    <div id="east" data-options="region:'east'"  style="width:55%;height:100%;float:left;">
        <table class="easyui-datagrid" title="已选人员" id="personGrid">
        </table>
    </div>

    <div style="padding:5px;text-align:right;" id="choose-buttons">
        <a  onclick="savePerson()" class="easyui-linkbutton" icon="icon-ok">确定</a>
        <a  onclick="cancelPerson()" class="easyui-linkbutton" icon="icon-cancel">取消</a>
    </div>
</div>
</body>

</html>
