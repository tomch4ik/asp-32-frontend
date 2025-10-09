import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppContext from "../../../features/context/AppContext";

export default function Category()
{
    const {slug} = useParams();
    const {cart, request, backUrl, updateCart} = useContext(AppContext);
    const navigate = useNavigate();
    const [group, setGroup] = useState({products:[]});

    useEffect(() => {
    request("/api/group/" + slug)
        .then(setGroup)
        .catch(_ => {});
    }, [slug]);

    const buyClick = productId => {
        request("/api/cart/" + productId, {
            method: 'POST'
        })
    .then(updateCart)
    .catch(console.error);
};

    return <>
        <h1>Розділ {group.name}</h1>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
        {group.products.map(p => <div key={p.id} className="col">
            <Link className="nav-link h-100" to={"/product/" + (p.slug || p.id)}>
                    <div class="card h-100">
                        <img src={backUrl + p.imageUrl} className="card-img-top" alt={p.name}/>
                        <div className="card-body">
                            <h5 className="card-title">{p.name}</h5>
                            <p className="card-text">{p.description}</p>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <span>
                                <i class="bi bi-eye"></i>
                                &nbsp;
                                {p.feedbacksCount}
                            </span>
                            {cart.cartItems.some(ci => ci.productId == p.id)
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
            </div>)}
        </div>
    </>;
}