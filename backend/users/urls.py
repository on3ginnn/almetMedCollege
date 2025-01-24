from django.urls import path
import users.views


urlpatterns = [
    path('register/', users.views.UserRegisterAPIView.as_view(), name='register'),
    path('login/', users.views.UserLoginAPIView.as_view(), name='login'),
    path('users/', users.views.UserListAPIView.as_view(), name='list'),
    path('profile/', users.views.UserProfileAPIView.as_view(), name='profile'),
    path('user/<int:pk>/', users.views.UserDetailUpdateDeleteAPIView.as_view(), name='concrete'),
    path('search/', users.views.UserSearchAPIView.as_view(), name='search'),
]
