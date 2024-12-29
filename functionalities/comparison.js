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
    }, 2000);
});

const comparisonPreferences = {
    firstHabit: null,
    secondHabit: null,
    filterCriteria: null
};


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

    if (instruction.classList.contains("show")) {
        instruction.classList.remove("show");
        instruction.classList.add("hide");
    }
    if (comparisonSection.classList.contains("hide")) {
        comparisonSection.classList.remove("hide");
        comparisonSection.classList.add("show");
    }

    const firstHabitName = habits[firstHabitIndex].habitName;
    const secondHabitName = habits[secondHabitIndex].habitName;

    const comparisonTitle = document.createElement('h4');
    comparisonTitle.innerText = `Comparison Between ${firstHabitName} And ${secondHabitName}`;

    const comparisonContainer = document.createElement('table');
    comparisonContainer.classList.add('comparison-container');

    if (filterCriteria === "filter-weekly") {
        const selectedFirstHabitData = calculateProgressInsights(firstHabitIndex);
        const selectedSecondHabitData = calculateProgressInsights(secondHabitIndex);

        comparisonContainer.innerHTML = `
    <hr />
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

        comparisonSection.appendChild(comparisonTitle);
        comparisonSection.appendChild(comparisonContainer);
    }
}