import React from 'react';

function ImagePopup(props) {
    return (
        <div
            className={`popup popup_open_picture ${
                props.isOpen ? 'popup_opened' : ''
            }`}
        >
            <div className="popup__open-card">
                <img
                    className="popup__picture"
                    src={props.card ? props.card.link : ''}
                    alt={props.card ? props.card.name : ''}
                />
                <p className="popup__description">
                    {props.card ? props.card.name : ''}
                </p>
                <button
                    className="popup__close"
                    type="button"
                    onClick={props.onClose}
                />
            </div>
        </div>
    );
}

export default ImagePopup;
