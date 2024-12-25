// import  weeklyProgress  from "./habitsCRUD";
const progressData = JSON.parse(localStorage.getItem('habitProgress')) || {};
let val24 = [];
let val25 = [];
let val26= [];

Object.values(progressData).forEach((habit,index)=>{
    habit.forEach((habitWeek)=>{
        val24.push("Habit No" + habitWeek.habit);
        val25.push(habitWeek.completed);
        val26.push(index+1);
    })
})

 new Chart("stats",{
    type:"line",
    data:{
        labels:val24,
        datasets:[{
            borderColor:"orange",
            data:val25
        }]
    },
    options:{
        legend:{display:false},
        scales:{
            yAxes: [ {ticks:{min:1,max:20}}],
        }
    }

});
