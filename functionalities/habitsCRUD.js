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
        habit.days = [];
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
            <div id="habit-info-${habitIndex}">
            <p>Habit: ${habit.habitName}</p>
            <p>Start Date: ${habit.habitStartDate}</p>
            <p>Description: ${habit.habitDescription}</p>
            <p>Goal Days: ${habit.habitGoalDays}</p>
            <p id="completed-days-${habitIndex}">Completed Days: ${habit.completedDaysCount}</p>
            </div>
            <div id="icons">
            <span  id="edit" class="${habit.isCompleted ? 'hide' : 'habit-icons'} " onclick="editHabit(${habitIndex}) "><i class="fa-regular fa-pen-to-square"></i></span>
            <span class=" ${habit.isCompleted ? 'habit-icons w-full' : 'habit-icons'} " id="delete"  onclick="deleteHabit(${habitIndex})" onmouseenter="cardShrink(${habitIndex})" onmouseleave="cardGrow(${habitIndex})"><i class="fa-solid fa-trash-can"></i></span>
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
        habitNameElem.textContent = `Habit : ${habit.habitName}`;
        habitNameElem.className = 'habit-title';


        let week_checkboxes = null;
        let week_checkboxesTitle = null;
        for (let day = 1; day <= habit.habitGoalDays; day++) {
            const checkbox = document.createElement("input");
            const dayNum = document.createElement("p");

            dayNum.innerText = `Day ${day}`;
            checkbox.type = "checkbox";
            checkbox.className = "habit-checkboxes";
            checkbox.setAttribute("data-day", day);
            checkbox.setAttribute("data-habit-index", habitIndex);

            if (habit.completedDays.includes(day)) {
                checkbox.checked = true;
            }

            if (day % 7 == 1) {
                week_checkboxes = document.createElement("div");
                week_checkboxesTitle = document.createElement("h4");
                week_checkboxesTitle.innerText = `Week No ${habit_compliting_container.children.length + 1}`;
                week_checkboxes.appendChild(week_checkboxesTitle);
                week_checkboxes.classList.add("week-checkboxes",`week-checkboxes-${habitIndex}`);
                habit_compliting_container.appendChild(week_checkboxes);
            }

            const habit_day = document.createElement("div");
            habit_day.appendChild(dayNum);
            habit_day.appendChild(checkbox);
            week_checkboxes.appendChild(habit_day);


            // habit.days = Array(habit.habitGoalDays).fill(false);
            if (!Array.isArray(habit.days) || habit.days.length === 0) {
                habit.days = Array.from({ length: habit.habitGoalDays }, (_, index) =>
                    habit.completedDays.includes(index)
                );
            }

            checkbox.addEventListener('click', (e) => {
                const isChecked = e.target.checked;
                const checkboxDay = parseInt(e.target.getAttribute("data-day"), 10);

                habits[habitIndex].days[checkboxDay ] = isChecked;

                if (isChecked) {
                    habit.completedDaysCount++;
                    habit.completedDays.push(checkboxDay)
                }
                else {
                    habit.completedDaysCount--;
                    habit.completedDays = habit.completedDays.filter(day => day !== checkboxDay)
                }
                habit.isCompleted = habit.completedDaysCount == parseInt(habit.habitGoalDays, 10);
                // updateStreakDisplay(habitIndex);
                // updateCompletedDisplay(habitIndex);

                updateStreakHighlight(e.target, isChecked);
                updateHabitDetails(habitIndex);
                saveHabits(); //save habits instantly without debouncing in-order to reflect checkbox's effect habit's data on UI
            });
            // updateHabitDetails(habitIndex);
            // updateStreakDisplay(habitIndex);
            // updateCompletedDisplay(habitIndex);


        }
        habit_showdetails.innerHTML = '<i class="fa-solid fa-circle-arrow-down"></i>';
        habit_showdetails.className = "habit-expand";
        habit_showdetails.setAttribute("expanded", "false");
        habit_showdetails.title = "View More Details";
        habit_showdetails.classList.add('habit-expand-color');
        habit_extra_details.classList.add("hide")

        habit_showdetails.addEventListener("click", () => {

            let isExpanded = habit_showdetails.getAttribute("expanded") == "true";

            habit_showdetails.classList.remove(!isExpanded ? "habit-expand-color" : "habit-expanded-color");
            habit_showdetails.title = !isExpanded ? "Hide Details" : "View More Details";
            habit_showdetails.innerHTML = isExpanded ? '<i class="fa-solid fa-circle-arrow-down"></i>' : '<i class="fa-solid fa-circle-arrow-up"></i>';

            habit_extra_details.classList.remove(isExpanded ? "show" : "hide");
            habit_extra_details.classList.add(isExpanded ? "hide" : "show");


            habit_showdetails.classList.add(!isExpanded ? 'habit-expanded-color' : 'habit-expand-color');

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

        completedParaTitle.innerText = `${habit.completedDays.length ? "Days When Habit Was Completed" : "Habit was not completed on any day"}`;
        // completedParaTitle.innerText =`${habit.completedDays.length? "Days When Habit Was Completed":"Habit was not completed on any day"}`;
        completedParaDiv.appendChild(completedParaTitle);
        completedParaDiv.appendChild(completedPara);
        completedParaDiv.classList.add("completed-para-div");
        completedPara.classList.add("completed-para");

        // <p id="remaining-days-${habitIndex}"style=${habit.isCompleted ? 'display:none' : ''}></p>
        // <p id="completed-days-${habitIndex}"></p>
        // <p id="streak-days-${habitIndex}">No Streaks</p>
        habit_extra_details.innerHTML = `
        <div class="habit-extra-details">
            <p>Habit Description<br> ${habit.habitDescription}</p>
            <p>Start Date<br> ${habit.habitStartDate}</p>
          
             <p id="remaining-days-${habitIndex}" style=${habit.isCompleted ? 'display:none' : ''}>
            Days Remaining to Complete: ${habit.habitGoalDays - habit.completedDaysCount}
        </p>
        <p id="completed-days-${habitIndex}">
            ${habit.isCompleted ? 'Habit Already Completed!' : 'Not Completed on Any Day'}
        </p>
        <p id="streak-days-${habitIndex}">No Streaks</p>
            </div><br>
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
        // updateCompletedDisplay(habitIndex);
        // updateStreakDisplay(habitIndex);
        updateHabitDetails(habitIndex);
    
   
});
saveHabitsDebounced();
    initializeHabits();
}

function initializeHabits() {
    habits.forEach((habit, habitIndex) => {
        habit.days.forEach((isChecked, dayIndex) => {
            const checkbox = document.querySelector(
                `input[data-habit-index="${habitIndex}"][data-day="${dayIndex}"]`
            );
            if (checkbox) {
                checkbox.checked = isChecked;
                updateStreakHighlight(checkbox,isChecked);
            }
        });

        // updateHabitUI(habitIndex);
        updateHabitDetails(habitIndex);
        // updateStreakDisplay(habitIndex);
        // updateCompletedDisplay(habitIndex);
    });
}


// function calculateStreak(habitIndex) {
//     const habit = habits[habitIndex];
//     let streak = 0;

//     const checkboxes = document.querySelectorAll(
//         `input[data-habit-index="${habitIndex}"]`
//     );
// checkboxes.forEach((checkbox, dayIndex) => {
//     const isChecked = habit.days[dayIndex + 1];
//         if (isChecked) {
//             streak++;
//             if (checkbox?.parentElement) {
//                 checkbox.parentElement.classList.add("streak-highlight");
//             }
//         } else {
//             if (checkbox?.parentElement) {
//                 checkbox.parentElement.classList.remove("streak-highlight");
//             }
//             streak = 0;
//         }
//     });

//     return streak;
//}
function calculateStreak(habitIndex) {

    const weekStreaks = Array.from(document.querySelectorAll(`.week-checkboxes-${habitIndex}`)).map(node=>{
        return Array.from(node.children).reduce((count,child)=>{
            return count + (child.querySelector(".streak-highlight")?1:0);

},0);
    });

    const totalStreak = weekStreaks.reduce((sum,streak)=>{
       return sum + streak
    },0);
    return totalStreak;
}

// function updateStreakDisplay(habitIndex) {
//     const streakElem = document.querySelector(`#streak-days-${habitIndex}`);
//     const streakDays = calculateStreak(habitIndex);
//     if (streakElem) {
//         streakElem.innerHTML = `Streak<br>${streakDays}`;
//     }
// }
function updateHabitDetails(habitIndex) {
    const habit = habits[habitIndex];

    const completedDaysCount = habit.completedDaysCount;
    const streakDays = calculateStreak(habitIndex);
    const daysRemaining = habit.habitGoalDays - completedDaysCount;

    const compltedElem = document.querySelector(`#completed-days-${habitIndex}`);
    const streakElem = document.querySelector(`#streak-days-${habitIndex}`);
    const remainingElem = document.querySelector(`#remaining-days-${habitIndex}`);

    if (compltedElem) {
        compltedElem.textContent = habit.isCompleted ? "Habit Already Completed!" : `Completed Days: ${completedDaysCount}`;
    }
    if (streakElem) {
        streakElem.textContent = `Streak: ${streakDays}`;
    }

    if (remainingElem) {
        remainingElem.textContent = habit.isCompleted
            ? "No Days Remaining"
            : `Days Remaining to Complete: ${daysRemaining}`;
    }
}
// function updateCompletedDisplay(habitIndex) {
//     const habit = habits[habitIndex];
//     const completedElem = document.querySelector(`#completed-days-${habitIndex}`);

//     if (completedElem) {
//         completedElem.textContent = habit.isCompleted 
//             ? "Habit Already Completed!" 
//             : `Completed Days: ${habit.completedDaysCount}`;
//     }
// }

// document.querySelectorAll(".habit-checkboxes").forEach((checkbox)=>{
//     checkbox.addEventListener("click",(e)=>{
//         const isChecked = e.target.checked;
//         const checkboxDay = parseInt(e.target.getAttribute("data-day"),10);
//         const habitIndex = parseInt(e.target.getAttribute("data-habit-index"),10);

//         const habit = habits[habitIndex];
//         habit.days[checkboxDay] = isChecked;

//         if(isChecked){
//             habit.completedDaysCount++;
//             habit.completedDays.push(checkboxDay);
//         } else{
//             habit.completedDaysCount--;
//             habit.completedDays = habit.completedDays.filter(day => day!==checkboxDay);

//         }
//         habit.isCompleted = habit.completedDaysCount === habit.habitGoalDays;
//         updateCompletedDisplay(habitIndex);
//         updateStreakDisplay(habitIndex);
//         updateHabitDetails(habitIndex);

//         updateStreakHighlight(e.target, isChecked);
//         saveHabits();
//     })
// });
function updateStreakHighlight(checkbox, isChecked) {
    if (isChecked) {
        checkbox.parentElement.classList.add("streak-highlight");
    }
    else {
        checkbox.parentElement.classList.remove("streak-highlight");
    }
}
function updateHabitUI(habitIndex) {
    const habit = habits[habitIndex];
    const habitItem = document.getElementById(`habit-item-${habitIndex}`);
    const completedDaysElem = document.getElementById(`completed-days-${habitIndex}`);
    const markCompleteButton = document.querySelector(`#habit-container-${habitIndex} #mark-completed`);
    const editButton = document.querySelector(`#habit-item-${habitIndex} #edit`);
    const deleteButton = document.querySelector(`#habit-item-${habitIndex} #delete`);

    if (!habitItem || !completedDaysElem) return;

    completedDaysElem.textContent = `Completed Days: ${habit.completedDaysCount}`;
    habitItem.classList.toggle("completed", habit.isCompleted)

    if (markCompleteButton) markCompleteButton.classList.toggle("hide", habit.isCompleted);
    if (editButton) editButton.classList.toggle("hide", habit.isCompleted);
    if (deleteButton) deleteButton.classList.toggle("w-full", habit.isCompleted);
}

function cardShrink(habitIndex) {

    const card = document.getElementById(`habit-info-${habitIndex}`);
    card.classList.add("minimize");
}
function cardGrow(habitIndex) {

    const card = document.getElementById(`habit-info-${habitIndex}`);
    card.classList.add("maximize");
    setTimeout(() => window.location.reload(), 1000)

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

function updateHabitState(habitIndex, dayIndex, isChecked) {
    const habit = habits[habitIndex];
    const streak = 0;

    habit.days[dayIndex] = isChecked;
    habit.completedDaysCount = habit.days.filter(Boolean).length;

    streak = calculateStreak(habitIndex);
    habit.isCompleted = habit.completedDaysCount === habit.habitGoalDays;

    // updateCompletedDisplay(habitIndex);
    // updateStreakDisplay(habitIndex);
    updateHabitDetails(habitIndex);
    updateHabitUI(habitIndex);

    saveHabitsDebounced();
}

window.onload = loadHabits;
window.addEventListener("DOMContentLoaded", initializeHabits);

