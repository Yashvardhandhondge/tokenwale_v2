import { formatFirestoreTimestamp } from '@/utils/random';
import { api } from '@/trpc/react';
import { userName } from '@/utils/random';
import React, { useState } from 'react'

const RecentTransfer = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [rows, setRows] = useState(5)
    const {
        data: txn,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
      } = api.txn.getLatestTxnByUserIdInf.useInfiniteQuery(
        {
          limit: rows,
        },
        {
          getNextPageParam: (last) => last.lastVisible,
          getPreviousPageParam: (prev) => prev.lastVisible,
        },
      );

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
    <div className='p-5 mb-3 '>
        <div className="flex flex-col gap-4 text-white md:flex-row mt-12">
          <div className="flex max-h-[500px] mt-10 w-full flex-col items-center justify-center md:w-full">
            <div className="flex w-full  flex-row justify-between gap-12 pb-6">
              <p>Recent Transfers</p>
             
            </div>
            <div className="-m-1.5 w-full">
              <div className="inline-block min-w-full p-1.5 align-middle">
                <div className="overflow-hidden">
                  <div className="max-w-[300px] overflow-x-auto md:max-w-full max-h-[500px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-[#38F68F] text-[#A7B0AF]">
                      <thead className="">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-[16px] font-medium uppercase text-[#A7B0AF]"
                          >
                            Sender ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-[16px] font-medium uppercase text-[#A7B0AF]"
                          >
                            Receiver ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-[16px] font-medium uppercase text-[#A7B0AF]"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end text-[16px] font-medium uppercase text-[#A7B0AF]"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end text-[16px] font-medium uppercase text-[#A7B0AF]"
                          >
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {txn?.pages[currentPage - 1]?.transactions?.map(
                          (transaction, index) => (
                            <tr key={index}>
                              <td className={`whitespace-nowrap px-6 py-4 text-[16px] font-medium  ${userName(transaction.from).toLocaleLowerCase() === 'tokenwale'? 'text-[#38F68F]' : 'text-white'}`}>
                                {userName(transaction.from)}
                              </td>
                              <td className={`whitespace-nowrap px-6 py-4 text-[16px] font-medium ${userName(transaction.to).toLocaleLowerCase() === 'burnt'? 'text-red-500' : 'text-white'}`}>
                                {userName(transaction.to)}
                              </td>
                              <td className={`whitespace-nowrap px-6 py-4 text-[16px] ${userName(transaction.from).toLocaleLowerCase() === 'tokenwale'? 'text-[#38F68F]' : userName(transaction.to).toLocaleLowerCase() === 'burnt'? 'text-red-500' : 'text-white'} `}>
                                {transaction.amount}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-end text-[16px] text-white">
                                {
                                  formatFirestoreTimestamp(
                                    transaction.timestamp,
                                  )?.date
                                }
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-end text-[16px] text-white">
                                {
                                  formatFirestoreTimestamp(
                                    transaction.timestamp,
                                  )?.time
                                }
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex w-full flex-col md:flex-row md:justify-end">
                    
                    <div className="mt-4 flex w-1/3 justify-end items-center">
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
            </div>
          </div>
        </div>
    </div>
  )
}

export default RecentTransfer