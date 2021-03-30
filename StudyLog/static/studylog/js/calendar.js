document.addEventListener('DOMContentLoaded', () => {
  // listens for create task btn
  const createBtn = document.querySelector('.create-task-btn')
  if (createBtn !== null) {
    createBtn.addEventListener('click', () => {
      CreateTask(event.target)
    })
  }

  // associates every calendar task with the current html
  const taskList = document.querySelector('#calendar_tasks')
  PageColor(taskList)
})

function CreateTask (button) {
  const taskContent = document.querySelector('#content')
  const taskComment = document.querySelector('#comment')
  const taskDate = document.querySelector('#date')

  // sends to database
  fetch('/create_calendar_task', {
    method: 'POST',
    body: JSON.stringify({
      'content': taskContent.value,
      'comment': taskComment.value,
      'date': taskDate.value
    }),
    credentials: 'same-origin',
    headers: {"X-CSRFToken": getCookie("csrftoken")}
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      // reloads page
      window.location.reload(true)
    })
}

function PageColor (taskList) {
  const tasks = Array.from(taskList.children)
  const months = {
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sept': 'September',
    'Oct': 'October',
    'Nov': 'November',
    'Dec': 'December'}

  let days = ''
  let dayName = ''
  let dayNumber = ''
  let dayPk = ''
  let taskDays = []
  let NewTaskDays = []

  tasks.forEach((task) => {
    let date = task.lastElementChild.innerText
    const pk = task.firstElementChild.id.split('#')
    date = date.split(' ')
    date.push(pk[0])
    const monthTables = document.querySelectorAll('th.month')

    let currentMonth = ''
    let monthName = ''

    monthTables.forEach((month) => {
      if (month.innerText === months[date[1]]) {
        currentMonth = month.parentNode.parentNode.parentNode
        monthName = month.innerText
      }
    })

    dayName = date[0].toLowerCase()
    dayNumber = date[2]
    dayPk = date[4]

    days = currentMonth.querySelectorAll('td.' + `${dayName}`)
    days.forEach((day) => {
      if (day.innerText === dayNumber) {
        day.style.background = 'blue'
        day.style.color = 'white'
        day.style.cursor = 'pointer'
        day.dataset.toggle = 'modal'
        day.dataset.target = '#singlecalendartask'
        day.id = dayPk

        // adds current day to taskDays through a list

        const dayList = [monthName, day]
        taskDays.push(dayList)
      }
    })
    // crea un objeto con el mes y el día, luego haces una lista con dichos objetos
  })

  for (let i = 0, length1 = taskDays.length; i < length1; i++) {
    if (i === 0) {
      NewTaskDays.push(taskDays[i])
    }
    if (i >= 1) {
      if (taskDays[i][1] !== taskDays[i - 1][1]) {
        NewTaskDays.push(taskDays[i])
      }
    }
  }

  NewTaskDays.forEach((day) => {
    day[1].addEventListener('click', () => {
      DayInfo(day, tasks)
    })
  })
}

function DayInfo (day, tasks) {
  // retrieves month's name of current day
  const belongMonth = day[1].parentElement.parentElement.firstElementChild.firstElementChild.innerText.slice(0, 3)
  console.log(day[1])
  console.log(tasks)

  const currentDayTasks = []

  // gets current day tasks
  for (let i = 0; i < tasks.length; i++) {
    if (belongMonth === tasks[i].lastElementChild.innerText.slice(4, 7)) {
      if (parseInt(day[1].innerText) < 10) {
        if (day[1].innerText === tasks[i].lastElementChild.innerText.slice(8, 9)) {
          currentDayTasks.push(tasks[i])
        }
      } else {
        if (day[1].innerText === tasks[i].lastElementChild.innerText.slice(8, 10)) {
          currentDayTasks.push(tasks[i])
        }
      }
    }
  }

  console.log(currentDayTasks)

  const modalBody = document.querySelector('#singlecalendartask')
    .firstElementChild
    .firstElementChild
    .firstElementChild
    .nextElementSibling

  while (modalBody.firstChild) {
      modalBody.removeChild(modalBody.firstChild)
  }

  currentDayTasks.forEach((day) => {
    const taskContent = day.querySelector('.task_content')
    const taskComment = day.querySelector('.task_comment')

    console.log(taskContent)
    console.log(taskComment)

    const contentLabel = document.createElement('label')
    contentLabel.htmlFor = 'modal_task_content'
    contentLabel.className = 'col-form-label font-weight-bold d-inline-block'
    contentLabel.innerText = 'Task:'

    const content = document.createElement('div')
    content.id = 'modal_task_content'
    content.className = ' border border-dark rounded p-2 m-1'
    content.innerText = taskContent.innerText

    const commentLabel = document.createElement('label')
    commentLabel.htmlFor = 'modal_task_comment'
    commentLabel.className = 'col-form-label font-weight-bold'
    commentLabel.innerText = 'Comment:'

    const comment = document.createElement('div')
    comment.id = 'modal_task_comment'
    comment.className = 'border border-dark rounded p-2 m-1 d-block'
    comment.innerText = taskComment.innerText

    if (comment.innerText === '') {
      modalBody.append(contentLabel, content)
    } else {
      modalBody.append(contentLabel, content, commentLabel, comment)
    }

    // creates delete task button
    const deleteButton = document.createElement('button')
    deleteButton.className = 'btn btn-danger mt-3 mb-3 p-1 d-block'
    deleteButton.innerText = 'Delete this task from calendar'

    deleteButton.addEventListener('click', () => {
      delCalendarTask(event.target, day)
    })

    modalBody.append(deleteButton)
  })
}

function delCalendarTask (button, day) {
  // clicks modal
  const closeBtn = button.parentElement.previousElementSibling.lastElementChild
  function closemodal () {
    // deletes color from page
    day.style.background = 'white'
    day.style.color = 'black'
    day.style.cursor = 'initial'
    closeBtn.click()
  }
  setTimeout(closemodal, 200)

  // delete from database
  const calendarPk = day.firstElementChild.id.split('_')[1]
  fetch('/delete_calendar_task', {
    method: 'POST',
    body: JSON.stringify({
      'pk': calendarPk,
    }),
    credentials: 'same-origin',
    headers: { "X-CSRFToken": getCookie("csrftoken") }
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      // reloads page
      window.location.reload(true)
    })
}

// get csrf token for security purposes
function getCookie (name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}