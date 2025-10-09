import { useContext} from "react";
import AppContext from "../../../features/context/AppContext";

// const initCartState = 
// {
//     cartItems: []
// };

export default function Cart() {
    const {cart, request, updateCart, user} = useContext(AppContext);

    const totalItems = cart.cartItems.length; 
    const totalQuantity = cart.cartItems.reduce((sum, ci) => sum + ci.quantity, 0); 
    const totalPrice = cart.cartItems.reduce((sum, ci) => sum + ci.price, 0); 
    return <>
    <h1>Cart</h1>
    {!user ? <>        
        <div className="alert alert-danger" role="alert">
            Кошик можна переглядати тільки після входу в систему
        </div>
    </> : <>
        <div>
                <div className="row">
                    <div className="col col-1 offset-1">Товар</div>
                    <div className="col col-4"></div>
                    <div className="col col-1">Ціна</div>
                    <div className="col col-2 text-center">Кількість</div>
                    <div className="col col-1">Вартість</div>
                    <div className="col col-1"></div>
                </div>

                {cart.cartItems.map(ci => <CartItem cartItem={ci} key={ci.id} />)}

                {cart.cartItems.length > 0 && (
                    <div className="row fw-bold border-top pt-3 mt-3">
                        <div className="col-4">Разом:</div>
                        <div className="col-2">Позицій: {totalItems}</div>
                        <div className="col-3">Кількість товарів: {totalQuantity}</div>
                        <div className="col-3">Загальна вартість: {totalPrice}</div>
                    </div>
                )}
            </div>
    </>}
    </>;
}

function CartItem({cartItem}) {
    const {request, updateCart} = useContext(AppContext);

    const deleteClick = () => {
        console.log("delete", cartItem.id);
        request("/api/cart/" + cartItem.id, {
            method: "DELETE"
        }).then((data) => {
            if(data) {
                updateCart();
            }
            else {
                alert("Помилка видалення");
            }
        })
    };

    const changeQuantity = (cnt) => {
      request("/api/cart/" + cartItem.id + "?cnt=" + cnt, {
        method: "PATCH"
      }).then((data) => {
        if(data) {
          updateCart();
        }
        else {
          alert("Помилка оновлення");
        }
      });
    };

    return <div className="row border-bottom py-2 mb-2">
        <div className="col col-1 offset-1"><img className="w-100" src={cartItem.product.imageUrl}/></div>
        <div className="col col-4">{cartItem.product.name}</div>
        <div className="col col-1">{cartItem.product.price}</div>
        <div className="col col-2 text-center">
          <i onClick={() => changeQuantity(-1)} class="bi bi-dash-square me-2" role="button"></i>
          {cartItem.quantity}
          <i onClick={() => changeQuantity(1)} class="bi bi-plus-square ms-2" role="button"></i>
        </div>
        <div className="col col-1">{cartItem.price}</div>
        <div className="col col-1"><i onClick={deleteClick} role="button" class="bi bi-x-square"></i></div>                
    </div>;
}
