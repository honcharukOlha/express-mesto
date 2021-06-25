import '../index.css';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onLogin(email, password);
    }

    return (
        <div className="login">
            <p className="login__welcome">Вход</p>
            <form onSubmit={handleSubmit} className="form">
                <input
                    required
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    className="form__input"
                    value={email}
                    onChange={handleEmailChange}
                />
                <input
                    required
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    className="form__input"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <div className="form__button-container">
                    <button type="submit" className="form__link">
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
}

export default withRouter(Login);
