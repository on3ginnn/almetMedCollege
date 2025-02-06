import rest_framework.generics
import rest_framework.permissions

import news.serializer
import users.permissions
import news.models


class NewsCreateAPIView(rest_framework.generics.CreateAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    serializer_class = news.serializer.NewsCreateUpdateSerializer
    queryset = news.models.News.objects.all()


class NewsListAPIView(rest_framework.generics.ListAPIView):
    queryset = news.models.News.objects.all()
    serializer_class = news.serializer.NewsSerializer
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]


class NewsDetailUpdateDeleteAPIView(rest_framework.generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [users.permissions.DjangoModelPermissionsWithGroups]
    queryset = news.models.News.objects.all()
    serializer_class = news.serializer.NewsCreateUpdateSerializer
