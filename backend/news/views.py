import rest_framework.generics
import rest_framework.permissions
import rest_framework.response

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


class SearchNewsAPIView(rest_framework.views.APIView):
    def get(self, request):
        search_query = request.GET.get('search')
        # TODO: поиск должен быть не чувствительным к регистру
        if search_query:
            news_list = news.models.News.objects.filter(title__icontains=search_query)
            serializer = news.serializer.NewsSerializer(news_list, many=True)
            
            return rest_framework.response.Response(serializer.data)
        
        return rest_framework.response.Response([])