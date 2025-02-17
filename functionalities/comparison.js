habits.forEach((habit, habitIndex) => {
    createHabitOptions('comparison-selector-first-habit', habitIndex, habit.habitName);
    createHabitOptions('comparison-selector-second-habit', habitIndex, habit.habitName);
});

// show filter for different comparison type
const filterIcon = document.querySelector(".cmp-icon");
const filterSection = document.getElementById("filter-section");

let hideTimeout;

filterIcon.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
    filterSection.classList.add("visible");
});

filterIcon.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => {
        filterSection.classList.remove("visible");
    }, 4000);
});

const comparisonPreferences = {
    firstHabit: null,
    secondHabit: null,
    filterCriteria: null
};


const comparisonSelectorFirst = document.querySelector('#comparison-selector-first-habit');

comparisonSelectorFirst.addEventListener('change', (e) => {
    const selectedHabitIndex = e.target.value;

    if (habits[selectedHabitIndex]) {
        comparisonPreferences.firstHabit = {
            habitName: habits[selectedHabitIndex].habitName,
            selectedHabitIndex,
        };
    }
});
const comparisonSelectorSecond = document.querySelector('#comparison-selector-second-habit');

comparisonSelectorSecond.addEventListener('change', (e) => {
    const selectedHabitIndex = e.target.value;

    if (habits[selectedHabitIndex]) {
        comparisonPreferences.secondHabit = {
            habitName: habits[selectedHabitIndex].habitName,
            selectedHabitIndex,
        };
    }
});

const filterCriteria = document.querySelector('#filter-section');

filterCriteria.addEventListener('change', (e) => {
    const selectedCriteria = e.target.value;
    comparisonPreferences.filterCriteria = selectedCriteria;
});

document.querySelector('#compare-btn').addEventListener('click', () => {

    if (comparisonPreferences.firstHabit && !comparisonPreferences.secondHabit) {
        alert('Select Second Habit To Compare');
    }
    else if (!comparisonPreferences.firstHabit && comparisonPreferences.secondHabit) {
        alert('Select First Habit To Compare');
    }
    else if (!comparisonPreferences.firstHabit && !comparisonPreferences.secondHabit) {
        alert('Select Habits To Compare');
    }
    else if (comparisonPreferences.firstHabit.habitName === comparisonPreferences.secondHabit.habitName) {
        alert('Select Different Habits To Compare');
    }
    else {
        if (!comparisonPreferences.filterCriteria) {
            alert('Select Filter Criteria To Compare');
        }
        else {
            displayComparison(comparisonPreferences.firstHabit.selectedHabitIndex, comparisonPreferences.secondHabit.selectedHabitIndex, comparisonPreferences.filterCriteria);
        }
    }
});

function displayComparison(firstHabitIndex, secondHabitIndex, filterCriteria) {

    const instruction = document.querySelector('#comparison-instruction');
    const comparisonSection = document.querySelector('#show-comparison');

    instruction.classList.replace("show", "hide");
    comparisonSection.classList.replace("hide", "show");

    const firstHabitName = habits[firstHabitIndex].habitName;
    const secondHabitName = habits[secondHabitIndex].habitName;

    const hrElem = document.createElement('hr');
    hrElem.style.border = "4px double hotpink";
    hrElem.style.margin = "16px 0px";

    const comparisonHeader = document.createElement('div');
    comparisonHeader.classList.add("comparison-header");

    const comparisonTitle = document.createElement('h3');
    comparisonTitle.innerText = `Comparison Between ${firstHabitName} And ${secondHabitName}`;

    const comparisonIconSection = document.createElement('div');

    const comparisonIcon = document.createElement('i');
    comparisonIcon.classList.add("fa-solid", "fa-hashtag");
    comparisonIcon.style.fontSize = "larger";

    const comparisonIconText = document.createElement('span');
    comparisonIconText.innerHTML = `&nbsp;&nbsp;${filterCriteria}`;

    comparisonIconSection.classList.add("comparison-icon-section");

    comparisonIconSection.appendChild(comparisonIcon);
    comparisonIconSection.appendChild(comparisonIconText);

    comparisonHeader.appendChild(comparisonTitle);
    comparisonHeader.appendChild(comparisonIconSection);

    comparisonSection.appendChild(comparisonHeader);

    const comparisonContainer = document.createElement('table');
    comparisonContainer.classList.add('comparison-container');

    if (filterCriteria === "weekly-comparison") {
        const selectedFirstHabitData = calculateProgressInsights(firstHabitIndex);
        const selectedSecondHabitData = calculateProgressInsights(secondHabitIndex);

        comparisonContainer.innerHTML = `
    
    <tr>
    <th>Habit Name</th>
    <th>Maximum Completed Days</th>
    <th>Best Week Number</th>
    <th>Best Week Percentages</th>
    </tr>    

    <tr>
    <td>${firstHabitName}</td>
    <td>${selectedFirstHabitData.maximumStreak}</td>
    <td>${selectedFirstHabitData.bestWeekNum}</td>
    <td>${selectedFirstHabitData.bestWeekPercentage}</td>
    </tr>

    <tr>
    <td>${secondHabitName}</td>
    <td>${selectedSecondHabitData.maximumStreak}</td>
    <td>${selectedSecondHabitData.bestWeekNum}</td>
    <td>${selectedSecondHabitData.bestWeekPercentage}</td>
    </tr>

    `;
        comparisonSection.appendChild(comparisonContainer);
    }

    else if (filterCriteria === "average-comparison") {
        const { habitAverageProgress: allHabitsAverageProgress } = analyzeHabitProgress();

        const selectedFirstHabitAverageData = allHabitsAverageProgress[firstHabitIndex];
        const selectedSecondHabitAverageData = allHabitsAverageProgress[secondHabitIndex];

        const firstHabitProgress = getHabitProgress(firstHabitIndex);
        const secondHabitProgress = getHabitProgress(secondHabitIndex);

        const maxWeeks = Math.max(firstHabitProgress.length, secondHabitProgress.length);

        let headerRow = `<tr><th>Habit Name</th><th>Habit Number</th>`;

        for (let i = 1; i <= maxWeeks; i++) {
            headerRow += `<th>Week ${i}</th>`;
        }
        headerRow += `<th>Average Progress</th></tr>`;

        const row1 = createComparisonTableRow(
            firstHabitProgress,
            selectedFirstHabitAverageData,
            maxWeeks
        );

        const row2 = createComparisonTableRow(
            secondHabitProgress,
            selectedSecondHabitAverageData,
            maxWeeks
        );

        comparisonContainer.innerHTML = headerRow + row1 + row2;
        comparisonSection.appendChild(comparisonContainer);
    }
    else {
        const comparisonContainerSummary = document.createElement('table');
        comparisonContainerSummary.classList.add('comparison-container-summary');

        const { finalSummary } = analyzeHabitProgress();

        const firstHabitSummary = finalSummary[firstHabitIndex];
        const secondHabitSummary = finalSummary[secondHabitIndex];

        comparisonContainerSummary.innerHTML = `
    
        <tr>
        <th>Habit Name</th>
        <th>Average Percentages</th>
        <th>Total Completed Days</th>
        <th>Best Week Percentages</th>
        <th>Best Week Number</th>
        <th>Highest Completed Days</th>
        </tr>    
    
        <tr>
        <td>${firstHabitSummary.habitName}</td>
        <td>${!isNaN(firstHabitSummary.averageProgress)
                ? firstHabitSummary.averageProgress + '%'
                : "Not completed any day For Habit"}</td>
        <td>${firstHabitSummary.total.totalCompletedDays}</td>
        <td>${firstHabitSummary.best.bestWeekPercentage}</td>
        <td>${firstHabitSummary.best.bestWeekNum}</td>
        <td>${firstHabitSummary.streak}</td>
        </tr>
    
        <tr>
        <td>${secondHabitSummary.habitName}</td>
        <td>${!isNaN(secondHabitSummary.averageProgress)
                ? secondHabitSummary.averageProgress + '%'
                : "Not completed any day For Habit"}</td>
        <td>${secondHabitSummary.total.totalCompletedDays}</td>
        <td>${secondHabitSummary.best.bestWeekPercentage}</td>
        <td>${secondHabitSummary.best.bestWeekNum}</td>
        <td>${secondHabitSummary.streak}</td>
        </tr>
    
        `;
        comparisonSection.appendChild(comparisonContainerSummary)
    }

    comparisonSection.appendChild(hrElem);
}

function createComparisonTableRow(progressData, averageProgress, maxWeeks) {
    const weeksData = Array(maxWeeks).fill("No Data");

    progressData.forEach((week, index) => {
        weeksData[index] = week.percentage || "No Data";
    });

    const weeksPercentages = weeksData.map(weekPercentage => `<td>${weekPercentage}</td>`).join(''); // to combine resultant tds array in a single string use join()

    return `
       <tr>
            <td>${averageProgress.habitName}</td>
            <td>${averageProgress.habitNumber}</td>
            ${weeksPercentages}
            <td>${averageProgress.averageProgress || "No Data"}</td>
       </tr>
    `;
}