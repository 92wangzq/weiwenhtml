$(function() {
	$("#userTypeTable").bootstrapTable({
		url: '/userType/searchUserTypes', //请求后台的URL（*）
		method: 'get', //请求方式（*）
		toolbar: '#toolbar', //工具按钮用哪个容器
		striped: true, //是否显示行间隔色
		cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
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
							$("#userTypeTable").bootstrapTable('refresh');
						}
					});
				},
				'click .RoleOfedit': function() {
					
				}
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
	$("#save").click("on", function(){
		console.log($('#saveUserTypeForm').serialize());
		$.ajax({
			type: "POST", //方法类型
			dataType: "json", //预期服务器返回的数据类型
			url: "/userType/save", //url
			data: $('#saveUserTypeForm').serialize(),
			success: function(rst) {
				console.log(rst); //打印服务端返回的数据(调试用)
				if(rst.code == 0) {
					$('#saveUserTypeModal').modal('hide');
					$("#userTypeTable").bootstrapTable('refresh');
				};
			}
		});
	})
})
