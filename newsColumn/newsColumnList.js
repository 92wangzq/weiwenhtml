$(function() {
	//加载左侧treeView
	$.ajax({
		type: "get",
		dataType: "json", //预期服务器返回的数据类型
		url: "/area/children", //url
		success: function(rst) {
			$("#areaTreeView").treeview({
				data: rst,
				showBorder: false,
				levels: 3,
				expandIcon: "glyphicon glyphicon-menu-right",
				collapseIcon: "glyphicon glyphicon-menu-down",
				emptyIcon: "glyphicon glyphicon-stop",
				onNodeSelected: function(event, data) {
					$("#searchAreaOid").val(data.oid);
					$("#newsColumnTable").bootstrapTable('refresh');
				},
				onNodeUnselected: function(event, data) {
					$("#searchAreaOid").val("");
					$("#newsColumnTable").bootstrapTable('refresh');
				}
			});
		}
	});
	$('#newsColumnTable').bootstrapTable({
		url: '/newsColumn/searchNewsColumnParentList', //请求后台的URL（*）
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
		detailView: true,
		columns: [{
			title: '序号',
			width: '5%',
			align: 'center',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'title',
			title: '栏目名称'
		}, {
			field: 'area.title',
			title: '行政区域',
			width: '10%',
			align: 'center'
		}, {
			field: 'user.realName',
			title: '创建人',
			width: '5%',
			align: 'center'
		}, {
			field: 'operate',
			title: '操作',
			width: '10%',
			align: 'center',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfedit btn btn-primary btn-sm">修改</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary btn-sm">删除</button>'
				].join('');
			},
			events: {
				'click .RoleOfedit': function(e, value, row, index) {
					$.setForm("#saveNewsColumnForm", row);
					$("#areaName").val(row.area.title);
					$("#areaOid").val(row.area.oid);
					$.ajax({
						url: "/newsColumn/searchNewsColumns?limit=1000&offset=1&area.oid="+row.area.oid,
						type: "get",
						dataType: "json",
						contentType: "application/json; charset=utf8",
						success: function(rst) {
							var options = "<option value=''>" + "===请选择===" + "</option>"
							$.each(rst.rows, function(name, ival) {
								options += "<option value='" + ival.oid + "'>" + ival.title + "</option>";
							});
							$("#parentOid").html(options);
							$("#parentOid").val(row.parent.oid);
						}
					});
					$("#saveNewsColumnModal").modal("show");
				},
				'click .RoleOfdelete': function(e, value, row, index) {
					Ewin.confirm({
						message: "确认要删除选择的数据吗？"
					}).on(function(e) {
						if(!e) {
							return;
						}
						$.ajax({
							type: "post",
							url: "/newsColumn/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function(rst) {
								if(rst.code == 0) {
									$("#newsColumnTable").bootstrapTable('refresh');
								}
							}
						});
					});
				}
			}
		}],
		onExpandRow: function(index, row, $detail) {
			InitSubTable(index, row, $detail);
		}
	});

	function queryParams(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: (params.offset / params.limit) + 1,
			title: $("#searchTitle").val(),
			"area.oid": $("#searchAreaOid").val()
		};
		return temp;
	}
	//初始化子表格(无线循环)
    InitSubTable = function (index, row, $detail) {
        var parent = row.title;
        var cur_table = $detail.html('<table></table>').find('table');
        $(cur_table).bootstrapTable({
            url: '/newsColumn/searchNewsColumns?parent.oid='+row.oid, //请求后台的URL（*）
			method: 'get', //请求方式（*）
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
			detailView: true,
			columns: [{
				title: '序号',
				width: '5%',
				align: 'center',
				formatter: function(value, row, index) {
					return index + 1;
				}
			}, {
				field: 'title',
				title: '栏目名称'
			}, {
				field: 'parent.title',
				title: '父级栏目',
				width: '5%',
				align: 'center'
			}, {
				field: 'operate',
				title: '操作',
				width: '10%',
				align: 'center',
				formatter: function() {
					return [
						'<button type="button" class="RoleOfedit btn btn-primary btn-sm">修改</button>',
						'<button type="button" class="RoleOfdelete btn btn-primary btn-sm">删除</button>'
					].join('');
				},
				events: {
					'click .RoleOfedit': function(e, value, row, index) {
						$.setForm("#saveNewsColumnForm", row);
						$("#areaName").val(row.area.title);
						$("#areaOid").val(row.area.oid);
						$.ajax({
							url: "/newsColumn/searchNewsColumns?limit=1000&offset=1&area.oid="+row.area.oid,
							type: "get",
							dataType: "json",
							contentType: "application/json; charset=utf8",
							success: function(rst) {
								var options = "<option value='0'>" + "===请选择===" + "</option>"
								$.each(rst.rows, function(name, ival) {
									options += "<option value='" + ival.oid + "'>" + ival.title + "</option>";
								});
								$("#parentOid").html(options);
								$("#parentOid").val(row.parent.oid);
							}
						});
						$("#saveNewsColumnModal").modal("show");
					},
					'click .RoleOfdelete': function(e, value, row, index) {
						Ewin.confirm({
							message: "确认要删除选择的数据吗？"
						}).on(function(e) {
							if(!e) {
								return;
							}
							$.ajax({
								type: "post",
								url: "/newsColumn/remove?oid=" + row.oid,
								contentType: "application/json; charset=utf-8",
								success: function(rst) {
									if(rst.code == 0) {
										$("#newsColumnTable").bootstrapTable('refresh');
									}
								}
							});
						});
					}
				}
			}],
			onExpandRow: function(index, row, $detail) {
				InitSubTable(index, row, $detail);
			}
        });
    };
	$("#search").off('click').on('click', function() {
		$("#newsColumnTable").bootstrapTable('refresh');
	})
	$("#addNewsColumnBtn").off('click').on("click", function() {
		$("#saveNewsColumnForm")[0].reset();
//		$.ajax({
//			type: "get",
//			url: "/newsColumn/children",
//			dataType: "json",
//			success: function(rst) {
//				var options = "<option value=''>" + "===请选择===" + "</option>"
//				$.each(rst, function(name, ival) {
//					options += "<option value='" + ival.oid + "'>" + ival.title + "</option>";
//				});
//				$("#parentOid").html(options);
//			}
//		});
		$("#saveNewsColumnModal").modal("show");
	});
	
	$("#areaName").off('click').click('on', function(event) {
		$.ajax({
			type: "get",
			dataType: "json", //预期服务器返回的数据类型
			url: "/area/children", //url
			success: function(rst) {
				$("#areaTree").treeview({
					data: rst,
					onNodeSelected: function(event, data) {
						$("#areaName").val(data.title);
						$("#areaOid").val(data.oid);
						$.ajax({
							url: "/newsColumn/searchNewsColumns?limit=1000&offset=1&area.oid="+data.oid,
							type: "get",
							dataType: "json",
							contentType: "application/json; charset=utf8",
							success: function(rst) {
								var options = "<option value='0'>" + "===请选择===" + "</option>"
								$.each(rst.rows, function(name, ival) {
									options += "<option value='" + ival.oid + "'>" + ival.title + "</option>";
								});
								$("#parentOid").html(options);
							}
						});
						$("#areaModal").modal("hide");
					}
				});
				$("#areaModal").modal("show");
			}
		});
	})

	var form = $("#saveNewsColumnForm");
	//验证表单的正确性
	form.validate({
		errorPlacement: function errorPlacement(error, element) {
			element.before(error);
		},
		rules: {
			confirm: {
				equalTo: "#password"
			}
		}
	});

	$("#save").off('click').on("click", function() {
		form.validate().settings.ignore = ":disabled";
		if(!form.valid()) return;
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/newsColumn/save", //url
			data: form.serialize(),
			success: function(rst) {
				if(rst.code == 0) {
					$('#saveNewsColumnModal').modal('hide');
					$("#newsColumnTable").bootstrapTable('refresh');
					toastr.success("成功!");
				};
			}
		});
	})
	$('#areaModal').on('hidden.bs.modal', function() {
		$('#savePersonnelModal').css({
			'overflow-y': 'scroll'
		});
		$("body").addClass("modal-open");
	});
})