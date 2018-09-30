$(function(){
	
	//初始化左侧栏目treeview
	$.ajax({
		type: "get",
		dataType: "json", //预期服务器返回的数据类型
		url: "/newsColumn/children?pOid=0", //url
		success: function(rst) {
			console.log(rst); //打印服务端返回的数据(调试用)
			$("#newsColumnTreeView").treeview({
				data: rst,
				onNodeSelected: function(event, data) {
					console.log(data);
					$("#searchNewsColumnOid").val(data.oid);
					$("#newsTable").bootstrapTable('refresh');
					
				},
				onNodeUnselected: function(event, data) {
                    console.log(data);
					$("#searchNewsColumnOid").val("");
					$("#newsTable").bootstrapTable('refresh');
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
	
	//初始化文本编辑器
	var ue = UE.getEditor('editor');
	$('#newsTable').bootstrapTable({
		url: '/news/searchNews', //请求后台的URL（*）
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
			},
			width: '5%'
		}, {
			field: 'title',
			title: '标题',
		}, {
			field: 'user.realName',
			title: '发布人',
			width: '5%'
		}, {
			field: 'insertTime',
			title: '发布时间',
			width: '15%'
		}, {
			field: 'operate',
			title: '操作',
			align: 'center',
			width: '15%',
			formatter: function() {
				return [
					'<button type="button" class="RoleOfview btn btn-default btn-sm" style="margin-right:15px;">查看</button>',
					'<button type="button" class="RoleOfdelete btn btn-default  btn-sm" style="margin-right:15px;">删除</button>',
					'<button type="button" class="RoleOfedit btn btn-default  btn-sm" style="margin-right:15px;">修改</button>'
				].join('');
			},
			events: {
				'click .RoleOfdelete': function(e, value, row, index) {
					Ewin.confirm({ message: "确认要删除选择的数据吗？" }).on(function (e) {
		                if (!e) {
		                    return;
		                }
		                $.ajax({
							type: "POST",
							url: "/news/remove?oid=" + row.oid,
							contentType: "application/json; charset=utf-8",
							success: function(rst) {
								if(rst.code == 0) {
									$("#newsTable").bootstrapTable('refresh');
								}
							},
							error: function() {
								alert("系统异常！");
							}
						});
		            });
				},
				'click .RoleOfedit': function(e, value, row, index) {
					$("#saveNewsForm")[0].reset();
					$.setForm("#saveNewsForm", row);
					$.ajax({
						type:"get",
						url:"/newsColumn/children",
						dataType: "json",
						success: function(rst){
							$.each(rst, function(name, ival) {
								if (ival.oid == row.column.oid) {
									$("#columnOid").append("<option value='"+ival.oid+"' selected>"+ival.title+"</option>");
								}else {
									$("#columnOid").append("<option value='"+ival.oid+"'>"+ival.title+"</option>");
								}
							});
						}
					});
					UE.getEditor('editor').setContent(row.content, null);
					$('#saveNewsModal').modal('show');
				},
				'click .RoleOfview': function(e, value, row, index) {
					$.ajax({
						type:"get",
						url:"/news/viewNews?oid="+row.oid,
						success: function(rst){
							console.log(rst);
							$.setDiv("#viewNewsInfo", rst);
							console.log(rst.user.realName);
							$("#columnTitle").html(rst.column.title);
							$('#viewNewsModal').modal('show');
						}
					});
				}
			}
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
	function queryParams(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: params.offset,
			title: $("#searchTitle").val(),
			'column.oid': $("#searchNewsColumnOid").val(),
			startTime: $("#searchStartInsertTime").val(),
			endTime: $("#searchEndInsertTime").val()
		};
		console.log(temp);
		return temp;
	}
	$("#search").on('click', function() {
		$("#newsTable").bootstrapTable('refresh');
	})
	
	$("#addNewsBtn").click("on", function(){
		$("#saveNewsForm")[0].reset();
		UE.getEditor('editor').execCommand("clearlocaldata");
		UE.getEditor('editor').setContent("");
		$.ajax({
			type:"get",
			url:"/newsColumn/children",
			dataType: "json",
			success: function(rst){
//				console.log(rst);
				$.each(rst, function(name, ival) {
					$("#columnOid").append("<option value='"+ival.oid+"'>"+ival.title+"</option>");
				});
				$("#saveNewsModal").modal("show");
			}
		});
		UE.getEditor('editor').setHeight(300);
	});
	$("#save").on("click", function() {
		$("#saveNewsForm #content").val(UE.getEditor('editor').getContent());
		console.log($('#saveNewsForm').serialize());
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/news/save", //url
			data: $('#saveNewsForm').serialize(),
			success: function(rst) {
				console.log(rst); //打印服务端返回的数据(调试用)
				if(rst.code == 0) {
					$('#saveNewsModal').modal('hide');
					$("#newsTable").bootstrapTable('refresh');
				};
			},
			error: function() {
				alert("异常！");
			}
		});
	})
})
