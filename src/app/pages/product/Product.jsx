import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../../features/context/AppContext";

export default function Product() {
    const { slug } = useParams();
    const { request, backUrl } = useContext(AppContext);
    useEffect(() => {
    request("/api/product/feedback/" + slug, {method: 'POST'});
    //     .then(setGroup)
    //     .catch(_ => { });
    }, [slug]);

return <>
    <h1>Product {slug}</h1>
</>;
}