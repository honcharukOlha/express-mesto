import '../index.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

function Register({ onRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onRegister(email, password, () => {
            setEmail('');
            setPassword('');
        });
    }

    return (
        <div className="register">
            <p className="register__welcome">Регистрация</p>
            <form onSubmit={handleSubmit} className="form">
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="form__input"
                    placeholder="Email"
                    minLength="2"
                    maxLength="30"
                    value={email}
                    onChange={handleChangeEmail}
                />
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    minLength="8"
                    maxLength="30"
                    className="form__input"
                    value={password}
                    onChange={handleChangePassword}
                    required
                />
                <div className="form__button-container">
                    <button
                        type="submit"
                        onSubmit={handleSubmit}
                        className="form__link"
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </form>

            <div className="register__sign-in">
                <p>
                    <Link to="/sign-in" className="register__login-link">
                        Уже зарегистрированы? Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default withRouter(Register);
