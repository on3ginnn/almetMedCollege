import { Box, Typography, Stack, Card, CardContent, Button } from "@mui/material";
import { useEffect, useState } from "react";
import {  useNewsStore } from '../../stores/newsStore';
import { useNavigate } from "react-router-dom";

export const NewsList = () => {
    const { newsList, getNewsList, deleteNews } = useNewsStore();
    const navigate = new useNavigate();

    // console.log(newsList);
    useEffect(() => {
        async function fetchNews(){
            await getNewsList();
        }
        fetchNews();
    }, []);

    const handleNewsDelete = (pk) => {
        deleteNews(pk);
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Новости
            </Typography>
            <Stack container spacing={2} sx={{ padding: 2 }}>
            {newsList.map((news, index) => (
                <Stack item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderColor: "primary.main", borderWidth: "5px", borderStyle: 'solid', }}>
                    <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h5" component="h2">
                        {news.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {news.body}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Издатель: {news.publisher}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Опубликовано: {news.created_on}
                    </Typography>
                    <Stack spacing={1} direction='row'>
                        <Button variant="contained" color="warning" onClick={() => navigate(`/news/edit/${news.id}`)}>Редактировать</Button>
                        <Button variant="contained" color="error" onClick={() => handleNewsDelete(news.id)}>Удалить</Button>
                    </Stack>
                    </CardContent>
                </Card>
                </Stack>
            ))}
            </Stack>
        </Box>

    );
};