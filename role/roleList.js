$(function(){
	$("#roleTable").bootstrapTable({
		url: '/system/roleList', //请求后台的URL（*）
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
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'description',
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
					'<button type="button" class="RoleOfview btn btn-primary btn-sm" style="margin-right:15px;">查看</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm" style="margin-right:15px;">删除</button>',
					'<button type="button" class="RoleOfedit btn btn-primary  btn-sm" style="margin-right:15px;">修改</button>'
				].join('');
			},
			events: {
				'click .RoleOfview': function() {
			
				},
				'click .RoleOfdelete': function(e, value, row, index) {
					$.ajax({
						type:"get",
						url:"/userType/remove?oid="+row.oid,
						contentType: "application/json; charset=utf-8",
						success: function() {
							$("#userTable").bootstrapTable('refresh');
						}
					});
				},
				'click .RoleOfedit': function() {
					
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
})
