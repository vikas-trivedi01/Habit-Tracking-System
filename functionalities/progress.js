
// get relevent data from localStorage 
const progressData = JSON.parse(localStorage.getItem('habitProgress')) || {};
const habits = JSON.parse(localStorage.getItem('habits')) || [];

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

    createChart(habitProgress, habitIndex, habit.habitName);
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

    const habitProgress = progressData[habitIndex]; // specific habit
    const weeks = habitProgress.map(habit => `Week ${habit.week}`); //habit = week of habit
    const completedDays = habitProgress.map(habit => habit.completed);
    const streak = habitProgress.map(habit => habit.completed);

    console.log(Math.max(...streak))

    let allWeeksPercentages = []
    habitProgress.forEach((week, index) => {
        allWeeksPercentages.push({ week: index + 1, percentage: week.percentage })
    })

    const weekPercentages = percentage.map(week => week.percentage);

    console.log(Math.max(...weekPercentages))


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
    const habitProgress = progressData[habitIndex];
    const totalWeeks = habitProgress.map(habit => `Week ${habit.week}`).length;
    const totalCompletedDays = habitProgress.reduce((acc, week) => acc + week.completed, 0);

    return { totalWeeks, totalCompletedDays };
}