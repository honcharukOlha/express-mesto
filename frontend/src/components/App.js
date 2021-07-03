import '../index.css';
import React, {useState} from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
    useHistory,
    Redirect,
} from 'react-router-dom';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import Header from './Header.js';
import InfoTooltip from './InfoTooltip.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup';
import api from '../utils/api.js';
import * as auth from '../utils/auth.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import Register from './Register.js';
import Login from './Login.js';
import ProtectedRoute from './ProtectedRoute.js';

function App() {
    const [isEditProfilePopupOpen, setEditProfileClick] = React.useState(false);
    const [isAddPlacePopupOpen, setAddPlaceClick] = React.useState(false);
    const [isEditAvatarPopupOpen, setEditAvatarClick] = React.useState(false);
    const [isPopupWithImageOpen, setPopupWithImageOpen] = React.useState(false);
    const [isTooltipPopupOpen, setTooltipPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [userData, setUserData] = React.useState({});
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [registrSuccessful, setRegistrSuccessful] = React.useState('');
    const history = useHistory();

    React.useEffect(() => {
        if (loggedIn) {
            Promise.all([api.getUserInfo(), api.getInitialCards()])
                .then(([user, cards]) => {
                    setCurrentUser(user);
                    setCards(cards);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [loggedIn]);

    function handleRegister(email, password, cleanCallback) {
        auth.register(email, password)
            .then((res) => {
                if (res) {
                    cleanCallback();
                    setUserData(res);
                    setRegistrSuccessful(true);
                    history.push('/sign-in');
                }
            })
            .catch((err) => {
                setRegistrSuccessful(false);
                console.log(err);
            })
            .finally(() => setTooltipPopupOpen(true));
    }

    function handleLogin(email, password) {
        auth.authorize(email, password)
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token);
                    setUserData(data);
                    setLoggedIn(true);
                    history.push('/main');
                }
            })
            .catch((err) => console.log(err));
    }

    function handleTokenCheck() {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            auth.checkToken(jwt)
                .then((res) => {
                    if (res) {
                        setUserData({
                            id: res._id,
                            email: res.email,
                        });
                        setLoggedIn(true);
                        history.push('/main');
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setLoggedIn(false);
            localStorage.removeItem('jwt');
            history.push('/sign-in');
        }
    }

    React.useEffect(() => {
        handleTokenCheck();
    }, []);

    function handleSignOut() {
        localStorage.removeItem('jwt');
        setCurrentUser({isLoggedIn: false});
        history.push('/sign-in');
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some((id) => id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.toggleLike(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) =>
                    state.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards(cards.filter((c) => !(c._id === card._id)));
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateUser(uInfo) {
        api.setUserInfo(uInfo.name, uInfo.about)
            .then((updateUser) => {
                setCurrentUser(updateUser);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatar) {
        api.changeAvatar(avatar.avatar)
            .then((avatar) => {
                setCurrentUser(avatar);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(place) {
        api.addNewCard(place.name, place.link)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleEditProfileClick() {
        setEditProfileClick(true);
    }

    function handleAddPlaceClick() {
        setAddPlaceClick(true);
    }

    function handleEditAvatarClick() {
        setEditAvatarClick(true);
    }

    function closeAllPopups() {
        setEditProfileClick(false);
        setAddPlaceClick(false);
        setEditAvatarClick(false);
        setPopupWithImageOpen(false);
        setTooltipPopupOpen(false);
        setSelectedCard(null);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setPopupWithImageOpen(true);
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className='root'>
                <div className='page'>
                    <Header userData={userData} onSignOut={handleSignOut} />
                    <Switch>
                        <Route exact path='/' />
                        <ProtectedRoute
                            path='/main'
                            component={Main}
                            loggedIn={loggedIn}
                            userData={userData}
                            onEditAvatar={handleEditAvatarClick}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onCardClick={handleCardClick}
                            cards={cards}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                        <Route exact path='/sign-in'>
                            <Login onLogin={handleLogin} />
                        </Route>
                        <Route exact path='/sign-up'>
                            <Register onRegister={handleRegister} />
                        </Route>
                    </Switch>
                    <Footer />
                </div>
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                />
                <ImagePopup
                    name='open_picture'
                    card={selectedCard}
                    isOpen={isPopupWithImageOpen}
                    onClose={closeAllPopups}
                />
                <PopupWithForm
                    name='open_confirmation'
                    title='Вы уверены?'
                    input='Да'
                />
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />

                <InfoTooltip
                    isOpen={isTooltipPopupOpen}
                    onClose={closeAllPopups}
                    onResult={registrSuccessful}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
