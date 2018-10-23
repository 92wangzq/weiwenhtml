$(function() {

	function getChildNodeIdArr(node) {
		var ts = [];
		if(node.nodes) {
			for(x in node.nodes) {
				ts.push(node.nodes[x].nodeId);
				if(node.nodes[x].nodes) {
					var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
					for(j in getNodeDieDai) {
						ts.push(getNodeDieDai[j]);
					}
				}
			}
		} else {
			ts.push(node.nodeId);
		}
		return ts;
	}

	function setParentNodeCheck(node) {
		var parentNode = $("#permissionTreeview").treeview("getNode", node.parentId);
		if(parentNode.nodes) {
			if(!parentNode.state.checked) {
				$("#permissionTreeview").treeview("checkNode", [parentNode, {
					silent: true
				}]);
				setParentNodeCheck(parentNode);
			}
			//			var checkedCount = 0;
			//			for(x in parentNode.nodes) {
			//				if(parentNode.nodes[x].state.checked) {
			//					checkedCount++;
			//				} else {
			//					break;
			//				}
			//			}
			//			if(checkedCount === parentNode.nodes.length) {
			//			}
		}
	}

	$("#roleTable").bootstrapTable({
		url: '/system/roleList', //请求后台的URL（*）
		method: 'get', //请求方式（*）
		contentType: "application/json; charset=utf-8",
		uniqueId: "oid", //每一行的唯一标识，一般为主键列
		cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination: true, //是否显示分页（*）
		sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
		queryParams: queryParams, //传递参数（*）
		pageNumber: 1, //初始化加载第一页，默认第一页
		pageSize: 10, //每页的记录行数（*）
		pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
		toolbar: '#toolbar', //工具按钮用哪个容器
		striped: true, //隔行变色
		detailView: true,
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'name',
			title: '角色名称'
		}, {
			field: 'role',
			title: '英文名称'
		}, {
			field: 'description',
			title: '描述'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			width: '200',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfedit btn btn-primary  btn-sm">修改</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm">删除</button>'
				].join('');
			},
			events: {
				'click .RoleOfedit': function(e, value, row, index) {
					$.ajax({
						type: "get",
						dataType: "json", //预期服务器返回的数据类型
						url: "/system/permissionTreeview?roleOid=" + row.oid, //url
						success: function(rst) {
							$("#permissionTreeview").treeview({
								data: rst,
								showIcon: false,
								levels: 1,
								showBorder: false,
								showCheckbox: true,
								onNodeChecked: function(event, node) { //选中节点
									var selectNodes = getChildNodeIdArr(node); //获取所有子节点
									if(selectNodes) { //子节点不为空，则选中所有子节点
										$('#permissionTreeview').treeview('checkNode', [selectNodes, {
											silent: true
										}]);
									}
									var parentNode = $("#permissionTreeview").treeview("getNode", node.parentId);
									setParentNodeCheck(node);
								},
								onNodeUnchecked: function(event, node) { //取消选中节点
									var selectNodes = getChildNodeIdArr(node); //获取所有子节点
									if(selectNodes) { //子节点不为空，则取消选中所有子节点
										$('#permissionTreeview').treeview('uncheckNode', [selectNodes, {
											silent: true
										}]);
									}
								}
							});
						},
						error: function() {
							alert("异常！");
						}
					});
					$.setForm("#saveRoleForm", row);
					$("#saveRoleModal").modal("show");
				},
				'click .RoleOfdelete': function(e, value, row, index) {
					Ewin.confirm({
						message: "确认要删除选择的数据吗？"
					}).on(function(e) {
						if(!e) {
							return;
						}
						$.ajax({
							type: "get",
							url: "/system/removeRole?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function() {
								$("#roleTable").bootstrapTable('refresh');
							}
						});
					})
				}
			}
		}],
		onExpandRow: function(index, row, $detail) {
			InitSubTable(index, row, $detail);
		}
	});

	function queryParams(params) {
		console.log(params);
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: (params.offset / params.limit) + 1
		};
		console.log(temp);
		return temp;
	}

	//初始化子表格(无线循环)
	InitSubTable = function(index, row, $detail) {
		var cur_table = $detail.html('<table></table>').find('table');
		$(cur_table).bootstrapTable({
			striped: true, //是否显示行间隔色
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）	
			clickToSelect: true, //是否启用点击选中行
			uniqueId: "oid", //每一行的唯一标识，一般为主键列
			data: row.permissions,
			columns: [{
				field: 'name',
				title: '资源名称'
			}, {
				field: 'permission',
				title: '权限标识'
			}]
		});
	};

	$("#addRoleBtn").off("click").on("click", function() {
		$.ajax({
			type: "get",
			dataType: "json", //预期服务器返回的数据类型
			url: "/system/permissionTreeview", //url
			success: function(rst) {
				$("#permissionTreeview").treeview({
					data: rst,
					showIcon: false,
					levels: 1,
					showBorder: false,
					showCheckbox: true,
					onNodeChecked: function(event, node) { //选中节点
						var selectNodes = getChildNodeIdArr(node); //获取所有子节点
						if(selectNodes) { //子节点不为空，则选中所有子节点
							$('#permissionTreeview').treeview('checkNode', [selectNodes, {
								silent: true
							}]);
						}
						var parentNode = $("#permissionTreeview").treeview("getNode", node.parentId);
						setParentNodeCheck(node);
					},
					onNodeUnchecked: function(event, node) { //取消选中节点
						var selectNodes = getChildNodeIdArr(node); //获取所有子节点
						if(selectNodes) { //子节点不为空，则取消选中所有子节点
							$('#permissionTreeview').treeview('uncheckNode', [selectNodes, {
								silent: true
							}]);
						}
					}
				});
			},
			error: function() {
				alert("异常！");
			}
		});
		$("#saveRoleForm")[0].reset();
		$("#saveRoleModal").modal("show");
	});

	$("#save").off("click").on("click", function() {
		form.validate().settings.ignore = ":disabled";
		if(!form.valid()) return;
		var permissionOids = "";
		$.each($("#permissionTreeview").treeview("getChecked"), function(n, val) {
			if(permissionOids == "") {
				permissionOids += val.oid;
			} else {
				permissionOids += "," + val.oid;
			}
		});
		$("#permissionOids").val(permissionOids);
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/system/saveRole", //url
			data: $('#saveRoleForm').serialize(),
			success: function(rst) {
				if(rst.code == 0) {
					$('#saveRoleModal').modal('hide');
					$("#roleTable").bootstrapTable('refresh');
				};
			},
			error: function() {
				alert("异常！");
			}
		});
	});

	var form = $("#saveRoleForm");
	//验证表单的正确性
	form.validate({
		errorPlacement: function errorPlacement(error, element) {
			element.before(error);
		},
		rules: {}
	});
})