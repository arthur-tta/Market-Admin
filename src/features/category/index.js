import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { deleteLead, getLeadsContent } from "./leadSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilSquareIcon  from "@heroicons/react/24/outline/PencilSquareIcon";

import { showNotification } from "../common/headerSlice";
import { Link  } from 'react-router-dom'

function Category() {
  const { leads } = useSelector((state) => state.lead);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLeadsContent());
  }, []);

  const [user, setUser] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`http://localhost:8889/api/category`);
      const data = await res.json();
      setUser(data);
    };
    getData();
  }, []);

  const getDummyStatus = (index) => {
    if (index % 5 === 0) return <div className="badge">Not Interested</div>;
    else if (index % 5 === 1)
      return <div className="badge badge-primary">In Progress</div>;
    else if (index % 5 === 2)
      return <div className="badge badge-secondary">Sold</div>;
    else if (index % 5 === 3)
      return <div className="badge badge-accent">Need Followup</div>;
    else return <div className="badge badge-ghost">Open</div>;
  };

  const deleteCurrentLead = (index) => {
    dispatch(
      openModal({
        title: "Chắc chắn?",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Bạn có chắc chắn muốn xoá`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
          index,
        },
      })
    );
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8889/api/category/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Handle successful deletion here
        // For example, you could remove the user from the state to update the UI
        setUser(user.filter((u) => u._id !== id));
        showNotification("User deleted successfully", "success");
      } else {
        // Handle error response here
        showNotification("Failed to delete user", "error");
      }
    } catch (error) {
      // Handle network errors here
      showNotification("Network error", "error");
    }
  };

  const handleDeleteUser = (id) => {
    deleteUser(id);
  };

 

  return (
    <>
      <div className="inline-block float-right">
        <Link
          to='/app/settings-profile'
          className="btn px-6 btn-sm normal-case btn-primary"
          >
          Thêm danh mục
        </Link>
      </div>

   

      <TitleCard title="Danh mục" topMargin="mt-2">
        {/* Leads List in table format loaded from slice after api call */}
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Mã danh mục</th>
                <th>Tên danh mục</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {user.map((l, k) => {
                return (
                  <tr key={k}>
                    <td>{l._id}</td>
                    <td>{l.name}</td>

                    <td>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => handleDeleteUser(l._id)}>
                        <TrashIcon className="w-5" />
                      </button>
                      <Link
                         to={`/app/edit-cate/${l._id}`}
                        className="btn btn-square btn-ghost"
                       >
                        <PencilSquareIcon className="w-5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Category;
