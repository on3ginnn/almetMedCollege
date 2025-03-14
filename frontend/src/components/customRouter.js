import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';


export const customRouter = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return React.useMemo(
    () => ({
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        navigate: (path) => {
        navigate(path);
        },
    }),
    [location, navigate],
    );
}

