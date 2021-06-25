import '../index.css';
import React from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main({
    cards,
    onEditAvatar,
    onEditProfile,
    onCardLike,
    onCardDelete,
    onAddPlace,
    onCardClick,
}) {
    const currentUser = React.useContext(CurrentUserContext);
    function mapCard(card) {
        return (
            <Card
                key={card._id}
                card={card}
                onCardClick={() => onCardClick(card)}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
            />
        );
    }

    return (
        <main className="content">
            <section className="profile">
                <img
                    src={currentUser.avatar}
                    className="profile__avatar"
                    alt="Фото, которое вы сами выберете"
                />
                <div className="profile__edits" onClick={onEditAvatar}>
                    <div className="profile__edit"></div>
                </div>
                <div className="profile-info">
                    <div className="profile-info__nowrap">
                        <h1 className="profile-info__name">
                            {currentUser.name}
                        </h1>
                        <button
                            type="button"
                            className="profile-info__button"
                            onClick={onEditProfile}
                        />
                    </div>
                    <p className="profile-info__activity">
                        {currentUser.about}
                    </p>
                </div>
                <button
                    type="button"
                    className="add-button"
                    onClick={onAddPlace}
                />
            </section>

            <section className="elements">{cards.map(mapCard)}</section>
        </main>
    );
}

export default Main;
