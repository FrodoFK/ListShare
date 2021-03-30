import json
import calendar
import datetime
from PyDictionary import PyDictionary
from django.shortcuts import render
from django.template import loader
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError

from .models import Task, List, CalendarDate, TaskToList, Grade, Subject, GradeToSubject

User = get_user_model()


# User Management

def login_user(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("home"))
        else:
            return render(request, "list/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "studylog/login.html")


def logout_user(request):

    logout(request)
    return HttpResponseRedirect(reverse("home"))


def register(request):
    if request.method == "POST":
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "studylog/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(
                username=username, email=email, password=password,
                first_name=first_name, last_name=last_name)
            user.save()
            print(user)
        except IntegrityError:
            return render(request, "studylog/register.html", {
                "message": "Username already taken."
            })
        login(request, user)

        # creates default lists
        daily = List(
            description="",
            title="DefaultDaily",
            creator=user,
            frecuency="daily")
        daily.save()

        weekly = List(
            description="",
            title="DefaultWeekly",
            creator=user,
            frecuency="weekly")
        weekly.save()

        monthly = List(
            description="",
            title="DefaultMonthly",
            creator=user,
            frecuency="monthly")
        monthly.save()

        yearly = List(
            description="",
            title="DefaultYearly",
            creator=user,
            frecuency="yearly")
        yearly.save()

        return HttpResponseRedirect(reverse("home"))
    else:
        return render(request, "studylog/register.html")


# Views

@login_required(login_url='login')
def home(request):

    # gets current user
    current_user = User.objects.get(username=request.user)

    # get default lists and tasks for current user
    daily_list = List.objects.get(
        creator=current_user, frecuency="daily",
        title="DefaultDaily")
    daily_tasks = TaskToList.objects.filter(List=daily_list)

    weekly_list = List.objects.get(
        creator=current_user, frecuency="weekly",
        title="DefaultWeekly")
    weekly_tasks = TaskToList.objects.filter(List=weekly_list)

    monthly_list = List.objects.get(
        creator=current_user, frecuency="monthly",
        title="DefaultMonthly")
    monthly_tasks = TaskToList.objects.filter(List=monthly_list)

    yearly_list = List.objects.get(
        creator=current_user, frecuency="yearly",
        title="DefaultYearly")
    yearly_tasks = TaskToList.objects.filter(List=yearly_list)

    today = datetime.date.today()

    calendar = CalendarDate.objects.filter(creator=current_user, date=today)

    return render(request, "studylog/home.html", {
        "daily_tasks": daily_tasks,
        "weekly_tasks": weekly_tasks,
        "monthly_tasks": monthly_tasks,
        "yearly_tasks": yearly_tasks,
        'calendar_tasks': calendar
    })


@login_required(login_url='login')
def calendar_tasks(request, current_year):

    # gets current user
    current_user = User.objects.get(username=request.user)

    new_cal = calendar.HTMLCalendar(firstweekday=0)
    year = current_year

    cal_tasks = CalendarDate.objects.filter(creator=current_user).select_related('task')

    cal_dates = []

    # formats date
    for task in cal_tasks:

        # formats date for better filtering
        date = task.date.ctime().split()
        month = date[1]
        date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[4]

        new_list = [task, date, month]
        cal_dates.append(new_list)

    return render(request, "studylog/calendar.html", {
        'calendar': new_cal.formatyear(year, width=2),
        'calendar_tasks': cal_dates
    })


@login_required(login_url='login')
def grades_view(request):

    if request.method != "GET":
        return JsonResponse({'error': 'invalid request method'}, status=400)

    # gets current user
    current_user = User.objects.get(username=request.user)

    # get current user's subjects
    user_subjects = Subject.objects.filter(creator=current_user)

    # dictionary to hold sorted information
    user_data = {}

    # get each subject's grades
    count = 0
    for subject in user_subjects:
        # get current user's gradestosubject assos
        grades = GradeToSubject.objects.filter(subject=subject)

        user_data[count] = {'subject': subject, 'grades': grades}

        count += 1

    return render(request, "studylog/gradesMenu.html", {
        'user_data': user_data,
    })


@login_required(login_url='login')
def dictionary(request):
    return render(request, 'studylog/dictionary.html')


# API'S
@login_required(login_url='login')
def new_task(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # gets current user
    current_user = User.objects.get(username=request.user)

    data = json.loads(request.body)

    if data.get('frecuency') == "daily":
        # gets list for posted task
        frecuency_list = List.objects.get(
            creator=current_user, frecuency=data.get('frecuency'),
            title="DefaultDaily")

    if data.get('frecuency') == "weekly":
        # gets list for posted task
        frecuency_list = List.objects.get(
            creator=current_user, frecuency=data.get('frecuency'),
            title="DefaultWeekly")

    if data.get('frecuency') == "monthly":
        # gets list for posted task
        frecuency_list = List.objects.get(
            creator=current_user, frecuency=data.get('frecuency'),
            title="DefaultMonthly")

    if data.get('frecuency') == "yearly":
        # gets list for posted task
        frecuency_list = List.objects.get(
            creator=current_user, frecuency=data.get('frecuency'),
            title="DefaultYearly")

    # creates task in database
    new_task = Task(
        content=data.get("task_content"),
        comment=data.get("task_comment"))
    new_task.save()

    # creates association between list and task
    association = TaskToList(task=new_task, List=frecuency_list)
    association.save()

    return JsonResponse(
        {"success": "Task added successfully", "key": new_task.pk}, status=200)


@login_required(login_url='login')
def delete_task(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)

    # gets task to delete
    task_to_delete = Task.objects.get(pk=data.get("pk"))
    task_to_delete.delete()

    return JsonResponse({"success": "Task deleted successfully."}, status=200)


@login_required(login_url='login')
def create_subject(request):

    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=401)

    # gets current user
    current_user = User.objects.get(username=request.user)

    # get request's data
    data = json.loads(request.body)

    # get subject's title
    subject_title = data.get('title')

    # creates Subject in database
    new_subject = Subject(title=subject_title, creator=current_user)
    new_subject.save()

    # get a list of each grade in this subject
    grade_list = data.get('gradeList')

    # iterates over the grades list
    for grade in grade_list:

        # creates grade in database
        new_grade = Grade(creator=current_user, test_type=grade['grade_type'],
                          obtained=grade['grade_obtained'], 
                          date=grade['grade_date'],
                          total=grade['grade_total'])
        new_grade.save()

        # creates assos in database
        new_assos = GradeToSubject(subject=new_subject, grade=new_grade,
                                   creator=current_user)
        new_assos.save()

    return JsonResponse({'success': 'subject created successfully'}, status=200)


@login_required(login_url='login')
def delete_subject(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=401)

    # gets current user
    current_user = User.objects.get(username=request.user)

    # get request's data
    data = json.loads(request.body)

    # gets subject to delete
    try:
        subject_to_del = Subject.objects.get(creator=current_user, pk=data.get('pk'))
        subject_to_del.delete()
    except Exception as e:
        return JsonResponse({'error': 'Subject does not exist or user is not authorized'}, status=401)

    return JsonResponse({'success': 'subject deleted successfully'}, status=200)


@login_required(login_url='login')
def change_grade_status(request):

    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    # gets current user
    current_user = User.objects.get(username=request.user)

    # get request's data
    data = json.loads(request.body)

    # gets current grade to change
    current_grade = Grade.objects.get(pk=int(data.get('pk')), creator=current_user)

    new_status = data.get('new_status')

    # changes status according to request's data
    if new_status.lower() == "pending":
        current_grade.status = "done"

    elif new_status.lower() == "done":
        current_grade.status = "pending"

    else:
        return JsonResponse({'error': 'Invalis status, please choose "done" or "pending"'},status=401)

    new_status = current_grade.status
    current_grade.save()

    return JsonResponse({'success': 'Status edited successfully', 
                        'new_status': new_status}, status=200)


@login_required(login_url='login')
def delete_grade(request):

    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=401)

    # gets current_user
    current_user = User.objects.get(username=request.user)

    # data
    data = json.loads(request.body)

    # get grade's pk
    try:
        grade_to_delete = Grade.objects.get(pk=data.get('pk'), creator=current_user)
        grade_to_delete.delete()
    except Exception as e:
        return JsonResponse({'error': 'grade does not exist or user not authorized'}, status=401)

    

    return JsonResponse({'success': 'grade deleted successfully'}, status=200)


@login_required(login_url='login')
def create_grade(request):

    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=401)

    # gets current_user
    current_user = User.objects.get(username=request.user)

    # data
    data = json.loads(request.body)

    try:
        belong_subject = Subject.objects.get(pk=data.get('subjectPk'),
                                             creator=current_user)
    except Exception as e:
        return JsonResponse({"error": "POST request required."}, status=400)

    # creates new grade
    new_grade = Grade(creator=current_user, test_type=data.get('tt'),
                      obtained=data.get('so'), total=data.get('ts'),
                      date=data.get('date'))
    new_grade.save()

    # creates new assos
    new_assos = GradeToSubject(subject=belong_subject, grade=new_grade,
                               creator=current_user)
    new_assos.save()

    return JsonResponse({'success': 'grade created successfully'})


@login_required(login_url='login')
def edit_grade(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=401)

    # gets current_user
    current_user = User.objects.get(username=request.user)

    # data
    data = json.loads(request.body)

    print(data.get('newPk'))

    # get grade's pk
    if data.get('pk'):
        try:
            grade_to_edit = Grade.objects.get(pk=data.get('pk'), creator=current_user)
        except Exception as e:
            return JsonResponse({'error': 'grade does not exist or user not authorized'}, status=401)

        if data.get('testype'):
            grade_to_edit.test_type = data.get('testype')

        elif data.get('gradeobtained') and data.get('gradetotal'):
            grade_to_edit.obtained = data.get('gradeobtained')
            grade_to_edit.total = data.get('gradetotal')

        elif data.get('date'):
            grade_to_edit.date = data.get('date')

        grade_to_edit.save()

        return JsonResponse({'success': 'grade edited successfully'}, status=200)

    elif data.get('newPk'):
        print('estoy aca')
        try:
            subject_to_edit = Subject.objects.get(pk=data.get('newPk'),
                                                  creator=current_user)
        except Exception as e:
            return JsonResponse({'error': 'subject does not exist or user not authorized'}, status=401)            
        subject_to_edit.title = data.get('title')
        subject_to_edit.save()

        return JsonResponse({'success': 'subject title edited successfully'}, status=200)


@login_required(login_url='login')
def new_calendar_task(request):

    if request.method != 'POST':
        return JsonResponse({'error': 'invalid request method'}, status=400)

    # gets current user
    current_user = User.objects.get(username=request.user)

    # gets request data
    data = json.loads(request.body)

    # first gets the string and separates it
    date_parts = data.get('date').split('-')

    # gets year, month & day

    year = int(date_parts[0])
    month = int(date_parts[1])
    day = int(date_parts[2])

    # creates datetime object
    selected_date = datetime.datetime(year=year, month=month, day=day)

    # creates new task
    new_cal_task = Task(content=data.get('content'),
                        comment=data.get('comment'))
    new_cal_task.save()

    # creates calendar assos
    new_cal_assos = CalendarDate(date=selected_date,
                                 creator=current_user,
                                 task=new_cal_task)
    new_cal_assos.save()

    return JsonResponse({'success': 'calendar task added successfully'})


@login_required(login_url='login')
def delete_calendar_task(request):

    if request.method != 'POST':
        return JsonResponse({'error': 'invalid request method'}, status=400)

    # gets current user
    current_user = User.objects.get(username=request.user)

    # gets data
    data = json.loads(request.body)

    calendar_to_delete = CalendarDate.objects.get(pk=data.get('pk'),
                                                  creator=current_user)

    task_to_delete = Task(pk=calendar_to_delete.task.pk)

    task_to_delete.delete()
    calendar_to_delete.delete()

    return JsonResponse({'success': 'calendar task deleted successfully'},
                        status=200)


@login_required(login_url='login')
def get_dictionary_word(request):

    # initialize response's dict
    response_dict = {}

    # get request's data
    data = json.loads(request.body)

    # get requested word
    word = data.get('word')

    dictionary = PyDictionary()

    # retrieves information about the word
    response_dict['meaning'] = dictionary.meaning(word)
    response_dict['synonyms'] = dictionary.synonym(word)
    response_dict['antonyms'] = dictionary.antonym(word)
    response_dict['word'] = word.capitalize()

    return JsonResponse(response_dict)