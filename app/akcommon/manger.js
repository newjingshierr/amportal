/**
 * Created by Handy on 2017/10/22.
 */
$(function() {

	//1.初始化Table
	var oTable = new TableInit();
	oTable.Init();

	//2.初始化Button的点击事件
	var oButton = new ButtonInit();
	oButton.Init();

	//3.初始化日期控件
	var oDateTime=new DateTimeInit();
	oDateTime.Init();
});

var TableInit = function() {
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function() {
		$('#tb_departments').bootstrapTable({
			url: '../app/akcommon/data.json', //请求后台的URL（*）
			method: 'get', //请求方式（*）
			toolbar: '#toolbar', //工具按钮用哪个容器
			striped: true, //是否显示行间隔色
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			sortable: false, //是否启用排序
			sortOrder: "asc", //排序方式
			queryParams: oTableInit.queryParams, //传递参数（*）
			sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
			search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			strictSearch: true,
			showColumns: true, //是否显示所有的列
			showRefresh: true, //是否显示刷新按钮
			minimumCountColumns: 2, //最少允许的列数
			clickToSelect: false, //是否启用点击选中行
			height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId: "ID", //每一行的唯一标识，一般为主键列
			showToggle: true, //是否显示详细视图和列表视图的切换按钮
			cardView: false, //是否显示详细视图
			detailView: false, //是否显示父子表
			columns: [{
				checkbox: true
			}, {
				field: 'Title',
				title: '标题'
			}, {
				field: 'Content',
				title: '内容'
			}, {
				field: 'CreatedBy',
				title: '创建人员'
			}, {
				field: 'Created',
				title: '创建时间'
			}, {
				field: 'ModifiedBy',
				title: '修改人员'
			}, {
				field: 'Modified',
				title: '修改时间'
			}, {
				field: '#',
				title: '操作',
				align: 'center',
				formatter: function(value, row, index) {
					return '<button id="btn_edit" type="button" class="btn btn-default"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>修改</button>'
				}
			}]
		});
	};

	//得到查询的参数
	oTableInit.queryParams = function(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: params.offset, //页码
			departmentname: $("#txt_search_departmentname").val(),
			statu: $("#txt_search_statu").val()
		};
		return temp;
	};

	return oTableInit;
};

//初始化按钮
var ButtonInit = function() {
	var oInit = new Object();
	var oBtn = {
		Add: $("#btn_add"),
		Delete: $("#btn_delete")
	};

	oInit.Init = function() {
		//初始化页面上面的按钮事件

		//新增
		oBtn.Add.click(function() {
			$("#myModal").modal('show');
		});

		//删除
		oBtn.Delete.click(function() {
			alert("Delte");
		});
	};

	return oInit;
};

//初始化日期控件
var DateTimeInit = function() {
	var oDateTimeInit = new Object();
	var oDateTIme = {
		PushDate: $('#pushdatetimepicker')
	};

	oDateTimeInit.Init = function() {
		//初始化日期控件
		oDateTIme.PushDate.datetimepicker({
			//language:  'fr',
			weekStart: 1,
			todayBtn: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
			showMeridian: 1
		});
	};

	return oDateTimeInit;
}