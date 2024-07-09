import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getProducts = async (page = 1) => {
    setIsLoading(true);
    const productRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`
    );
    setProducts(productRes.data.products);
    setPagination(productRes.data.pagination);
    setIsLoading(false);
  };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="container mt-md-5 mt-3 mb-7">
        <div className="row">
          {products.map((product) => {
            return (
              <div className="col-md-3" key={product.id}>
                <div className="card border-0 mb-4 position-relative">
                  <img
                    src={
                      product.imageUrl
                        ? product.imageUrl
                        : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    className="card-img-top rounded-0 object-cover"
                    height={250}
                    alt="..."
                  />
                  <div className="card-body p-0">
                    <h4 className="mb-0 mt-3">
                      <Link to={`/product/${product.id}`}>{product.title}</Link>
                    </h4>
                    <p className="card-text text-muted mb-0">{product.description}</p>
                    <p className="text-muted mt-3">NT${product.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <nav className="d-flex justify-content-center">
          <Pagination pagination={pagination} changePage={getProducts} />
        </nav>
      </div>
    </>
  );
}

export default Products;
