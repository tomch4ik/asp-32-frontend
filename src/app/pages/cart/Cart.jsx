import { useContext, useState } from "react";
import AppContext from "../../../features/context/AppContext";


/*
    ? Реалізувати на фронтенді профіль користувача. До нього додати *
     історію замовлень - посилання на кошики, які були закриті раніше. *
      Розробити сторінку минулого замовлення (як кошик, тільки без * можливості редагування). */



export default function Cart() {

    const { cart, user, request, updateCart } = useContext(AppContext);

    const [confirmationAction, setConfirmationAction] = useState(null);

    const handlePurchase = () => setConfirmationAction('purchase');
    const handleClearCart = () => setConfirmationAction('clear');
    const handleCloseModal = () => setConfirmationAction(null);

    const handleConfirm = () => {
    if (confirmationAction === 'purchase') {
        

        const rawCartItems = cart.cartItems; 
        const cartItems = Array.isArray(rawCartItems) 
            ? rawCartItems 
            : rawCartItems?.$values || [];
        
        const purchaseData = {

            items: cartItems.map(ci => ({
                productId: ci.productId, 
                quantity: ci.quantity    
            }))
        };
        

        request('/api/orders', { 
            method: 'POST', 

            body: JSON.stringify(purchaseData) 
        })
        .then(response => {

            if (response && response.status === 'Status201') { 
                alert('Ваше замовлення успішно оформлено!');

                request('/api/cart', { method: 'DELETE' }).then(updateCart); 
            } else if (response && response.data) {
                alert(`Помилка при оформленні замовлення: ${response.data}`);
            } else {
                alert('Помилка при оформленні замовлення.');
            }
        })
        .catch(error => {
            alert('Помилка зв\'язку з сервером при оформленні замовлення.');
            console.error(error);
        });
        
    } else if (confirmationAction === 'clear') {
        // Дописать надо
    }
    handleCloseModal();
};
    
    if (!user) {
        return (
            <>
                <h1>Кошик</h1>
                <div className="alert alert-danger" role="alert">
                    Кошик можна переглядати тільки після входу в систему
                </div>
            </>
        );
    }

    if (!cart) {
        return (
            <>
                <h1>Кошик</h1>
                <div className="alert alert-info" role="alert">
                    Завантаження даних кошика...
                </div>
            </>
        );
    }
    

    const rawCartItems = cart.cartItems; 
    const cartItems = Array.isArray(rawCartItems) 
        ? rawCartItems 
        : rawCartItems?.$values || [];

    const totalPrice = cartItems.reduce((sum, ci) => sum + ci.price, 0);
    const totalItems = cartItems.length; 
    const totalQuantity = cartItems.reduce((sum, ci) => sum + ci.quantity, 0); 

    const modalContent = {
        purchase: {
            title: 'Підтвердження замовлення',
            body: <p>Ви підтверджуєте оформлення замовлення на загальну суму <strong>{totalPrice} грн</strong>?</p>
        },
        clear: {
            title: 'Підтвердження очищення',
            body: <p>Ви дійсно хочете видалити всі товари з кошику?</p>
        }
    };
    
    return (
        <>
            <ConfirmationModal
                isOpen={!!confirmationAction}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                title={confirmationAction ? modalContent[confirmationAction].title : ''}
            >
                {confirmationAction && modalContent[confirmationAction].body}
            </ConfirmationModal>

            <h1>Кошик</h1>
            <div>
                <div className="row fw-bold mb-3">
                    <div className="col col-1 offset-1">Товар</div>
                    <div className="col col-4"></div>
                    <div className="col col-1">Ціна</div>
                    <div className="col col-2 text-center">Кількість</div>
                    <div className="col col-1">Вартість</div>
                    <div className="col col-1"></div>
                </div>

                {cartItems.map(ci => <CartItem cartItem={ci} key={ci.id} />)}

                {totalItems === 0 && (
                    <div className="alert alert-secondary text-center">
                        Ваш кошик порожній
                    </div>
                )}

                {totalItems > 0 && (
                    <>
                        <div className="row fw-bold border-top pt-3 mt-3">
                            <div className="col-4">Разом:</div>
                            <div className="col-2">Позицій: {totalItems}</div>
                            <div className="col-3">Кількість товарів: {totalQuantity}</div>
                            <div className="col-3 text-end">Загальна вартість: {totalPrice} грн</div>
                        </div>
                        <div className="row mt-4">
                            <div className="col d-flex justify-content-end gap-2">
                                <button className="btn btn-danger" onClick={handleClearCart}>
                                    <i className="bi bi-trash me-2"></i>
                                    Очистити кошик
                                </button>
                                <button className="btn btn-primary" onClick={handlePurchase}>
                                    <i className="bi bi-bag-check me-2"></i>
                                    Оформити замовлення
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
function CartItem({ cartItem }) {
    const { request, updateCart } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const deleteClick = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleConfirmDelete = () => {
        request(`/api/cart/${cartItem.id}`, { method: "DELETE" }).then(data => {
            if (data) updateCart();
            else alert("Помилка видалення");
        });
        setIsModalOpen(false);
    };
    const changeQuantity = (cnt) => {
        request(`/api/cart/${cartItem.id}?cnt=${cnt}`, { method: "PATCH" }).then(data => {
            if (data) updateCart();
            else alert("Помилка оновлення");
        });
    };
    return (
        <>
            <ConfirmationModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmDelete} title="Підтвердження видалення">
                <p>Ви дійсно хочете видалити <strong>'{cartItem.product.name}'</strong> з кошику?</p>
            </ConfirmationModal>
            <div className="row border-bottom py-2 mb-2 align-items-center">
                <div className="col col-1 offset-1"> 
                    <a href={ 'product/' + cartItem.product.slug} className="d-block"> 
                        <img className="w-100" src={cartItem.product.imageUrl} alt={cartItem.product.name} />
                    </a>
                </div>
                
                <div className="col col-4">{cartItem.product.name}</div>
                <div className="col col-1">{cartItem.product.price}</div>
                <div className="col col-2 text-center">
                    <i onClick={() => changeQuantity(-1)} className="bi bi-dash-square me-2" role="button"></i>
                    {cartItem.quantity}
                    <i onClick={() => changeQuantity(1)} className="bi bi-plus-square ms-2" role="button"></i>
                </div>
                <div className="col col-1">{cartItem.price}</div>
                <div className="col col-1"><i onClick={deleteClick} role="button" className="bi bi-x-square text-danger"></i></div>
            </div>
        </>
    );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) return null;
    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" onClick={onClose}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">{children}</div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Скасувати</button>
                            <button type="button" className="btn btn-primary" onClick={onConfirm}>Підтвердити</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}