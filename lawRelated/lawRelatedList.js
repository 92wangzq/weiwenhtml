$(function() {

	$("#lawRelatedTable").bootstrapTable({
		url: '/lawRelated/lawRelatedList', //请求后台的URL（*）
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
		toolbarAlign: "right",
		striped: true,//隔行变色
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'realName',
			title: '信访人姓名'
		}, {
			field: 'nation',
			title: '信访人民族',
			formatter: function(value, row, index) {
				if (value == "HZ") {
					return "汉族"
				} else if (value == "MZ") {
					return "蒙族"
				}
			}
		}, {
			field: 'identityCard',
			title: '信访人身份证'
		}, {
			field: 'birthday',
			title: '信访人出生日期'
		}, {
			field: 'originalRealName',
			title: '原案人姓名'
		}, {
			field: 'originalNation',
			title: '原案人民族',
			formatter: function(value, row, index) {
				if (value == "HZ") {
					return "汉族"
				} else if (value == "MZ") {
					return "蒙族"
				}
			}
		}, {
			field: 'originalIdentityCard',
			title: '原案人身份证'
		}, {
			field: 'originalBirthday',
			title: '原案人出生日期'
		}, {
			field: 'caseType',
			title: '案件类型',
			formatter: function(value, row, index) {
				if (value == "XZ") {
					return "行政案件";
				} else if (value == "XS") {
					return "刑事案件"
				} else if (value == "MS") {
					return "民事案件"
				}
			}
		}, {
			field: 'letterVisitOrder',
			title: '信访秩序',
			formatter: function(value, row, index) {
				if (value == "PT") {
					return "普通访"
				} else if (value == "CF") {
					return "重复访"
				} else if (value == "FF") {
					return "非访"
				} else if (value == "YJ") {
					return "越级访"
				} else if (value == "DJ") {
					return "打击处理"
				}
			}
		}, {
			field: 'powerAffairsUnit',
			title: '事权单位'
		}, {
			field: 'attendTo',
			title: '信访办理'
		}, {
			field: 'insertTime',
			title: '录入时间'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			width: '200',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfview btn btn-primary btn-sm" style="margin-right:15px;">查看</button>',
					'<button type="button" class="RoleOfedit btn btn-primary  btn-sm" style="margin-right:15px;">修改</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm" style="margin-right:15px;">删除</button>'
				].join('');
			},
			events: {
				'click .RoleOfview': function(e, value, row, index) {
					$.setDiv("example-basic", row);
					$.ajax({
						type:"get",
						url:"/lawRelated/viewLawRelated?oid="+row.oid,
						contentType: "application/json; charset=utf-8",
						success: function(rst) {
							var obj = $("#example-basic");
							$.each(rst, function(name, ival) {
								obj.find(".content #" + name + "").html(ival);
							});
							$("#viewLawRelatedModal").modal("show");
						}
					});
				},
				'click .RoleOfedit': function(e, value, row, index) {
					$.ajax({
						type:"get",
						url:"/lawRelated/viewLawRelated?oid="+row.oid,
						contentType: "application/json; charset=utf-8",
						success: function(rst) {
							$("#saveLawRelatedForm")[0].reset();
							$.setForm("#saveLawRelatedForm", rst);
							$("#saveLawRelatedModal").modal("show");
						}
					});
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
							url: "/lawRelated/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function() {
								$("#lawRelatedTable").bootstrapTable('refresh');
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
			offset: (params.offset / params.limit) + 1,
			realName: $("#searchRealName").val(),
			nation: $("#searchNation").val(),
			identityCard: $("#searchIdentityCard").val(),
			birthday: $("#searchBirthday").val(),
			originalRealName: $("#searchOriginalRealName").val(),
			originalNation: $("#searchOriginalNation").val(),
			originalIdentityCard: $("#searchOriginalIdentityCard").val(),
			originalBirthday: $("#searchOriginalBirthday").val()
		};
		return temp;
	}
	//绑定查询按钮事件
	$("#search").on('click', function() {
		$("#lawRelatedTable").bootstrapTable('refresh');
	})
	//导出报表
	$("#exportStuInfoExcel").on('click', function() {
		console.log("fdsfsdfsdfsd");
		$("#searchLawRelatedForm").submit();
	})
	
	$("#addLawRelatedBtn").on('click', function() {
		$("#saveLawRelatedModal").modal("show");
	});

	var form = $("#saveLawRelatedForm").show();

	form.steps({
		headerTag: "h3",
		bodyTag: "section",
		transitionEffect: "slideLeft",
		labels: {
			finish: "完成", // 修改按钮得文本
			next: "下一步", // 下一步按钮的文本
			previous: "上一步", // 上一步按钮的文本
			loading: "Loading ..."
		},
		onStepChanging: function(event, currentIndex, newIndex) {
			// Allways allow previous action even if the current form is not valid!
			if(currentIndex > newIndex) {
				return true;
			}
			// Forbid next action on "Warning" step if the user is to young
			if(newIndex === 3 && Number($("#age-2").val()) < 18) {
				return false;
			}
			// Needed in some cases if the user went back (clean up)
			if(currentIndex < newIndex) {
				// To remove error styles
				form.find(".body:eq(" + newIndex + ") label.error").remove();
				form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
			}
			form.validate().settings.ignore = ":disabled,:hidden";
			return form.valid();
		},
		onStepChanged: function(event, currentIndex, priorIndex) {
			// Used to skip the "Warning" step if the user is old enough.
			if(currentIndex === 2 && Number($("#age-2").val()) >= 18) {
				form.steps("next");
			}
			// Used to skip the "Warning" step if the user is old enough and wants to the previous step.
			if(currentIndex === 2 && priorIndex === 3) {
				form.steps("previous");
			}
		},
		onFinishing: function(event, currentIndex) {
			form.validate().settings.ignore = ":disabled";
			return form.valid();
		},
		onFinished: function(event, currentIndex) {
			$.ajax({
				type: "POST", //方法类型
				dataType: "json", //预期服务器返回的数据类型
				url: "/lawRelated/save", //url
				data: $('#saveLawRelatedForm').serialize(),
				success: function(rst) {
					if(rst.code == 0) {
						$('#saveLawRelatedModal').modal('hide');
						$("#lawRelatedTable").bootstrapTable('refresh');
					};
				},
				error: function() {
					alert("异常！");
				}
			});
		}
	}).validate({
		errorPlacement: function errorPlacement(error, element) {
			element.before(error);
		},
		rules: {
			confirm: {
				equalTo: "#password-2"
			}
		}
	});
	
	$("#example-basic").steps({
	    headerTag: "h3",
	    bodyTag: "section",
	    transitionEffect: "slideLeft",
	    autoFocus: true,
		labels: {
			finish: "终", // 修改按钮得文本
			next: "下一页", // 下一步按钮的文本
			previous: "上一页", // 上一步按钮的文本
			loading: "Loading ..."
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
})