from django.urls import path
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView
from . import views

urlpatterns = [
    #User management
    path("login", views.login_user, name="login"),
    path("logout", views.logout_user, name="logout"),
    path("register", views.register, name="register"),
    #Views
    path("", views.home, name="home"),
    path("calendar/<int:current_year>", views.calendar_tasks, name='calendar'),
    path('grades', views.grades_view, name="grades"),
    path('dictionary', views.dictionary, name="dictionary"),
    #API'S
    path("new_task", views.new_task, name="new task"),
    path("delete_task", views.delete_task, name="delete task"),
    path("create_subject", views.create_subject, name="create subject"),
    path("delete_subject", views.delete_subject, name="delete subject"),
    path("change_grade_status", views.change_grade_status, name="change status"),
    path("delete_grade", views.delete_grade, name="delete grade"),
    path("create_grade", views.create_grade, name="create grade"),
    path("edit_grade", views.edit_grade, name="edit grade"),
    path("get_word", views.get_dictionary_word, name="get word"),
    path('create_calendar_task', views.new_calendar_task, name="create calendar task"),
    path('delete_calendar_task', views.delete_calendar_task, name="delete calendar task"),
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url("favicon.ico")))
]