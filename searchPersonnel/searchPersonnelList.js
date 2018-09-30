$(function() {

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
	//初始化表格
	$('#searchPersonnelListTable').bootstrapTable({
		toolbar: '#toolbar', //工具按钮用哪个容器
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
		}],
		rowStyle: function(row, index) {
			return {
				css: {
					"background-color": row.riskRating,
					"height": "20px"
				}
			}
		}
	});

	//绑定查询按钮事件
	$("#search").on('click', function() {
		$("#searchPersonnelListTable").bootstrapTable("destroy");
		$('#searchPersonnelListTable').bootstrapTable({
			url: '/personnel/searchPersonnels', //请求后台的URL（*）
			method: 'get', //请求方式（*）
			toolbar: '#toolbar', //工具按钮用哪个容器
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			queryParams: queryParams, //传递参数（*）
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			pageNumber: 1, //初始化加载第一页，默认第一页
			pageSize: 2, //每页的记录行数（*）
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
			}],
			rowStyle: function(row, index) {
				return {
					css: {
						"background-color": row.riskRating,
						"height": "20px"
					}
				}
			}
		});
		$("#searchPersonnelListTable").bootstrapTable('refresh');
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
	
	$("#exportStuInfoExcel").on('click', function() {
		$("#searchPersonnelForm").submit();
	})
});