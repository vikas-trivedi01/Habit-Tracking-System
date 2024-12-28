habits.forEach((habit, habitIndex) => {
    createHabitOptions('comparison-selector-first-habit', habitIndex, habit.habitName);
    createHabitOptions('comparison-selector-second-habit', habitIndex, habit.habitName);
});

const selectedHabits = {
    firstHabit: null,
    secondHabit: null,
};

const comparisonSelectorFirst = document.querySelector('#comparison-selector-first-habit');

comparisonSelectorFirst.addEventListener('change', (e) => {
    const selectedHabitIndex = e.target.value;

    if (habits[selectedHabitIndex]) {
        selectedHabits.firstHabit = {
            habitName: habits[selectedHabitIndex].habitName,
            selectedHabitIndex,
        };
    }
});

const comparisonSelectorSecond = document.querySelector('#comparison-selector-second-habit');

comparisonSelectorSecond.addEventListener('change', (e) => {
    const selectedHabitIndex = e.target.value;

    if (habits[selectedHabitIndex]) {
        selectedHabits.secondHabit = {
            habitName: habits[selectedHabitIndex].habitName,
            selectedHabitIndex,
        };
    }
});

document.querySelector('#compare-btn').addEventListener('click', () => {

    if (selectedHabits.firstHabit && !selectedHabits.secondHabit) {
        alert('Select Second Habit To Compare');
    }
    if (!selectedHabits.firstHabit && selectedHabits.secondHabit) {
        alert('Select First Habit To Compare');
    }
    if (!selectedHabits.firstHabit && !selectedHabits.secondHabit) {
        alert('Select Habits To Compare');
    }
    if (selectedHabits.firstHabit.habitName === selectedHabits.secondHabit.habitName) {
        alert('Select Different Habits To Compare');
    }

    displayComparison(selectedHabits.firstHabit.selectedHabitIndex, selectedHabits.secondHabit.selectedHabitIndex);
});

function displayComparison(firstHabitIndex, secondHabitIndex) {

    const instruction = document.querySelector('#comparison-instruction');
    const comparisonSection = document.querySelector('#show-comparison');

    if (instruction.classList.contains("show")) {
        instruction.classList.remove("show");
        instruction.classList.add("hide");
    }
    if (comparisonSection.classList.contains("hide")) {
        comparisonSection.classList.remove("hide");
        comparisonSection.classList.add("show", "show-comparison-flex");
    }

    const selectedFirstHabitData = calculateProgressInsights(firstHabitIndex);
    const selectedSecondHabitData = calculateProgressInsights(secondHabitIndex);

    const firstHabitName = habits[firstHabitIndex].habitName;
    const secondHabitName = habits[secondHabitIndex].habitName;

    const comparisonContainer = document.createElement('table');

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
