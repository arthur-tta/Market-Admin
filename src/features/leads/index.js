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
import { showNotification } from "../common/headerSlice";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewLeadModal = () => {
    dispatch(
      openModal({
        title: "Tạo người dùng",
        bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW,
      })
    );
  };

  
};

function Leads() {
  const { leads } = useSelector((state) => state.lead);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLeadsContent());
  }, []);

  const [user, setUser] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`http://localhost:8889/api/user/`);
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
      const response = await fetch(`http://localhost:8889/api/user/delete/${id}`, {
        method: 'DELETE',
      });
  
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
      <TitleCard
        title="Người dùng"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}>
        {/* Leads List in table format loaded from slice after api call */}
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Mã người dùng</th>
                <th>Tên người dùng</th>
                <th>Số điện thoại</th>
                <th>Gropp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {user.map((l, k) => {
                return (
                  <tr key={k}>
                    <td>{l._id}</td>
                    <td>
                        {l.name}
                    </td>
                    <td>
                        {l.phone}
                    </td>
                    <td>
                        {l.isGroup ? "Có" : "Không"}
                    </td>
                   
                    <td>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => handleDeleteUser(l._id)}>
                        <TrashIcon className="w-5" />
                      </button>
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

export default Leads;
