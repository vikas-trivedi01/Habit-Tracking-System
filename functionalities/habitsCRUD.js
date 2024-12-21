let habits = [];

//on submission of form call the addHabit to add the habit
document.getElementById("habit-form").addEventListener("submit", addHabit);

function addHabit(e) {
    e.preventDefault();

    const habitDescription = document.getElementById("description").value.trim();
    const habitDue = document.getElementById("due-date").value;

    if (!habitDescription || !habitDue) {
        alert("Please enter both description and due date.");
        return;
    }
    //push the habit object in habits array
    habits.push({
        description: habitDescription,
        due_date: habitDue,
        isCompleted: false,

    });
    //empty the fields
    document.getElementById("description").value = "";
    document.getElementById("due-date").value = "";

    //display and save tasks to localstorage
    displayHabits();
    saveHabitsDebounced();
}

function displayHabits() {

    const habitList = document.getElementById("habit-list");
    habitList.innerHTML = "";

    if(habits.length === 0){
        habitList.innerText = "No Habits to Display";
    }
    habits.forEach((habit, index) => {
        //create necessary elements
        const habit_elem = document.createElement("div");
        const habit_buttons = document.createElement("div");
        const habit_info = document.createElement("div");


        habit_elem.className = habit.isCompleted ? "habit-item completed" : "habit-item";
        habit_elem.innerHTML = `
            Habit: ${habit.description}<br>
            Due Date: ${habit.due_date}<br>`;

        habit_buttons.innerHTML = `
            <button id="delete" class="btn" onclick="deleteHabit(${index})">Delete</button><br>
            <button id="edit" class="${habit.isCompleted ? 'hide' : 'btn'}" onclick="editHabit(${index})">Edit</button><br>
            <button id="mark_completed" class="${habit.isCompleted ? 'hide' : 'hov btn'}" onclick="completeHabit(${index})">Mark Complete</button>
            `;

        habit_buttons.className = "buttons";
        habit_info.className = "habit_info";

            habit_info.appendChild(habit_elem);
            habit_info.appendChild(habit_buttons);
            habitList.appendChild(habit_info);
        

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
        habits = storedHabits?JSON.parse(storedHabits):[];
        displayHabits();

    } catch (error) {
        alert(error.message);
        habits = [];
    }

}

window.onload = loadHabits;
