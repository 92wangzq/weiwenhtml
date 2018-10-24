$(function() {

	//加载左侧treeView
	$.ajax({
		type: "get",
		dataType: "json", //预期服务器返回的数据类型
		url: "/area/children", //url
		success: function(rst) {
			$("#searchAreaTreeView").treeview({
				data: rst,
				showBorder: false,
				levels: 3,
				expandIcon: "glyphicon glyphicon-menu-right",
				collapseIcon: "glyphicon glyphicon-menu-down",
				emptyIcon: "glyphicon glyphicon-stop",
				onNodeSelected: function(event, data) {
					$("#searchAreaOid").val(data.oid);
					$("#personnelTable").bootstrapTable('refresh');
				},
				onNodeUnselected: function(event, data) {
					$("#searchAreaOid").val("");
					$("#personnelTable").bootstrapTable('refresh');
                }
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
	//初始化表格
	$('#searchPersonnelListTable').bootstrapTable({
		toolbar: '#toolbar', //工具按钮用哪个容器
		toolbarAlign: "right",
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
			field: 'riskRating',
			title: '风险等级',
			formatter: function(value, row) {
				if(row.riskRating == "green") {
					return "绿色";
				} else if(row.riskRating == "orange") {
					return "橙色";
				} else if(row.riskRating == "red") {
					return "红色";
				} else if(row.riskRating == "gray") {
					return "灰色";
				}
			},
			cellStyle: function(value, row, index) {
				return {
					css: {
						"color": row.riskRating
					}
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
			method: 'get', //请求方式（*）
			url: '/personnel/searchPersonnels', //请求后台的URL（*）
			contentType: "application/json; charset=utf-8",
			uniqueId: "oid", //每一行的唯一标识，一般为主键列
			cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true, //是否显示分页（*）
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			queryParams: queryParams, //传递参数（*）
			pageNumber: 1, //初始化加载第一页，默认第一页
			pageSize: 10, //每页的记录行数（*）
			pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
			toolbar: '#toolbar', //工具按钮用哪个容器
			toolbarAlign: "right",
			striped: true,//隔行变色
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
				title: '民族',
				formatter: function(value, row) {
					return getNationName(value);
				}
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
				title: '政治面貌',
				formatter: function(value, row) {
					if(value == "QZ") {
						return "群众";
					} else if(value == "TY") {
						return "团员";
					} else if(value == "DY") {
						return "党员";
					}
				}
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
				field: 'riskRating',
				title: '风险等级',
				formatter: function(value, row) {
					if(row.riskRating == "green") {
						return "绿色";
					} else if(row.riskRating == "orange") {
						return "橙色";
					} else if(row.riskRating == "red") {
						return "红色";
					} else if(row.riskRating == "gray") {
						return "灰色";
					}
				},
				cellStyle: function(value, row, index) {
					return {
						css: {
							"color": row.riskRating
						}
					}
				}
			}, {
				field: 'operate',
				title: '操作',
				width: '12%',
				align: 'center',
				formatter: function() {
					return [
						'<button type="button" class="RoleOfview btn btn-primary btn-sm">查看</button>'
					].join('');
				},
				events: {
					'click .RoleOfview': function(e, value, row, index) {
						$.setDiv("#viewPersonnelInfo", row);
						$("#viewAreaName").val(row.area.title)
						$("#viewPersonnelInfo #operator").html(row.user.realName);
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
							return getNationName(row.nation);
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
								title: '民族',
								formatter: function(value, row) {
									return getNationName(value);
								}
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
			}]
		});
		$("#searchPersonnelListTable").bootstrapTable('refresh');
	});

	function queryParams(params) {
		var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			limit: params.limit, //页面大小
			offset: (params.offset / params.limit) + 1,
			"area.oid": $("#searchAreaOid").val(),
			realName: $("#searchRealName").val(),
			sex: $("#searchSex").val(),
			nation: $("#searchNation").val(),
			identitycCard: $("#searchIdentitycCard").val(),
			"type.oid": $("#searchPersonnelType").val(),
			birthday: $("#searchBirthday").val(),
			realState: $("#searchRealState").val(),
			riskRating: $("#searchRiskRating").val(),
			familyRealName: $("#searchFamilyRealName").val(),
			domicile: $("#searchDomicile").val(),
			present: $("#searchPresent").val(),
			eventAppeals: $("#searchEventAppeals").val(),
			experienceResults: $("#searchExperienceResults").val()
		};
		return temp;
	}
	
	$("#exportStuInfoExcel").on('click', function() {
		$("#searchPersonnelForm").submit();
	})
	
	$.ajax({
        type:"get",
        dataType:"json",
        url:"/json/ethnic.json",
        success: function(data) {
	        var searchNation = $("#searchNation");
	        var nations = "<option value=''>===请选择===</option>";
	        $(data).each(function(i,item){
	            nations += "<option value='"+item.en+"'>"+item.name+"</option>";
	        });
	        searchNation.html(nations);
        }
    });
    
    function getNationName(value) {
    	if (value == "Han") {
			return "汉族";
		} else if (value == "Manchu") {
			return "蒙古族";
		} else if (value == "Hui") {
			return "回族";
		} else if (value == "Tibetan") {
			return "藏族";
		} else if (value == "Uyghur") {
			return "维吾尔族";
		} else if (value == "Miao") {
			return "苗族";
		} else if (value == "Yi") {
			return "彝族";
		} else if (value == "Zhuang") {
			return "壮族";
		} else if (value == "Buyei") {
			return "布依族";
		} else if (value == "Korean") {
			return "朝鲜族";
		} else if (value == "Manchu") {
			return "满族";
		} else if (value == "Dong") {
			return "侗族";
		} else if (value == "Yao") {
			return "瑶族";
		} else if (value == "Bai") {
			return "白族";
		} else if (value == "Tujia") {
			return "土家族";
		} else if (value == "Hani") {
			return "哈尼族";
		} else if (value == "Kazakh") {
			return "哈萨克族";
		} else if (value == "Dai") {
			return "傣族";
		} else if (value == "Li") {
			return "黎族";
		} else if (value == "Lisu") {
			return "傈僳族";
		} else if (value == "Va") {
			return "佤族";
		} else if (value == "She") {
			return "畲族";
		} else if (value == "Gaoshan") {
			return "高山族";
		} else if (value == "Lahu") {
			return "拉祜族";
		} else if (value == "Shui") {
			return "水族";
		} else if (value == "Dongxiang") {
			return "东乡族";
		} else if (value == "Nakhi") {
			return "纳西族";
		} else if (value == "Jingpo") {
			return "景颇族";
		} else if (value == "Kyrgyz") {
			return "柯尔克孜族";
		} else if (value == "Monguor") {
			return "土族";
		} else if (value == "Daur") {
			return "达斡尔族";
		} else if (value == "Mulao") {
			return "仫佬族";
		} else if (value == "Qiang") {
			return "羌族";
		} else if (value == "Blang") {
			return "布朗族";
		} else if (value == "Salar") {
			return "撒拉族";
		} else if (value == "Maonan") {
			return "毛南族";
		} else if (value == "Gelao") {
			return "仡佬族";
		} else if (value == "Xibe") {
			return "锡伯族";
		} else if (value == "Achang") {
			return "阿昌族";
		} else if (value == "Pumi") {
			return "普米族";
		} else if (value == "Tajik") {
			return "塔吉克族";
		} else if (value == "Nu") {
			return "怒族";
		} else if (value == "Uzbek") {
			return "乌孜别克族";
		} else if (value == "Russian") {
			return "俄罗斯族";
		} else if (value == "Evenk") {
			return "鄂温克族";
		} else if (value == "Deang") {
			return "德昂族";
		} else if (value == "Bonan") {
			return "保安族";
		} else if (value == "Yughur") {
			return "裕固族";
		} else if (value == "Kinh") {
			return "京族";
		} else if (value == "Tatar") {
			return "塔塔尔族";
		} else if (value == "Derung") {
			return "独龙族";
		} else if (value == "Oroqen") {
			return "鄂伦春族";
		} else if (value == "Nanai") {
			return "赫哲族";
		} else if (value == "Monpa") {
			return "门巴族";
		} else if (value == "Lhoba") {
			return "珞巴族";
		} else if (value == "Jino") {
			return "基诺族";
		}
    }
});