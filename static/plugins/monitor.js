function drawLayer02Label(canvasObj,text,textBeginX,lineEndX){
	var colorValue = '#04918B';

	var ctx = canvasObj.getContext("2d");

	ctx.beginPath();
	ctx.arc(35,55,2,0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = colorValue;
	ctx.fill();

	ctx.moveTo(35,55);
	ctx.lineTo(60,80);
	ctx.lineTo(lineEndX,80);
	ctx.lineWidth = 1;
	ctx.strokeStyle = colorValue;
	ctx.stroke();

	ctx.font='12px Georgia';
	ctx.fillStyle = colorValue;
	ctx.fillText(text,textBeginX,92);
}

//接入机型占比

var COLOR = {
	MACHINE:{
		TYPE_A:'#0175EE',
		TYPE_B:'#D89446',
		TYPE_C:'#373693',
		TYPE_D:'#25AE4F',
		TYPE_E:'#06B5C6',
		TYPE_F:'#009E9A',
		TYPE_G:'#AC266F',
		TYPE_H:'#039E9A',
		TYPE_I:'#A0266F'
	}
};

function renderLegend(){
	drawLegend(COLOR.MACHINE.TYPE_A,25,'思想');
	drawLegend(COLOR.MACHINE.TYPE_B,50,'历史');
	drawLegend(COLOR.MACHINE.TYPE_C,75,'生物');
	drawLegend(COLOR.MACHINE.TYPE_D,100,'地理');
	drawLegend(COLOR.MACHINE.TYPE_E,125,'化学');
	drawLegend(COLOR.MACHINE.TYPE_F,150,'物理');
	drawLegend(COLOR.MACHINE.TYPE_G,175,'外语');
	drawLegend(COLOR.MACHINE.TYPE_H,200,'语文');
	drawLegend(COLOR.MACHINE.TYPE_I,225,'数学');
}

function drawLegend(pointColor,pointY,text){
	var ctx = $("#layer03_left_01 canvas").get(0).getContext("2d");
	ctx.beginPath();
	ctx.arc(20,pointY,6,0,2*Math.PI);
	ctx.fillStyle = pointColor;
	ctx.fill();
	ctx.font='20px';
	ctx.fillStyle = '#FEFFFE';
	ctx.fillText(text,40,pointY+3);
}


//存储
function renderLayer03Right(){
	drawLayer03Right($("#layer03_right_chart01 canvas").get(0),"#027825",0.18);
	drawLayer03Right($("#layer03_right_chart02 canvas").get(0),"#006DD6",0.36);
	drawLayer03Right($("#layer03_right_chart03 canvas").get(0),"#238681",0.43);
	drawLayer03Right($("#layer03_right_chart04 canvas").get(0),"#238681",0.3);
}

function drawLayer03Right(canvasObj,colorValue,rate){
	var ctx = canvasObj.getContext("2d");
    
	var circle = {
        x : 35,    //圆心的x轴坐标值
        y : 80,    //圆心的y轴坐标值
        r : 30      //圆的半径
    };

	//画扇形
	//ctx.sector(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI);
	//ctx.fillStyle = colorValue;
	//ctx.fill();

	ctx.beginPath();
	ctx.arc(circle.x,circle.y,circle.r,0,Math.PI*2)
	ctx.lineWidth = 10;
	ctx.strokeStyle = '#052639';
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI)
	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.strokeStyle = colorValue;
	ctx.stroke();
	ctx.closePath();
    
	ctx.fillStyle = 'white';
	ctx.font = '20px Calibri';
	ctx.fillText(rate*100+'%',circle.x-15,circle.y+10);

}


function renderChartBar01(){
	var myChart = echarts.init(document.getElementById("layer03_left_02"));
		myChart.setOption(
					 {
						title : {
							text: '',
							subtext: '',
							x:'center'
						},
						tooltip : {
							trigger: 'item',
							formatter: "{b} : {c} ({d}%)"
						},
						legend: {
							show:false,
							x : 'center',
							y : 'bottom',
							data:['思想','历史','生物','地理','化学','物理','外语','语文','数学']
						},
						toolbox: {
						},
						label:{
							normal:{
								show: true, 
								formatter: "{b} \n{d}%"
							} 
						},
						calculable : true,
						color:[COLOR.MACHINE.TYPE_A,COLOR.MACHINE.TYPE_B,COLOR.MACHINE.TYPE_C,COLOR.MACHINE.TYPE_D,COLOR.MACHINE.TYPE_E,COLOR.MACHINE.TYPE_F,COLOR.MACHINE.TYPE_G,COLOR.MACHINE.TYPE_H,COLOR.MACHINE.TYPE_I],
						series : [
							{
								name:'',
								type:'pie',
								radius : [40, 80],
								center : ['50%', '50%'],
								//roseType : 'area',
								data:[
									{value:1.82, name:'思想'},
									{value:4.55, name:'历史'},
									{value:9.09, name:'生物'},
									{value:2, name:'地理'},
									{value:18.18, name:'化学'},
									{value:11.82, name:'物理'},
									{value:13.64, name:'外语'},
									{value:18.18, name:'语文'},
									{value:20.73, name:'数学'}
								]
							}
						]
					}
		);

}


// function renderLayer04Left(){
// 	var myChart = echarts.init(document.getElementById("layer04_left_chart"));
// 	myChart.setOption(
// 		{
// 			title: {
// 				text: ''
// 			},
// 			tooltip : {
// 				trigger: 'axis'
// 			},
// 			legend: {
// 				data:[]
// 			},
// 			grid: {
// 				left: '3%',
// 				right: '4%',
// 				bottom: '5%',
// 				top:'4%',
// 				containLabel: true
// 			},
// 			xAxis :
// 			{
// 				type : 'category',
// 				boundaryGap : false,
// 				data : getLatestDays(31),
// 				axisLabel:{
// 					textStyle:{
// 						color:"white", //刻度颜色
// 						fontSize:8  //刻度大小
// 					},
// 					rotate:45,
// 					interval:2
// 				},
// 				axisTick:{show:false},
// 				axisLine:{
// 					show:true,
// 					lineStyle:{
// 						color: '#0B3148',
// 						width: 1,
// 						type: 'solid'
// 					}
// 				}
// 			},
// 			yAxis : 
// 			{
// 				type : 'value',
// 				axisTick:{show:false},
// 				axisLabel:{
// 					textStyle:{
// 						color:"white", //刻度颜色
// 						fontSize:8  //刻度大小
// 						}
// 				},
// 				axisLine:{
// 					show:true,
// 					lineStyle:{
// 						color: '#0B3148',
// 						width: 1,
// 						type: 'solid'
// 					}
// 				},
// 				splitLine:{
// 					show:false
// 				}
// 			},
// 			tooltip:{
// 				formatter:'{c}',
// 				backgroundColor:'#FE8501'
// 			},
// 			series : [
// 				{
// 					name:'',
// 					type:'line',
// 					smooth:true,
// 					areaStyle:{
// 						normal:{
// 							color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#026B6F'}, {offset: 1, color: '#012138' }], false),
// 							opacity:0.2
// 						}
// 					},
// 					itemStyle : {  
//                             normal : {  
//                                   color:'#009991'
//                             },
// 							lineStyle:{
// 								normal:{
// 								color:'#009895',
// 								opacity:1
// 							}
// 						}
//                     },
// 					symbol:'none',
// 					data:[48, 52, 45, 46, 89, 120, 110,100,88,96,88,45,78,67,89,103,104,56,45,104,112,132,120,110,89,95,90,89,102,110,110]
// 				}
// 			]
// 		}
	
// 	);
// }

function renderLayer04Left(){
	var myChart = echarts.init(document.getElementById("layer04_left_chart"));
	myChart.setOption({
		title: {
			text: ''
		},
		tooltip: {
			formatter:function (params, ticket, callback) {
				var htmlStr = '';
				for(var i=0;i<params.length;i++){
				  var param = params[i];
				  var xName = param.name;//x轴的名称
				  var seriesName = param.seriesName;//图例名称
				  var value = param.value;//y轴值
				  var color = param.color;//图例颜色
				  
				  if(i===0){
					htmlStr += xName + '<br/>';//x轴的名称
				  }
				  htmlStr +='<div>';
				  //为了保证和原来的效果一样，这里自己实现了一个点的效果
				  htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+color+';"></span>';
				  
				  //圆点后面显示的文本
				  htmlStr += seriesName + '：' + value + '%';
				  
				  htmlStr += '</div>';
				}
				return htmlStr;
			   },
			trigger: 'axis'
		},
		legend: {
			top:20,
			right:5,
			textStyle:{
				color:'white'
			},
			orient:'vertical',
			data:[
					{name:'非常好',icon:'circle'},
					{name:'良好',icon:'circle'},
					{name:'正常',icon:'circle'},
					{name:'不佳',icon:'circle'}
				]
		},
		grid: {
			left: '3%',
			right: '16%',
			bottom: '3%',
			top:'3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			axisTick:{show:false},
			axisLabel:{
				textStyle:{
					color:"white", //刻度颜色
					fontSize:8  //刻度大小
					}
			},
			axisLine:{
				show:true,
				lineStyle:{
					color: '#0B3148',
					width: 1,
					type: 'solid'
				}
			},
			data: ['2018/12/24','2018/12/25','2018/12/26','2018/12/27','2018/12/28']
			//get10MinutesScale()
		},
		yAxis: {
			type: 'value',
			axisTick:{show:false},
			axisLabel:{
				formatter:'{value} %',
				textStyle:{
					color:"white", //刻度颜色
					fontSize:8  //刻度大小
					}
			},
			axisLine:{
				show:true,
				lineStyle:{
					color: '#0B3148',
					width: 1,
					type: 'solid'
				}
			},
			splitLine:{
				show:false
			}
		},
		series: [
					{
						name:'非常好',
						type:'line',
						itemStyle : {  
								normal : {  
								color:'#F3891B'
							},
							lineStyle:{
								normal:{
								color:'#F3891B',
								opacity:1
									}
							}
						},  
						data:[9.09, 13.64, 22.73, 23.64, 9.09]
					},
					{
						name:'良好',
						type:'line',
						itemStyle : {  
								normal : {  
								color:'#006AD4'
							},
							lineStyle:{
								normal:{
								color:'#F3891B',
								opacity:1
									}
							}
						},
						data:[18.18, 36.36, 36.36, 31.82, 41.82]
					},
					{
						name:'正常',
						type:'line',
						itemStyle : {  
								normal : {  
								color:'#009895'
							},
							lineStyle:{
								normal:{
								color:'#009895',
								opacity:1
									}
							}
						},
						data:[36.36, 45.45, 32.73, 40.91, 31.82]
					},
					{
						name:'不佳',
						type:'line',
						itemStyle : {  
								normal : {  
								color:'#108762'
							},
							lineStyle:{
								normal:{
								color:'#108762',
								opacity:1
									}
							}
						},
						data:[36.36, 4.55, 8.18, 3.64, 17.27]
					}
				]
	}	
);
}




function renderLayer05Right(){
	var myChart = echarts.init(document.getElementById("layer05_right_chart"));
	myChart.setOption({
			title: {
				text: ''
			},
			tooltip: {formatter:function (params, ticket, callback) {
				var htmlStr = '';
				for(var i=0;i<params.length;i++){
				  var param = params[i];
				  var xName = param.name;//x轴的名称
				  var seriesName = param.seriesName;//图例名称
				  var value = param.value;//y轴值
				  var color = param.color;//图例颜色
				  
				  if(i===0){
					htmlStr += xName + '<br/>';//x轴的名称
				  }
				  htmlStr +='<div>';
				  //为了保证和原来的效果一样，这里自己实现了一个点的效果
				  htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+color+';"></span>';
				  
				  //圆点后面显示的文本
				  htmlStr += seriesName + '：' + value + '%';
				  
				  htmlStr += '</div>';
				}
				return htmlStr;
			   },
				trigger: 'axis'
			},
			legend: {
				top:20,
				right:5,
				textStyle:{
					color:'white'
				},
				orient:'vertical',
				data:[
						{name:'开心',icon:'circle'},
						{name:'正常',icon:'circle'},
						{name:'低落',icon:'circle'}
					]
			},
			grid: {
				left: '3%',
				right: '16%',
				bottom: '3%',
				top:'3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisTick:{show:false},
				axisLabel:{
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
						}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				},
				data: ['2018/12/24','2018/12/25','2018/12/26','2018/12/27','2018/12/28']
				//get10MinutesScale()
			},
			yAxis: {
				type: 'value',
				axisTick:{show:false},
				axisLabel:{
					formatter:'{value} %',
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
						}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				},
				splitLine:{
					show:false
				}
			},
			series: [
						{
							name:'开心',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#F3891B'
								},
								lineStyle:{
									normal:{
									color:'#F3891B',
									opacity:1
										}
								}
							},  
							data:[35,30,38,41,45]
						},
						{
							name:'正常',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#006AD4'
								},
								lineStyle:{
									normal:{
									color:'#F3891B',
									opacity:1
										}
								}
							},
							data:[56,65,55,50,51]
						},
						{
							name:'低落',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#009895'
								},
								lineStyle:{
									normal:{
									color:'#009895',
									opacity:1
										}
								}
							},
							data:[9,5,7,9,1]
						}
					]
		}	
	);
}




function renderLayer04Right(){
	var myChart = echarts.init(document.getElementById("layer04_right_chart"));
	myChart.setOption({
			title: {
				text: ''
			},
			tooltip: {formatter:function (params, ticket, callback) {
				var htmlStr = '';
				for(var i=0;i<params.length;i++){
				  var param = params[i];
				  var xName = param.name;//x轴的名称
				  var seriesName = param.seriesName;//图例名称
				  var value = param.value;//y轴值
				  var color = param.color;//图例颜色
				  
				  if(i===0){
					htmlStr += xName + '<br/>';//x轴的名称
				  }
				  htmlStr +='<div>';
				  //为了保证和原来的效果一样，这里自己实现了一个点的效果
				  htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+color+';"></span>';
				  
				  //圆点后面显示的文本
				  htmlStr += seriesName + '：' + value + '%';
				  
				  htmlStr += '</div>';
				}
				return htmlStr;
			   },
				trigger: 'axis'
			},
			legend: {
				top:20,
				right:5,
				textStyle:{
					color:'white'
				},
				orient:'vertical',
				data:[
						{name:'积极',icon:'circle'},
						{name:'正常',icon:'circle'},
						{name:'疲惫',icon:'circle'}
					]
			},
			grid: {
				left: '3%',
				right: '16%',
				bottom: '3%',
				top:'3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisTick:{show:false},
				axisLabel:{
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
						}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				},
				data: ['2018/12/24','2018/12/25','2018/12/26','2018/12/27','2018/12/28']
				//get10MinutesScale()
			},
			yAxis: {
				type: 'value',
				axisTick:{show:false},
				axisLabel:{
					formatter:'{value} %',
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
						}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				},
				splitLine:{
					show:false
				}
			},
			series: [
						{
							name:'积极',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#F3891B'
								},
								lineStyle:{
									normal:{
									color:'#F3891B',
									opacity:1
										}
								}
							},  
							data:[18.18,40.91,45.45,47.27,54.55]
						},
						{
							name:'正常',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#006AD4'
								},
								lineStyle:{
									normal:{
									color:'#F3891B',
									opacity:1
										}
								}
							},
							data:[45.45,50.00,40.91,42.73,40.91]
						},
						{
							name:'疲惫',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#009895'
								},
								lineStyle:{
									normal:{
									color:'#009895',
									opacity:1
										}
								}
							},
							data:[36.36,9.09,13.64,10.00,4.55]
						}
					]
		}	
	);
}

function get10MinutesScale()
{
	var currDate = new Date();
	var odd = currDate.getMinutes()%10;
	var returnArr = new Array();
	currDate.setMinutes(currDate.getMinutes()-odd);
	for(var i = 0; i <7; i++){
		returnArr.push(currDate.getHours()+":"+(currDate.getMinutes()<10?("0"+currDate.getMinutes()):currDate.getMinutes()));
		currDate.setMinutes(currDate.getMinutes()-10);
	}
	return returnArr;
}


function getLatestDays(num)
{
	var currentDay = new Date();
	var returnDays = [];
	for (var i = 0 ; i < num ; i++)
	{
		currentDay.setDate(currentDay.getDate() - 1);
		returnDays.push((currentDay.getMonth()+1)+"/"+currentDay.getDate());
	}
	return returnDays;
}