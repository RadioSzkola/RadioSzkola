import axios from 'axios';

export const checkIDValidity = async (userID) => {
    try {
        await axios.post(`${import.meta.env.REACT_APP_HOST}users/IDChecker`, { id: userID });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
