import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../components/FormElements";
import axios from "axios";

function Checkout() {
  const { cartData } = useOutletContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    const { name, email, tel, address } = data;
    const form = {
      data: {
        user: {
          name,
          email,
          tel,
          address,
        },
      },
    };
    const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/order`, form);

    console.log(errors);
    navigate(`/success/${res.data.orderId}`);
  };

  return (
    <div className="bg-light pt-5 pb-7">
      <div className="container">
        <div className="row justify-content-center flex-md-row flex-column-reverse">
          <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white p-4">
              <h4 className="fw-bold">外送資料</h4>
              <div className="mb-2">
                <Input
                  id="email"
                  type="email"
                  errors={errors}
                  labelText="Email"
                  register={register}
                  rules={{
                    required: "email為必填",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email格式不正確",
                    },
                  }}
                />
              </div>
              <div className="mb-2">
                <Input
                  id="name"
                  type="text"
                  errors={errors}
                  labelText="姓名"
                  register={register}
                  rules={{
                    required: "姓名為必填",
                    maxLength: { value: 10, message: "姓名長度不超過10" },
                  }}
                />
              </div>
              <div className="mb-2">
                <Input
                  id="tel"
                  type="text"
                  errors={errors}
                  labelText="連絡電話"
                  register={register}
                  rules={{
                    required: "電話為必填",
                    maxLength: { value: 10, message: "電話長度不超過12" },
                  }}
                />
              </div>
              <div className="mb-2">
                <Input
                  id="address"
                  type="text"
                  errors={errors}
                  labelText="地址"
                  register={register}
                  rules={{
                    required: "地址為必填",
                  }}
                />
              </div>
            </div>
            <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100">
              <Link className="text-dark mt-md-0 mt-3" to="/cart">
                <i className="bi bi-chevron-left me-2"></i> 繼續點餐
              </Link>
              <button type="submit" className="btn btn-dark py-3 px-7 rounded-0">
                送出表單
              </button>
            </div>
          </form>
          <div className="col-md-4">
            <div className="border p-4 mb-4">
              <h4 className="mb-4">選購餐點</h4>
              {cartData?.carts?.map((item) => {
                return (
                  <div className="d-flex" key={item.id}>
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      className="me-2"
                      style={{ width: "48px", height: "48px", objectFit: "cover" }}
                    />
                    <div className="w-100">
                      <div className="d-flex justify-content-between fw-bold">
                        <p className="mb-0">{item.product.title}</p>
                        <p className="mb-0">x{item.qty}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="text-muted mb-0">
                          <small>NT$ {item.product.price}</small>
                        </p>
                        <p className="mb-0">NT$ {item.final_total}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">Total</p>
                <p className="mb-0 h4 fw-bold">NT$ {cartData.final_total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
