import { useState, useRef } from 'react';
import { addUser, logUser } from './axios.jsx';
import Notification from './notification.jsx';
import '/src/Components/css/login.css';


const AuthForm = () => {
    const initialState = { login: '', password: '', confirmPassword: '', id: '' };
    const [formValue, setFormValue] = useState(initialState);
    const [isLogin, setIsLogin] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const login = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const smallsLogin = useRef(null);
    const smallsPass = useRef(null);
    const smallsConfirmPass = useRef(null);
    const smallsId = useRef(null);
    const button = useRef(null);
    const userId = useRef(null);

    const handleLoginClose = () => {
        document.querySelector(".LoginCentralizingContainer").classList.add("LoginHidden");
        const successElements = document.querySelectorAll('.LoginFormSuccess');
        const errorElements = document.querySelectorAll('.LoginFormError');
        if (successElements) {
            successElements.forEach(element => {
                element.classList.remove('LoginFormSuccess');
            });
        }
        if (errorElements) {
            errorElements.forEach(element => {
                element.classList.remove('LoginFormError');
            });
        }

        setFormValue(initialState);
        resetForm();
        smallsLogin.current.innerHTML = '';
        smallsPass.current.innerHTML = '';
        if(!isLogin) smallsConfirmPass.current.innerHTML = '';
        if(!isLogin) smallsId.current.innerHTML = '';
        setIsLogin(true);
    }

    const handleChange = ({ target: { name, value } }) => {
        setFormValue({ ...formValue, [name]: value });
    }

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setFormValue(initialState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        checkInputs();

        const passwordCheck = password.current.value.trim();
        const loginCheck = login.current.value.trim();
        if (isLogin && passwordCheck !== '' && loginCheck !== '') {
            const response = await logUser({ login: login.current.value, password: password.current.value });
            if (response.status !== 200) {
                setNotifications((prev) => [...prev, { message: response.message, type: 'error' }]);
                removeSuccessClasses();
            } else {
                localStorage.setItem('ID', response.userId);
                setSuccessFor(login);
                setSuccessFor(password);
                setNotifications((prev) => [...prev, { message: response.message, type: 'success' }]);
                resetForm();
                handleLoginClose();
            }
        } else {
            if (isPass(password) && password.current.value === confirmPassword.current.value) {
                const response = await addUser({ login: login.current.value, password: password.current.value, id: userId.current.value });
                if (response.status !== 201) {
                    setNotifications((prev) => [...prev, { message: response.message, type: 'error' }]);
                    removeSuccessClasses();
                } else {
                    localStorage.setItem('ID', userId.current.value);
                    setSuccessFor(login);
                    setSuccessFor(userId);
                    setSuccessFor(password);
                    setSuccessFor(confirmPassword);
                    setNotifications((prev) => [...prev, { message: response.message, type: 'success' }]);
                    resetForm();
                    handleLoginClose();
                }
            }
        }
    };

    const handleCloseNotification = (index) => {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    const removeSuccessClasses = () => {
        const successElements = document.querySelectorAll('.LoginFormSuccess');
        successElements.forEach(element => {
            element.classList.add('LoginFormError');
            element.classList.remove('LoginFormSuccess');
            const smalls = document.querySelectorAll('.LoginFormMessage');
            smalls.forEach(small => {
                small.innerHTML = '';
            })
        });
    }

    const resetForm = () => {
        setFormValue(initialState);
        login.current.value = '';
        password.current.value = '';
        if(!isLogin) confirmPassword.current.value = '';
        if(!isLogin) userId.current.value = '';
    }

    const checkInputs = () => {
        const loginValue = login.current.value.trim();
        const passwordValue = password.current.value.trim();

        if (loginValue === '') {
            setErrorFor(login, 'Proszę wprowadzić adres login. Pole nie może być puste.', smallsLogin.current);
        }

        if (passwordValue === '') {
            setErrorFor(password, 'Proszę wprowadzić hasło. Pole nie może być puste.', smallsPass.current);
        }
        if (!isLogin) {
            const confirmPasswordValue = confirmPassword.current.value.trim();
            const idValue = userId.current.value.trim();
            if (confirmPasswordValue === '') {
                setErrorFor(confirmPassword, 'Proszę powtórzyć hasło. Pole nie może być puste.', smallsConfirmPass.current);
            } else if (confirmPasswordValue !== passwordValue) {
                setErrorFor(confirmPassword, 'Hasła nie pasują do siebie.', smallsConfirmPass.current);
            }

            if (idValue === '') {
                setErrorFor(userId, 'Proszę wprowadzić identyfikator. Pole nie może być puste.', smallsId.current);
            }
            
        }
    }

    const setErrorFor = (input, message, small) => {
        const formControl = input.current.parentElement;
        formControl.classList.remove("LoginFormSuccess");
        formControl.classList.add("LoginFormError");
        small.innerHTML = message;
    }

    const setSuccessFor = (input) => {
        const formControl = input.current.parentElement;
        formControl.classList.remove("LoginFormError");
        formControl.classList.add("LoginFormSuccess");
    }

    const isPass = (password) => {
        const value = password.current.value;
        const isLongEnough = /.{8,}/.test(value);
        const isLowerCase = /(?=[a-z])/.test(value);
        const isUpperCase = /(?=[A-Z])/.test(value);
        const isNumber = /(?=\d)/.test(value);
        const isSpecialChar = /(?=\W)/.test(value);

        if (!isLongEnough) {
            setErrorFor(password, 'Hasło musi mieć co najmniej 8 znaków.', smallsPass.current);
            return false;
        }
        if (!isLowerCase || !isUpperCase || !isNumber || !isSpecialChar) {
            setErrorFor(password, 'Hasło musi zawierać małe, duże litery, cyfrę i znak specjalny.', smallsPass.current);
            return false;
        }
        setSuccessFor(password);
        return true;
    }

    return (
        <div className="LoginCentralizingContainer LoginHidden">
            <div className="LoginContainer">
                <h2 className="LoginContainerHeader">{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>
                <button className="LoginCloseButton" id="close__login__btn" onClick={handleLoginClose}>
                    <i className="ri-close-fill"></i>
                </button>
                <form className="LoginForm" onSubmit={handleSubmit}>
                    <div className="LoginFormContainer">
                        <label htmlFor="login" className="LoginFormLabel">Login</label>
                        <input
                            type="login"
                            className="LoginFormInput"
                            name="login"
                            id="login"
                            placeholder="Wprowadź login"
                            autoComplete="off"
                            onChange={handleChange}
                            ref={login}
                        />
                        <p ref={smallsLogin} className="LoginFormMessage"></p>
                    </div>

                    <div className="LoginFormContainer">
                        <label htmlFor="password" className="LoginFormLabel">Hasło</label>
                        <input
                            type="password"
                            className="LoginFormInput"
                            name="password"
                            id="form__password"
                            placeholder="Wprowadź hasło"
                            ref={password}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        <p ref={smallsPass} className="LoginFormMessage"></p>
                    </div>

                    {!isLogin && (
                        <div className="LoginFormContainer">
                            <label htmlFor="confirmPassword" className="LoginFormLabel">Powtórz hasło</label>
                            <input
                                type="password"
                                className="LoginFormInput"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Powtórz hasło"
                                ref={confirmPassword}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            <p ref={smallsConfirmPass} className="LoginFormMessage"></p>
                        </div>
                    )}
                    {!isLogin && (
                        <div className="LoginFormContainer">
                        <label htmlFor="userId" className="LoginFormLabel">ID</label>
                        <input
                            type="text"
                            className="LoginFormInput"
                            name="userId"
                            id="userId"
                            placeholder="Wprowadź ID"
                            ref={userId}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        <p ref={smallsId} className="LoginFormMessage"></p>
                    </div>
                    )}
                    <button ref={button} className="ToggleLoginButton">{isLogin ? 'Zaloguj się' : 'Zarejestruj się'}</button>
                </form>
                <button className="register__button" onClick={handleToggle}>
                    {isLogin ? 'Nie masz konta? Załóż je tutaj!' : 'Masz już konto? Zaloguj się tutaj!' }
                </button>
            </div>
            {notifications.map((notification, index) => (
                <Notification 
                    key={index} 
                    message={notification.message} 
                    onClose={() => handleCloseNotification(index)} 
                    type={notification.type} 
                />
            ))}
        </div>
    );
}

export default AuthForm;
