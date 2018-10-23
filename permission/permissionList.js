$(function() {
	$("#permissionTable").bootstrapTable({
		url: '/system/searchParentPermissions', //请求后台的URL（*）
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
//		toolbar: '#toolbar', //工具按钮用哪个容器
		striped: true, //隔行变色
		detailView: true,
		columns: [{
			title: '序号',
			formatter: function(value, row, index) {
				return index + 1;
			}
		}, {
			field: 'name',
			title: '资源名称'
		}, {
			field: 'permission',
			title: '权限标识'
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
	InitSubTable = function(index, row, $detail) {
		var parent = row.title;
        var cur_table = $detail.html('<table></table>').find('table');
        $(cur_table).bootstrapTable({
        	url: '/system/searchChildPermissions?parentId='+row.oid, //请求后台的URL（*）
			method: 'get', //请求方式（*）
			striped: true, //是否显示行间隔色
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			queryParams: {},
			contentType: "application/x-www-form-urlencoded",
			clickToSelect: true, //是否启用点击选中行
			uniqueId: "oid", //每一行的唯一标识，一般为主键列
			detailView: true,
			columns: [{
				field: 'name',
				title: '资源名称'
			}, {
				field: 'permission',
				title: '权限标识'
			}, {
				field: 'parent.name',
				title: '所属资源'
			}],
			onExpandRow: function(index, row, $detail) {
				InitSubTable(index, row, $detail);
			}
        });
	}
})