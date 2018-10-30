$(function() {

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
	
	$.ajax({
		type: "get",
		url: "/area/searchAreas?limit=0&offset=100000",
		dataType: "json",
		success: function(rst) {
			var op = "";
			$.each(rst.rows, function(n, val) {
				op += "<option value='" + val.oid + "'>" + val.title + "</option>";
			});
			console.log(op);
			$("#documentAreaOids").html(op);
			$("#documentAreaOids").selectpicker("refresh");
		}
	});
	
	$('#taskDocumentTable').bootstrapTable({
		url: '/document/tasks', //请求后台的URL（*）
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
					'<button type="button" class="RoleOfapproval btn btn-primary  btn-sm">审批</button>'
				].join('');
			},
			events: {
				'click .RoleOfapproval': function(e, value, row, index) {
					$.ajax({
						type: "get",
						url: "/document/viewDocument?oid=" + row.oid,
						contentType: "application/json; charset=utf-8",
						success: function(rst) {
							$.setDiv("#viewDocumentModal", rst);
							$("#viewDocumentModal #file").html("<a href='/document/download?oid=" + rst.oid + "'>" + rst.file.title + "</a>");
							$("#oid").val(rst.oid);
							$("#taskId").val(row.taskId);
							$("#viewDocumentModal").modal("show");
						}
					});
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
		return temp;
	}
	$("#search").off("click").on('click', function() {
		$("#taskDocumentTable").bootstrapTable('refresh');
	});
	var form = $("#saveMsgForm");
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
	
	$("#complete").off("click").on("click", function() {
		if(!form.valid()) return;
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/document/approvalDocument", //url
			data: $('#taskDocumentForm').serialize(),
			success: function(rst) {
				if(rst.code == 0) {
					$('#viewDocumentModal').modal('hide');
					$("#taskDocumentTable").bootstrapTable('refresh');
				};
			}
		});
	});
})