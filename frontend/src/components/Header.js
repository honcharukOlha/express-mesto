import '../index.css';
import logo from '../../src/images/logo.svg';
import { Route, Link } from 'react-router-dom';
function Header({ userData, onSignOut }) {
    return (
        <header className="header">
            <img src={logo} className="header__logo" alt="Логотип сайта" />
            <Route exact path="/sign-in">
                <button className="header__button">
                    <Link to="/sign-up" className="header__button_text">
                        Регистрация
                    </Link>
                </button>
            </Route>
            <Route exact path="/sign-up">
                <button className="header__button">
                    <Link to="/sign-in" className="header__button_text">
                        Войти
                    </Link>
                </button>
            </Route>
            <Route exact path="/"></Route>
            <Route exact path="/main">
                <button className="header__button header__button_nowrap">
                    <p className="header__button_email">{userData.email}</p>
                    <Link
                        to="/sign-in"
                        onClick={onSignOut}
                        className="header__button_text"
                    >
                        Выйти
                    </Link>
                </button>
            </Route>
        </header>
    );
}

export default Header;
