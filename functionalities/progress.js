
// get relevent data from localStorage 
const progressData = JSON.parse(localStorage.getItem('habitProgress')) || {};
const habits = JSON.parse(localStorage.getItem('habits')) || [];

function getHabitProgress(habitIndex) {
    return progressData[habitIndex];
}
calculateTopHabits();
// container to hold all habit's charts
const progressContainer = document.querySelector('.progress-section-container');

//iterate through all habits to process each habit

habits.forEach((habit, habitIndex) => {

    const habitContainer = document.createElement('div');
    habitContainer.classList.add('habit-progress-container');


    const habitContainerHeader = document.createElement('div');
    habitContainerHeader.classList.add('habit-container-header');

    const habitContainerTitle = document.createElement('h4');
    habitContainerTitle.innerText = `Habit : ${habit.habitName}`;
    habitContainerTitle.classList.add('habit-container-title');


    const { totalWeeks, totalCompletedDays } = calculateHabitProgress(habitIndex);

    const habitContainerTotalWeeks = document.createElement('p');
    habitContainerTotalWeeks.innerText = `Total Weeks : ${totalWeeks}`;
    habitContainerTotalWeeks.classList.add('habit-container-total-weeks');

    const habitContainerTotalDays = document.createElement('p');
    habitContainerTotalDays.innerText = `Total Completed Days : ${totalCompletedDays}`;
    habitContainerTotalDays.classList.add('habit-container-total-days');


    const habitCanvasContainer = document.createElement('div');
    habitCanvasContainer.classList.add('habit-canvas-container');
    const habitProgress = document.createElement('canvas');

    habitProgress.id = `progress-chart-${habitIndex}`;
    habitProgress.style.width = '100%';
    habitProgress.style.maxWidth = '800px';

    habitCanvasContainer.appendChild(habitProgress);

    const chartIcon = createChartIcon(habitCanvasContainer);//pass canvas to toggle it's visibility using an icon

    habitContainerHeader.appendChild(habitContainerTitle);
    habitContainerHeader.appendChild(chartIcon);
    habitContainerHeader.appendChild(habitContainerTotalDays);
    habitContainerHeader.appendChild(habitContainerTotalWeeks);

    habitContainer.appendChild(habitContainerHeader);
    habitContainer.appendChild(habitCanvasContainer);

    progressContainer.appendChild(habitContainer);

    createChart(habitProgress, habitIndex);

    const insightsSelector = document.querySelector('#progress-insights #insights-selector');
    const habitOption = document.createElement('option');
    habitOption.id = `${habitIndex}`;
    habitOption.value = `${habitIndex}`;
    habitOption.innerText = `${habit.habitName}`;
    insightsSelector.appendChild(habitOption);

});
const insightsSelector = document.querySelector('#insights-selector');
insightsSelector.addEventListener('change', (e) => {
    const selectedHabitIndex = e.target.value;
    displayInsights(selectedHabitIndex);
});
function createChartIcon(habitChart) {
    const chartIcon = document.createElement("button");

    chartIcon.innerHTML = '<i class="fa-solid fa-chart-line"></i>';
    chartIcon.setAttribute("isChartVisible", "false");
    chartIcon.title = "View Chart";
    chartIcon.classList.add("canvas-expand-icon", "canvas-expand-color");
    habitChart.classList.add("hide")

    chartIcon.addEventListener("click", () => {

        let isChartVisible = chartIcon.getAttribute("isChartVisible") === "true";

        chartIcon.classList.remove(!isChartVisible ? "canvas-expand-color" : "canvas-expanded-color");
        chartIcon.title = !isChartVisible ? "Hide Chart" : "View Chart";
        chartIcon.innerHTML = isChartVisible ? '<i class="fa-solid fa-chart-line"></i>' : '<i class="fa-solid fa-rectangle-xmark"></i>';

        habitChart.classList.remove(isChartVisible ? "show" : "hide");
        habitChart.classList.add(isChartVisible ? "hide" : "show");


        chartIcon.classList.add(!isChartVisible ? 'canvas-expanded-color' : 'canvas-expand-color');

        chartIcon.setAttribute("isChartVisible", !isChartVisible);

    })

    return chartIcon;

}

// function to create habit's chart
function createChart(canvas, habitIndex) {

    const habitProgress = getHabitProgress(habitIndex); // specific habit
    const weeks = habitProgress.map(habit => `Week ${habit.week}`); //habit = week of habit
    const completedDays = habitProgress.map(habit => habit.completed);

    new Chart(canvas, {
        type: "line",
        data: {
            labels: weeks,
            datasets: [{
                fill: false,
                label: 'Completed Days',
                data: completedDays,
                borderColor: 'rgb(0, 0, 0)',
                tension: 0.4,
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Days Completed",
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Weeks"
                    }
                }
            }
        }
    });
}

function calculateHabitProgress(habitIndex) {
    const habitProgress = getHabitProgress(habitIndex);

    const totalWeeks = habitProgress.map(habit => `Week ${habit.week}`).length;
    const totalCompletedDays = habitProgress.reduce((acc, week) => acc + week.completed, 0);

    return { totalWeeks, totalCompletedDays };
}

function calculateProgressInsights(habitIndex) {
    const habitProgress = getHabitProgress(habitIndex);
    let allWeeksPercentages = [];

    const streaks = habitProgress.map(week => week.completed);

    const maximumStreak = Math.max(...streaks);

    habitProgress.forEach((week, weekIndex) => {
        allWeeksPercentages.push({ weekNumber: weekIndex + 1, percentage: week.percentage })
    })


    const bestWeek = Math.max(...allWeeksPercentages.map(week => week.percentage));
    const bestWeekNum = allWeeksPercentages.find(week => week.percentage == bestWeek).weekNumber;
    return { maximumStreak, bestWeek, bestWeekNum };

}

function calculateTopHabits(){
    let habitAverageProgress = [];//store average progress of each habit
    let topHabits = [];//store top habits with high average progress
    const finalSummary = [];//store the final summary of habits

    //calculate average progress for each habit
    Object.values(progressData).forEach((weekData,habitIndex)=>{
        const totalPercentage = weekData.reduce((sum,week)=>sum + week.percentage,0);
        const averagePercentage = (totalPercentage/weekData.length).toFixed(2);

        habitAverageProgress.push({
            habitNumber : habitIndex + 1,
            habitName : habits[habitIndex].habitName,
            averageProgress:parseFloat(averagePercentage),
        });
    });

    habitAverageProgress.forEach((habit)=>{
        if(habit.averageProgress >= 80){
            topHabits.push({habitNumber:habit.habitNumber,habitName:habit.habitName,});
        }
    });

    habitAverageProgress.forEach((habit)=>{
        finalSummary.push(
            {
                habitNumber : habit.habitNumber,
                habitName:  habit.habitName,
                averageProgress : habit.averageProgress,
                hasStar : topHabits.some(topHabit => topHabit.habitNumber === habit.habitNumber),  

            }
        );
    });

}


function displayInsights(habitIndex) {
    const insightsContainer = document.querySelector('#progress-insights');
    const { maximumStreak, bestWeek, bestWeekNum } = calculateProgressInsights(habitIndex);
    const insights = document.createElement('div');
    const maximumStreakElem = document.createElement('p');
    const bestWeekElem = document.createElement('p');

    maximumStreakElem.innerText = `${maximumStreak}`;
    bestWeekElem.innerText = `Week No ${bestWeekNum} : Percentage :${bestWeek}%`;

    insights.appendChild(maximumStreakElem);
    insights.appendChild(bestWeekElem);

    insightsContainer.appendChild(insights);
}