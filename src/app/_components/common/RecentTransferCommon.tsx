import { formatFirestoreTimestamp } from '@/utils/random';
import { api } from '@/trpc/react';
import { userName } from '@/utils/random';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Timestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import FilterModal from '@/app/_components/admin/FilterModal';
import Link from 'next/link';

const RecentTransferCommon = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [rows, setRows] = useState(5)
    const [transfers, setTransfers] = useState<"global" | "user" | "burnt">("global")
    const [txns, setTxns] = useState<{
        firestoreId: string;
        amount: number;
        from: string;
        id: string;
        timestamp: Timestamp;
        to: string;
    }[]>([])

    
    const {data:session} = useSession()

    const {
        data: txn,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
      } = api.txn.getLatestTxnBurntInf.useInfiniteQuery(
        {
          limit: rows,
        },
        {
          getNextPageParam: (last) => last.lastVisible,
          getPreviousPageParam: (prev) => prev.lastVisible,
        },
      );
      const {
        data: txnsGlobal,
        fetchNextPage:fetchNextAllUsers
      } = api.txn.getLatestTxnInf.useInfiniteQuery(
        {
          limit: rows,
        },
        {
          getNextPageParam: (last) => last.lastVisible,
          getPreviousPageParam: (prev) => prev.lastVisible,
        },
      );
      const {
        data: txnsUser,
        fetchNextPage:fetchNextAllTrans
      } = api.txn.getLatestTxnInf.useInfiniteQuery(
        {
          limit: rows,
        },
        {
          getNextPageParam: (last) => last.lastVisible,
          getPreviousPageParam: (prev) => prev.lastVisible,
        },
      );
      

      useEffect(()=>{
        setTxns([])
        if(transfers == 'global'){
            setTxns(txnsGlobal?.pages[currentPage-1]?.transactions ?? [])
        }
        if(transfers == 'burnt'){
            // console.log("burnts");
            console.log(txn?.pages[currentPage-1]?.transactions.filter(txn => txn.to.toLowerCase() == '00000000' ));
            
            
            setTxns(txn?.pages[currentPage-1]?.transactions.filter(txn => txn.to.toLowerCase() == '00000000' ) ?? [])
        }
        if(transfers == 'user'){
            setTxns(txnsUser?.pages[currentPage-1]?.transactions.filter(txn => txn.to.toLowerCase() == session?.user.id || txn.from.toLowerCase() == session?.user.id) ?? [])
        }
      }, [txn, transfers, currentPage,rows])


      

      const handleNextPage = async () => {
        switch(transfers){
            case "user": await fetchNextAllTrans();
                break;
            case "global": await fetchNextAllUsers();
                break;
            case "burnt": await fetchNextPage();
                break;
        }
        
        setCurrentPage((prev) => prev + 1);
      };
    
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
  return (
    <div className='p-5 pt-0 mb-3 flex-1'>
        <div className="flex flex-col gap-4 text-white md:flex-row mt-8">
          <div className="flex max-h-[500px] mt-10 w-full flex-col items-center justify-center md:w-full">
            <div className="flex w-full  flex-row justify-between gap-12 pb-6">
              <p>Recent Transfers</p>
              <div className='flex gap-2 items-center'>
                <FilterModal />
                <Link href={"/"} className='text-md text-[#38f68f]'>
                    See All Transfers
                </Link>
              </div>
            </div>
            <div className='flex justify-start w-full gap-2'>
                <Button className={`${transfers == 'global' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white" }`} onClick={()=>{
                    setTransfers('global')
                    setCurrentPage(1)
                }}>Global Transfers</Button>
                <Button className={`${transfers == 'user' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white" }`} onClick={()=>{
                setCurrentPage(1)
                setTransfers('user')
            }}>User Transfers</Button>
                <Button className={`${transfers == 'burnt' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white" }`} onClick={()=>{
                    setTransfers('burnt')
                    setCurrentPage(1)
                }}>Burnt</Button>
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
                        {txns?.map(
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
                  
                  <div className="flex w-full items-center md:flex-row md:justify-between mb-18">
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
                        {[3,6,9].map((number) => (
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
                    <div className="mt-4 flex w-1/3 items-center justify-between">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="cursor-pointer rounded px-2 sm:px-4 sm:py-2 text-white hover:bg-gray-800"
                      >
                        &lt;
                      </button>
                      <div className="flex gap-2">
                        <button
                          className={`rounded px-4 sm:py-2 text-green-500`}
                          disabled={true}
                        >
                          {currentPage}
                        </button>
                      </div>
                      <button
                        onClick={handleNextPage}
                        className="cursor-pointer rounded px-2 sm:px-4 sm:py-2 text-white hover:bg-gray-800"
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

export default RecentTransferCommon