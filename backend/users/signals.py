from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import django.contrib.auth.models
from .models import User


@receiver(post_save, sender=User)
def set_user_group_based_on_role(sender, instance, **kwargs):
    """
    Синхронизирует группу пользователя на основании его роли после сохранения.
    """
    
    try:
        # Получаем группу, соответствующую роли пользователя
        target_group, created = django.contrib.auth.models.Group.objects.get_or_create(name=instance.role)
        print(target_group)
    except django.contrib.auth.models.Group.DoesNotExist:
        raise ValueError(f"Группа с именем '{instance.role}' не существует")

    print([i.name for i in instance.groups.all()])
    # Очищаем текущие группы пользователя
    instance.groups.clear()
    print([i.name for i in instance.groups.all()])

    # Добавляем пользователя в новую группу
    instance.groups.add(target_group)
    print([i.name for i in instance.groups.all()])

