import React, { useState } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    // Подписка на контекст
    const currentUser = React.useContext(CurrentUserContext);

    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
            name: name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            name="open_edit"
            title="Редактировать профиль"
            input="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                name="author"
                id="text-input-author"
                className="popup__text popup__text_name_author"
                value={name || ''}
                placeholder="Имя"
                minLength="2"
                maxLength="40"
                required
                onChange={handleNameChange}
            />
            <span
                className="popup__text-error popup__text-error_active"
                id="text-input-author-error"
            />
            <input
                type="text"
                name="description"
                id="text-input-activity"
                className="popup__text popup__text_name_activity"
                value={description || ''}
                placeholder="О себе"
                minLength="2"
                maxLength="200"
                required
                onChange={handleDescriptionChange}
            />
            <span
                className="popup__text-error popup__text-error_active"
                id="text-input-activity-error"
            />
        </PopupWithForm>
    );
}

export default EditProfilePopup;
