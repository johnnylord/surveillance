from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth.models import User
import django.contrib.auth as auth
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer


@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']
        re_password = data['re_password']
        if password == re_password:
            try:
                if User.objects.filter(username=username).exists():
                    return Response({ 'error': 'Username already exists' })
                elif len(password) < 6:
                    return Response({ 'error': 'Password must be at least 6 characters'})
                else:
                    user = User.objects.create_user(username=username,
                                                    password=password)
                    profile = UserProfile(user=user,
                                        first_name='',
                                        last_name='',
                                        phone='',
                                        city='')
                    profile.save()
                    return Response({ 'success': 'User created successfully' })
            except Exception:
                return Response({ 'error': 'Something went wrong went regsiter user' })
        else:
            return Response({ 'error': 'Passwords do not match' })

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']
        try:
            user = auth.authenticate(username=username,
                                    password=password)
            if user is not None:
                auth.login(request, user)
                return Response({ 'username': username, 'success': 'User authenticated' })
            else:
                return Response({ 'error': 'Fail to authenticate' })
        except Exception:
            return Response({ 'error': 'Something went wrong when loging into system' })

class LogoutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Logout' })
        except Exception:
            return Response({ 'error': 'Something went wroung when log out' })

class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        try:
            is_authed = User.is_authenticated

            if is_authed:
                return Response({ 'is_authed': 'success' })
            else:
                return Response({ 'is_authed': 'error' })
        except Exception:
            return Response({ 'error': 'Something went wrong when checkint authenticated status' })


class DeleteUserView(APIView):
    def delete(self, request, format=None):
        try:
            user = self.request.user
            user = User.objects.filter(id=user.id).delete()
            return Response({ 'success': 'User deleted successfully' })
        except Exception:
            return Response({ 'error': 'Something went wrong when trying to delete user' })


class GetUserView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer = UserSerializer

    def get(self, request, format=None):
        try:
            user_id = self.request.query_params.get('user_id')
            user = User.objects.get(id=user_id)
            user = self.serializer(user)
            return Response(user.data)
        except Exception as e:
            return Response({ 'error': 'Something went wrong when trying to access user' })


class GetUserProfileView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer = UserProfileSerializer

    def get(self, request, format=None):
        try:
            user_id = self.request.query_params.get('user_id')
            user = User.objects.get(id=user_id)
            profile = UserProfile.objects.get(user=user)
            profile = self.serializer(profile)
            return Response(profile.data)
        except Exception:
            return Response({ 'error': 'Something went wrong when trying to access user profile' })


@method_decorator(csrf_protect, name='dispatch')
class UpdateUserProfileView(APIView):
    serializer = UserProfileSerializer

    def post(self, request, format=None):
        try:
            user = self.request.user

            data = self.request.data
            first_name = data['first_name']
            last_name = data['last_name']
            phone = data['phone']
            city = data['city']

            UserProfile.objects.filter(user=user).update(first_name=first_name,
                                                        last_name=last_name,
                                                        phone=phone,
                                                        city=city)
            profile = UserProfile.objects.get(user=user)
            profile = self.serializer(profile)
            return Response({ 'profile': profile.data, 'user': user.id })

        except Exception as e:
            return Response({ 'error': 'Something went wrong when trying to update user profile' })
