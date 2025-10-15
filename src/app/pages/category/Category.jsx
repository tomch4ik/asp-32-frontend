import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppContext from "../../../features/context/AppContext";

export default function Category()
{
    const {slug} = useParams();
    const {cart, request, backUrl, updateCart} = useContext(AppContext);
    const navigate = useNavigate();
    const [group, setGroup] = useState(null); 

    useEffect(() => {
        request("/api/group/" + slug)
            .then(setGroup)
            .catch(console.error); 
    }, [slug]);

    const buyClick = productId => {
        request("/api/cart/" + productId, {
            method: 'POST'
        })
        .then(updateCart)
        .catch(console.error);
    };


    if (!group) {
        return <h1>Завантаження...</h1>;
    }

    const productsToRender = group.products?.$values || [];
    

    const currentCartItems = Array.isArray(cart?.cartItems) ? cart.cartItems : [];



    return <>
        <h1>Розділ {group.name}</h1>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
        
        {productsToRender.map(p => 
            <div key={p.id} className="col">
                <Link className="nav-link h-100" to={"/product/" + (p.slug || p.id)}>
                    <div className="card h-100">

                        <img src={backUrl + p.imageUrl} className="card-img-top" alt={p.name}/>
                        <div className="card-body">
                            <h5 className="card-title">{p.name}</h5>
                            <p className="card-text">{p.description}</p>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <span>
                                <i className="bi bi-eye"></i>
                                &nbsp;
                                {p.feedbacksCount}
                            </span>
                            
                            {currentCartItems.some(ci => ci.productId === p.id)
                            ?
                            <button
                                className="btn btn-success"
                                onClick={e => {e.preventDefault(); navigate("/cart") }} >
                                <i className="bi bi-cart-check"></i>
                            </button>
                            :
                            <button
                                className="btn btn-outline-success"
                                onClick={e => {e.preventDefault(); buyClick(p.id)}} >
                                <i className="bi bi-cart-plus"></i>
                            </button>
                            }
                        </div>
                    </div>
                </Link>
            </div>
        )}


        {productsToRender.length === 0 && (
            <div className="col-12">
                <p className="alert alert-info text-center">
                    У цьому розділі немає доступних товарів.
                </p>
            </div>
        )}
        </div>
    </>;
}