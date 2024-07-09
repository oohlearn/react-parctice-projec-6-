import axios from "axios";
import { useEffect, useRef, useState } from "react";
import CouponModal from "../../components/CouponModal";
import { Modal } from "bootstrap";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";

function AdminCoupon() {
  const [coupons, setCoupon] = useState([]);
  const [pagination, setPagination] = useState({});
  const couponsModal = useRef(null);
  const deleteModal = useRef(null);

  const [type, setType] = useState("create");
  const [tempCoupon, setTempCoupon] = useState({});

  useEffect(() => {
    couponsModal.current = new Modal("#couponModal", { backdrop: "static" });
    getCoupons();
    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
  }, []);

  const getCoupons = async (page = 1) => {
    const res = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupons?page=${page}`
    );
    setCoupon(res.data.coupons);
    setPagination(res.data.pagination);
    console.log(res);
  };

  const openDeleteModal = (coupon) => {
    setTempCoupon(coupon);
    deleteModal.current.show();
  };
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };

  const openCouponsModal = (type, coupon) => {
    setType(type);
    setTempCoupon(coupon);
    couponsModal.current.show();
  };
  const closeModal = () => {
    couponsModal.current.hide();
  };
  const deleteCoupon = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`
      );
      if (res.data.success) {
        deleteModal.current.hide();
        getCoupons();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3">
      <CouponModal
        closeModal={closeModal}
        getOrders={getCoupons}
        type={type}
        tempCoupon={tempCoupon}
      />
      <DeleteModal
        close={closeDeleteModal}
        text={tempCoupon.title}
        handleDelete={deleteCoupon}
        id={tempCoupon.id}
      />
      <h3>產品列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openCouponsModal("create", {})}
        >
          建立新優惠券
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">標題</th>
            <th scope="col">折扣</th>
            <th scope="col">到期日</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => {
            return (
              <tr key={coupon.id}>
                <td>{coupon.title}</td>
                <td>{coupon.percent}</td>
                <td>{new Date(coupon.due_date).toDateString()}</td>
                <td>{coupon.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openCouponsModal("edit", coupon)}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => openDeleteModal(coupon)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getCoupons} />
    </div>
  );
}

export default AdminCoupon;
