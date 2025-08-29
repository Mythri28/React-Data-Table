import React, { useState } from "react";
import data from "../data/data.json";

const DataTable = () => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Sorting
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Filtering
  const filteredData = sortedData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">📊 Data Table</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by Name..."
        className="border p-2 rounded w-full mb-4 shadow-sm focus:ring focus:ring-blue-300"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              {["id", "name", "date", "status", "amount"].map((col) => (
                <th
                  key={col}
                  onClick={() => requestSort(col)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-600"
                >
                  {col.toUpperCase()}
                  {sortConfig.key === col ? (
                    sortConfig.direction === "asc" ? " 🔼" : " 🔽"
                  ) : (
                    ""
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr
                key={row.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
              >
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.date}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    row.status === "Active"
                      ? "text-green-600"
                      : row.status === "Inactive"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {row.status}
                </td>
                <td className="px-4 py-2">₹{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
