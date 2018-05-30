/*
 * @Description: 定时服务方法 
 */


var schedule = require("node-schedule"); //定时服务
const configHelper = require("./configHelper");
// //https://github.com/node-schedule/node-schedule
// /**
//  * 1.到达时间执行
//  */
// var date = new Date(2017, 12, 19, 15, 20, 0);

// var a = schedule.scheduleJob(date, function() {
//   console.log("执行任务" + new Date());
// });

// /**
//  * 2.符合条件时执行
//  */
// var rule1 = new schedule.RecurrenceRule();

// rule1.second = 01; //按照秒数来执行任务
// // rule1.hour
// // rule1.month
// // rule1.year
// // rule1.nextInvocationDate

// var b = schedule.scheduleJob(rule1, function() {
//   console.log("执行任务" + new Date());
// });

// var rule2 = new schedule.RecurrenceRule();
// rule2.dayOfWeek = [0, new schedule.Range(1, 6)]; //周1至周6
// rule2.hour = 20; //小时达到 20

// var c = schedule.scheduleJob(rule2, function() {
//   console.log("执行任务" + new Date());
// });

// //取消定时任务
// a.cancel();
// b.cancel();
// c.cancel();

// // 简便写法 
// var obj = '* * * * * *' //秒 分 时 天 月 一周中的第N天

// //使用
// var setjob = require("");
// var job = setjob("/5 * * * * *",function(){
//     console.log("每隔5s执行一次任务" + new Date());
// })


var test = async function () {
  console.log("定时服务开始执行");
}

var testSchedule = async function () {
  var time = configHelper.getScheduleJobConfig("testJob");
  return schedule.scheduleJob(time, test);
  
}



module.exports = {
  testSchedule
};