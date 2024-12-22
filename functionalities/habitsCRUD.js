let habits = [];

document.getElementById("start-date").addEventListener("change", () => {
    const habitStartDate = document.getElementById("start-date").value;
    const habitGoalDays = parseInt(document.getElementById("goal-days").value);
    const endingDateField = document.getElementById("end-date");

    let endingDate = new Date(habitStartDate);
    endingDate.setDate(endingDate.getDate() + habitGoalDays);
    endingDateField.value = `${endingDate.getMonth() + 1}/${endingDate.getDate()}/${endingDate.getFullYear()}`;

})
//on submission of form call the addHabit to add the habit
document.getElementById("habit-form").addEventListener("submit", addHabit);

function addHabit(e) {
    e.preventDefault();

    const habitName = document.getElementById("name").value.trim();
    const habitStartDate = document.getElementById("start-date").value;
    const habitDescription = document.getElementById("description").value.trim();
    const habitGoalDays = parseInt(document.getElementById("goal-days").value);

    if (!habitName && !habitStartDate) {
        alert("Please enter name and starting date of habit.");
        return;
    }
    //push the habit object in habits array
    habits.push({
        habitName: habitName,
        habitStartDate: habitStartDate,
        habitDescription: habitDescription,
        isCompleted: false,
        habitGoalDays: habitGoalDays
    });



    //empty the fields
    document.getElementById("name").value = "";
    document.getElementById("start-date").value = "";
    document.getElementById("description").value = "";
    document.getElementById("goal-days").value = "";

    //display and save tasks to localstorage
    displayHabits();
    saveHabitsDebounced();
}

function displayHabits() {

    const habitList = document.getElementById("habit-list");
    const habitCompletingList = document.getElementById("habit-completing-list");
    habitList.innerHTML = "";
    habitCompletingList.innerHTML = "";

    if (habits.length === 0) {
        habitList.innerText = "No Habits to Display";
    }


    habits.forEach((habit, habitIndex) => {
        //create necessary elements
        habit.completedDays = habit.completedDays || [];
        habit.completedDaysCount = habit.completedDaysCount || 0;
        const habit_elem = document.createElement("div");
        const habit_complete = document.createElement("div");
        const habit_card = document.createElement("div");
        const habit_compliting_container = document.createElement("div");
        const habit_container = document.createElement("div");


        habit_elem.className = habit.isCompleted ? "habit-item completed" : "habit-item";

        habit_elem.innerHTML = `
            <div id="habit-info">
            <p>Habit: ${habit.habitName}</p>
            <p>Start Date: ${habit.habitStartDate}</p>
            <p>Description: ${habit.habitDescription}</p>
            <p>Goal Days: ${habit.habitGoalDays}</p>
            <p id="completed-days-${habitIndex}">Completed Days: ${habit.completedDaysCount}</p>
            </div>
            <div id="icons">
            <span  id="edit" class="${habit.isCompleted ? 'hide' : 'habit-icons'} " onclick="editHabit(${habitIndex})"><i class="fa-regular fa-pen-to-square"></i></span>
            <span class=" ${habit.isCompleted ? 'habit-icons w-full' : 'habit-icons'} " id="delete"  onclick="deleteHabit(${habitIndex})"><i class="fa-solid fa-trash-can"></i></span>
            </div>
            `;

        habit_complete.innerHTML = `
            <button id="mark-completed" class="${habit.isCompleted ? 'hide' : ''} " onclick="completeHabit(${habitIndex})">Mark Complete</button>
            `;

        habit_elem.id = `habit-item-${habitIndex}`;
        habit_card.className = "habit-card";
        habit_card.appendChild(habit_elem);
        habit_card.appendChild(habit_complete);
        habit_card.id = `habit-container-${habitIndex}`;

        habitList.appendChild(habit_card);

        const habitNameElem = document.createElement("p");
        habitNameElem.textContent = `Habit Name : ${habit.habitName}`;
        habitNameElem.className = 'habit-title';

        for (let day = 1; day <= habit.habitGoalDays; day++) {
            if (habit.completedDays.includes(day)) {
                checkbox.checked = true;
            }
            const container = document.createElement("div");

            container.innerHTML += `<p>Day ${day}:</p>`;
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "habit-checkboxes";
            checkbox.setAttribute("data-day", day);
            checkbox.setAttribute("data-habit-index", habitIndex);

            container.appendChild(checkbox);
            habit_compliting_container.appendChild(container);//h_c_c is container for content of one habit
            habit_container.appendChild(habitNameElem);

            checkbox.addEventListener('click', (e) => {
                const habitIndex = parseInt(e.target.getAttribute("data-habit-index"), 10);
                const selectedHabit = habits[habitIndex];
                const isChecked = e.target.checked;
                const checkboxIndex = parseInt(e.target.getAttribute("data-day"), 10);

                if (isChecked) {
                    selectedHabit.completedDaysCount++;
                    selectedHabit.completedDays.push(checkboxIndex)
                }
                else {
                    selectedHabit.completedDaysCount--;
                    selectedHabit.completedDays = selectedHabit.completedDays.filter(day => day !== checkboxIndex)
                }
                selectedHabit.isCompleted = selectedHabit.completedDaysCount == parseInt(selectedHabit.habitGoalDays, 10);

                updateHabitUI(habitIndex);
            });

        }
        habit.hasOwnProperty('compltedDays') ? delete habit.compltedDays : '';

        habit_compliting_container.className = 'habit-checkboxes-container';

        habit_container.appendChild(habit_compliting_container);
        habit_container.className = 'habit-container';

        habitCompletingList.appendChild(habit_container);
    });

    saveHabits();
}
function updateHabitUI(habitIndex) {
    const habitItem = document.getElementById(`habit-item-${habitIndex}`);

    const completedDaysElem = document.getElementById(`completed-days-${habitIndex}`);

    // const habitIcons = document.getElementsByClassName("habit-icons");
    const btn = document.querySelectorAll(`#habit-item-${habitIndex} .habit-icons`)
    const habit = habits[habitIndex];

    if (completedDaysElem) {
        completedDaysElem.textContent = `Completed Days: ${habit.completedDaysCount}`;
    }
    if (!habitItem) return;

    const allChecked = habit.completedDaysCount === parseInt(habit.habitGoalDays, 10);

    habit.isCompleted = allChecked;
    if (allChecked) {
        habitItem.classList.add("completed");
        const markCompleteButton = document.querySelector(`#habit-container-${habitIndex} #mark-completed`);

        if (markCompleteButton) {
            markCompleteButton.classList.add("hide");
        }
        // <span  id="edit" class="${habit.isCompleted ? 'hide' : 'habit-icons'} " onclick="editHabit(${habitIndex})"><i class="fa-regular fa-pen-to-square"></i></span>
        //<span class=" ${habit.isCompleted ? 'habit-icons w-full' : 'habit-icons'} " id="delete"  onclick="deleteHabit(${habitIndex})"><i class="fa-solid fa-trash-can"></i></span>

        btn.forEach(icon => {
            if (icon.id === "edit") {
                icon.classList.add("hide");
            }
            else if (icon.id === "delete") {
                icon.classList.add("w-full");
            }
        })
    } else {
        habitItem.classList.remove("completed");
    }

}


function deleteHabit(habitIndex) {
    habits.splice(habitIndex, 1);//remove habit from index
    displayHabits();
    saveHabitsDebounced();
}

function completeHabit(habitIndex) {
    habits[habitIndex].isCompleted = !habits[habitIndex].isCompleted;
    displayHabits();
    saveHabitsDebounced();
    alert("Congratulations ! you have completed this habit");
}

function editHabit(habitIndex) {

    //provide editing options
    const updatedHabitName = prompt(
        "Update habit name",
        habits[habitIndex].habitName
    );
    const updatedHabitDate = prompt(
        "Update habit start date",
        habits[habitIndex].habitStartDate
    );
    const updatedHabitDescription = prompt(
        "Update habit description",
        habits[habitIndex].habitDescription
    );

    const updatedHabitGoalDays = prompt(
        "Update habit goal days",
        habits[habitIndex].habitGoalDays
    );

    // Check if all inputs are valid
    if (updatedHabitName && updatedHabitDate && updatedHabitDescription && updatedHabitGoalDays) {
        habits[habitIndex].habitName = updatedHabitName;
        habits[habitIndex].habitStartDate = updatedHabitDate;
        habits[habitIndex].habitDescription = updatedHabitDescription;
        habits[habitIndex].habitGoalDays = updatedHabitGoalDays;

        displayHabits();
        saveHabitsDebounced();
    } else {
        console.log("One or more updates were not provided.");
    }

}


function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));//store habits to localstorage
}

// Debounce saveTasks function
function debounce(func, delay) {
    let timer;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}
const saveHabitsDebounced = debounce(saveHabits, 1000);

function loadHabits() {
    try {
        const storedHabits = localStorage.getItem("habits");//fetch habits from localstorage
        habits = storedHabits ? JSON.parse(storedHabits) : [];
        displayHabits();

    } catch (error) {
        alert(error.message);
        habits = [];
    }

}

window.onload = loadHabits;
