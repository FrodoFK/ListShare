document.addEventListener("DOMContentLoaded", () => {

    document.querySelector("#new_form").addEventListener('submit', (event) => {
        addTask(event);
        event.preventDefault()
    })

    //gets all delete buttons
    const delete_buttons = document.querySelectorAll(".delete-btn")
    
    delete_buttons.forEach((button) => {
        
        button.addEventListener('click', (event) => {
            deleteTask(event);
        })
    })

    const complete_buttons = document.querySelectorAll(".complete-btn")

    complete_buttons.forEach((button) => {

        const li = button.parentElement.firstElementChild
        const key = button.parentElement.lastElementChild.value

        const state = localStorage.getItem(key)

        if (state === "unmarked") {
            button.innerHTML = "Mark as Completed"
            li.style.textDecoration = 'none';
        } else {
            button.innerHTML = "Unmark"
            li.style.textDecoration = 'line-through';
        }

        button.addEventListener('click', (event) => {
            completeTask(event);
        })
    })


})

function addTask (event) {
    // gets form element
    const parent = event.target
    
    // get each part of the form
    const frecuency = parent.querySelector("#frecuency")
    const content = parent.querySelector("#content")
    const comment = parent.querySelector("#comment")

    let given_key =""

    //send task to server
    fetch("/new_task", {
        method: "POST",
        body: JSON.stringify({
            frecuency: frecuency.value,
            task_content: content.value,
            task_comment: comment.value
        }),
        credentials: 'same-origin',
        headers: {"X-CSRFToken": getCookie("csrftoken")}
    })
    .then((response) => response.json())
    .then((result) => {
        if (result['error']) {
            console.log(result['error'])
        }
        else {
            console.log(result)
            given_key = result['key']
            //console.log(given_key)
            return given_key

        }
    })
    .then((key) => {

        // gets panel to be addded
        const panel = document.querySelector("#" + `${frecuency.value}`)

        // creates each element

        const li = document.createElement("li")
        li.innerHTML = "<h5>" + content.value + "</h5>"

        const para = document.createElement("p")
        para.className= "m-2 p-2"
        if (comment.value !== "") {
            para.innerHTML = comment.value    
        }

        const completed = document.createElement("button")
        completed.className = "btn btn-primary complete-btn d-inline-block mr-1"
        completed.innerHTML = "Mark as Completed"


        const delbtn = document.createElement("button")
        delbtn.className = "btn btn-primary delete-btn d-inline-block"
        delbtn.innerHTML = "Delete"
        delbtn.addEventListener('click', (event) => {
                deleteTask(event);
            })

        key_value = document.createElement("input")
        key_value.type = "hidden"
        key_value.name = "key_id"
        key_value.value = key
        localStorage.setItem(key, "unmarked")

        // creates container to append
        const container = document.createElement("div")
        container.className ="p-2 m-2 border-bottom"
        container.append(li, para, completed, delbtn, key_value)


        // appends container to body
        panel.querySelector("ul").append(container)

        //changes panel
        document.querySelector("#" + `${frecuency.value}` + "-tab").click()

        // cleanses first addition
        if (panel.querySelector("h2") !== null){
            panel.querySelector("h2").remove()
        }

        // cleanses form
        content.value = ""
        comment.value = ""
    })

    
}


function deleteTask (event) {
    
    // get tasks primary key
    const key = event.target.nextElementSibling
    console.log(key)

    // sends "delete request" to server

    fetch("/delete_task", {
        method:"POST",
        body: JSON.stringify({pk:key.value}),
        credentials: 'same-origin',
        headers: {"X-CSRFToken": getCookie("csrftoken")}
    })
    .then((response) => response.json())
    .then((result) => {
        console.log(result)
    })

    // update page in real time
    const parent = key.parentElement
    let op = 10
    let id= setInterval(remove_el, 30)

    function remove_el() {
        if (op === 0){
            parent.remove()

        }
        else{
            parent.style.opacity = op/10
            op--
        }
    }

    // puts no task default
    const root = parent.parentElement.parentElement
    const default_title = document.createElement("h2")
    default_title.innerHTML = "No tasks added yet!"

    if (root.firstElementChild.childElementCount === 1) {
        parent.remove()
        root.append(default_title)
    }

}

function completeTask (event) {

    const li = event.target.parentElement.firstElementChild
    const key = event.target.parentElement.lastElementChild.value

    if (event.target.innerHTML === "Mark as Completed") {
        li.style.textDecoration = 'line-through';
        event.target.innerHTML = "Unmark"
        localStorage.setItem(key, 'marked')


    } else {
        li.style.textDecoration = 'none';
        event.target.innerHTML = "Mark as Completed"
        localStorage.setItem(key, 'unmarked')
    }
    
}


// get csrf token for security purposes
function getCookie(name) {
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