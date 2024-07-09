import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
function ProductDetail() {
  const [product, setProduct] = useState({});
  const [cartQty, setCartQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { getCart } = useOutletContext();
  const { id } = useParams();
  const getProduct = async (id) => {
    const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
    setProduct(res.data.product);
  };

  const addToCart = async () => {
    setIsLoading(true);
    const data = {
      data: {
        product_id: product.id,
        qty: cartQty,
      },
    };
    try {
      const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, data);
      console.log("addCart", res);
      setIsLoading(false);
      getCart();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);

  return (
    <div className="container">
      <div
        style={{
          minHeight: "400px",
          backgroundImage: `url(${product.imageUrl})`,
          backgroundPosition: "center center",
        }}
      ></div>
      <div className="row justify-content-between mt-4 mb-7">
        <div className="col-md-7">
          <h2 className="mb-0">{product.title}</h2>
          <p className="fw-bold">NT$ {product.price}</p>
          <p>{product.content}</p>
          <div className="my-4">
            <img src={product.imageUrl} alt="" className="img-fluid mt-4" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group mb-3 border mt-3">
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon1"
                onClick={() => setCartQty((pre) => (pre === 0 ? 0 : pre - 1))}
              >
                <i className="bi bi-dash-lg"></i>
              </button>
            </div>
            <input
              type="number"
              className="form-control border-0 text-center my-auto shadow-none"
              placeholder=""
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
              readOnly
              value={cartQty}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon2"
                onClick={() => setCartQty((pre) => pre + 1)}
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <button
            type="button"
            href="./checkout.html"
            className="btn btn-dark w-100 rounded-0 py-3"
            onClick={() => addToCart()}
            disabled={isLoading}
          >
            加入購物車
          </button>

          <Link
            type="button"
            className="btn btn-primary w-100 rounded-0 py-3 my-3"
            to={"/products"}
          >
            產品清單
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;
