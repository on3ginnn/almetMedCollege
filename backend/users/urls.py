from django.urls import path
import users.views


app_name = "users"

urlpatterns = [
    path('create/', users.views.UserCreateAPIView.as_view(), name='create'),
    path('login/', users.views.UserLoginAPIView.as_view(), name='login'),
    path('list/', users.views.UserListAPIView.as_view(), name='list'),
    path('profile/', users.views.UserProfileAPIView.as_view(), name='profile'),
    path('<int:pk>/', users.views.UserDetailUpdateDeleteAPIView.as_view(), name='concrete'),
    path('search/', users.views.UserSearchAPIView.as_view(), name='search'),
]
