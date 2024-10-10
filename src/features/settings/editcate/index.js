import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";
import { useParams } from "react-router-dom";
function EditCate() {
  const [categoryName, setCategoryName] = useState("");
  let { id } = useParams();
  
  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn trình duyệt reload khi form submit

    try {
      const response = await fetch(
        `http://localhost:8889/api/category/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: categoryName }),
        }
      );
      console.log(categoryName);

      if (response.ok) {
        // Xử lý thành công
        showNotification("Danh mục được tạo thành công", "success");
        setCategoryName(""); // Reset input field
        alert('Cập nhật thành công')
        window.location.href = 'http://localhost:3000/app/category'
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
    const getData = async () => {
      const res = await fetch(`http://localhost:8889/api/category/${id}`);
      const dataAPI = await res.json();
      console.log(dataAPI);
      setCategoryName(dataAPI.name)
    };
    getData();
  }, [])

  return (
    <>
      <TitleCard title="Sửa danh mục" topMargin="mt-2">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
          className="mt-1 block w-full rounded-lg border-2 border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={categoryName} 
          onChange={(e) => setCategoryName(e.target.value)}
        />
          </div>
          <div className="mt-16">
            <button type="submit" className="btn btn-primary float-right">
              Cập nhật
            </button>
          </div>
        </form>
      </TitleCard>
    </>
  );
}

export default EditCate;
