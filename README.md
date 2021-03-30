# StudyLog

StudyLog is a student-focused, mobile responsive, web app, based on the Django Backend and Javascript, CSS & HTML on the frontend, that allows you to keep track of your grades, 
daily tasks, and more!


It has four sections:
  - [**Home page**](https://github.com/me50/FrodoFK/new/web50/projects/2020/x/capstone?readme=1#home-page)
  - [**Calendar**](https://github.com/me50/FrodoFK/new/web50/projects/2020/x/capstone?readme=1#calendar)
  - [**Grades**](https://github.com/me50/FrodoFK/new/web50/projects/2020/x/capstone?readme=1#grades)
  - [**Dictionary**](https://github.com/me50/FrodoFK/new/web50/projects/2020/x/capstone?readme=1#dictionary)
  
And each one has its own functionality but at the same time (almost all of them) relate to each other, giving a "whole project" experience.

## About StudyLog
You can think of StudyLog as a kind of "helper" in your student-day-to-day life management! It's pure goal is to augment your productivity keeping a fine, stable and segmented
record of your daily tasks; also giving you a deep, concise and fast access to your grades/scores in each Subject that you decide to put on the "Grades" section! A calendar that is
in sync with the current year and that will help you with those important dates in your way! StudyLog even has a dictionary to help you search for precise and complete information
about that word you can't understand in the subject's book or some part of a fancy phrase you heard in the subway! 

## Registration and Login System

To use StudyLog you must register in the app. Then, you can just log in or out at your please. This way you can access your data through different devices without losing any type of information and, as it is a responsive app, still have a nice and comfortable display.

## Overview

### Tasks
The Home and Calendar sections have a common "type" of data: Tasks. Lets define it as a kind of "annotation" that has two parts:
  - The main body
  - An optional comment about the main body.
  
The goal here is to be able to avoid disruption about the main focus, the task, but to be able to add extra information (optional, of course) that allows to put some context to the task or even extra details that might be related to it. So every time you're about to create a task you are going to be able to add a comment to it that will be displayed next to it, slightly smaller, if you desire. 

Of course, the task's body is a required field.


### Home Page
At first, the homepage consists in a table with 4 tabs: Daily, Weekly, Monthly and Yearly and each one of them, as they're empty in the user's first login, will display "No tasks added yet!" in each tab. The main idea of this table is to hold on those tasks that may be repetitive and tedious
to type down each time, each day. At the table's right side we can se two more "sections" (almost like a sidebar):
  - **"Add a new task"**: This section allows you to create a new Task, with the desired frecuency (f.e. Daily) and an optional comment about the task.
  - **"Calendar Tasks for today"**: This section just displays the Calendar Tasks that have the current day's date. Meaning that every Calendar task will be displayed at the Home page in its corresponding date.
  
The Home page's functionality yet simple, allows you to keep track of important tasks that may be recurrent and you can mark them as "completed" maybe for the day, the week and
so on; you can also delete the tasks, of course. Even though it's "meant" for recursive tasks, you can just use it for any type of tasks, or even notes! It's al up to the user's needs out of the app's "nomenclature". You can add as many tasks as you want without having to worry about the page growing long as it has a fixed height so if it overflows you would scroll _inside_ the table's tab, not the page itself. It's worth mentioning that the table's tabs are independent from each other, this meaning, if you have a lot of daily tasks and just a few monthly tasks it will adapt to the number of tasks displayed.


### Calendar
The calendar will display a pair-configuration (individual in small screens) of the year's months, with a light design, to show you every task that you have asigned to an specific day. At the top-right part of the page there's a fixed button ("Create Calendar Task") that will display a modal section for you to create a new **calendar task**. You just have to fill up the modal's fields and hit the "Create Task" button, and remember that all the fields are required, except for the task's comment.
The difference between this and a regular task is that calendar tasks have dates associated to them, and that they will display at the home page in their respective dates.

At the moment of creation the page will just reload, fetching the new provided info from the server and updating the page visually to display the new task that you added in the calendar, this being that the date's box in the calendar now will apear with a dark blue instead of white, giving it contrast to stand out among the other date cells.

### Grades

This StudyLog section is another "core" functionality as it allows the user to track the academic status of each "Subject". In general, it displays all of the subjects entered to the section by the user as tables, where each row represents an individual grade. Each subject's table consists in 4 columns or fields:
  - **Test Type**: This field is to represent the way that the current grade was evaluated, for example an Essay can be a type. As the types can vary from institution to institution or even from countrie to countrie, this is an input field so the User can enter the most appropiate word to describe it.
  
  - **Score**: It represents, lets say, two fields in one. User's Score in the left side of the "/" symbol and Grades Total Score on the right side. Every score can be an integer or a floating point number with just one decimal point  (for example "20.1").
  
  - **Date**: This can be an assignment's due date or a public presentation day of exhibition, it **must** have the YYYY-MM-dd format (for example, 2021-03-22)
  
  - **Status**: This field has only two status: _"PENDING"_ status and _"DONE"_ status. As the name can spoiler, this isa way to see if the current grade has already been completed or not. 
  
At the most-right end of each grade there's a _"Mark as Done"/"Unmark as Done"_ button that allows you to change that status quickly (almost like a sort of cheklist).


Then, at the last row of the table is the total User's score displayed in points and in percentage, this way the user can see how much progress has been made in the subject and how many points are already evaluated. This can also work to make a "simulation" by, lets say, adding a pending grade and entering an approximate score of how many points do they think they will get in the assignment and see if its enough to pass the subject. This score is calculated by a JavaScript function in the frontend that grabs the User's score and Grade's total score and displays the percentage/points acquired in relation to the number of grades and the subject's total.

At the top-right corner of the table we can find a button _("Edit this Subject")_ that allows the user to edit the subject and edit every field of the table except the status button, as this can be done outside this "edit" mode. We can select any field just by clicking on the table's cell we want to edit and then, through an input field, we enter the new piece of information we want. The Score field **MUST** be in the format _number/number_ (for example, 22/30) as typing another number wont edit the data in the server side. Same goes for the Date field, it **MUST** be in the YYYY-MM-dd format as mentioned before (for example, 2021-03-21) as typing another format wont be accepted by the input field's code. In the table's header cells, at the right-most part, will appear a _"Create New Grade"_ button that will "append" a new grade to the current subject that is being edited by the user. On click it will display a new modal where the user will have to enter the Grades data, this being as commented before:
  - Test Type
  - Score Obtained
  - Total's Grade Score
  - Date
  
Then, after clicking the _"Create Grade"_ button at the modal's bottom, the page will refresh and the edited subject will now display the new grade.
  
Also, in this edit mode, the _"Mark as Done"_ buttons of each grade turn into "Delete this Grade" buttons that, on click, will remove that row's grade from the current subject.

Next, in the table's left-bottom corner, there is a delete button that allows you to remove the subject completely from the page and, of course, from the database.

Finally, to exit the "Edit Mode", that same button will turn into a _"Finish"_ button that the user can click to turn the table back to it's normal state.


### Dictionary
This is the final section of the app and, as the name spoils, this is just a "pocket" dictionary to search for any word in english!
Entering the page there's just a search bar at the top that will connect with the database and search, with the help of the PyDictionary module, the word that's being requested. Then, a new block will appear in the page displaying:
- At the top: The word that was searched.
- In the left side:
  - All the definitions of the word. These can be its definitions as a noun, as a verb, and so on.
- In the right side:
  - A list of synonyms, with a maximum of 10 entries.
  - A list of antonyms, with a maximum of 10 entries.
  
This part is just thought as a "quick" use section where the user can retrieve complete yet short amounts of information to use in their day-to-day. The searchs will be stacked one below the other but on refresh the page will be emptied.
  

### Why I believe this project is complex and distinct enough to be approved

My main goal was to build something different from every other app in the course but also applying the concepts that i learned (and to that, add another concepts that i learned by myself). I think all the interactivity from the user's perspective gives the project it's core "feeling" of being able to modify every piece of entered information (I can relate this type of implementation alongside with the CRUD definition I learned and expanded by myself through the course's duration) is a powerful key in making a really usefull app; something dynamic that it's not just "fixed" and that can adapt to the user's need. As I said above: Many parts are _"meant"_ to be used in some kind of way but the code's development and structure is oriented to what the user's needs the most, even out of the "definitions" provided by this document and, for me, that's just the best way to think about an application of this "type".

It also gives different types of functionalities (some related to each other) that make it versatile even out of the app's main usage (like being able to have a calendar at hand, or just type for a word and have a lot of information in just a click/touch). Next, it's designed in a "lite" way, so that reload times are fast, and the interface remains as distract-free as possible.


### Files inside StudyLog

Inside the app's folder we have:
- static (folder)
  - studylog (folder)
    - css (folder): Here there are every css files used to style the HTML templates, the names remain the same as the templates so it's easier to "relate" them
    - icons (folder): There's only one file here: The search icon used in the search bar of the *Dictionary* section
    - js (folder): In this folder are contained all JavaScript files that give interactivity to the different HTML templates of the project. As with the css files, the JavaScript files are named the same to give a better "visual" relation between files.
    - favicon.ico : A custom favicon I made for the page!
- templates (folder) : 
    - studylog (folder) : This folder holds every HTML page (template) of every user-oriented-view.
- admin.py : This file registers every model in the django-admin.
- apps.py : Remains as default w/o modifications
- models.py: Every model created is stored in this file.
- tests.py: Remains as default w/o modifications
- urls.py: It cointains every url created to be used by the app's views, APIs and "normal" views.
- views.py: This file has all the django views and APIs used by the app to display/send information to the client.
  
  
### How to run the project
Simply open up the command line, install all the packages in the requirements.txt file with the command _pip install -r requirements.txt_, then, go to the project's path (where the manage.py file's stored) and just type _python mnage.py migrate_ to apply migrations to your database, then just run the server with the _python manage.py runserver_ and it's ready to use! Simply open up the url in your browser, register and start using StudyLog!
