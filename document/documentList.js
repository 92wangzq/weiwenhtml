$(function() {

	//初始化左侧栏目treeview
	$.ajax({
		type: "get",
		dataType: "json", //预期服务器返回的数据类型
		url: "/documentColumn/children?pOid=0", //url
		success: function(rst) {
			console.log(rst); //打印服务端返回的数据(调试用)
			$("#documentColumnTreeView").treeview({
				data: rst,
				showBorder: false,
				levels: 3,
				expandIcon: "glyphicon glyphicon-menu-right",
				collapseIcon: "glyphicon glyphicon-menu-down",
				emptyIcon: "glyphicon glyphicon-stop",
				onNodeSelected: function(event, data) {
					console.log(data);
					$("#searchDocumentColumnOid").val(data.oid);
					$("#documentTable").bootstrapTable('refresh');
				},
				onNodeUnselected: function(event, data) {
					console.log(data);
					$("#searchDocumentColumnOid").val("");
					$("#documentTable").bootstrapTable('refresh');
				}
			});
		},
		error: function() {
			alert("异常！");
		}
	});

	//初始化时间组件
	$('.form_date').datetimepicker({
		language: 'fr',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		language: 'cn'
	});

	$('#documentTable').bootstrapTable({
		url: '/document/searchDocuments', //请求后台的URL（*）
		method: 'post', //请求方式（*）
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
		striped: true,//隔行变色
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'documentNumber',
			title: '公文编号'
		}, {
			field: 'title',
			title: '公文标题'
		}, {
			field: 'user.area.title',
			title: '上传单位'
		}, {
			field: 'user.realName',
			title: '上传人'
		}, {
			field: 'insertTime',
			title: '上传时间'
		}, {
			field: 'downloadNum',
			title: '下载次数'
		}, {
			field: 'remarks',
			title: '备注'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			width: '200',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfView btn btn-primary  btn-sm">查看</button>',
					'<button type="button" class="RoleOfedit btn btn-primary  btn-sm">修改</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm">删除</button>',
					'<button type="button" class="RoleOfDownload btn btn-primary  btn-sm">下载</button>'
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
							type: "POST",
							url: "/document/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function(rst) {
								if(rst.code == 0) {
									$("#documentTable").bootstrapTable('refresh');
								}
							},
							error: function() {
								alert("系统异常！");
							}
						});
					});
				},
				'click .RoleOfedit': function(e, value, row, index) {
					$("#saveDocumentForm")[0].reset();
					$.ajax({
						type: "get",
						url: "/document/viewDocument?oid=" + row.oid,
						contentType: "application/json charset=utf-8",
						success: function(rst) {
							$.setForm("#saveDocumentForm", rst);
							console.log(rst.column.oid);
							$.ajax({
								type: "get",
								url: "/documentColumn/children",
								contentType: "application/json charset=utf-8",
								success: function(data) {
									$.each(data, function(name, ival) {
										console.log(ival.oid);
										if (ival.oid == rst.column.oid) {
											$("#columnOid").append("<option value='" + ival.oid + "' selected >"+ ival.title + "</option>");
										} else {
											$("#columnOid").append("<option value='" + ival.oid + "'>" + ival.title + "</option>");
										}
									});
								}
							});
							$("#fileOid").val(rst.file.oid);
							var ue = UE.getEditor("documentEditor");
							ue.execCommand("clearlocaldata");
							ue.ready(function() { 
								ue.setContent(rst.description); 
							});
						}
					});
					$('#saveDocumentModal').modal('show');
				},
				'click .RoleOfView': function(e, value, row, index) {
					$.ajax({
						type: "get",
						url: "/document/viewDocument?oid=" + row.oid,
						contentType: "application/json; charset=utf-8",
						success: function(rst) {
							console.log(rst);
							$.setDiv("#viewDocumentModal", rst);
							$("#columnTitle").html(rst.column.title);
							$("#viewDocumentModal #file").html("<a href='/document/download?oid=" + rst.oid + "'>" + rst.file.title + "</a>");
							if(rst.logs != null) {
								$("#downloadLogTable").bootstrapTable("destroy");
								$("#downloadLogTable").bootstrapTable({
									data: rst.logs,
									columns: [{
										title: '序号',
										formatter: function(value, row, index) {
											return index + 1;
										}
									}, {
										field: 'user.area.title',
										title: '下载单位'
									}, {
										field: 'user.realName',
										title: '下载人'
									}, {
										field: 'downloadTime',
										title: '下载时间'
									}]
								})
							}
							$("#viewDocumentModal").modal("show");
						},
						error: function() {
							alert("系统异常！");
						}
					});
				},
				'click .RoleOfDownload': function(e, value, row, index) {
					location.href = "/document/download?oid=" + row.oid;
					$("#documentTable").bootstrapTable('refresh');
				}
			}
		}]
	});

	function queryParams(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: (params.offset / params.limit) + 1,
			title: $("#searchTitle").val(),
			'column.oid': $("#searchDocumentColumnOid").val(),
			startTime: $("#searchStartInsertTime").val(),
			endTime: $("#searchEndInsertTime").val()
		};
		console.log(temp);
		return temp;
	}
	$("#search").on('click', function() {
		$("#documentTable").bootstrapTable('refresh');
	})

	$("#addDocumentBtn").click("on", function() {
		$("#saveDocumentForm")[0].reset();
		var ue = UE.getEditor("documentEditor");
		ue.execCommand("clearlocaldata");
		ue.ready(function() { 
			ue.setContent(''); 
		});
		$.ajax({
			type: "get",
			url: "/documentColumn/children",
			dataType: "json",
			success: function(rst) {
				console.log(rst);
				$.each(rst, function(name, ival) {
					$("#columnOid").append("<option value='" + ival.oid + "'>" + ival.title + "</option>");
				});
				$("#saveDocumentModal").modal("show");
			}
		});
	});

	$("#fileName").off("change").on("change", function() {
		var formData = new FormData();
		formData.append('fileName', $('#fileName')[0].files[0]);
		$.ajax({
			url: '/yup',
			type: 'POST',
			cache: false,
			data: formData,
			processData: false,
			contentType: false,
			success: function(rst) {
				console.log(rst);
				$("#fileOid").val(rst.oid);
			}
		}).done(function(res) {

		}).fail(function(res) {

		});

	});
	$("#save").off("click").on("click", function() {
		$("#saveDocumentForm #description").val(UE.getEditor('documentEditor').getContent());
		console.log($('#saveDocumentForm').serialize());
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/document/save", //url
			data: $('#saveDocumentForm').serialize(),
			success: function(rst) {
				console.log(rst); //打印服务端返回的数据(调试用)
				if(rst.code == 0) {
					$('#saveDocumentModal').modal('hide');
					$("#documentTable").bootstrapTable('refresh');
				};
			},
			error: function() {
				alert("异常！");
			}
		});
	})
})