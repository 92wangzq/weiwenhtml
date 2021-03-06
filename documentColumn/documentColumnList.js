$(function(){
	$('#documentColumnTable').bootstrapTable({
		url: '/documentColumn/searchDocumentColumns', //请求后台的URL（*）
		method: 'get', //请求方式（*）
		toolbar: '#toolbar', //工具按钮用哪个容器
		striped: true, //是否显示行间隔色
		cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination: true, //是否显示分页（*）
		queryParams: queryParams, //传递参数（*）
		sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber: 1, //初始化加载第一页，默认第一页
		pageSize: 10, //每页的记录行数（*）
		pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
		contentType: "application/x-www-form-urlencoded",
		strictSearch: true,
		clickToSelect: true, //是否启用点击选中行
		uniqueId: "oid", //每一行的唯一标识，一般为主键列
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'title',
			title: '标题'
		}, {
			field: 'user.realName',
			title: '发布人'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm" style="margin-right:15px;">删除</button>'
				].join('');
			},
			events: {
				'click .RoleOfdelete': function(e, value, row, index) {
					Ewin.confirm({
						message: "确认要删除选择的数据吗？"
					}).on(function(e) {
						if(!e) {
							return;
						}
						$.ajax({
							type: "post",
							url: "/documentColumn/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function(rst) {
								if(rst.code == 0) {
									$("#documentColumnTable").bootstrapTable('refresh');
								}
							}
						});
					});
				}
			}
		}]
	});
	function queryParams(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: (params.offset / params.limit) + 1
		};
		return temp;
	}
	
	$("#addDocumentColumnBtn").off("click").on("click", function(){
		$.ajax({
			type:"get",
			url:"/documentColumn/children",
			dataType: "json",
			success: function(rst){
				if (rst != null) {
					$.each(rst, function(name, ival) {
						$("#pOid").append("<option value='"+ival.oid+"'>"+ival.title+"</option>");
					});
				}
			}
		});
		$("#saveDocumentColumnModal").modal("show");
	});
	$("#save").off("click").on("click", function() {
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/documentColumn/save", //url
			data: $('#saveDocumentColumnForm').serialize(),
			success: function(rst) {
				if(rst.code == 0) {
					$('#saveDocumentColumnModal').modal('hide');
					$("#documentColumnTable").bootstrapTable('refresh');
				};
			}
		});
	})
})
