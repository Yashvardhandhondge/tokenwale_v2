import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { formatFirestoreTimestamp, userName } from "@/utils/random";
import React, { useEffect, useState } from "react";
import FilterModal from "../admin/FilterModal";
import { Button } from "@/components/ui/button";
import { Cross, XIcon } from "lucide-react";

const numbers = [3,6,9]

const MiningHistoryModal = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(3)
  const [dateFilter, setDateFilter] = useState<Date[] | null>(null)
  const [toShowTransactions, setToShowTransactions] = useState<any[]>([])
  const [open, setIsOpen] = useState(false)
//   const [timeFilter, setDateFilter] = useState<Date | null>(null)

  const {
    data: txn,
    fetchNextPage,
    hasNextPage,
    hasPreviousPage,
  } = api.txn.getLatestMineTxnByUserIdInf.useInfiniteQuery(
    {
      limit: rows,
    },
    {
      getNextPageParam: (last) => last.lastVisible,
      getPreviousPageParam: (prev) => prev.lastVisible,
    }
  );

  useEffect(()=>{
    if(dateFilter){
        const newTxns = txn?.pages[currentPage-1]?.transactions.filter(txn => {
            const formatedDate = formatFirestoreTimestamp(txn.timestamp)?.date
            if(!formatedDate) return false
            const dateFilterArray = dateFilter.map(date => {
                return new Date(date).toLocaleDateString('en-GB', { day: "2-digit", month: "2-digit", year: "2-digit" });
              })
            
            return dateFilterArray.includes(formatedDate)
        })
        setToShowTransactions(newTxns ?? [])
    }else{
        setToShowTransactions(txn?.pages[currentPage-1]?.transactions ?? [])
    }

  },[txn, currentPage, dateFilter])

  const handleNextPage = async () => {
    await fetchNextPage();
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>
        <button className="mb-4 text-[#38F68F]">See all</button>
      </DialogTrigger>
      <DialogContent  className="[&>button]:hidden h-[90vh] border-0 bg-transparent text-white md:w-screen md:max-w-fit ">
        <DialogHeader className="md:px-16 md:pt-2 md:pb-16 rounded-[50px] border border-gray-600 dashboard-card-bg bg-opacity-30 backdrop-blur-lg ">
          <DialogTitle className="mb-4 relative flex justify-between text-[16px] text-white md:text-[24px] pt-12">
            <div className="absolute top-0 -right-10 w-full flex justify-end">
              <Button variant={"ghost"} className="hover:bg-transparent hover:text-[#fff]" onClick={()=>{setIsOpen(false)}}><XIcon size={16} /></Button>
            </div>
            Mining History
            <FilterModal setDateFilter={setDateFilter} />
          </DialogTitle>
          <DialogDescription className="flex h-full w-full flex-col justify-center px-4 md:w-[100vh]">
            
            <div className="flex w-full flex-row items-center justify-center border-b-[1px] border-[#38F68F] mb-2">
              <div className="flex w-1/2 flex-col items-center justify-center">
                <p className="mb-4 text-[14px] font-bold text-[#7E7E8B] md:text-[16px]">
                  Tokens Mined
                </p>
              </div>
              <div className="flex w-1/2 flex-col items-center justify-center">
                <p className="mb-4 text-[14px] font-bold text-[#7E7E8B] md:text-[16px]">
                  Task
                </p>
              </div>
              <div className="flex w-1/2 flex-col items-center justify-center">
                <p className="mb-4 text-[14px] font-bold text-[#7E7E8B] md:text-[16px]">
                  Date & Time
                </p>
              </div>
            </div>
            <div className="flex-1 max-h-full flex flex-col justify-between">
              
              <div className="flex-1 max-h-[20rem] overflow-y-auto">
              {toShowTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex w-full flex-row items-center justify-center gap-4"
                >
                  <div className="tems-center w-1/2 justify-center">
                    <p className="mt-4 w-full rounded-[12px] py-3 text-center text-[12px] text-white md:text-[16px]">
                      {transaction.amount}
                    </p>
                  </div>
                  <div className="tems-center w-1/2 justify-center">
                    <p className="mt-4 w-full rounded-[12px] py-3 text-center text-[12px] text-white md:text-[16px]">
                      {transaction.task ? `${transaction.task != 'TRANSFER' ? transaction.task:`From ${userName(transaction.from)}`}`:`From ${userName(transaction.from)}`}
                    </p>
                  </div>
                  <div className="w-1/2 items-center justify-center">
                    <p className="mt-4 w-full rounded-[12px] py-3 text-center text-[12px] text-white md:text-[16px]">
                      {/* {transaction.time} */}
                      {formatFirestoreTimestamp(transaction.timestamp)?.date ??
                        "N/A"}{" "}
                        {formatFirestoreTimestamp(transaction.timestamp)?.time ??
                        "N/A"}{" UTC"}
                    </p>
                  </div>
                  
                </div>
              ))}
              </div>


              <div className="flex items-center">
              <div className="flex w-full items-center gap-2 text-white px-3">
                      <label className="text-[12px] sm:text-md">Show rows:</label>
                      <select
                        name="page_number"
                        className="rounded-[10px] text-[12px] sm:text-md border-none bg-[#38F68F] bg-opacity-25 px-2 sm:px-4 py-1 text-white outline-none"
                        onChange={(e) => {
                          setCurrentPage(1);
                          setRows(e.target.value ? Number(e.target.value) : 10);
                        }}
                      >
                        {numbers.map((number) => (
                          <option
                            key={number}
                            className="text-black text-[0.6rem] sm:text-md"
                            value={number}
                          >
                            {number}
                          </option>
                        ))}
                      </select>
                    </div>


                 <div className="flex w-full flex-col md:flex-row md:justify-end">
                    
                    <div className=" flex w-1/3 justify-end items-center">
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
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default MiningHistoryModal;
