import React, { useState } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');
    // Подписка на контекст
    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setName('');
        setLink('');
    }, [isOpen]);

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onAddPlace({
            name: name,
            link: link,
        });
    }

    return (
        <PopupWithForm
            name="open_add"
            title="Новое место"
            input="Создать"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                name="description"
                id="text-input-description"
                className="popup__text popup__text_name_description"
                value={name || ''}
                placeholder="Название"
                minLength="2"
                maxLength="30"
                required
                onChange={handleChangeName}
            />
            <span
                className="popup__text-error popup__text-error_active"
                id="text-input-description-error"
            />
            <input
                type="url"
                name="link"
                id="url-input-link"
                className="popup__text popup__text_name_link"
                value={link || ''}
                placeholder="Ссылка на картинку"
                required
                onChange={handleLinkChange}
            />
            <span
                className="popup__text-error popup__text-error_active"
                id="url-input-link-error"
            />
        </PopupWithForm>
    );
}

export default AddPlacePopup;
