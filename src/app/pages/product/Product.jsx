import React,{ useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../../features/context/AppContext";

export default function Product() {
    const { slug } = useParams();
    
    const { request, backUrl } = useContext(AppContext); 

    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null); 
    

    useEffect(() => {

        if (!request || !slug) return;
        
        request("/api/product/" + slug, {method: "GET"})
        .then(data => {

            
            if (data) {
                setProduct(data);
                setError(null);
            } else {
                setProduct(false); 
                setError("Сервер вернул пустые данные.");
            }
        })
        .catch(err => {
            console.error("Ошибка при загрузке продукта:", err);
            setError("Ошибка загрузки данных с API.");
            setProduct(false);
        });
    },[slug, request]); 


    useEffect(() => {
        if (request && slug) {
             request("/api/product/feedback/" + slug, {method: 'POST'});
        }
    }, [slug, request]);



    if (product === null) {
        return <h1 className="text-xl p-4">Загрузка продукта...</h1>;
    }
    

    if (product === false) {
        return <h1 className="text-xl p-4 text-red-600">
            Ошибка: {error || 'Не удалось загрузить данные о продукте.'}
        </h1>;
    }
    

    return (

    <div className="card mb-3" style={{maxWidth: '540px'}}> 
        <div className="row g-0">
            <div className="col-md-4">
                {/* тут могут быть проблемы с путем к фотографии */}
                <img src={backUrl + "/Storage/" + product.imageUrl} className="img-fluid rounded-start" alt={product.name}/>
            </div>
            <div className="col-md-8">
                <div className="card-body"> 
                    <h5 className="card-title">{product.name}</h5> 
                    <p className="card-text">{product.description}</p> 
                    <p className="card-text"><strong>Ціна:</strong> {product.price} грн</p> 
                </div>
            </div>
        </div>
    </div>

    );
}
