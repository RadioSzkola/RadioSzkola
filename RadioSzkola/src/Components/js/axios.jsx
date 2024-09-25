import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_HOST, 
    headers: {
        'Content-Type': 'application/json',
        'cache-control': 'no-store'
    }
});

export const getElements = async () => {
    try {
        const response = await api.get('/tracks/fetchnupload');
        return response.data;
    } catch (error) {
        console.error(error);
        let list = [];
        return list;
    }
};

export const addUser = async (data) => {
    try {
        const response = await api.post('/users/addUser', data);
        return { message: 'Zalogowano pomyślnie.', status: response.status };;
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 409) {
            return { message: 'Użytkownik już istnieje.', status: error.response.status };
        } else if (error.response && error.response.status === 404){
            return { message: 'Błędny identyfikator.', status: error.response.status };
        } else if (error.response && error.response.status === 422) {
            return { message: 'Identyfikator jest już w użyciu.', status: error.response.status };
        }
        return { message: 'Wystąpił błąd podczas przesyłania danych.', status: error.response.status};
    }
}

export const logUser = async (data) => {
    try {
        const response = await api.post('/users/logUser', data);
        return { message: 'Zalogowano pomyślnie.', status: response.status, userId: response.data.userId };
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 404) {
            return { message: 'Użytkownik nie istnieje.', status: error.response.status };
        }
        return { message: 'Wystąpił błąd podczas przesyłania danych.', status: error.response.status };
    }
}