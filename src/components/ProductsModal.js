import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MessageContext, handleSuccessMessage, handleFailMessage } from "../store/messageStore";

function ProductsModal({ closeProductsModal, getProducts, type, tempProduct }) {
  const [tempData, setTemData] = useState({
    title: "",
    category: "",
    origin_price: 100,
    price: 300,
    unit: "",
    description: "",
    content: "",
    is_enabled: 1,
    imageUrl: "",
  });
  useEffect(() => {
    if (type === "create") {
      setTemData({
        title: "",
        category: "",
        origin_price: 100,
        price: 300,
        unit: "",
        description: "",
        content: "",
        is_enabled: 1,
        imageUrl: "",
      });
    } else if (type === "edit") {
      setTemData(tempProduct);
    }
  }, [type, tempProduct]);
  const [, dispatch] = useContext(MessageContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["price", "origin_price"].includes(name)) {
      setTemData({ ...tempData, [name]: Number(value) });
    } else if (name === "is_enabled") {
      setTemData({ ...tempData, [name]: e.target.checked });
    } else {
      setTemData({ ...tempData, [name]: value });
    }
  };
  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`;
      let method = "post";
      if (type === "edit") {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`;
        method = "put";
      }
      const res = await axios[method](api, {
        data: tempData,
      });
      console.log(res);
      closeProductsModal();
      getProducts();
      handleSuccessMessage(dispatch, res);
    } catch (error) {
      handleFailMessage(dispatch, error);
      console.log(error);
    }
  };

  const uploadUrl = (url) => {
    setTemData({ ...tempData, ["imageUrl"]: url });
  };

  const uploadFile = async (file) => {
    // 取出已經存入的token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("oohToken="))
      ?.split("=")[1];
    console.log(file);
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`,
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setTemData({ ...tempData, ["imageUrl"]: res.data.imageUrl });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="productModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {type === "create" ? "建立新商品" : `編輯${tempData.title}`}
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeProductsModal}
            />
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="image">
                    輸入圖片網址
                    <input
                      type="text"
                      name="imageUrl"
                      id="image"
                      placeholder="請輸入圖片連結"
                      className="form-control"
                      onChange={(e) => {
                        uploadUrl(e.target.value);
                        console.log(e);
                      }}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="customFile">
                    或 上傳圖片
                    <input
                      type="file"
                      id="customFile"
                      className="form-control"
                      onChange={(e) => {
                        uploadFile(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
                <img src={tempData.imageUrl} alt="" className="img-fluid" />
              </div>
              <div className="col-sm-8">
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="title">
                    標題
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="請輸入標題"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.title}
                    />
                  </label>
                </div>
                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="category">
                      分類
                      <input
                        type="text"
                        id="category"
                        name="category"
                        placeholder="請輸入分類"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.category}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="unit">
                      單位
                      <input
                        type="unit"
                        id="unit"
                        name="unit"
                        placeholder="請輸入單位"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.unit}
                      />
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="origin_price">
                      原價
                      <input
                        type="number"
                        id="origin_price"
                        name="origin_price"
                        placeholder="請輸入原價"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.origin_price}
                      />
                    </label>
                  </div>
                  <div className="form-group mb-2 col-md-6">
                    <label className="w-100" htmlFor="price">
                      售價
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="請輸入售價"
                        className="form-control"
                        onChange={handleChange}
                        value={tempData.price}
                      />
                    </label>
                  </div>
                </div>
                <hr />
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="description">
                    產品描述
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      placeholder="請輸入產品描述"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.description}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <label className="w-100" htmlFor="content">
                    說明內容
                    <textarea
                      type="text"
                      id="content"
                      name="content"
                      placeholder="請輸入產品說明內容"
                      className="form-control"
                      onChange={handleChange}
                      value={tempData.content}
                    />
                  </label>
                </div>
                <div className="form-group mb-2">
                  <div className="form-check">
                    <label className="w-100 form-check-label" htmlFor="is_enabled">
                      是否啟用
                      <input
                        type="checkbox"
                        id="is_enabled"
                        name="is_enabled"
                        placeholder="請輸入產品說明內容"
                        className="form-check-input"
                        onChange={handleChange}
                        checked={!!tempData.is_enabled}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeProductsModal}>
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsModal;
