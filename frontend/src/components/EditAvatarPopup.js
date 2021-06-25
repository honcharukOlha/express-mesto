import React from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    const avatarRef = React.useRef();

    React.useEffect(() => {
        avatarRef.current.value = '';
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateAvatar({
            avatar: avatarRef.current.value,
        });
    }

    return (
        <PopupWithForm
            name="change_avatar"
            title="Обновить аватар"
            input="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
            <input
                ref={avatarRef}
                type="url"
                name="link-image"
                id="avatar-input-link"
                className="popup__text popup__text_name_image"
                placeholder="Ссылка на картинку"
                required
            />
            <span
                className="popup__text-error popup__text-error_active"
                id="avatar-input-link-error"
            />
        </PopupWithForm>
    );
}

export default EditAvatarPopup;
