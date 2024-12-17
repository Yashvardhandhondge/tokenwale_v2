import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { userName } from "@/utils/random";
import { useState } from "react";
import type { ChangeEvent } from "react";
import Transfer from "./Transfer";

const PaginatedUserList = ({
  userIds,
  handleSelectUser,
  handleCoinTransfer,
  getAmountAfterTxnCost,
  setAddNote,
  qrUserId,
  selectedUser,
  amount,
  setAmount,
  setSelectedUser,
}: {
  userIds: string[];
  handleSelectUser: (userId: string) => void;
  handleCoinTransfer: (
    amount: number,
    selectedUser: string,
    from: string
  ) => void;
  getAmountAfterTxnCost: (amount: number) => number;
  setAddNote: (note: string) => void;
  qrUserId: string;
  selectedUser: string;
  amount: number;
  setAmount: (amount: number) => void;
  setSelectedUser: (userId: string) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(5);

  // Calculate the indices for slicing
  const startIndex = (currentPage - 1) * rows;
  const endIndex = startIndex + rows;

  // Slice the array for the current page
  const paginatedUsers = userIds.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(userIds.length / rows);

  // Navigate to the previous page
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Navigate to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      {paginatedUsers.map((userId, index) => (
        <div
          key={index}
          className="flex w-full flex-row items-center justify-between gap-4"
        >
          <span className="mt-2 flex w-full items-center gap-2 rounded-[12px] py-3 text-start text-white">
            <p className="h-[2rem] w-[2rem] rounded-full bg-white text-[12px] md:text-[18px]"></p>
            {userName(userId)}
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="mt-4 max-w-[250px] rounded-[10px] bg-[#2DC574] py-3 text-center text-sm text-black w-[150px] md:text-md"
                onClick={() => handleSelectUser(userId)}
              >
                Transfer now
              </button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] w-full border-0 bg-[#262626ED] text-white md:w-screen md:max-w-fit">
              <DialogHeader>
                <Transfer amount={amount} setAddNote={setAddNote} setAmount={setAmount}  qrUserId={qrUserId} selectedUser={selectedUser} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ))}
      {/* Pagination Controls */}
      {/* <div className="mt-8 flex items-center justify-center gap-4">
        <button
          className="rounded bg-gray-400 px-4 py-2 text-white disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="rounded bg-gray-400 px-4 py-2 text-white disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
      <div className="flex w-full md:flex-row md:justify-between mb-18">
        <div className="flex w-full items-center gap-2 text-white px-3">
          <label>Show rows:</label>
          <select
            name="page_number"
            className="rounded-[10px] border-none bg-[#38F68F] bg-opacity-25 px-4 py-1 text-white outline-none"
            onChange={(e) => {
              setCurrentPage(1);
              setRows(e.target.value ? Number(e.target.value) : 10);
            }}
          >
            {[2, 3, 4, 5, 6].map((number) => (
              <option key={number} className="text-black" value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex w-1/3 items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="cursor-pointer rounded px-4 py-2 text-white hover:bg-gray-800"
          >
            &lt;
          </button>
          <div className="flex gap-2">
            <button
              className={`rounded px-4 py-2 text-green-500`}
              disabled={true}
            >
              {currentPage}
            </button>
          </div>
          <button
            onClick={handleNextPage}
            className="cursor-pointer rounded px-4 py-2 text-white hover:bg-gray-800"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginatedUserList;
