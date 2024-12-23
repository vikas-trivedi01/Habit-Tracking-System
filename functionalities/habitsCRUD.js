let habits = [];

document.getElementById("start-date").addEventListener("change", () => {
    const habitStartDate = document.getElementById("start-date").value;
    const habitGoalDays = parseInt(document.getElementById("goal-days").value);
    const endingDateField = document.getElementById("end-date");

    const endingDate = new Date(habitStartDate);
    endingDate.setDate(endingDate.getDate() + habitGoalDays);

    const formattedDate = `${(endingDate.getMonth() + 1).toString().padStart(2, '0')} /` +
        ` ${endingDate.getDate().toString().padStart(2, '0')} /` +
        ` ${endingDate.getFullYear()}
    `;

    // Assign the formatted date to the input field
    endingDateField.value = formattedDate;
})
//on submission of form call the addHabit to add the habit
document.getElementById("habit-form").addEventListener("submit", addHabit);

function addHabit(e) {
    e.preventDefault();

    const habitName = document.getElementById("name").value.trim();
    const habitStartDate = document.getElementById("start-date").value;
    const habitDescription = document.getElementById("description").value.trim();
    const habitGoalDays = parseInt(document.getElementById("goal-days").value);
    const habitEndDate = document.getElementById("end-date").value;

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
        habitGoalDays: habitGoalDays,
        habitEndDate: habitEndDate
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
function completeHabit(habitIndex) {
    const habit = habits[habitIndex];

    if (!habit.isCompleted) {
        habit.isCompleted = true; // Mark as completed
    }
    alert(`Congratulations! You have completed the habit: ${habit.habitName}`);

    // Update UI and save changes
    updateHabitUI(habitIndex);
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
        const habit_header = document.createElement("div");
        const habit_showdetails = document.createElement("button");
        const habit_extra_details = document.createElement("div");


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
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "habit-checkboxes";
            checkbox.setAttribute("data-day", day);
            checkbox.setAttribute("data-habit-index", habitIndex);

            if (habit.completedDays.includes(day)) {
                checkbox.checked = true;
            }
            const container = document.createElement("div");

            container.innerHTML += `<p>Day ${day}:</p>`;

            container.appendChild(checkbox);
            habit_compliting_container.appendChild(container);//h_c_c is container for content of one habit

            checkbox.addEventListener('click', (e) => {
                const isChecked = e.target.checked;
                const checkboxIndex = parseInt(e.target.getAttribute("data-day"), 10);

                if (isChecked) {
                    habit.completedDaysCount++;
                    habit.completedDays.push(checkboxIndex)
                }
                else {
                    habit.completedDaysCount--;
                    habit.completedDays = habit.completedDays.filter(day => day !== checkboxIndex)
                }
                habit.isCompleted = habit.completedDaysCount == parseInt(habit.habitGoalDays, 10);
                handleCheckboxChange(habitIndex);
            });

        }
        habit_showdetails.innerHTML = '<i class="fa-solid fa-circle-arrow-down"></i>';
        habit_showdetails.className = "habit-expand";
        habit_showdetails.setAttribute("expanded", "false");
        habit_showdetails.classList.add('habit-expand-color');

        habit_showdetails.addEventListener("click", () => {

            let isExpanded = habit_showdetails.getAttribute("expanded") == "true";
            habit_showdetails.classList.remove(`${habit_showdetails.className.includes("habit-expand-color") ? "habit-expand-color" : "habit-expanded-color"}`);
            habit_showdetails.innerHTML = isExpanded ? '<i class="fa-solid fa-circle-arrow-up"></i>' : '<i class="fa-solid fa-circle-arrow-down"></i>';
            habit_showdetails.classList.add(`${isExpanded ? 'habit-expanded-color' : 'habit-expand-color'}`);
            habit_showdetails.setAttribute("expanded", !isExpanded);

        })

        let completedPara = document.createElement("div");
        let completedParaDiv = document.createElement("div");
        let completedParaTitle = document.createElement("p");
        habit.completedDays.forEach(num => {
            let p = document.createElement("p");
            p.innerText = num;
            completedPara.appendChild(p);
        })
        completedParaTitle.innerText = "Days When Habit Was Completed";
        completedParaDiv.appendChild(completedParaTitle);
        completedParaDiv.appendChild(completedPara);
        completedParaDiv.classList.add("completed-para-div")
        completedPara.classList.add("completed-para")
        habit_extra_details.innerHTML = `
            <div class="habit-extra-details">
            <p>Habit Description: ${habit.habitDescription}</p>
            <p>Start Date: ${habit.habitStartDate}</p>
            <p>Days Remaining to Complete: ${habit.habitGoalDays - habit.completedDaysCount}</p>
            <p id="completed-days-${habitIndex}">Completed Days: ${habit.completedDaysCount}</p>
            </div><br><br>
        `;

        habit_extra_details.appendChild(completedParaDiv);
        habit.hasOwnProperty('compltedDays') ? delete habit.compltedDays : '';

        habit_compliting_container.className = 'habit-checkboxes-container';
        habit_header.className = 'habit-header';

        habit_header.appendChild(habitNameElem);
        habit_header.appendChild(habit_showdetails);
        habit_container.appendChild(habit_header);
        habit_container.appendChild(habit_compliting_container);
        habit_container.appendChild(habit_extra_details);
        habit_container.className = 'habit-container';

        habitCompletingList.appendChild(habit_container);
    });

    saveHabits();
}
function handleCheckboxChange(habitIndex) {
    const habit = habits[habitIndex];
    const allChecked = habit.completedDaysCount === parseInt(habit.habitGoalDays, 10);

    if (allChecked) {
        console.log('before1')
        completeHabit(habitIndex);
    } else if (habit.isCompleted) {
        console.log('before2')
        habit.isCompleted = false; // Unmark the habit as completed
        updateHabitUI(habitIndex); // Just update the UI
        saveHabitsDebounced();
    }


}
function updateHabitUI(habitIndex) {
    const habit = habits[habitIndex];
    const habitItem = document.getElementById(`habit-item-${habitIndex}`);
    const completedDaysElem = document.getElementById(`completed-days-${habitIndex}`);
    const markCompleteButton = document.querySelector(`#habit-container-${habitIndex} #mark-completed`);
    // const allChecked = habit.completedDaysCount === parseInt(habit.habitGoalDays, 10);
    const editButton = document.querySelector(`#habit-item-${habitIndex} #edit`);
    const deleteButton = document.querySelector(`#habit-item-${habitIndex} #delete`);

    if (!habitItem || !completedDaysElem) return;

    completedDaysElem.textContent = `Completed Days: ${habit.completedDaysCount}`;
    habitItem.classList.toggle("completed", habit.isCompleted)
    // console.log('ertr')
    if (markCompleteButton) markCompleteButton.classList.toggle("hide", habit.isCompleted);
    if (editButton) editButton.classList.toggle("hide", habit.isCompleted);
    if (deleteButton) deleteButton.classList.toggle("w-full", habit.isCompleted);
}


function deleteHabit(habitIndex) {
    habits.splice(habitIndex, 1);//remove habit from index
    displayHabits();
    saveHabitsDebounced();
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
