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

    const comparisonTitle = document.createElement('h4');
    comparisonTitle.innerText = `Comparison Between ${firstHabitName} And ${secondHabitName}`;
    comparisonSection.appendChild(comparisonTitle);

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

    }

    comparisonSection.appendChild(comparisonContainer);
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