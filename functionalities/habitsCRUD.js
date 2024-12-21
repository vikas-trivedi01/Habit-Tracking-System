let habits = [];

//on submission of form call the addHabit to add the habit
document.getElementById("habit-form").addEventListener("submit", addHabit);

function addHabit(e) {
    e.preventDefault();

    const habitName = document.getElementById("name").value.trim();
    const habitStartDate = document.getElementById("start-date").value;
    const habitDescription = document.getElementById("description").value.trim();
    const habitGoalDays = document.getElementById("goal-days").value;

    if (!habitName && !habitStartDate) {
        alert("Please enter name and starting date of habit.");
        return;
    }
    //push the habit object in habits array
    habits.push({
        habitName,
        habitStartDate,
        habitDescription,
        habitGoalDays,
        compltedDays: 0,
        isCompleted: false
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
    habits.forEach((habit, index) => {
        //create necessary elements
        const habit_elem = document.createElement("div");
        const habit_complete = document.createElement("div");
        const habit_card = document.createElement("div");
        const habit_compliting_container = document.createElement("div");
        // const habit_compliting_container = document.createElement("div");


        habit_elem.className = habit.isCompleted ? "habit-item completed" : "habit-item";
        habit_elem.innerHTML = `
            <div id="habit-info">
            Habit: ${habit.habitName}<br>
            Start Date: ${habit.habitStartDate}<br>
            Description: ${habit.habitDescription}<br>
            Goal Days: ${habit.habitGoalDays}<br>
            Completed Days: ${habit.compltedDays}<br>
            </div>
            <div id="icons">
            <span  id="edit" class="${habit.isCompleted ? 'hide' : 'habit-icons'} " onclick="editHabit(${index})"><i class="fa-regular fa-pen-to-square"></i></span>
            <span class=" ${habit.isCompleted ? 'habit-icons w-full' : 'habit-icons'} habit-icons " id="delete"  onclick="deleteHabit(${index})"><i class="fa-solid fa-trash-can"></i></span>
            </div>
            `;

        habit_complete.innerHTML = `
            <button id="mark-completed" class="${habit.isCompleted ? 'hide' : ''} " onclick="completeHabit(${index})">Mark Complete</button>
            `;

        habit_card.className = "habit-card";

        habit_card.appendChild(habit_elem);
        habit_card.appendChild(habit_complete);
        habitList.appendChild(habit_card);

        const habitNameElem = document.createElement("p");
        habitNameElem.textContent = `Habit Name : ${habit.habitName}`;
        habitNameElem.className = 'habit-title'
        const checkbox = '<input type="checkbox" class="habit-checkboxes"></input>';        

        for(let index = 0; index < habit.habitGoalDays; index++) {
            const container = document.createElement("div");
            container.innerHTML += `<p>Day ${index+1}:</p>${checkbox}`
            container.className = 'checkbox-container'
            habit_compliting_container.appendChild(container);//h_c_c is container for content of one habit
        }

        habit_compliting_container.className = 'habit-checkboxes-container'
        // habit_compliting_container.appendChild(habit_compliting_days);
        // habit_compliting_container.appendChild(habit_compliting_chekboxes);
        habitCompletingList.appendChild(habitNameElem);
        habitCompletingList.appendChild(habit_compliting_container);


    });
}

function deleteHabit(index) {
    habits.splice(index, 1);//remove habit from index
    displayHabits();
    saveHabitsDebounced();
}

function completeHabit(index) {
    habits[index].isCompleted = !habits[index].isCompleted;
    displayHabits();
    saveHabitsDebounced();
    alert("Congratulations ! you have completed this habit");
}

function editHabit(index) {
    //provide editing options
    const newDescription = prompt(
        "Enter new habit description",
        habits[index].description
    );
    const newDate = prompt(
        "Enter new habit due date",
        habits[index].due_date
    );

    if (newDescription && newDate) {
        habits[index].description = newDescription;
        habits[index].due_date = newDate;
        displayHabits();
        saveHabitsDebounced();
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
