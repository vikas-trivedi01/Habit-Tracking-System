habits.forEach((habitIndex) => {
    createHabitOptions('comparison-selector-first-habit', habitIndex);
    createHabitOptions('comparison-selector-second-habit', habitIndex);
});

const selectedHabits = {
    firstHabit: null,
    secondHabit: null,
};

const comparisonSelectorFirst = document.querySelector('#comparison-selector-first-habit');

comparisonSelectorFirst.addEventListener('change', (e) => {
    const selectedHabitIndex = parseInt(e.target.value, 10);
   
    if (habits[selectedHabitIndex]) {
        selectedHabits.firstHabit = {
            habitName: habits[selectedHabitIndex].habitName,
            selectedHabitIndex,
        };
    }
});

const comparisonSelectorSecond = document.querySelector('#comparison-selector-second-habit');

comparisonSelectorSecond.addEventListener('change', (e) => {
    const selectedHabitIndex = parseInt(e.target.value, 10);
   
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
    if (!selectedHabits.firsHabit && selectedHabits.secondHabit) {
        alert('Select First Habit To Compare');
    }
    if (!selectedHabits.firstHabit && !selectedHabits.secondHabit) {
        alert('Select Habits To Compare');
    }
    if (selectedHabits.firstHabit.habitName === selectedHabits.secondHabit.habitName) {
        alert('Select Different Habits To Compare');
    }

});
