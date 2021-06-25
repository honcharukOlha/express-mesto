import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
    const currentUser = React.useContext(CurrentUserContext);

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = card.owner._id === currentUser._id;

    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = `element__basket ${
        isOwn ? 'element__basket_visible' : 'element__basket_hidden'
    }`;

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = `element__button ${
        isLiked ? 'element__button_active' : ''
    }`;

    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card);
    }

    return (
        <li className="element">
            <img
                className="element__image"
                src={card.link}
                alt={card.name}
                onClick={handleClick}
            />
            <div className="element__nowrap">
                <h3 className="element__text">{card.name}</h3>
                <div className="element__wrap">
                    <button
                        type="button"
                        className={cardLikeButtonClassName}
                        onClick={handleLikeClick}
                    />
                    <p className="element__like">{card.likes.length}</p>
                </div>
            </div>
            <button
                type="button"
                className={cardDeleteButtonClassName}
                onClick={handleDeleteClick}
            />
        </li>
    );
}

export default Card;
