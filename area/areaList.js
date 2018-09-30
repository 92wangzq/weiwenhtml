$(function(){
	var TableInit = function() {
		var oTableInit = new Object();
		oTableInit.Init = function(){
			$("#areaTable").bootstrapTable({
				url: '/area/searchAreas', //请求后台的URL（*）
				method: 'get', //请求方式（*）
				toolbar: '#toolbar', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				queryParams: oTableInit.queryParams, //传递参数（*）
				sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
				pageNumber: 1, //初始化加载第一页，默认第一页
				pageSize: 10, //每页的记录行数（*）
				pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
				showPaginationSwitch: true,
				contentType: "application/x-www-form-urlencoded",
				strictSearch: true,
				showRefresh: true, //是否显示刷新按钮
				clickToSelect: true, //是否启用点击选中行
				uniqueId: "oid",
				columns: [{
					title: '序号',
					width: '80',
					align: 'center',
					formatter: function(value, row, index) {
						return index + 1;
					}
				}, {
					title: '名称',
					field: 'title',
					align: 'center',
				}, {
					field: 'operate',
					title: '操作',
					align: 'center',
					width: '200',
					events: operateEvents,
					formatter: function() {
						return [
							'<button type="button" class="RoleOfview btn btn-primary btn-sm" style="margin-right:15px;">查看</button>',
							'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm" style="margin-right:15px;">删除</button>',
							'<button type="button" class="RoleOfedit btn btn-primary  btn-sm" style="margin-right:15px;">修改</button>'
						].join('');
					}
				}],//每一行的唯一标识，一般为主键列,
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
		}
		//得到查询的参数
		oTableInit.queryParams = function(params) {
			var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
				limit: params.limit, //页面大小
				offset: params.offset
			};
			return temp;
		};
		return oTableInit;
	}
	window.operateEvents = {
		'click .RoleOfview': function() {
			
		},
		'click .RoleOfdelete': function(e, value, row, index) {
			$.ajax({
				type:"get",
				url:"/area/remove?oid="+row.oid,
				contentType: "application/json; charset=utf-8",
				success: function() {
					$("#areaTable").bootstrapTable('refresh');
				}
			});
		},
		'click .RoleOfedit': function() {
			
		}
	};
	//1.初始化Table
	var oTable = new TableInit();
	oTable.Init();
	
	$("#btn_addArea").click("on", function(){
		$.ajax({
			type:"get",
			url:"/area/children",
			dataType: "json",
			success: function(rst){
				console.log(rst);
				$.each(rst, function(name, ival) {
					$("#pOid").append("<option value='"+ival.oid+"'>"+ival.title+"</option>");
				});
				$("#saveAreaModel").modal("show");
			}
		});
	});
	$("#save").click("on", function(){
		console.log($('#saveAreaForm').serialize());
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/area/save", //url
			data: $('#saveAreaForm').serialize(),
			success: function(rst) {
				console.log(rst); //打印服务端返回的数据(调试用)
				if(rst.code == 0) {
					$('#saveAreaModel').modal('hide');
					$("#areaTable").bootstrapTable('refresh');
				};
			},
			error: function() {
				alert("异常！");
			}
		});
	})
})
