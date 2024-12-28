
// get relevent data from localStorage 
const progressData = JSON.parse(localStorage.getItem('habitProgress')) || {};
const habits = JSON.parse(localStorage.getItem('habits')) || [];

function getHabitProgress(habitIndex) {
    return progressData[habitIndex];
}

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

    const insightsSelectorWeekly = document.querySelector('#insights-selector-weekly');
    const insightsSelectorAverage = document.querySelector('#insights-selector-average');

    const weeklyOption = document.createElement('option');
    weeklyOption.id = `${habitIndex}`;
    weeklyOption.value = `${habitIndex}`;
    weeklyOption.innerText = `${habit.habitName}`;


    const averageOption = document.createElement('option');
    averageOption.id = `${habitIndex}`;
    averageOption.value = `${habitIndex}`;
    averageOption.innerText = `${habit.habitName}`;

    insightsSelectorWeekly.appendChild(weeklyOption);
    insightsSelectorAverage.appendChild(averageOption);


});

const insightsSelectorWeekly = document.querySelector('#insights-selector-weekly');

insightsSelectorWeekly.addEventListener('change', (e) => {
    const selectedHabitIndex = e.target.value;
    displayWeeklyInsights(selectedHabitIndex);
});
const insightsSelectorAverage = document.querySelector('#insights-selector-average');

insightsSelectorAverage.addEventListener('change', (e) => {
    const selectedHabitIndex = e.target.value;
    displayAverageInsights(selectedHabitIndex);
});

document.querySelector('#top-habits').addEventListener('click', () => {

    const insightsContainer = document.querySelector('#progress-insights-top-habits');
    const insightsContainerWeekly = document.querySelector('#progress-insights-weekly');
    const insightsContainerAverage = document.querySelector('#progress-insights-average');
    const insightsContainerSummaryHabits = document.querySelector('#progress-insights-summary-habits');


    if (insightsContainerWeekly.classList.contains("current-insight")) {
        insightsContainerWeekly.classList.add("hide");
        insightsContainerWeekly.classList.remove("current-insight");
    }
    if (insightsContainerAverage.classList.contains("current-insight")) {
        insightsContainerAverage.classList.add("hide");
        insightsContainerAverage.classList.remove("current-insight");
    }
    if (insightsContainerSummaryHabits.classList.contains("current-insight")) {
        insightsContainerSummaryHabits.classList.add("hide");
        insightsContainerSummaryHabits.classList.remove("current-insight");
    }
    if (!insightsContainer.classList.contains("current-insight")) {
        insightsContainer.classList.add("current-insight");
        insightsContainer.classList.remove("hide");
    }


    const { topHabits } = analyzeHabitProgress();

    // if (!topHabits) {
    //     const notFound = document.createElement('h3');
    //     notFound.innerText = "No Data Found !";

    //     insights.appendChild(notFound);
    //     insightsContainer.appendChild(insights);
    // }
    // else {

    topHabits.forEach(habit => {

        const insights = document.createElement('div');
        insights.classList.add("insights-container");

        const habitTitle = document.createElement('h3');

        const hrElem = document.createElement('hr');
        hrElem.style.border = "3px solid #75ebb0";

        const habitNumber = document.createElement('h5');

        habitTitle.innerHTML = `Habit Name <br>${habit.habitName}`;
        habitNumber.innerHTML = `Habit No <br> ${habit.habitNumber}`;

        insights.appendChild(habitTitle);
        insights.appendChild(hrElem);
        insights.appendChild(habitNumber);

        insightsContainer.appendChild(insights);

    })
    // }
})



document.querySelector('#summary-habits').addEventListener('click', () => {

    const insightsContainer = document.querySelector('#progress-insights-summary-habits');
    const insightsContainerWeekly = document.querySelector('#progress-insights-weekly');
    const insightsContainerAverage = document.querySelector('#progress-insights-average');
    const insightsContainerTopHabits = document.querySelector('#progress-insights-top-habits');


    if (insightsContainerWeekly.classList.contains("current-insight")) {
        insightsContainerWeekly.classList.add("hide");
        insightsContainerWeekly.classList.remove("current-insight");
    }
    if (insightsContainerAverage.classList.contains("current-insight")) {
        insightsContainerAverage.classList.add("hide");
        insightsContainerAverage.classList.remove("current-insight");
    }
    if (insightsContainerTopHabits.classList.contains("current-insight")) {
        insightsContainerTopHabits.classList.add("hide");
        insightsContainerTopHabits.classList.remove("current-insight");
    }
    if (!insightsContainer.classList.contains("current-insight")) {
        insightsContainer.classList.add("current-insight");
        insightsContainer.classList.remove("hide");
    }

    const { finalSummary } = analyzeHabitProgress();

    finalSummary.forEach(habit => {

        const insights = document.createElement('div');
        insights.classList.add("insights-container");

        const habitTitle = document.createElement('h3');

        const hrElem = document.createElement('hr');
        hrElem.style.border = "3px solid #75ebb0";

        const habitNumber = document.createElement('h4');
        const habitAverageProgress = document.createElement('p');
        const topHabit = document.createElement('p');

        const habitTotalWeeks = document.createElement('p');
        const habitTotalDays = document.createElement('p');

        const habitBestWeekPercentage = document.createElement('p');
        const habitBestWeekNumber = document.createElement('p');

        const habitStreak = document.createElement('p');

        habitTitle.innerHTML = `Habit Name : ${habit.habitName}`;
        habitNumber.innerHTML = `Habit No : ${habit.habitNumber}`;
        habitAverageProgress.innerHTML = `
            <br>
            Average Progress Percentage Out Of All Weeks : 
            ${!isNaN(habit.averageProgress)
                ? habit.averageProgress + '%'
                : "<br>Not completed any day of this habit"
            }
          `;
        topHabit.innerHTML = `
          <br>
          Habits Having Average Progress Percentage Greater Than <i>80%</i> :
          ${habit.isTopHabit
                ? "This Habit Has Average Progress Percentage Greater Than <i>80%</i>"
                : "This Habit Doesn't Have Average Progress Percentage Greater Than <i>80%</i>"
            }
          `;
        habitTotalWeeks.innerHTML = `<br>Total Weeks : ${habit.total.totalWeeks}`;
        habitTotalDays.innerHTML = `<br>Total Completed Days : ${habit.total.totalCompletedDays}`;

        habitBestWeekPercentage.innerHTML = `<br>Week With Highest Completion Percentage : ${habit.best.bestWeekPercentage}`;
        habitBestWeekNumber.innerHTML = `<br>Week No : ${habit.best.bestWeekNum}`;

        habitStreak.innerHTML = `<br>Maximum Days Completed Out Of All Weeks : ${habit.streak}`;

        insights.appendChild(habitTitle);
        insights.appendChild(hrElem);
        insights.appendChild(habitNumber);

        insights.appendChild(habitAverageProgress);

        insights.appendChild(habitTotalWeeks);
        insights.appendChild(habitTotalDays);

        insights.appendChild(habitBestWeekPercentage);
        insights.appendChild(habitBestWeekNumber);

        insights.appendChild(habitStreak);


        insightsContainer.appendChild(insights);

    })
})

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


    const bestWeekPercentage = Math.max(...allWeeksPercentages.map(week => week.percentage));
    const bestWeekNum = allWeeksPercentages.find(week => week.percentage == bestWeekPercentage).weekNumber;
    return { maximumStreak, bestWeekPercentage, bestWeekNum };

}

function analyzeHabitProgress() {
    let habitAverageProgress = [];//store average progress of each habit (average of all weeks)
    let topHabits = [];//store top habits with high average progress
    const finalSummary = [];//store the final summary of habits

    Object.values(progressData).forEach((weekData, habitIndex) => {
        const totalPercentage = weekData.reduce((sum, week) => sum + week.percentage, 0);
        const averagePercentage = (totalPercentage / weekData.length).toFixed(2);

        habitAverageProgress.push({
            habitNumber: habitIndex + 1,
            habitName: habits[habitIndex].habitName,
            averageProgress: parseFloat(averagePercentage),
        });
    });

    habitAverageProgress.forEach((habit) => {
        if (habit.averageProgress >= 80) {
            topHabits.push({ habitNumber: habit.habitNumber, habitName: habit.habitName, });
        }
    });

    habitAverageProgress.forEach((habit, habitIndex) => {
        const { totalWeeks, totalCompletedDays } = calculateHabitProgress(habitIndex);
        const { maximumStreak, bestWeekPercentage, bestWeekNum } = calculateProgressInsights(habitIndex);

        finalSummary.push({
            habitNumber: habit.habitNumber,
            habitName: habit.habitName,
            averageProgress: habit.averageProgress,
            isTopHabit: topHabits.some(topHabit => topHabit.habitNumber === habit.habitNumber),
            total: {
                totalWeeks,
                totalCompletedDays
            },
            best: {
                bestWeekPercentage,
                bestWeekNum
            },
            streak: maximumStreak

        });
    });


    return { habitAverageProgress, topHabits, finalSummary };
}


function displayWeeklyInsights(habitIndex) {
    const insightsContainer = document.querySelector('#progress-insights-weekly');
    const insightsContainerAverage = document.querySelector('#progress-insights-average');
    const insightsContainerTopHabits = document.querySelector('#progress-insights-top-habits');
    const insightsContainerSummaryHabits = document.querySelector('#progress-insights-summary-habits');


    if (insightsContainerAverage.classList.contains("current-insight")) {
        insightsContainerAverage.classList.add("hide");
        insightsContainerAverage.classList.remove("current-insight");
    }
    if (insightsContainerTopHabits.classList.contains("current-insight")) {
        insightsContainerTopHabits.classList.add("hide");
        insightsContainerTopHabits.classList.remove("current-insight");
    }
    if (insightsContainerSummaryHabits.classList.contains("current-insight")) {
        insightsContainerSummaryHabits.classList.add("hide");
        insightsContainerSummaryHabits.classList.remove("current-insight");
    }
    if (!insightsContainer.classList.contains("current-insight")) {
        insightsContainer.classList.add("current-insight");
        insightsContainer.classList.remove("hide");
    }

    const insights = document.createElement('div');
    insights.classList.add("insights-container");

    const { maximumStreak, bestWeekPercentage, bestWeekNum } = calculateProgressInsights(habitIndex);

    // if (!maximumStreak && !bestWeekPercentage && !bestWeekNum) {

    //     const notFound = document.createElement('h3');
    //     notFound.innerText = "No Data Found !";

    //     insights.appendChild(notFound);
    //     insightsContainer.appendChild(insights);
    // }
    // else {

    const habitTitle = document.createElement('h3');

    const hrElem = document.createElement('hr');
    hrElem.style.border = "3px solid rgb(206, 202, 205)";

    const maximumStreakElem = document.createElement('p');
    const bestWeekElem = document.createElement('p');

    habitTitle.innerText = `Habit Name : ${habits[habitIndex].habitName}`;
    maximumStreakElem.innerText = `Maximum Streak Among All Weeks : ${maximumStreak}`;
    bestWeekElem.innerHTML = `Best Week No : ${bestWeekNum} <br> Best Week Percentage :${bestWeekPercentage}%`;

    insights.appendChild(habitTitle);
    insights.appendChild(hrElem);
    insights.appendChild(maximumStreakElem);
    insights.appendChild(bestWeekElem);
    insightsContainer.appendChild(insights);
    // }

}

function displayAverageInsights(habitIndex) {
    const insightsContainer = document.querySelector('#progress-insights-average');
    const insightsContainerWeekly = document.querySelector('#progress-insights-weekly');
    const insightsContainerTopHabits = document.querySelector('#progress-insights-top-habits');
    const insightsContainerSummaryHabits = document.querySelector('#progress-insights-summary-habits');



    if (insightsContainerWeekly.classList.contains("current-insight")) {
        insightsContainerWeekly.classList.add("hide");
        insightsContainerWeekly.classList.remove("current-insight");
    }
    if (insightsContainerTopHabits.classList.contains("current-insight")) {
        insightsContainerTopHabits.classList.add("hide");
        insightsContainerTopHabits.classList.remove("current-insight");
    }
    if (insightsContainerSummaryHabits.classList.contains("current-insight")) {
        insightsContainerSummaryHabits.classList.add("hide");
        insightsContainerSummaryHabits.classList.remove("current-insight");
    }
    if (!insightsContainer.classList.contains("current-insight")) {
        insightsContainer.classList.add("current-insight");
        insightsContainer.classList.remove("hide");
    }

    const { habitAverageProgress: allHabitsAverageProgress } = analyzeHabitProgress();

    const habitAverageProgress = allHabitsAverageProgress[habitIndex];


    const insights = document.createElement('div');
    insights.classList.add("insights-container");

    const habitTitle = document.createElement('h3');

    const hrElem = document.createElement('hr');
    hrElem.style.border = "3px solid #75b0eb";

    const habitNumber = document.createElement('p');
    const averageProgress = document.createElement('p');

    habitTitle.innerText = `Habit Name : ${habitAverageProgress.habitName}`;
    habitNumber.innerHTML = `<br>Habit No : ${habitAverageProgress.habitNumber}`;
    averageProgress.innerHTML = `
    <br>
    Average Progress Percentage Out Of All Weeks : 
    ${!isNaN(habitAverageProgress.averageProgress)
            ? habitAverageProgress.averageProgress + '%'
            : "<br>Not completed any day of this habit"}
  `;

    insights.appendChild(habitTitle);
    insights.appendChild(hrElem);
    insights.appendChild(habitNumber);
    insights.appendChild(averageProgress);

    insightsContainer.appendChild(insights);
}