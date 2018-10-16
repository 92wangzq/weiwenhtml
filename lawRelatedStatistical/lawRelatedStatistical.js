$(function() {
	"use strict";
	$.ajax({
		type: "get",
		url: "/lawRelated/caseTypeStatistical",
		contentType: "application/json; charset=utf-8",
		success: function(rst) {
			//BAR CHART  
			new Morris.Bar({
				element: 'bar-chart',
				resize: true,
				data: rst,
				barColors: ['#00a65a', '#f56954', '#00A0E9'],
				xkey: 'month',
				ykeys: ['xz', 'xs', 'ms'],
				ymax: 'auto',
				units: '',
				labels: ['民事案件', '刑事案件', '行政案件'],
				hideHover: 'true',
				hoverFillColor: '#00a65a'
			});
		}
	});

	$.ajax({
		type: "get",
		url: "/lawRelated/caseTypeStatistical",
		contentType: "application/json; charset=utf-8",
		success: function(rst) {
			//LINE CHART
			new Morris.Line({
				element: 'line-chart',
				resize: true,
				data: rst,
				xkey: 'month',
				ykeys: ['xz', 'xs', 'ms'],
				labels: ['民事案件', '刑事案件', '行政案件'],
				hideHover: 'true',
				lineColors: ['#00a65a', '#f56954', '#00A0E9']
				//				element(必填)：要放置图标区域的id
				//				data(必填)：图表的数据(就是从后台返回的数据)
				//				xkey(必填)：要显示在x轴的数据的名称(x轴只能放置时间格式的数据，允许的时间格式有 2018, 2018 Q1, 2018 W1, 2018-07-13, 2018-07-13, 2018-07-13 16:55, 2018-07-13 16:55:00, 2018-07-13 16:55:00.000 等格式)
				//				ykeys(必填)：要是在y轴的数据的名称
				//				labels(必填):对应ykeys的描述名称
				//				linewidth(选填)：线的宽度 单位是px 默认值为3
				//				pointSize(选填)：点(x轴数据和y轴数据的交点)的半径，单位px 默认值为4
				//				lineColors(选填)：线和点的颜色阵列 默认值['#0b62a4', '#7A92A3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed']
				//				ymax(选填)：y轴的最大值。可以设置为"auto" 让 morris.js 自动计算也可以设置为 "auto 数字"来确保y轴的最大值 默认值为auto
				//				ymin(选填)：y轴的最小值。可以设置为"auto" 让 morris.js 自动计算也可以设置为 "auto 数字"来确保y轴的最小值 默认值为"auto 0"
				//				smooth(选填)：设置线是否有弧度 false没有弧度 true有弧度 默认为true
				//				hideHover(选填)：设置鼠标滑出时提示框是否隐藏 true则立即隐藏 false则不隐藏 默认为false
				//				parseTime(选填)：设置根据x轴的数据来产生相应的时间间距 false则时间间距相同 默认为true
				//				units(选填)：y轴的单位 默认无
				//				dataFormat(选填): 把毫秒转换成时间字符串 默认为:function (x) { return new Date(x).toString(); }
				//				marginTop(必填)：图表区域的上方边距 默认值为25
				//				marginRigth(必填):图表区域的右边边距 默认值为25
				//				marginBottom(必填):图表区域的下方边距 默认值为30
				//				marginLeft(必填)：图表区域的左边边距 默认值为25
				//				numLines(必填)：图表y轴要切成几等份
				//				gridLineColor(选填): 图表y轴要切成几等份的线的颜色 默认值为：#aaa
				//				gridTextColor(选填)：图表y轴和x轴上的文字颜色 默认值：#888
				//				gridTextSize(选填): 图表x轴和y轴上的文字的大小 单位是px 默认值为12
				//				gridStorkeWidth(选填): 图表y轴要切成几等份的线的宽度 单位是px 默认值是0.5
				//				hoverPaddingY(选填): 提示信息框的上下文内距 默认值 5
				//				hoverMargin(选填)：提示信息框的边距 默认值 10
				//				hoverBorderColor(选填)：提示信息框的边框颜色  默认值为 #ccc
				//				hoverBorderWidth(选填)：提示信息框的边框宽度 默认值为 2 
				//				hoverOpacity(选填): 提示信息框的不透明度 默认值为0.5 
				//				hoverLabelColor(选填): 提示信息框文字的颜色 默认值为 #444
				//				hoverFontSize(选填): 提示信息框的文字大小
			});
		}
	});

	//DONUT CHART
	$.ajax({
		type: "get",
		url: "/lawRelated/caseTypeStatisticalDonut",
		success: function(rst) {
			new Morris.Donut({
				element: 'sales-chart',
				resize: true,
				colors: ["#3c8dbc", "#f56954", "#00a65a"],
				data: rst,
				hideHover: 'true'
			});
		}
	});
});