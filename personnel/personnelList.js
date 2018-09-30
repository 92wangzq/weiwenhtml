$(document).ready(function() {

	//加载左侧treeView
	$.ajax({
		type: "get",
		dataType: "json", //预期服务器返回的数据类型
		url: "/area/children", //url
		success: function(rst) {
			console.log(rst); //打印服务端返回的数据(调试用)
			$("#areaTreeView").treeview({
				data: rst,
				onNodeSelected: function(event, data) {
					$("#searchAreaOid").val(data.oid);
					$("#personnelTable").bootstrapTable('refresh');
				},
				onNodeUnselected: function(event, data) {
					$("#searchAreaOid").val("");
					$("#personnelTable").bootstrapTable('refresh');
				}
			});
		},
		error: function() {
			alert("异常！");
		}
	});

	//加载人员类别
	$.ajax({
		type: "get",
		url: "/personnelType/children?pOid=0",
		dataType: "json",
		success: function(rst) {
			$.each(rst, function(n, val) {
				$("#searchPersonnelTypeParent").append("<option value='" + val.oid + "'>" + val.title + "</option>");
			});
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

	//加载人员信息数据列表
	$('#personnelTable').bootstrapTable({
		url: '/personnel/searchPersonnels', //请求后台的URL（*）
		method: 'get', //请求方式（*）
		toolbar: '#toolbar', //工具按钮用哪个容器
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
			field: 'realName',
			title: '姓名'
		}, {
			field: 'sex',
			title: '性别',
			formatter: function(value, row) {
				if(value == 1) {
					return '男'
				} else {
					return '女'
				}
			}
		}, {
			field: 'nation',
			title: '民族'
		}, {
			field: 'identityCard',
			title: '身份证号'
		}, {
			field: 'birthday',
			title: '出生日期'
		}, {
			field: 'workUnit',
			title: '工作单位'
		}, {
			field: 'politicalStatus',
			title: '政治面貌'
		}, {
			field: 'telephone',
			title: '联系方式'
		}, {
			field: 'type.title',
			title: '人员类别',
		}, {
			field: 'realState',
			title: '现实状态',
			formatter: function(value, row) {
				if(value == 'XSBF') {
					return "息诉罢访";
				} else if(value == 'WKZ') {
					return "稳控中";
				} else if(value = 'SLZ') {
					return "失联中";
				}
			}
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfview btn btn-default btn-sm" style="margin-right:15px;">查看</button>',
					'<button type="button" class="RoleOfdelete btn btn-default  btn-sm" style="margin-right:15px;">删除</button>',
					'<button type="button" class="RoleOfedit btn btn-default  btn-sm" style="margin-right:15px;">修改</button>'
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
							type: "get",
							url: "/personnel/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function(rst) {
								if(rst.code == 0) {
									$("#personnelTable").bootstrapTable('refresh');
								}
							},
							error: function() {
								alert("系统异常！");
							}
						});
					});
				},
				'click .RoleOfedit': function(e, value, row, index) {
					$("#savePersonnelForm")[0].reset();
					$.setForm("#savePersonnelForm", row);
					$("#operator").val($.cookie("user"));
					if(row.area != null) {
						$("#areaOid").val(row.area.oid);
						$("#areaName").html(row.area.title);
					}
					$.ajax({
						type: "get",
						url: "/personnelType/children?pOid=0",
						dataType: "json",
						success: function(rst) {
							$.each(rst, function(n, val) {
								if(row.type != null) {
									if(val.oid == row.type.type.oid) {
										$("#personnelTypeParent").append("<option value='" + val.oid + "' selected>" + val.title + "</option>");
										$.ajax({
											type: "get",
											url: "/personnelType/children?pOid=" + val.oid,
											dataType: "json",
											success: function(rst) {
												$.each(rst, function(index, value) {
													if(value.oid == row.type.oid) {
														$("#personnelType").append("<option value='" + value.oid + "' selected>" + value.title + "</option>");
													} else {
														$("#personnelType").append("<option value='" + value.oid + "'>" + value.title + "</option>");
													}
												});
											}
										});
									} else {
										$("#personnelTypeParent").append("<option value='" + val.oid + "'>" + val.title + "</option>");
									}
								} else {
									$("#personnelTypeParent").append("<option value='" + val.oid + "'>" + val.title + "</option>");
								}
							});
						}
					});
					$("#familyTable").bootstrapTable("destroy");
					$("#familyTable").bootstrapTable({
						url: '/family/searchFamilys?personnelOid=' + row.oid, //请求后台的URL（*）
						method: 'get', //请求方式（*）
						striped: true, //是否显示行间隔色
						cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
						contentType: "application/x-www-form-urlencoded",
						strictSearch: true,
						minimumCountColumns: 2, //最少允许的列数
						clickToSelect: true, //是否启用点击选中行
						uniqueId: "oid", //每一行的唯一标识，一般为主键列
						showToggle: false, //是否显示详细视图和列表视图的切换按钮
						cardView: false, //是否显示详细视图
						detailView: false, //是否显示父子表
						columns: [{
							title: '序号',
							formatter: function(value, row, index) {
								return index + 1;
							}
						}, {
							field: 'relationship',
							title: '重点人员关系'
						}, {
							field: 'realName',
							title: '姓名'
						}, {
							field: 'nation',
							title: '民族'
						}, {
							field: 'identityCard',
							title: '身份证号'
						}, {
							field: 'workUnit',
							title: '工作单位'
						}, {
							field: 'telephone',
							title: '联系方式'
						}],
						rowStyle: function(row, index) {
							var classesArr = ['success', 'info'];
							var strclass = "";
							if(index % 2 === 0) { //偶数行
								strclass = classesArr[0];
							} else { //奇数行
								strclass = classesArr[1];
							}
							return {
								classes: strclass
							};
						}
					});
					$('#savePersonnelModal').modal('show');
				},
				'click .RoleOfview': function(e, value, row, index) {
					$.setDiv("#viewPersonnelInfo", row);
					$("#viewPersonnelInfo #operator").html(row.user.realName);
					console.log(row);
					if(row.area != null) {
						$("#viewPersonnelInfo #viewAreaName").html(row.area.title);
					}
					$("#viewPersonnelInfo #sex").html(function() {
						if(row.sex == "1") {
							return "男";
						} else {
							return "女";
						}
					});
					$("#viewPersonnelInfo #nation").html(function() {
						if(row.nation == "HZ") {
							return "汉族";
						} else if(row.nation == "MZ") {
							return "蒙族";
						}
					});
					$("#viewPersonnelInfo #politicalStatus").html(function() {
						if(row.politicalStatus == "QZ") {
							return "群众";
						} else if(row.politicalStatus == "TY") {
							return "团员";
						} else if(row.politicalStatus == "DY") {
							return "党员";
						}
					});
					$("#viewPersonnelInfo #personnelPType").html(function() {
						return row.type.type.title;
					});
					$("#viewPersonnelInfo #personnelType").html(function() {
						return row.type.title;
					});
					$("#viewPersonnelInfo #realState").html(function() {
						if(row.realState == "XSBF") {
							return "息诉罢访";
						} else if(row.realState == "WKZ") {
							return "稳控中";
						} else if(row.realState == "SLZ") {
							return "失联中";
						}
					});
					$("#viewPersonnelInfo #riskRating").html(function() {
						if(row.riskRating == "green") {
							return "绿色";
						} else if(row.riskRating == "orange") {
							return "橙色";
						} else if(row.riskRating == "red") {
							return "红色";
						} else if(row.riskRating == "gray") {
							return "灰色";
						}
					});
					$("#viewFamilyTable").bootstrapTable("destroy");
					$("#viewFamilyTable").bootstrapTable({
						url: '/family/searchFamilys?personnelOid=' + row.oid, //请求后台的URL（*）
						method: 'get', //请求方式（*）
						striped: true, //是否显示行间隔色
						cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
						contentType: "application/x-www-form-urlencoded",
						strictSearch: true,
						minimumCountColumns: 2, //最少允许的列数
						clickToSelect: true, //是否启用点击选中行
						uniqueId: "oid", //每一行的唯一标识，一般为主键列
						showToggle: false, //是否显示详细视图和列表视图的切换按钮
						cardView: false, //是否显示详细视图
						detailView: false, //是否显示父子表
						columns: [{
							title: '序号',
							formatter: function(value, row, index) {
								return index + 1;
							}
						}, {
							field: 'relationship',
							title: '重点人员关系'
						}, {
							field: 'realName',
							title: '姓名'
						}, {
							field: 'nation',
							title: '民族'
						}, {
							field: 'identityCard',
							title: '身份证号'
						}, {
							field: 'workUnit',
							title: '工作单位'
						}, {
							field: 'telephone',
							title: '联系方式'
						}],
						rowStyle: function(row, index) {
							var classesArr = ['success', 'info'];
							var strclass = "";
							if(index % 2 === 0) { //偶数行
								strclass = classesArr[0];
							} else { //奇数行
								strclass = classesArr[1];
							}
							return {
								classes: strclass
							};
						}
					});
					$('#personnelInfoModal').modal('show');
				}
			}
		}],
		rowStyle: function(row, index) {
			return {
				css: {
					"background-color": row.riskRating,
					"height": "20px"
				}
			}
		}, //隔行变色
	});

	function queryParams(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: params.offset,
			realName: $("#searchRealName").val(),
			sex: $("#searchSex").val(),
			nation: $("#searchNation").val(),
			politicalStatus: $("#searchPoliticalStatus").val(),
			telephone: $("#searchTelephone").val(),
			identityCard: $("#searchIdentityCard").val(),
			birthday: $("#searchBirthday").val(),
			realState: $("#searchRealState").val(),
			riskRating: $("#searchRiskRating").val(),
			"type.oid": $("#searchPersonnelType").val(),
			"area.oid": $("#searchAreaOid").val()
		};
		console.log(temp);
		return temp;
	}

	//绑定查询按钮事件
	$("#search").on('click', function() {
		$("#personnelTable").bootstrapTable('refresh');
	})

	//绑定人员类别级联事件
	$("#searchPersonnelTypeParent").on('change', function() {
		$.ajax({
			type: "get",
			url: "/personnelType/children?pOid=" + $("option:selected", this).val(),
			dataType: "json",
			success: function(rst) {
				$.each(rst, function(n, val) {
					$("#searchPersonnelType").append("<option value='" + val.oid + "'>" + val.title + "</option>");
				});
			}
		});
	});

	//绑定新增按钮事件
	$("#addPersonnelBtn").click('on', function() {
		$('#familyTable').bootstrapTable({
			url: '', //请求后台的URL（*）
			method: 'get', //请求方式（*）
			toolbar: '#familyTableToolbar', //工具按钮用哪个容器
			striped: true, //是否显示行间隔色
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			contentType: "application/x-www-form-urlencoded",
			strictSearch: true,
			minimumCountColumns: 2, //最少允许的列数
			clickToSelect: true, //是否启用点击选中行
			uniqueId: "oid", //每一行的唯一标识，一般为主键列
			showToggle: false, //是否显示详细视图和列表视图的切换按钮
			cardView: false, //是否显示详细视图
			detailView: false, //是否显示父子表
			editable: true, //开启编辑模式
			columns: [{
				title: '序号',
				formatter: function(value, row, index) {
					return index + 1;
				}
			}, {
				field: 'relationship',
				title: '重点人员关系'
			}, {
				field: 'realName',
				title: '姓名'
			}, {
				field: 'nation',
				title: '民族'
			}, {
				field: 'identityCard',
				title: '身份证号'
			}, {
				field: 'workUnit',
				title: '工作单位'
			}, {
				field: 'telephone',
				title: '联系方式'
			}],
			rowStyle: function(row, index) {
				var classesArr = ['success', 'info'];
				var strclass = "";
				if(index % 2 === 0) { //偶数行
					strclass = classesArr[0];
				} else { //奇数行
					strclass = classesArr[1];
				}
				return {
					classes: strclass
				};
			}, //隔行变色
		});
		$("#savePersonnelForm")[0].reset();
		$("#operator").val($.cookie("user"));
		$.ajax({
			type: "get",
			url: "/personnelType/children?pOid=0",
			dataType: "json",
			success: function(rst) {
				$.each(rst, function(n, val) {
					$("#personnelTypeParent").append("<option value='" + val.oid + "'>" + val.title + "</option>");
				});
			}
		});
		$('#savePersonnelModal').modal('show');
	});

	$("#personnelTypeParent").on('change', function() {
		$.ajax({
			type: "get",
			url: "/personnelType/children?pOid=" + $("option:selected", this).val(),
			dataType: "json",
			success: function(rst) {
				$.each(rst, function(n, val) {
					$("#personnelType").append("<option value='" + val.oid + "'>" + val.title + "</option>");
				});
			}
		});
	});

	$("#areaName").click('on', function(event) {
		$.ajax({
			type: "get",
			dataType: "json", //预期服务器返回的数据类型
			url: "/area/children", //url
			success: function(rst) {
				console.log(rst); //打印服务端返回的数据(调试用)
				$("#areaTree").treeview({
					data: rst,
					onNodeSelected: function(event, data) {
						console.log(data);
						$("#areaName").html(data.title);
						$("#areaOid").val(data.oid);
						$("#areaModal").modal("hide");
					}
				});
			},
			error: function() {
				alert("异常！");
			}
		});
		$("#areaModal").modal("show");
	})

	$("#realState").on('change', function() {
		var value = $("option:selected", this).val();
		var more = $("#more option:selected").val();
		console.log(value);
		console.log(more);
		if($("#personnelType").val() == 6 || $("#personnelType").val() == 7 || $("#personnelType").val() == 8) {
			$("#riskRating").find("option[value='gray']").attr("selected", "selected");
		} else {
			if(value == 'WKZ' && more == '0') {
				console.log(value);
				console.log(more);
				$("#riskRating").find("option[value='green']").attr("selected", "selected");
			} else if(value == 'WKZ' && (more >= 1 || more <= 2)) {
				$("#riskRating").find("option[value='orange']").attr("selected", "selected");
			} else if(value == 'SLZ' || more >= 3) {
				$("#riskRating").find("option[value='red']").attr("selected", "selected");
			}
		}
	});

	$("#more").on('change', function() {
		var value = $("option:selected", this).val();
		var realState = $("#realState option:selected").val();
		if($("#personnelType").val() == 6 || $("#personnelType").val() == 7 || $("#personnelType").val() == 8) {
			$("#riskRating").find("option[value='gray']").attr("selected", "selected");
		} else {
			if(realState == 'WKZ' && value == '0') {
				$("#riskRating").find("option[value='green']").attr("selected", "selected");
			} else if(realState == 'WKZ' && (value >= 1 || value <= 2)) {
				$("#riskRating").find("option[value='orange']").attr("selected", "selected");
			} else if(realState == 'SLZ' || value >= 3) {
				$("#riskRating").find("option[value='red']").attr("selected", "selected");
			}
		}
	});

	$("#saveFamily").on("click", function() {
		var row = $.getFormJson('#saveFamilyForm');
		console.log(row);
		$("#familyTable").bootstrapTable("append", row);
		console.log();
	});

	$("#save").click("on", function() {
		console.log(JSON.stringify($("#familyTable").bootstrapTable("getData")));
		$("#familyJson").val(JSON.stringify($("#familyTable").bootstrapTable("getData")));
		console.log($('#savePersonnelForm').serialize());
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/personnel/save", //url
			data: $('#savePersonnelForm').serialize(),
			success: function(rst) {
				console.log(rst); //打印服务端返回的数据(调试用)
				if(rst.code == 0) {
					$('#savePersonnelModal').modal('hide');
					$("#personnelTable").bootstrapTable('refresh');
				};
			},
			error: function() {
				alert("异常！");
			}
		});
	})
	$("#exportStuInfoExcel").on('click', function() {
		$("#searchPersonnelForm").submit();
	})

	$('#familyModel').on('hidden.bs.modal', function() {
		alert("fsdfdsfsdfsdfsd");
		$('#savePersonnelModal').css({
			'overflow-y': 'scroll'
		});
		$("body").addClass("modal-open");
	});

	$('#areaModal').on('hidden.bs.modal', function() {
		alert("fsdfdsfsdfsdfsd");
		$('#savePersonnelModal').css({
			'overflow-y': 'scroll'
		});
		$("body").addClass("modal-open");
	});
})