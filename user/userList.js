$(function() {
	$('#userTable').bootstrapTable({
		url: '/user/searchUsers', //请求后台的URL（*）
		method: 'get', //请求方式（*）
		toolbar: '#toolbar', //工具按钮用哪个容器
		striped: true, //是否显示行间隔色
		cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination: true, //是否显示分页（*）
		queryParams: queryParams,
		sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber: 1, //初始化加载第一页，默认第一页
		pageSize: 10, //每页的记录行数（*）
		pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
		contentType: "application/x-www-form-urlencoded",
		strictSearch: true,
		clickToSelect: true, //是否启用点击选中行
		uniqueId: "oid", //每一行的唯一标识，一般为主键列
		toolbarAlign: "right",
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'realName',
			title: '姓名'
		}, {
			field: 'userName',
			title: '登录名'
		}, {
			field: 'area.title',
			title: '所属区域'
		}, {
			field: 'state',
			title: '状态',
			formatter: function(value) {
				if(value == "Normal") {
					return "正常";
				} else if(value == "Frozen") {
					return "冻结"
				}
			}
		}, {
			field: 'insertTime',
			title: '创建时间'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			width: '200',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfview btn btn-primary btn-sm">查看</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm">删除</button>',
					'<button type="button" class="RoleOfedit btn btn-primary  btn-sm">修改</button>'
				].join('');
			},
			events: {
				'click .RoleOfview': function(e, value, row, index) {
					$.ajax({
						type: "get",
						url: "/user/viewUser?oid=" + row.oid,
						dataType: "json",
						contentType: "application/json; charset=utf8",
						success: function(data) {
							$.setDiv("#viewUserInfo", data);
							$("#viewOid").val(data.oid);
							$("#viewAreaName").html(data.area.title);
							if(data.state == "Normal") {
								$("#viewState").html("正常");
							} else if(data.state == "Frozen") {
								$("#viewState").html("冻结");
							} else {
								$("#viewState").html("已删除");
							}
							var roleNames = "";
							$.each(data.roles, function(n, role) {
								if(roleNames == "") {
									roleNames += role.name;
								} else {
									roleNames += "," + role.name;
								}
							});
							$("#viewRoleNames").html(roleNames);
							if(data.state == "Normal") {
								$("#frozen").show();
								$("#thaw").hide();
							} else {
								$("#frozen").hide()
								$("#thaw").show()
							}
						}
					});
					$("#viewUserModal").modal("show");
				},
				'click .RoleOfdelete': function(e, value, row, index) {
					Ewin.confirm({
						message: "确认要删除选中数据吗？"
					}).on(function(e) {
						if(!e) {
							return;
						}
						$.ajax({
							type: "get",
							url: "/user/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function() {
								$("#userTable").bootstrapTable('refresh');
							}
						});
					});
				},
				'click .RoleOfedit': function(e, value, row, index) {
					$.ajax({
						type: "get",
						url: "/user/viewUser?oid=" + row.oid,
						dataType: "json",
						contentType: "application/json; charset=utf8",
						success: function(data) {
							$.setForm("#saveUserForm", data);
							$("#areaName").val(data.area.title);
							$("#areaOid").val(data.area.oid);
							$("#userPwd").attr("readonly", "readonly");
							$.ajax({
								type: "get",
								url: "/system/roleList?limit=0&offset=100000",
								dataType: "json",
								success: function(rst) {
									var op = "";
									$.each(rst.rows, function(n, val) {
										op += "<option value='" + val.oid + "'>" + val.name + "</option>";
									});
									$("#roleOids").html(op);
									$('#roleOids').selectpicker('refresh');
									var roles = new Array(data.roles.length);
									$.each(data.roles, function(n, val) {
										roles[n] = val.oid;
									});
									$("#roleOids").val(roles);
									$("#roleOids").selectpicker("refresh");
								}
							});
						}
					});
					$("#saveUserModal").modal("show");
				}
			}
		}]
	});

	function queryParams(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: (params.offset / params.limit) + 1,
			realName: $("#searchRealName").val(),
			userName: $("#searchUserName").val(),
			state: $("#searchState").val()
		};
		return temp;
	}

	$("#search").off("click").on("click", function() {
		$("#userTable").bootstrapTable('refresh');
	});

	var form = $("#saveUserForm");
	//验证表单的正确性
	form.validate({
		errorPlacement: function errorPlacement(error, element) {
			//			element.before(error);
			if(element.is(":checkbox") || element.is(":radio")) {
				error.appendTo(element.parent().parent());
			} else {
				error.insertAfter(element);
			}
		},
		rules: {}
	});

	$("#addUserBtn").off("click").on("click", function() {
		$("#saveUserForm")[0].reset();
		$("#userPwd").removeAttr("readonly");
		$.ajax({
			type: "get",
			url: "/system/roleList?limit=0&offset=100000",
			dataType: "json",
			success: function(rst) {
				var op = "";
				$.each(rst.rows, function(n, val) {
					op += "<option value='" + val.oid + "'>" + val.name + "</option>";
				});
				$("#roleOids").html(op);
				$('#roleOids').selectpicker('refresh');
			}
		});
		$("#saveUserModal").modal("show");
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
						$("#areaModal").modal("hide");
					}
				});
				$("#areaModal").modal("show");
			},
			error: function() {
				alert("异常！");
			}
		});
	});

	$('.modal').on('hidden.bs.modal', function() {
		$("body").addClass("modal-open");
	});

	$("#save").click("on", function() {
		form.validate().settings.ignore = ":disabled";
		if(!form.valid()) return;
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/user/save", //url
			data: $('#saveUserForm').serialize(),
			success: function(rst) {
				if(rst.code == 0) {
					$('#saveUserModal').modal('hide');
					$("#userTable").bootstrapTable('refresh');
					toastr.success("成功!");
				};
			},
			error: function() {
				alert("异常！");
			}
		});
	});

	$("#frozen").off("click").on("click", function() {
		$.ajax({
			type: "get",
			url: "/user/editState?state=Frozen&oid=" + $("#viewOid").val(),
			dataType: "json",
			contentType: "application/json; charset=utf8",
			success: function(rst) {
				if(rst.code == "0") {
					toastr.success("成功!");
				} else {
					toastr.error(rst.message);
				}
			}
		});
		$("#viewUserModal").modal("hide");
		$("#userTable").bootstrapTable('refresh');
	});

	$("#thaw").off("click").on("click", function() {
		$.ajax({
			type: "get",
			url: "/user/editState?state=Normal&oid=" + $("#viewOid").val(),
			dataType: "json",
			contentType: "application/json; charset=utf8",
			success: function(rst) {
				if(rst.code == "0") {
					toastr.success("成功!");
				} else {
					toastr.error(rst.message);
				}
			}
		});
		$("#viewUserModal").modal("hide");
		$("#userTable").bootstrapTable('refresh');
	});
});