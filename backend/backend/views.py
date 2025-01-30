from django.contrib.admin.views.autocomplete import AutocompleteJsonView
from django.http import JsonResponse
from django.apps import apps
from users.models import User

class CustomAutocompleteJsonView(AutocompleteJsonView):
    """
    Кастомный Autocomplete View, который фильтрует пользователей
    по роли преподавателя или администратора в поле "publisher".
    """

    def get(self, request, *args, **kwargs):
        """
        Обрабатывает GET-запрос для автозаполнения.
        """
        if not hasattr(self, "admin_site") or self.admin_site is None:
            return JsonResponse({"error": "Admin site is not set"}, status=400)

        app_label = request.GET.get("app_label")
        model_name = request.GET.get("model_name")
        field_name = request.GET.get("field_name")

        if not all([app_label, model_name, field_name]):
            return JsonResponse({"error": "Missing parameters"}, status=400)

        try:
            model = apps.get_model(app_label, model_name)
        except LookupError:
            return JsonResponse({"error": "Invalid model"}, status=400)

        if model not in self.admin_site._registry:
            return JsonResponse({"error": "Model not registered in admin"}, status=400)

        # Если поле - publisher, фильтруем только преподавателей и администраторов
        print(model)
        if field_name == "publisher":
            queryset = User.objects.filter(role__in=[User.Role.TEACHER, User.Role.ADMIN])
        else:
            # В остальных случаях вызываем стандартный механизм autocomplete
            return super().get(request, *args, **kwargs)

        return JsonResponse(
            {
                "results": [
                    {"id": obj.pk, "text": str(obj)}
                    for obj in queryset
                ]
            }
        )
