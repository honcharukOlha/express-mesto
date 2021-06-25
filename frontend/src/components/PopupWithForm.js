import React from 'react';

function PopupWithForm(props) {
    return (
        <div
            className={`popup popup_${props.name} ${
                props.isOpen ? 'popup_opened' : ''
            }`}
        >
            <div className="popup__container">
                <form
                    onSubmit={props.onSubmit}
                    name={`popup-${props.name}`}
                    className="popup__form novalidate"
                >
                    <h2 className="popup__heading">{props.title}</h2>
                    {props.children}
                    <input
                        type="submit"
                        className="popup__button"
                        value="Сохранить"
                    />
                </form>
                <button
                    className="popup__close"
                    type="button"
                    onClick={props.onClose}
                />
            </div>
        </div>
    );
}

export default PopupWithForm;
