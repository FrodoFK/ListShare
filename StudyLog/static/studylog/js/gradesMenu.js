document.addEventListener('DOMContentLoaded', () => {
  // listens for add grade button
  const addGradeBtn = document.querySelector('.addgradebtn')
  addGradeBtn.addEventListener('click', () => {
    addGradeModal(event.target)
  })

  // listens for create subject button
  const createSubjectbtn = document.querySelector('.create-subject-btn')
  createSubjectbtn.addEventListener('click', () => {
    createSubject()
  })

  // listens for a delete subject button
  const deleteButtonList = document.querySelectorAll('.deletebtn')
  deleteButtonList.forEach((button) => {
    button.addEventListener('click', () => {
      deleteSubject(event.target)
    })
  })

  // listens for a status change button
  const completeButtonList = document.querySelectorAll('.complete_button')
  completeButtonList.forEach((button) => {
    button.addEventListener('click', () => {
      changeStatus(event.target)
    })
  })

  // listens for a edit button
  const editButtonList = document.querySelectorAll('.editbtn')
  editButtonList.forEach((button) => {
    button.addEventListener('click', () => {
      editSubject(event.target)
    })
  })

  // listens for newgrade button
  const newGradeBtn = document.querySelector('.create-grade-btn')
  newGradeBtn.addEventListener('click', () => {

  })

  // displays total score & % for each subject
  subjectCalcs()
})

function subjectCalcs () {
  const tables = document.querySelectorAll('table')

  tables.forEach((table) => {
    // calcs total score
    const gradesTotal = table.querySelectorAll('.gradetotal')
    let totalpts = 0

    gradesTotal.forEach((grade) => {
      const gradeValue = parseFloat(grade.innerText)
      totalpts += gradeValue
    })

    // appends total score to table
    const totalPoints = table.querySelector('#total_points')
    totalPoints.innerText = `${totalpts}` + 'pts'

    // calcs user score
    let userTotal = 0
    const gradesObtained = table.querySelectorAll('.gradeobtained')
    gradesObtained.forEach((grade) => {
      const gradeValue = parseFloat(grade.innerText)
      userTotal += gradeValue
    })

    // calculates % of user total
    const userPercent = (userTotal * 100) / totalpts

    // append results to table
    const userInfo = table.querySelector('#total_percent')
    userInfo.innerText = `${userTotal}` + "pts " + `(${userPercent.toPrecision(4)}%)`

  })
}

function addGradeModal () {
  const reqGrade = document.querySelector('#required_grade')
  const newGrade = reqGrade.cloneNode(true)

  // clears newGrade fields
  newGrade.querySelector('#grade_type').value = ''
  newGrade.querySelector('#grade_obtained').value = ''
  newGrade.querySelector('#grade_total').value = ''
  newGrade.querySelector('#grade_date').value = ''

  // appends new task to modal
  document.querySelector('#required_grade').parentElement.append(newGrade)
}

function deleteGradeModal (grade) {
  const count = grade.parentElement.parentElement.childElementCount
  if (count !== 1) {
    grade.parentElement.remove()
  }
}

function createSubject () {
  const subjectTitle = document.querySelector('#subject_title').value
  const reqGrade = document.querySelector('#required_grade')

  // validates title
  if (subjectTitle === '') {
    alert("Subject's title is required")
  }
  // validates required grade field
  else if (reqGrade.querySelector('#grade_type').value === '' || reqGrade.querySelector('#grade_obtained').value === '' || reqGrade.querySelector('#grade_total').value === '' || reqGrade.querySelector('#grade_date').value === '') {
    alert('All grade fields must be filled!')
  } else {
    // retrieves each grade's info
    const gradeList = []
    const gradeArray = Array.from(reqGrade.parentElement.children)

    gradeArray.forEach((grade) => {
      const gradeObject = {
        grade_type: grade.querySelector('#grade_type').value,
        grade_obtained: grade.querySelector('#grade_obtained').value,
        grade_total: grade.querySelector('#grade_total').value,
        grade_date: grade.querySelector('#grade_date').value
      }
      gradeList.push(gradeObject)
    })

    // sends data to server
    fetch('/create_subject', {
      method: 'POST',
      body: JSON.stringify({
        title: subjectTitle,
        gradeList: gradeList
      }),
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        // closes modal
        const close = document.querySelector('#gradesmenu_title').nextElementSibling
        close.click()
        clearForm()

        // reloads page
        window.location.reload(true)
      })
  }
}

function clearForm () {
  const reqGrade = document.querySelector('#required_grade')
  // clears reqGrade & title fields
  document.querySelector('#subject_title').value = ''
  reqGrade.querySelector('#grade_type').value = ''
  reqGrade.querySelector('#grade_obtained').value = ''
  reqGrade.querySelector('#grade_total').value = ''
  reqGrade.querySelector('#grade_date').value = ''

  const form = document.querySelector('#grade_list')
  while (form.firstElementChild.nextElementSibling != null) {
    form.firstElementChild.nextElementSibling.remove()
  }
}

function deleteSubject (button) {
  const confirmation = confirm('Are you sure you want to delete this Subject?')
  if (!confirmation) {
    return
  }

  const table = button.parentElement.parentElement.parentElement.parentElement
  const pk = table.querySelector('.subjectpk').innerText
  console.log(pk)

  // sends data to server
  fetch('/delete_subject', {
    method: 'POST',
    body: JSON.stringify({
      pk: pk
    }),
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': getCookie('csrftoken') }
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      // removes element
      table.remove()
    })
}

function changeStatus (button) {
  const gradePk = button.parentElement.nextElementSibling.innerText
  const status = button.parentElement.previousElementSibling

  // sends data to server
  fetch('/change_grade_status', {
    method: 'POST',
    body: JSON.stringify({
      pk: gradePk,
      new_status: status.innerText
    }),
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': getCookie('csrftoken') }
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)

      // changes button according to new state
      if (result.new_status === 'done') {
        status.innerText = 'DONE'
        button.className = 'complete_button btn btn-danger'
        button.innerText = 'Unmark as Done'
      } else {
        status.innerText = 'PENDING'
        button.className = 'complete_button btn btn-primary'
        button.innerText = 'Mark as Done'
      }
    })
}

function editSubject (button) {
  const table = button.parentElement.parentElement.parentElement.parentElement

  // creates and appends new finish button
  const finishBtn = document.createElement('button')
  finishBtn.innerText = 'Finish'
  finishBtn.style.color = button.style.color
  finishBtn.className = 'btn editbtn'

  // appends button to table
  button.parentElement.append(finishBtn)
  button.remove()

  finishBtn.addEventListener('click', () => {
    normalState(event.target)
  })

  // changes cursor style to pointer on every cell and adds singleEdit listener
  const title = table.querySelector('.subject_title')
  title.style.cursor = 'pointer'
  title.addEventListener('click', () => {
    singleEdit(event.target, 'title', event.target.innerText)
  })

  // changes cursor style and hover animation
  const testTypeList = table.querySelectorAll('.testype')
  testTypeList.forEach((cell) => {
    cell.style.cursor = 'pointer'
    cell.onmouseenter = function () {
      cell.classList.add('hov')
    }
    cell.onmouseleave = function () {
      cell.classList.remove('hov')
      cell.classList.add('nohov')
    }
    cell.addEventListener('click', () => {
      singleEdit(event.target, 'testtype', event.target.innerText)
    })
  })

  // changes cursor style and hover animation
  const scoreList = table.querySelectorAll('.gradeobtained')
  scoreList.forEach((cell) => {
    cell.style.cursor = 'pointer'
    cell.onmouseenter = function () {
      cell.classList.add('hov')
    }
    cell.onmouseleave = function () {
      cell.classList.remove('hov')
      cell.classList.add('nohov')
    }
    cell.addEventListener('click', () => {
      singleEdit(event.target, 'score', event.target.innerText)
    })
  })

  // changes cursor style and hover animation
  const dateList = table.querySelectorAll('.date')
  dateList.forEach((cell) => {
    cell.style.cursor = 'pointer'
    cell.onmouseenter = function () {
      cell.classList.add('hov')
    }
    cell.onmouseleave = function () {
      cell.classList.remove('hov')
      cell.classList.add('nohov')
    }
    cell.addEventListener('click', () => {
      singleEdit(event.target, 'date', event.target.innerText)
    })
  })

  // changes mark as done buttons to delete current grade buttons
  const completeButtonList = table.querySelectorAll('.complete_button')
  completeButtonList.forEach((button) => {
    // fetches cell and removes button to delete event listener too
    const cell = button.parentElement
    button.remove()
    // creates new button
    const newButton = document.createElement('button')
    newButton.innerText = 'Delete This Grade'
    newButton.className = 'btn btn-outline-danger'

    // adds new button to cell
    cell.append(newButton)

    newButton.addEventListener('click', () => {
      deleteGrade(event.target)
    })
  })

  // creates "add new grade" button
  const newGradeButton = document.createElement('button')
  newGradeButton.innerText = 'Create New Grade'
  newGradeButton.className = 'btn btn-outline-primary'
  newGradeButton.setAttribute('data-toggle', 'modal')
  newGradeButton.setAttribute('data-target', '#newgrademenu')

  // appends create grade button to table
  const tableRow = table.firstElementChild.firstElementChild.nextElementSibling.lastElementChild
  tableRow.append(newGradeButton)
  newGradeButton.addEventListener('click', () => {
    localStorage.setItem('last_value', title.nextElementSibling.innerText)
  })

  alert("Click the Subject's Title or any grade's cell to edit it")
}

function singleEdit (cell, cellName, text) {
  if (cell.tagName === 'BUTTON') {
    return
  }
  if (text.toUpperCase() !== 'SAVE') {
  // checks the input's type to replace into the cell
    if (cellName === 'testtype') {
      cell.innerHTML = '<input type="text" width="50px" class="form-control mt-1" value=' + `${text}` + '><button onclick="saveData(event.target)" class="btn btn-primary my-1">Save</button>'
    }
    if (cellName === 'score' && cell.tagName !== 'A') {
      cell.innerHTML = '<input type="text" width="50px" class="form-control mt-1" value=' + `${text}` + '><button onclick="saveData(event.target)" class="btn btn-primary my-1">Save</button>'
    }
    if (cellName === 'title') {
      cell.innerHTML = '<input type="text" class="form-control mt-1" value=' + `${text}` + '><button onclick="saveData(event.target)" class="btn btn-danger my-1">Save</button>'
    }
    if (cellName === 'date') {
      cell.innerHTML = '<input type="text" width="50px" class="form-control mt-1" value=' + `${text}` + '><button onclick="saveData(event.target)" class="btn btn-primary my-1">Save</button>'
    }
  }
  cell.classList.add('p-2')
}

function saveData (button) {
  if (button.parentElement.className.indexOf('date') !== -1) {
    const dateText = button.parentElement.querySelector('input').value
    const dateArray = dateText.split('-')
    if (dateArray.length !== 3 || dateArray[2].length !== 2) {
      alert('Invalid Date\n Format is YYYY-MM-DD')
    }
    const date = new Date(dateText)
    console.log(date.toDateString())

    if (isNaN(date.valueOf())) {
      alert('Invalid Date\n Format is YYYY-MM-DD')
    } else {
      sendSingleEdit(button.parentElement.parentElement.lastElementChild,
        'date',
        dateText)
      button.parentElement.innerText = dateText
    }
  } else {
    sendSingleEdit(button.parentElement.parentElement.lastElementChild,
      button.parentElement.classList[0],
      button.parentElement.querySelector('input').value)
    if (button.parentElement.classList[0] === 'gradeobtained') {
      const scoreValues = button.parentElement.querySelector('input').value.split('/')
      button.parentElement.innerHTML = '<td class="gradeobtained">' + `${scoreValues[0]}` + '/<a class="gradetotal">' + `${scoreValues[1]}` + '</a></td>'
    } else {
      button.parentElement.innerText = button.parentElement.querySelector('input').value
    }
  }
}

function sendSingleEdit (pk, cell, value) {
  if (cell === 'gradeobtained') {
    const newValues = value.split('/')
    fetch('/edit_grade', {
      method: 'POST',
      body: JSON.stringify({
        pk: pk.innerText,
        gradeobtained: newValues[0],
        gradetotal: newValues[1]
      }),
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        subjectCalcs()
      })
  }
  if (cell === 'testype') {
    fetch('/edit_grade', {
      method: 'POST',
      body: JSON.stringify({
        pk: pk.innerText,
        testype: value
      }),
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
      })
  }
  if (cell === 'date') {
    fetch('/edit_grade', {
      method: 'POST',
      body: JSON.stringify({
        pk: pk.innerText,
        date: value
      }),
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
      })
  }
  if (cell === 'subject_title') {
    const newPk = pk.previousElementSibling.innerText
    fetch('/edit_grade', {
      method: 'POST',
      body: JSON.stringify({
        newPk: newPk,
        title: value
      }),
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
      })
  }
}

function normalState (button) {
  const table = button.parentElement.parentElement.parentElement.parentElement

  // creates and appends new edit button
  const editBtn = document.createElement('button')
  editBtn.innerText = 'Edit this Subject'
  editBtn.style.color = button.style.color
  editBtn.className = 'btn editbtn'

  // appends button to table
  button.parentElement.append(editBtn)
  button.remove()

  editBtn.addEventListener('click', () => {
    editSubject(event.target)
  })

  // removes creategrade button
  table.querySelector('.btn-outline-primary').remove()

  // turn delete buttons to mark as done buttons
  const deleteButtonList = table.querySelectorAll('.btn-outline-danger')
  deleteButtonList.forEach((button) => {
    const status = button.parentElement.previousElementSibling.innerText

    // creates new mark as done button
    const doneButton = document.createElement('button')
    if (status === 'DONE') {
      doneButton.innerText = 'Unmark as Done'
      doneButton.className = 'complete_button btn btn-danger'
    } else {
      doneButton.innerText = 'Mark as Done'
      doneButton.className = 'complete_button btn btn-primary'
    }

    // adds event listener
    doneButton.addEventListener('click', () => {
      changeStatus(event.target)
    })

    button.parentElement.replaceChild(doneButton, button)
  })


  // removes cursor and hover effects
  const title = table.querySelector('.subject_title')
  const newTitle = document.createElement('th')
  newTitle.innerText = title.innerText
  newTitle.className = title.className
  newTitle.colSpan = '4'

  table.firstElementChild.firstElementChild.replaceChild(newTitle, title)

  // changes cursor style and hover animation
  const testTypeList = table.querySelectorAll('.testype')
  testTypeList.forEach((cell) => {
    const newCell = document.createElement('td')
    newCell.innerText = cell.innerText
    newCell.className = cell.className

    cell.parentElement.replaceChild(newCell, cell)
  })

  // changes cursor style and hover animation
  const scoreList = table.querySelectorAll('.gradeobtained')
  scoreList.forEach((cell) => {
    const newCell = document.createElement('td')
    newCell.innerText = cell.innerText
    newCell.className = cell.className

    cell.parentElement.replaceChild(newCell, cell)
  })

  // changes cursor style and hover animation
  const dateList = table.querySelectorAll('.date')
  dateList.forEach((cell) => {
    const newCell = document.createElement('td')
    newCell.innerText = cell.innerText
    newCell.className = cell.className

    cell.parentElement.replaceChild(newCell, cell)
  })
}

function deleteGrade (button) {
  const pk = button.parentElement.nextElementSibling.innerText

  fetch('/delete_grade', {
    method: 'POST',
    body: JSON.stringify({
      pk: pk
    }),
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': getCookie('csrftoken') }
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // replace each table cell
        const tableRow = button.parentElement.parentElement
        tableRow.remove()
      } else {
        console.log('not deleted')
      }

      subjectCalcs()
    })
}

function newGrade (button) {
  const subjectPk = localStorage.getItem('last_value')
  const newGradeForm = document.querySelector('#newgrade_form')

  const tt = newGradeForm.querySelector('#newgrade_type').value
  const so = newGradeForm.querySelector('#newgrade_obtained').value
  const ts = newGradeForm.querySelector('#newgrade_total').value
  const date = newGradeForm.querySelector('#newgrade_date').value

  if (tt === '' || so === '' || ts === '' || date === '') {
    return
  }

  // sends data to server
  fetch('/create_grade', {
    method: 'POST',
    body: JSON.stringify({
      subjectPk: subjectPk,
      tt: tt,
      so: so,
      ts: ts,
      date: date
    }),
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': getCookie('csrftoken') }
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
    })
}

// get csrf token for security purposes
function getCookie (name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}
