const progressData = JSON.parse(localStorage.getItem('habitProgress')) || {};
const habits = JSON.parse(localStorage.getItem('habits')) || [];
const habitNames = [];
// habits.forEach((habit)=>{
//      habitNames.push(habit.habitName);
// })
// console.log(habitNames)

const progressContainer = document.querySelector('.progress-section-container');

habits.forEach((habit,habitIndex)=>{

    const habitContainer = document.createElement('div');
    habitContainer.classList.add('habit-progress-container');

    const habitContainerHeader = document.createElement('div');
    habitContainerHeader.classList.add('habit-container-header');

    const habitContainerTitle = document.createElement('h4');
    habitContainerTitle.innerText = `${habit.habitName}`;
    habitContainerTitle.classList.add('habit-container-title');

    const habitProgress = document.createElement('canvas');
    const chartIcon = createChartIcon(habitProgress);

    habitProgress.id = `progress-chart-${habitIndex}`;
    habitProgress.style.width = '100%';
    habitProgress.style.maxWidth = '700px';
    
    habitContainerHeader.appendChild(habitContainerTitle);
    habitContainerHeader.appendChild(chartIcon);

    habitContainer.appendChild(habitContainerHeader);
    habitContainer.appendChild(habitProgress);
    
    progressContainer.appendChild(habitContainer);
    
})
