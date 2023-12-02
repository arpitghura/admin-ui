import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Trash2, Pencil, Search, Save } from "lucide-react";

const MembersData = () => {
  const [originalData, setOriginalData] = useState([]);
  const [membersData, setMembersData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const [editingId, setEditingId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Table Columns
  const columns = [
    {
      name: "",
      selector: (row) => row.id,
      sortable: true,
      // hide this column in the table
      cell: () => null,
      width: "0px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (rowData) => {
        const [memberName, setMemberName] = useState(rowData.name);

        const handleChange = (event) => {
          setMemberName(event.target.value);
        };

        return (
          <>
            {editMode && editingId === rowData.id ? (
              <input
                type="text"
                value={memberName}
                onChange={handleChange}
                className="p-1 rounded-md border-2 border-gray-600 outline-none"
              />
            ) : (
              memberName
            )}
          </>
        );
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      cell: (rowData) => {
        const [memberEmail, setMemberEmail] = useState(rowData.email);

        const handleChange = (event) => {
          setMemberEmail(event.target.value);
        };

        return (
          <>
            {editMode && editingId === rowData.id ? (
              <input
                type="email"
                value={memberEmail}
                onChange={handleChange}
                className="p-1 rounded-md border-2 border-gray-600 outline-none"
              />
            ) : (
              memberEmail
            )}
          </>
        );
      },
    },
    {
      name: "Role",
      selector: (row) => row.role,
      width: "120px",
      editable: true,
      cell: (rowData) => {
        const [memberRole, setMemberRole] = useState(rowData.role);

        const handleChange = (event) => {
          setMemberRole(event.target.value);
        };

        return (
          <>
            {editMode && editingId === rowData.id ? (
              <input
                type="text"
                value={memberRole}
                onChange={handleChange}
                className="p-1 rounded-md border-2 border-gray-600 outline-none"
              />
            ) : (
              memberRole
            )}
          </>
        );
      },
    },
    {
      name: "",
      selector: (row) => row.action,
      cell: (rowData) => {
        const handleEditClick = () => {
          setEditingId(rowData.id);
          setEditMode(true);
        };

        const handleSaveClick = () => {
          setEditMode(false);
        };

        return (
          <div className="flex ml-14">
            {(editMode && editingId === rowData.id) ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white p-4 rounded-full m-1 save"
                onClick={() => handleSaveClick()}
              >
                <Save size={18} />
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white p-4 rounded-full m-1 edit"
                onClick={() => handleEditClick()}
              >
                <Pencil size={18} />
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-700 text-white p-4 rounded-full m-1 delete"
              onClick={() => handleDeleteBtn(rowData.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      },
      ignoreRowClick: true,
    },
  ];

  const handleDeleteBtn = (id) => {
    setMembersData(membersData.filter((item) => item.id !== id));
  };

  const handleMulDeleteRows = () => {
    setIsShowModal(false);
    setMembersData(membersData.filter((item) => !selectedRows.includes(item)));
    setSelectedRows([]);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);

    if (e.target.value === "") {
      setMembersData(originalData);
    } else {
      setMembersData(
        originalData.filter(
          (item) =>
            item.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.role.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(event);
    }
  };

  const fetchData = async () => {
    const response = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const data = await response.json();
    setMembersData(data);
    setOriginalData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  return (
    <>
      <div className="flex w-screen p-7">
        <input
          type="text"
          name="Search"
          id="search"
          value={searchQuery}
          onChange={handleSearch}
          className="px-2 text-md leading-none w-full outline-none border-2 border-green-600 rounded-s-xl"
          placeholder="Search Member by Id, Name, Email, Role..."
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white p-3 border-green-600 rounded-e-xl disabled:opacity-70 search-icon"
          onClick={handleSearch}
          disabled={searchQuery === ""}
        >
          <Search />
        </button>
      </div>

      <div className="px-4 w-full">
        <DataTable
          title="Members Data"
          columns={columns}
          data={membersData}
          pagination
          paginationPerPage={10}
          highlightOnHover
          responsive
          actions={
            <button
              onClick={() => setIsShowModal(true)}
              className="bg-red-500 z-50 hover:bg-red-600 text-white p-3 mr-2 rounded-full disabled:opacity-75"
              disabled={selectedRows.length === 0}
            >
              <Trash2 />
            </button>
          }
          selectableRows
          onSelectedRowsChange={(state) => setSelectedRows(state.selectedRows)}
          selectableRowsHighlight
          selectableRowsVisibleOnly
          clearSelectedRows
        />
      </div>

      {/* MultiDelete Confirmation Modal */}
      {isShowModal && (
        <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center">
          <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>

          <div className="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-xl font-bold text-black">
                  Are you sure, you want to delete?
                </p>
              </div>
              <div className="mb-2">
                <p className="text-sm font-semibold text-gray-600">
                  Selected IDs:
                </p>
                <p className="text-lg font-medium text-black">
                  {selectedRows.map((row) => row.id).join(", ")}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 bg-gray-500 p-3 mr-3 rounded-lg text-white hover:bg-gray-600"
                  onClick={() => setIsShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 bg-red-500 p-3 ml-3 rounded-lg text-white hover:bg-red-600"
                  onClick={() => handleMulDeleteRows()}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MembersData;
