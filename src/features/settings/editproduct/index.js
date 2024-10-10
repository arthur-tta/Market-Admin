import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";
import { useParams } from "react-router-dom";

function EditProduct() {
  let { id } = useParams();
  const [data, setData] = useState();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productDes, setProductDes] = useState("");
  const [productNSX, setProductNSX] = useState("");
  const [productHSD, setProductHSD] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryID, setCategoryID] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn trình duyệt reload khi form submit

    try {
      const response = await fetch(`http://localhost:8889/api/food/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productName,
          categoryId: selectedCategory,
          price: productPrice,
          image: productImage,
          productionDate: productNSX,
          expirationDate: productHSD,
          des: productDes,
        }),
      });
      console.log(response);
      if (response.ok) {
        // Xử lý thành công
        showNotification("Danh mục được tạo thành công", "success");

        alert("Thêm thành công");
        window.location.href = "http://localhost:3000/app/product";
      } else {
        // Xử lý lỗi từ phía server
        showNotification("Không thể tạo danh mục", "error");
      }
    } catch (error) {
      // Xử lý lỗi mạng hoặc lỗi không xác định
      showNotification("Lỗi mạng hoặc lỗi không xác định", "error");
    }
  };

  useEffect(() => {
    const getCate = async () => {
      const res = await fetch(`http://localhost:8889/api/category/`);
      const data = await res.json();
      setCategoryID(data);
    };
    getCate();

    const getData = async () => {
      const res = await fetch(`http://localhost:8889/api/food/detail/${id}`);
      const dataAPI = await res.json();
      setData(dataAPI);
      setProductName(dataAPI.name);
      setProductPrice(dataAPI.price);
      setProductImage(dataAPI.image)
      setProductDes(dataAPI.des)
      setProductNSX(dataAPI.productionDate)
      setProductHSD(dataAPI.expirationDate)
      setSelectedCategory(dataAPI.categoryId)

    };
    getData();
  }, []);

  console.log(data);
  return (
    <>
      {data && (
        <TitleCard title="Thông tin sản phấm" topMargin="mt-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Tên sản phẩm"
                
              />
              <input
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Giá sản phẩm"
                
              />
              <input
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                placeholder="Ảnh sản phẩm"
                
              />
              <input
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={productDes}
                onChange={(e) => setProductDes(e.target.value)}
                placeholder="Mô tả"
               
              />
              <input
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={productNSX}
                onChange={(e) => setProductNSX(e.target.value)}
                placeholder="Ngày sản xuất"
                type="date"
               
              />
              <input
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={productHSD}
                onChange={(e) => setProductHSD(e.target.value)}
                placeholder="Hạn sử dụng"
                type="date"
               
              />
              <select
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={selectedCategory}
                
                onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Chọn danh mục</option>
                {categoryID.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-16">
              <button type="submit" className="btn btn-primary float-right">
                Cập nhật
              </button>
            </div>
          </form>
        </TitleCard>
      )}
    </>
  );
}

export default EditProduct;
