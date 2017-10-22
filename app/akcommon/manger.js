/**
 * Created by Handy on 2017/10/22.
 */
$(function() {
	//1.初始化Table
	var oTable = new TableInit();
	oTable.Init();
});

var TableInit = function() {
	var oTableInit = new Object();

	//操作
	var oBtn = {
		Add: $("#btn_add"),
		Delete: $("#btn_delete"),
		Submit: $("#btn_submit")
	};

	//操作界面
	var oModal = {
		myModal: $('#myModal'), // Modal
		title: $("#myModalLabel"), // 标题
		pushDate: $("#pushdatetimepicker"), // 发布时间
		newTitle: $("#newTitle"), // 新闻标题
		newContent: $("#newContent"), // 新闻内容
		newType: $("#newType"), // 新闻类型
		type: 0 //类型 0||1
	};

	// 初始化Table
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
				events: oTableInit.operateEditor,
				formatter: function(value, row, index) {
					return '<button id="TableEditor" type="button" class="btn btn-default"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</button>'
				}
			}]
		});
	};

	// 手动刷新列表
	oTableInit.Refresh=function(){
		$('#tb_departments').bootstrapTable("refresh");
	}

	//得到查询的参数
	oTableInit.queryParams = function(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: params.offset, //页码
		};
		return temp;
	};

	// 绑定按钮事件
	oTableInit.operateEditor = {
		"click #TableEditor": function(event, value, row, index) { //编辑按钮事件
			oTableInit.ShowModal(1, row);
		}
	};

	// 新增
	oBtn.Add.click(function() {
		oTableInit.ShowModal(0, null);
	});

	// 删除
	oBtn.Delete.click(function() {
		alert("Delte");
	});

	// 提交
	oBtn.Submit.click(function() {
		switch(oModal.type) {
			case 0:// 新增
				oTableInit.AddData();
				break;
			case 1:// 编辑
				oTableInit.EditData();
				break;
			default:
				break;
		}
	});
	
	// 新增
	oTableInit.AddData=function(){
		oTableInit.Refresh();
		oTableInit.HideModal();
	};
	
	// 编辑
	oTableInit.EditData=function(){
		oTableInit.Refresh();
		oTableInit.HideModal();
	};
	
	// 验证Modal数据
	oTableInit.ValidateForm=function(){
		
	}

	// 展示Modal 0：新增 1编辑
	oTableInit.ShowModal = function(type, data) {
		oModal.type = type;
		switch(type) {
			case 0:
				oModal.title.text("新增");
				oModal.pushDate.val("");
				oModal.newTitle.val("");
				oModal.newContent.val("");
				oModal.newType.val("");
				break;
			case 1:
				oModal.title.text("编辑");
				oModal.pushDate.val(data.PublishDate);
				oModal.newTitle.val(data.Title);
				oModal.newContent.val(data.Content);
				oModal.newType.val(data.Type);
				break;
			default:
				console.log("oModalInit.Show 未得到正确的type");
				break;
		}
		oModal.pushDate.datetimepicker({
			//language:  'fr',
			weekStart: 1,
			todayBtn: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
			showMeridian: 1
		});
		oModal.myModal.modal("show");
	}

	// 隐藏Modal
	oTableInit.HideModal = function(){
		oModal.myModal.modal("hide");
	}
	
	return oTableInit;
};