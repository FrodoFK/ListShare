from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User (AbstractUser):
    description = models.TextField(default="")


class Task (models.Model):
    content = models.TextField()
    comment = models.TextField(default="")


class List (models.Model):
    description = models.TextField()
    title = models.CharField(max_length=50)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_posts')
    frecuency = models.TextField()


class TaskToList (models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='belong_list')
    List = models.ForeignKey(
        List, on_delete=models.CASCADE, related_name='belong_tasks')


class CalendarDate (models.Model):
    date = models.DateField()
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_calendar_dates')
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='date_to_task',
        default=None)


class Subject (models.Model):
    title = models.CharField(max_length=120)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_subjects')


class Grade (models.Model):
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_grades')
    test_type = models.CharField(max_length=300, default='')
    obtained = models.FloatField()
    total = models.FloatField()
    date = models.DateField()
    status = models.CharField(max_length=20, default='pending')


class GradeToSubject (models.Model):
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name='related_grades')
    grade = models.ForeignKey(
        Grade, on_delete=models.CASCADE, related_name='belonging_subject')
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_assos')
