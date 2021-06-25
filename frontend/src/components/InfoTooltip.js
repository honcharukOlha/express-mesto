import React from 'react';
import success from '../images/Check.svg';
import error from '../images/Cross-check.svg';

function InfoTooltip(props) {
    const { isOpen, onClose, onResult } = props;
    const logo = `${onResult ? success : error}`;

    return (
        <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
                <form className="popup__form">
                    <img
                        src={logo}
                        className="popup__icon"
                        alt="Иконка статуса обработки вашего запроса"
                    />
                    <h2 className="popup__status">
                        {onResult
                            ? `Вы успешно зарегистрировались!`
                            : `Что-то пошло не так! Попробуйте ещё раз.`}
                    </h2>
                </form>
                <button
                    className="popup__close"
                    type="button"
                    onClick={onClose}
                />
            </div>
        </div>
    );
}

export default InfoTooltip;
