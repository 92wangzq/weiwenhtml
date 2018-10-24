$(function() {
	var userName = $.cookie("userName");
	if(!userName) {
		Ewin.confirm({
			message: "登录超时，请重新登录"
		}).on(function(e) {
			if(!e) {
				return;
			}
			window.location.href = '/login.html';
		});
	}
	//加载左侧treeView
	$.ajax({
		type: "get",
		dataType: "json", //预期服务器返回的数据类型
		url: "/area/children", //url
		success: function(rst) {
			$("#areaTreeView").treeview({
				data: rst,
				showBorder: false,
				levels: 2,
				expandIcon: "glyphicon glyphicon-menu-right",
				collapseIcon: "glyphicon glyphicon-menu-down",
				emptyIcon: "glyphicon glyphicon-stop",
				onNodeSelected: function(event, data) {
					$("#searchAreaOid").val(data.oid);
					$("#lawRelatedTable").bootstrapTable('refresh');
				},
				onNodeUnselected: function(event, data) {
					$("#searchAreaOid").val("");
					$("#lawRelatedTable").bootstrapTable('refresh');
				}
			});
		}
	});
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
			formatter: function(value, row) {
				return getNationName(value);
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
			formatter: function(value, row) {
				return getNationName(value);
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
			field: 'powerAffairsUnit.dictDataName',
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
					'<button type="button" class="RoleOfview btn btn-primary btn-sm">查看</button>',
					'<button type="button" class="RoleOfedit btn btn-primary  btn-sm">修改</button>',
					'<button type="button" class="RoleOfdelete btn btn-primary  btn-sm">删除</button>'
				].join('');
			},
			events: {
				'click .RoleOfview': function(e, value, row, index) {
					$.setDiv("example-basic", row);
					$("#searchPowerAffairsUnit").html(row.powerAffairsUnit.dictDataName);
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
							if (rst.powerAffairsUnit != null) {
								$("#parentDictionary").val(rst.powerAffairsUnit.parent.oid);
								$.ajax({
									type:"get",
									url:"/dictionary/searchChildDictionaryDatas?parentOid="+rst.powerAffairsUnit.parent.oid,
									success: function(result) {
										var powerAffairsUnit = "<option value=''>===请选择===</option>";
										$(result).each(function(i, item) {
											powerAffairsUnit += "<option value='"+item.oid+"'>"+item.dictDataName+"</option>";
										});
										$("#powerAffairsUnit").html(powerAffairsUnit);
										$("#powerAffairsUnit").val(rst.powerAffairsUnit.oid)
									}
								});
							}
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
			originalBirthday: $("#searchOriginalBirthday").val(),
			"area.oid": $("#searchAreaOid").val()
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
		$("#saveLawRelatedForm")[0].reset();
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
	
	$.ajax({
        type:"get",
        dataType:"json",
        url:"/json/ethnic.json",
        success: function(data) {
	        var searchNation= $("#searchNation");
	        var searchOriginalNation = $("#searchOriginalNation");
	        var nation = $("#nation");
	        var originalNation = $("#originalNation");
	        var nations = "<option value=''>===请选择===</option>";
	        $(data).each(function(i,item){
	            nations += "<option value='"+item.en+"'>"+item.name+"</option>";
	        });
	        searchNation.html(nations);
	        searchOriginalNation.html(nations);
	        nation.html(nations);
	        originalNation.html(nations);
        }
    });
    
	$.ajax({
		type:"get",
		url:"/dictionary/searchParentDictionaryDatas?dictionaryValue=UNIT_TYPE",
		success: function(rst) {
			console.log(rst);
			var parentDictionary = "<option value=''>请选择</option>";
			$.each(rst, function(n, val) {
				parentDictionary += "<option value='"+val.oid+"'>"+val.dictDataName+"</option>"
			});
			$("#parentDictionary").html(parentDictionary);
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
})
function getChildDictionaryDatas() {
	alert($("option:selected", $("#parentDictionary")).val());
	$.ajax({
		type:"get",
		url:"/dictionary/searchChildDictionaryDatas?parentOid="+$("option:selected", $("#parentDictionary")).val(),
		success: function(rst) {
			var powerAffairsUnit = "<option value=''>===请选择===</option>";
			$(rst).each(function(i, item) {
				powerAffairsUnit += "<option value='"+item.oid+"'>"+item.dictDataName+"</option>";
			});
			$("#powerAffairsUnit").html(powerAffairsUnit);
		}
	});
}