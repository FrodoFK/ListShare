document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('#searchBtn')
  searchBtn.addEventListener('click', () => {
    const word = document.querySelector('#searchbar').value
    if (word !== '') {
      searchBtn.parentElement.innerHTML = '<button class="btn btn-primary" id="searchBtn" disabled style="cursor:default;"><span class="spinner-border spinner-border-sm mr-2 mb-1" role="status" aria-hidden="true"></span><div class="ml-1 d-inline-block">Searching</div></button>'
      SearchWord(word, document.querySelector('#searchBtn'))
    } else {
      alert('You must write a word!')
    }
  })
})

function SearchWord (word, button) {
  fetch('/get_word', {
    method: 'POST',
    body: JSON.stringify({ word: word }),
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': getCookie('csrftoken') }
  })
    .then((response) => response.json())
    .then((result) => {
      button.parentElement.innerHTML = '<button class="btn btn-primary" id="searchBtn">Search</button>'
      document.querySelector('#searchBtn').addEventListener('click', () => {
        const word = document.querySelector('#searchbar').value
        if (word !== '') {
          document.querySelector('#searchBtn').parentElement.innerHTML = '<button class="btn btn-primary" id="searchBtn" disabled style="cursor:default;"><span class="spinner-border spinner-border-sm mr-2 mb-1" role="status" aria-hidden="true"></span><div class="ml-1 d-inline-block">Searching</div></button>'
          SearchWord(word, document.querySelector('#searchBtn'))
        } else {
          alert('You must write a word!')
        }
      })
      AddWord(result)
    })
}

function AddWord (result) {
  console.log(result)

  // creates jumbotron element
  const jumboDiv = document.createElement('div')
  jumboDiv.className = 'jumbotron mt-4'

  // creates divisor
  const hr = document.createElement('hr')

  // displays word
  const jumboTitle = document.createElement('h1')
  jumboTitle.className = 'display-4 ml-4'
  jumboTitle.innerText = result.word

  // text container
  const textContainer = document.createElement('div')
  textContainer.className = 'textContainer'

  // defines meanings and display
  const leftContainer = document.createElement('div')
  leftContainer.className = 'left_content'

  console.log(Object.keys(result.meaning))
  console.log(result.meaning[Object.keys(result.meaning)[0]])

  Object.keys(result.meaning).forEach((meaning) => {
    const typeContainer = document.createElement('div')
    typeContainer.className = 'mb-2'
    const typeTitle = document.createElement('h3')
    typeTitle.innerText = 'As ' + meaning + ':'

    const typeList = document.createElement('ul')
    typeList.className = 'list-group list-group-flush'

    result.meaning[meaning].forEach((definition) => {
      const typeDefinition = document.createElement('li')
      typeDefinition.className = 'list-group-item'
      typeDefinition.innerText = definition
      typeList.append(typeDefinition)
    })

    // appends everything to main page
    typeContainer.append(typeTitle, hr, typeList)
    leftContainer.append(typeContainer)
  })

  // synonyms
  const rightContainer = document.createElement('div')
  rightContainer.className = 'right_content'

  const synonymsContainer = document.createElement('div')
  synonymsContainer.className = 'dropdown d-inline-block'

  const synonymsDropdown = document.createElement('button')
  synonymsDropdown.innerText = 'Synonyms'
  synonymsDropdown.className = 'btn btn-primary dropdown-toggle btn-lg mb-3 mr-3 mt-4'
  synonymsDropdown.dataset.toggle = 'dropdown'
  synonymsDropdown.id = `${result.word}` + 'synonymdropdown'

  const synonymsMenu = document.createElement('div')
  synonymsMenu.className = 'dropdown-menu'
  synonymsMenu.setAttribute('aria-labelledby', `${result.word}` + 'synonymdropdown')

  result.synonyms.slice(0, 11).forEach((word) => {
    const synonym = document.createElement('a')
    synonym.className = 'dropdown-item'
    synonym.innerText = word
    synonym.href = '#'
    synonymsMenu.append(synonym)
  })
  synonymsContainer.append(synonymsDropdown, synonymsMenu)
  rightContainer.append(synonymsContainer)

  // antonyms
  const antonymsContainer = document.createElement('div')
  antonymsContainer.className = 'dropdown d-inline-block'

  const antonymsDropdown = document.createElement('button')
  antonymsDropdown.innerText = 'Antonyms'
  antonymsDropdown.className = 'btn btn-primary dropdown-toggle btn-lg mb-3 mt-4'
  antonymsDropdown.dataset.toggle = 'dropdown'
  antonymsDropdown.id = `${result.word}` + 'antonymdropdown'

  const antonymsMenu = document.createElement('div')
  antonymsMenu.className = 'dropdown-menu'
  antonymsMenu.setAttribute('aria-labelledby', `${result.word}` + 'antonymdropdown')

  result.antonyms.slice(0, 11).forEach((word) => {
    const antonym = document.createElement('a')
    antonym.className = 'dropdown-item'
    antonym.innerText = word
    antonym.href = '#'
    antonymsMenu.append(antonym)
  })
  antonymsContainer.append(antonymsDropdown, antonymsMenu)
  rightContainer.append(antonymsContainer)

  // appends everything to main page
  textContainer.append(leftContainer, hr, rightContainer, hr)
  jumboDiv.append(jumboTitle, hr, textContainer)
  document.querySelector('.result_container').append(jumboDiv)
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
