const timerSection = document.createElement('div');
timerSection.id = "timer-section";

const timerContainer = document.createElement('div');
timerContainer.id = "timer-container";
timerContainer.innerHTML =
    `
<div id='timer-input-container'>
     <input type='number' id='timer-limit' placeholder='Set Timer Limit (in minutes)'/> 
     <button id='start-timer'>Start Timer</button>
     </div>`;

const timerContainerHeader = document.createElement('h2');
timerContainerHeader.innerText = "Habit Timer !!";
timerContainerHeader.id = "timer-container-header";

const parent = document.getElementById('habit-list').parentNode;
// parent.insertBefore(timerContainer, document.getElementById('habit-list').nextSibling);
// parent.insertBefore(timerContainerHeader, document.getElementById('timer-container'));
parent.insertBefore(timerSection, document.getElementById('habit-list').nextSibling);

timerSection.appendChild(timerContainerHeader);
timerSection.appendChild(timerContainer);

let startedTimer = false;
document.getElementById('start-timer').addEventListener('click', () => {
    const instruction = document.createElement('p');

    if (!startedTimer) {
        const timerElemContainer = document.createElement('div');
        timerElemContainer.id = "timer-display-container";

        const timerElem = document.createElement('div');
        timerElem.id = "timer-display";

        const timerStop = document.createElement('button');
        timerStop.innerText = "Stop Timer";
        timerStop.id = "timer-display-stop";

        class Timer {

            constructor(limit) {
                this.limit = limit;
                this.totalSeconds = 0;
                this.minutes = 0;
                this.seconds = 0;
                this.stop = false;
            }

            setStop() {
                this.stop = true;
            }
            getStop() {
                return this.stop;
            }
            startTimer() {
                setInterval(() => {
                    if (!this.getStop()) {
                        if (this.totalSeconds < this.limit * 60) {

                            if (this.totalSeconds != 0 ? this.totalSeconds % 60 == 0 : '') {
                                this.minutes++;
                                this.totalSeconds++;
                                this.seconds = 0;
                                timerElem.innerText = `Minutes : ${this.minutes} and Seconds : ${this.seconds}`;
                            }
                            else {
                                this.totalSeconds++;
                                this.seconds++;
                                timerElem.innerText = this.minutes != 0 ? `Minutes : ${this.minutes} and Seconds : ${this.seconds} ` : `Seconds : ${this.seconds} `;
                            }
                            timerElemContainer.appendChild(timerElem);
                            timerElemContainer.appendChild(timerStop);
                        }
                        else {
                            timerElem.innerHTML = '<h2>Time Up!</h2>';
                            timerElemContainer.appendChild(timerElem);

                            timerElemContainer.contains(timerStop) ? timerElemContainer.removeChild(timerStop) : '';
                        }

                        timerContainer.appendChild(timerElemContainer);
                    }
                    else {
                        if (timerContainer.contains(timerElemContainer)) timerContainer.removeChild(timerElemContainer);
                    }

                }, 1000);
            }

            stopTimer() {
                this.setStop();
            }
        }

        if (document.getElementById('timer-limit').value) {
            const limit = document.getElementById('timer-limit').value;

            const newTimer = new Timer(limit);
            newTimer.startTimer();
            document.getElementById('timer-limit').value = "";

            timerStop.onclick = function () { newTimer.stopTimer(); }
            startedTimer = true;
        }
        else {
            instruction.innerText = "Please input time limit first!";
            timerContainer.appendChild(instruction);
        }

    } else {
        instruction.innerText = "Timer is already running !";
        document.getElementById('timer-input-container').appendChild(instruction);
        document.getElementById('timer-limit').value = "";
    }
});
