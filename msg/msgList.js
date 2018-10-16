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
	
	$("#msgSenderTable").bootstrapTable({
		url: '/msg/msgSenderList', //请求后台的URL（*）
		method: 'get', //请求方式（*）
		toolbar: '#toolbar', //工具按钮用哪个容器
		cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination: true, //是否显示分页（*）
		queryParams: queryParams, //传递参数（*）
		sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber: 1, //初始化加载第一页，默认第一页
		pageSize: 20, //每页的记录行数（*）
		pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
		contentType: "application/json; charset=utf-8",
		uniqueId: "oid", //每一行的唯一标识，一般为主键列
		toolbarAlign: "right",
		striped: true,//隔行变色
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'title',
			title: '消息标题'
		}, {
			field: 'sender',
			title: '发件人'
		}, {
			field: 'receiver',
			title: '收件人'
		}, {
			field: 'msgType',
			title: '消息类型',
			formatter: function(value, row, index) {
				if (value == '0') {
					return '普通消息'
				} else {
					return '系统消息'
				}
			}
		}, {
			field: 'state',
			title: '状态',
			formatter: function(value, row, index){
				if (value == '0') {
					return '未读'
				} else if (value == '2') {
					return '已读'
				}
			}
		}, {
			field: 'insertTime',
			title: '发送时间'
		}, {
			field: 'readTime',
			title: '阅读时间'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			width: '200',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfview btn btn-primary btn-sm" style="margin-right:15px;">查看</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm" style="margin-right:15px;">删除</button>'
				].join('');
			},
			events: {
				'click .RoleOfview': function(e, value, row, index) {
					$.ajax({
						type: "get",
						url: "/msg/viewMsg?oid="+row.oid,
						contentType: "application/json; charset=utf-8",
						success: function(rst) {
							console.log(rst);
							$.setDiv("#viewMsgInfo", rst);
							if (rst.msgType == '0') {
								$("#viewMsgInfo #msgType").html('普通消息')
							} else {
								$("#viewMsgInfo #msgType").html('系统消息')
							}
							$("#viewMsgModal").modal("show");
						}
						
					});
				},
				'click .RoleOfdelete': function(e, value, row, index) {
					Ewin.confirm({ message: "确认要删除选择的数据吗？" }).on(function (e) {
		                if (!e) {
		                    return;
		                }
						$.ajax({
							type: "get",
							url: "/msg/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function() {
								$("#msgSenderTable").bootstrapTable('refresh');
							}
						});
					});
				}
			}
		}]
	});

	$("#msgReceiverTable").bootstrapTable({
		url: '/msg/msgReceiverList', //请求后台的URL（*）
		method: 'get', //请求方式（*）
		cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination: true, //是否显示分页（*）
		queryParams: queryParams, //传递参数（*）
		sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
		pageNumber: 1, //初始化加载第一页，默认第一页
		pageSize: 10, //每页的记录行数（*）
		pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
		contentType: "application/json; charset=utf-8",
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
			field: 'title',
			title: '消息标题'
		}, {
			field: 'sender',
			title: '发件人'
		}, {
			field: 'receiver',
			title: '收件人'
		}, {
			field: 'msgType',
			title: '消息类型',
			formatter: function(value, row, index) {
				if (value == '0') {
					return '普通消息'
				} else {
					return '系统消息'
				}
			}
		}, {
			field: 'state',
			title: '状态',
			formatter: function(value, row, index){
				if (value == '0') {
					return '未读'
				} else if (value == '2') {
					return '已读'
				}
			}
		}, {
			field: 'insertTime',
			title: '发送时间'
		}, {
			field: 'readTime',
			title: '阅读时间'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			width: '200',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfview btn btn-primary btn-sm" style="margin-right:15px;">查看</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm" style="margin-right:15px;">删除</button>'
				].join('');
			},
			events: {
				'click .RoleOfview': function(e, value, row, index) {
					$.ajax({
						type: "get",
						url: "/msg/viewMsg?oid="+row.oid,
						contentType: "application/json; charset=utf-8",
						success: function(rst) {
							console.log(rst);
							$.setDiv("#viewMsgInfo", rst);
							if (rst.msgType == '0') {
								$("#viewMsgInfo #msgType").html('普通消息')
							} else {
								$("#viewMsgInfo #msgType").html('系统消息')
							}
							$("#viewMsgModal").modal("show");
						}
						
					});
					if (row.state == '0') {
						$.ajax({
							type:"get",
							url:"/msg/read?oid="+row.oid,
							contentType: "application/json; charset=utf-8",
							success: function(rst) {
								$("#msgReceiverTable").bootstrapTable('refresh');
							}
						});
					}
				},
				'click .RoleOfdelete': function(e, value, row, index) {
					Ewin.confirm({ message: "确认要删除选择的数据吗？" }).on(function (e) {
		                if (!e) {
		                    return;
		                }
						$.ajax({
							type: "get",
							url: "/msg/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function() {
								$("#msgReceiverTable").bootstrapTable('refresh');
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
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		var op = $(this).attr("href");
		if (op == '#msgSender') {
			$("#msgSenderTable").bootstrapTable('refresh');
		} else {
			$("#msgReceiverTable").bootstrapTable('refresh');
		}
	})
	$("#addMsgBtn").on('click', function() {
		$("#saveMsgForm")[0].reset();
		//初始化文本编辑器
		var ue = UE.getEditor('msgEditor');
		ue.execCommand("clearlocaldata");
		ue.ready(function() {
			ue.setContent('');
		});
		$.ajax({
			type: "get",
			url: "/area/searchAreas?limit=0&offset=100000",
			dataType: "json",
			success: function(rst) {
				console.log(rst)
				var op = "";
				$.each(rst.rows, function(n, val) {
					if(val.users != null) {
						op += "<optgroup label='" + val.title + "'>";
						$.each(val.users, function(i, user) {
							op += "<option value='" + user.oid + "'>" + user.realName + "</option>";
						})
						op += "</optgroup>"
						console.log(op);
					}
				});
				$("#receiverOids").html(op);
				$('#receiverOids').selectpicker('refresh');
			}
		});
		$('#saveMsgModal').modal('show');
	})

	$("#saveMsg").on("click", function() {
		$("#saveMsgForm #content").val(UE.getEditor('msgEditor').getContent());
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/msg/save", //url
			data: $('#saveMsgForm').serialize(),
			success: function(rst) {
				if(rst.code == 0) {
					$('#saveMsgModal').modal('hide');
					$("#msgSenderTable").bootstrapTable('refresh');
				};
			},
			error: function() {
				alert("异常！");
			}
		});
	})
})