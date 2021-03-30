from django.urls import path, include, re_path

from .views import (
        SignupView,
        GetCSRFToken,
        LoginView,
        LogoutView,
        CheckAuthenticatedView,
        DeleteUserView,
        GetUserView,
        GetUserProfileView,
        UpdateUserProfileView,
        )

urlpatterns = [
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('register', SignupView.as_view()),
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('authenticated', CheckAuthenticatedView.as_view()),
    path('delete', DeleteUserView.as_view()),
    path('user', GetUserView.as_view()),
    path('profile', GetUserProfileView.as_view()),
    path('update-profile', UpdateUserProfileView.as_view()),
]
