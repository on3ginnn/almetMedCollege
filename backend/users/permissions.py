import rest_framework.permissions


class IsAdminRole(rest_framework.permissions.IsAuthenticated):
    """
    Разрешает доступ только пользователям с ролью 'admin'.
    """
    def has_permission(self, request, view):
        return bool(super().has_permission(request, view) and request.user.role == 'admin')


class DjangoModelPermissionsWithGroups(rest_framework.permissions.DjangoModelPermissions):
    """Расширенный класс разрешений, проверяющий права из групп"""
    def __init__(self):
            super().__init__()
            self.perms_map['GET'] = ['%(app_label)s.view_%(model_name)s']

    def has_permission(self, request, view):
        """
        Проверяет, есть ли у пользователя необходимые права (как индивидуальные, так и унаследованные от групп).
        """
        user = request.user
        if not user.is_authenticated:
            return False

        # Получаем модель, с которой работает View
        queryset = self._queryset(view)
        model_cls = queryset.model

        # Базовый список прав, который использует DjangoModelPermissions
        perms = self.get_required_permissions(request.method, model_cls)

        # Получаем все права пользователя (его + группы)
        user_permissions = set(user.get_user_permissions()) | set(user.get_group_permissions())

        # Проверяем, есть ли у пользователя (или его групп) нужные права
        return any(perm in user_permissions for perm in perms)
