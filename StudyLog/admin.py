from django.contrib import admin
from .models import User, Task, List, CalendarDate, TaskToList, Grade, Subject, GradeToSubject

# Register your models here.
admin.site.register(User)
admin.site.register(Task)
admin.site.register(TaskToList)
admin.site.register(List)
admin.site.register(CalendarDate)
admin.site.register(Grade)
admin.site.register(Subject)
admin.site.register(GradeToSubject)
