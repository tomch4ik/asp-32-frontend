import React, { useContext, useState, useEffect } from 'react';
import AppContext from "../../../features/context/AppContext";
import { Link } from 'react-router-dom'; 

function OrderItem({ order, backUrl }) {

    const orderItems = Array.isArray(order.orderItems?.$values) 
        ? order.orderItems.$values 
        : Array.isArray(order.orderItems) ? order.orderItems : [];

    const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Замовлення №{order.id}</h5>
                    <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                        Переглянути деталі
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-4">
                        <strong>Дата:</strong> {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="col-md-4">
                        <strong>Товарів:</strong> {totalQuantity} шт.
                    </div>
                    <div className="col-md-4 text-end">
                        <strong>Сума:</strong> <span className="text-success">{order.totalAmount} грн</span>
                    </div>
                </div>
                
                {orderItems.length > 0 && (
                    <div className="mt-3 d-flex align-items-center">
                        <img 
                            src={backUrl + orderItems[0].product.imageUrl} 
                            alt={orderItems[0].product.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }} 
                            className="img-thumbnail" 
                        />
                        <small className="text-muted">Перший товар: {orderItems[0].product.name}</small>
                    </div>
                )}
            </div>
        </div>
    );
}


export default function OrdersHistory() {
    const { user, request, backUrl } = useContext(AppContext);
    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        

        request('/api/orders')
            .then(data => {
                if (data && data.$values) {
                    setOrders(data.$values);
                } else if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
            })
            .catch(err => {
                console.error("Помилка завантаження замовлень:", err);
                setError('Не вдалося завантажити історію замовлень.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user, request]);


    if (!user) {
        return (
            <>
                <h1>Мої замовлення</h1>
                <div className="alert alert-danger" role="alert">
                    Історію замовлень можна переглядати тільки після входу в систему.
                </div>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <h1>Мої замовлення</h1>
                <div className="alert alert-info" role="alert">
                    Завантаження історії замовлень...
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h1>Мої замовлення</h1>
                <div className="alert alert-danger" role="alert">{error}</div>
            </>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <>
                <h1>Мої замовлення</h1>
                <div className="alert alert-secondary" role="alert">
                    У вас поки немає жодного оформленого замовлення.
                </div>
            </>
        );
    }

    return (
        <>
            <h1>Мої замовлення ({orders.length})</h1>
            <div className="order-history-list">
                {orders.map(order => (
                    <OrderItem 
                        key={order.id} 
                        order={order} 
                        backUrl={backUrl} 
                    />
                ))}
            </div>
        </>
    );
}