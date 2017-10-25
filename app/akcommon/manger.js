/**
 * Created by Handy on 2017/10/22.
 */
$(function() {
	//1.初始化Table
	var oTable = new TableInit();
	oTable.Init();

	//2.初始化消息提示组件
	toastr.options = { //toastr.warning('').success('').error('').clear()
		closeButton: true //是否显示关闭按钮
	}

});

function S4() {
	return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function NewGuid() {
	return(S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

var TableInit = function() {
	var oTableInit = new Object();

	//操作
	var oBtn = {
		Add: $("#btn_add"),
		Submit: $("#btn_submit"),
		ImgFile: $("#newCover"),
		File: $("#btn_newfile")
	};

	//操作界面
	var oModal = {
		myModal: $('#myModal'), // Modal
		title: $("#myModalLabel"), // 标题
		//		pushDate: $("#pushdatetimepicker"), // 发布时间
		newTitle: $("#newTitle"), // 新闻标题
		newContent: $("#newContent"), // 新闻内容
		type: "Add", //类型 Add||Edit
		ID: 0
	};

	// 初始化Table
	oTableInit.Init = function() {
		$('#tb_departments').bootstrapTable({
			//			url: 'http://www.famliytree.cn/api/news/items', //请求后台的URL（*）
			url: 'http://localhost:64833/api/news/items',
			contentType: '', //请求的data格式
			method: 'get', //请求方式（*）
			toolbar: '#toolbar', //工具按钮用哪个容器
			striped: true, //是否显示行间隔色
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			sortable: false, //是否启用排序
			sortOrder: "asc", //排序方式
			queryParams: oTableInit.queryParams, //传递参数（*）
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			totalField: 'total', //server服务端时 行总数
			dataField: 'rows', // server服务端时 所有数据
			pageNumber: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			pageList: [2, 10, 25, 50, 100], //可供选择的每页的行数（*）
			search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			strictSearch: false, //设置为 true启用 全匹配搜索，否则为模糊搜索
			showColumns: true, //是否显示所有的列
			showRefresh: true, //是否显示刷新按钮
			minimumCountColumns: 2, //最少允许的列数
			clickToSelect: false, //是否启用点击选中行
			height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId: "ID", //每一行的唯一标识，一般为主键列
			showToggle: true, //是否显示详细视图和列表视图的切换按钮
			cardView: false, //是否显示详细视图
			detailView: false, //是否显示父子表
			onRefresh: oTableInit.Refresh, //刷新
			columns: [{
				field: 'Title',
				title: '标题'
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
					var btnEditor = '<button type="button" class="btn btn-default btn-edit"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>编辑</button>';
					var btnDelete = '<button type="button" class="btn btn-default btn-delete"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>删除</button>';
					return '<div class="btn-group">' + btnEditor + btnDelete + '</div>';
				}
			}]
		});
	};

	// 手动刷新列表
	oTableInit.Refresh = function() {
		$('#tb_departments').bootstrapTable("showLoading");

		var request = {
			index: $('#tb_departments').bootstrapTable("getOptions").pageNumber - 1,
			pageSize: $('#tb_departments').bootstrapTable("getOptions").pageSize
		};

		$.ajax({
			url: 'http://www.famliytree.cn/api/news/items',
			type: "get",
			data: request,
			dataType: 'json',
			success: function(result) {
				$('#tb_departments').bootstrapTable("hideLoading");
				$('#tb_departments').bootstrapTable("load", result);
			},
			error: function(result) {
				console.log(result);
			}
		});
	}

	//得到查询的参数
	oTableInit.queryParams = function(params) {
		var temp = {
			index: params.offset == 0 ? 0 : $('#tb_departments').bootstrapTable("getOptions").pageNumber - 1,
			pageSize: params.offset == 0 ? params.limit : $('#tb_departments').bootstrapTable("getOptions").pageSize
		};
		return temp;
	};

	// 绑定按钮事件
	oTableInit.operateEditor = {
		"click .btn-edit": function(event, value, row, index) { //编辑按钮事件
			oTableInit.ShowModal("Edit", row);
		},
		"click .btn-delete": function(event, value, row, index) { //删除按钮事件
			oTableInit.DeleteData(row);
		}
	};

	// 新增按钮点击事件
	oBtn.Add.click(function() {
		oTableInit.ShowModal("Add", null);
	});

	// 提交
	oBtn.Submit.click(function() {
		switch(oModal.type) {
			case "Add": // 新增
				oTableInit.AddData();
				break;
			case "Edit": // 编辑
				oTableInit.EditData();
				break;
			default:
				break;
		}
	});

	// 新增数据
	oTableInit.AddData = function() {
		var request = {
			coverImagePath: oBtn.ImgFile.attr("src"), //封面图片地址
			title: oModal.newTitle.val(), //新闻标题 
			body: oModal.newContent.val() //新闻内容
		}

		$.ajax({
			url: 'http://localhost:64833/api/news/item',
			type: "post",
			data: request,
			dataType: 'json',
			success: function(result) {
				toastr.success('操作成功');
				oTableInit.HideModal();
				oTableInit.Refresh();
			},
			error: function(result) {
				toastr.error('操作失败');
				console.log(result);
				oTableInit.HideModal();
				oTableInit.Refresh();
			}
		});
	};

	// 编辑数据
	oTableInit.EditData = function() {
		var request = {
			coverImagePath: oBtn.ImgFile.attr("src"), //封面图片地址
			title: oModal.newTitle.val(), //新闻标题 
			body: oModal.newContent.val(), //新闻内容
			ID: oModal.ID
		}

		$.ajax({
			url: 'http://localhost:64833/api/news/item/Modify',
			type: "post",
			data: request,
			dataType: "json",
			success: function(result) {
				toastr.success('操作成功');
				oTableInit.HideModal();
				oTableInit.Refresh();
			},
			error: function(result) {
				toastr.error('操作失败');
				console.log(result);
				oTableInit.HideModal();
				oTableInit.Refresh();
			}
		});
	};

	// 删除数据
	oTableInit.DeleteData = function(data) {
		var request = {
			ID: data.ID
		}

		$.ajax({
			url: 'http://localhost:64833/api/news/item/delete',
			type: 'post',
			data: request,
			dataType: 'json',
			success: function(result) {
				toastr.success('操作成功');
				oTableInit.HideModal();
				oTableInit.Refresh();
			},
			error: function(result) {
				toastr.error('操作失败');
				console.log(result);
				oTableInit.HideModal();
				oTableInit.Refresh();
			}
		});
	};

	// 展示Modal Add：新增   Edit:编辑
	oTableInit.ShowModal = function(type, data) {
		oModal.type = type;
		oModal.ID = data ? data.ID : 0;
		switch(type) {
			case "Add":
				oModal.title.text("新增");
				oBtn.ImgFile.attr('src',"../upload/201611/thumb.jpg");
				oModal.newTitle.val("");
				oModal.newContent.val("");
				break;
			case "Edit":
				oModal.title.text("编辑");
				oBtn.ImgFile.attr('src',data.coverImagePath);
				oModal.newTitle.val(data.Title);
				oModal.newContent.val(data.Content);
				break;
			default:
				console.log("oModalInit.Show 未得到正确的type");
				break;
		}
		oModal.myModal.modal("show");
	}

	// 隐藏Modal
	oTableInit.HideModal = function() {
		oModal.myModal.modal("hide");
	}

	//封面图片点击上传
	oBtn.ImgFile.click(function() {
		//触发input file控件
		oBtn.File.click();
	})

	//上传控件
	oBtn.File.change(function(data) {
		if(data.target.files.length > 0) {
			var formData = new FormData();
			formData.append('files', data.target.files[0], NewGuid() + data.target.files[0].name);
			formData.append('handy', 1);
			$.ajax({
				url: 'http://localhost:64833/api/news/item/upload',
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				success: function(result) {
					oBtn.ImgFile.attr('src',result);
				},
				error: function(result) {
					console.log(result);
				}
			});
		}
	})

	return oTableInit;
};