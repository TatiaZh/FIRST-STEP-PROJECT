
/*--------------------- Saving buttons in variables ------------------- */

let addDayButton = document.querySelector('.button.add');
let removeDayButton = document.querySelector('.button.remove');
let updateTableButton = document.querySelector('.button.update');

/*------------------------- ADD DAY -------------------------------  */

// Function adds eventlistener to button ADD DAY
// clicking this button causes to add new day to the table, generate date 
// that is next to be added, style the table accordingly and update statistics section
addDayButton.addEventListener('click', event => {
    genrateDate('+');
    let rawDate = event.target.dataset.date;
    let convertedDate = convertDate(rawDate);
    addDay(convertedDate);
    styleDaysByGrowth(true);
    updateStatistics();
});
// Function creates and adds new date and student mark cells to each student row
function addDay(dateValue) {
    let studentFR = document.querySelector('.studentFR');
    let dayNode = document.createElement('div');
    dayNode.setAttribute('class', 'day frRow');
    let dayNodeText = document.createTextNode(dateValue);
    dayNode.appendChild(dayNodeText);
    studentFR.appendChild(dayNode);
    let students = document.querySelectorAll('.student');
    students.forEach(element => {
        let dayMark = document.createElement('div');
        dayMark.setAttribute('class', 'day');
        let dayMarkText = document.createTextNode('0');
        dayMark.appendChild(dayMarkText);
        element.appendChild(dayMark);
    });
}
// Function generates dates according to techub timetable
function genrateDate(operator) {
    let currentDate = new Date();
    currentDate.setTime(parseInt(addDayButton.dataset.date));
    let nextDate = new Date();
    if(operator=='+'){
        nextDate.setTime(currentDate.getTime() + 86400000 * 2);
        if (currentDate.getDay() == 5) {
            nextDate.setTime(currentDate.getTime() + 86400000);
        } 
    }
    else{
        nextDate.setTime(currentDate.getTime() - 86400000 * 2);
        if (currentDate.getDay() == 6) {
        nextDate.setTime(currentDate.getTime() - 86400000);
        }
    }
    addDayButton.dataset.date = nextDate.getTime();
}
// Function converts generated date to readable dd.mm.yy format 
function convertDate(rawdate) {
    let date = new Date();
    date.setTime(parseInt(rawdate));
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();
    year = year.slice(2, 4);
    month.length < 2 ? month = '0' + month : month = month;
    day.length < 2 ? day = '0' + day : day = day;
    return `${day}.${month}.${year}`;
}
// function makes sure that table columns shrink or grow accordingly when user adds a new column
function styleDaysByGrowth(grow) {
    let studentFR = document.querySelector('.studentFR');
    let students = document.querySelectorAll('.student');
    let colCounter = parseInt(studentFR.dataset.colCounter);
    grow ? studentFR.dataset.colCounter = ++colCounter : studentFR.dataset.colCounter = --colCounter;
    studentFR.style.gridTemplateColumns = `repeat(${colCounter}, minmax(50px, 1fr)`;
    students.forEach(element => {
        element.style.gridTemplateColumns = `repeat(${colCounter}, minmax(50px, 1fr)`;
    });
}
// --------------------------------------------------------------------- //

/*------------------------- REMOVE DAY -------------------------------  */
// Function removes last added date from table
function removeDay() {
    let studentFR = document.querySelector('.studentFR');
    let studentFRChildren = document.querySelectorAll('.day.frRow');
    studentFR.removeChild(studentFRChildren[studentFRChildren.length - 1]);
    let students = document.querySelectorAll('.student');
    students.forEach(element => {
        let studentsChildren = element.querySelectorAll('.day');
        element.removeChild(studentsChildren[studentsChildren.length - 1]);
    });
}
// Function adds evenlistener to button named REMOVE DAY
// clicking this button causes to remove last added day from table, generate date 
// that is next to be added, style the table accordingly and update statistics section
removeDayButton.addEventListener('click', event => {
    removeDay();
    genrateDate('-');
    styleDaysByGrowth(false);
    updateStatistics();
});
// ----------------------------------------------------------------------- //

/*------------------------- UPDATE MARKS -------------------------------  */

// Function updates student mark cells when clicking on them
function updateMarks() {
    let table = document.querySelector('.table');
    table.addEventListener('click', event => {
        let clickedCell = event.target;
        let tabelCellArray = Array.from(clickedCell.classList);
        if (tabelCellArray.includes("day") || tabelCellArray.includes("studentPresent")) {
            let mark = Number(prompt("Please Enter Student's Mark", '0'));
            mark < 0 ? mark = 0 : mark = mark;
            mark > 4 ? mark = 5 : mark = mark;
            mark == null ? mark = clickedCell.innerHTML : mark = mark;
            mark > 0 ? clickedCell.classList.add("studentPresent") : clickedCell.classList.remove("studentPresent");;
            clickedCell.innerHTML = mark;
            updateStatistics();

        }

    })
}
updateMarks();
// ---------------------------------------------------------------------------- //

/*------------------------- UPDATE STATISTICS -------------------------------  */
// Function uptades the statistics section when clicking on the button named UPDATE TABLE
updateTableButton.addEventListener('click', event =>{
    updateStatistics();
    /* 
        This function and the button itself are not really useful
        because statistics already uptade dinamically
        one can assume that this button would be used to send the information to 
        database or server 
    */
})
// Function updates the statistics section
function updateStatistics() {
    updateTotalDays();
    updateMissedLessons();
    calculateAverage();
}
// Function updates the number of missed lessons by all students
function updateMissedLessons() {
    let missedLessons = document.querySelector('.missedLessons');
    let students = document.querySelectorAll('.student');
    let counter = 0;
    students.forEach(element => {
        let marks = Array.from(element.querySelectorAll('.day'));
        for (e of marks) {
            if (e.innerHTML == '0') {
                counter++;
            }
        };
    });
    missedLessons.innerHTML = counter;
}
// Function updates the number of total days
function updateTotalDays() {
    let totalDays = document.querySelector('.totalDays');
    let totalDaysArray = document.querySelectorAll('.day.frRow');
    totalDays.innerHTML = totalDaysArray.length;
}
// Function updates the average mark of all students
function updateAverageMark() {
    let avr = 0;
    let averages = document.querySelectorAll('.student .avr');
    for (e of averages) {
        avr += parseFloat(e.innerHTML);
    }
    let averageMark = document.querySelector('.averageMark');
    averageMark.innerHTML = (avr / averages.length).toFixed(2);
}
// Function updates the total number of students
function updateTotalStudents() {
    let totalStudents = document.querySelector('.totalStudents');
    let students = document.querySelectorAll('.student');
    totalStudents.innerHTML = students.length;
}
updateTotalStudents();
// Function calculates the average mark of each student as well as of all students
function calculateAverage() {
    let students = document.querySelectorAll('.student');
    students.forEach(element => {
        let averageMark = element.querySelector('.avr');
        let avr = 0;
        let marks = Array.from(element.querySelectorAll('.day'));
        for (e of marks) {
            avr += parseFloat(e.innerHTML);
        };
        averageMark.innerHTML = (avr / marks.length).toFixed(2);
    });
    updateAverageMark();
}