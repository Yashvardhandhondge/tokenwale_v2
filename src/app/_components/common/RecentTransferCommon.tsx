import { formatFirestoreTimestamp, getAmountAfterTxnCost } from '@/utils/random';
import { api } from '@/trpc/react';
import { userName } from '@/utils/random';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Timestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import FilterModal from '@/app/_components/admin/FilterModal';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ScanDialog from './QrScannerPopup';
import Image from 'next/image';
import PaginatedUserList from './PagedUserList';


const RecentTransferCommon = ({qrUserId}:{
  qrUserId:string
}) => {
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


     const [addNote, setAddNote] = useState("");
     const [qrId, setQrId] = useState("")
        const [userIds, setUserIds] = useState<string[]>([]);
        const [selectedUser, setSelectedUser] = useState<string>("");
        const [amount, setAmount] = useState<number>(0);
          const { mutate, isPending } = api.user.findUserByUserId.useMutation({
            onSuccess: (data) => {
              setUserIds(data.map((e) => e));
            },
          });
        
          const handleSearch = (userId: string) => {
            if (userId.toString().length < 5) {
              setUserIds([]);
              return;
            }
            mutate({ userId });
          };
    
          const handleSelectUser = (userId: string) => {
            setSelectedUser(userId);
          };

    

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
            
            
            setTxns(txn?.pages[currentPage-1]?.transactions.filter(txn => txn.to.toLowerCase() == '00000000' ) ?? [])
          }
          if(transfers == 'user'){
            setTxns(txnsUser?.pages[currentPage-1]?.transactions ?? [])
            console.log(txn?.pages[currentPage-1]?.transactions ?? []);
          }
      }, [txn, transfers, currentPage,rows])


      useEffect(()=>{
        setQrId(qrUserId)
      },[qrUserId])


      

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
    <div className='p-5 pt-0 mb-3'>
        <div className="flex flex-col gap-4 text-white md:flex-row mt-8">
          <div className="flex max-h-[500px] mt-10 w-full flex-col items-center justify-center md:w-full">
            <div className="flex w-full  flex-row justify-between gap-12 pb-6">
              <p>Recent Transfers</p>
              <div className='flex gap-2 items-center'>
                <FilterModal />
                <Link href={"/"} className='text-[10px] sm:text-md text-[#38f68f]'>
                    See All Transfers
                </Link>
              </div>
            </div>
            <div className='flex text-[10px] sm:text-md justify-start max-w-[90vw] w-full gap-2 flex-wrap'>
                <Button className={`text-[8px] sm:text-md ${transfers == 'global' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white" }`} onClick={()=>{
                    setTransfers('global')
                    setCurrentPage(1)
                }}>Global Transfers</Button>
                <Button className={` text-[8px] sm:text-md ${transfers == 'user' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white" }`} onClick={()=>{
                setCurrentPage(1)
                setTransfers('user')
            }}>User Transfers</Button>
                <Button className={`text-[8px] sm:text-md ${transfers == 'burnt' ? "bg-[#38f28f] text-black hover:bg-[#38f68faa]":"bg-transparent text-white" }`} onClick={()=>{
                    setTransfers('burnt')
                    setCurrentPage(1)
                }}>Burnt</Button>
            </div>
            <div className="-m-1.5 w-full">
              <div className="inline-block min-w-full p-1.5 align-middle">
                <div className="overflow-hidden">
                  <div className="max-w-[90vw] overflow-x-auto md:max-w-full max-h-[500px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-[#38F68F] text-[#A7B0AF]">
                      <thead className="text-[10px] sm:text-[16px]">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start  font-medium uppercase text-[#A7B0AF]"
                          >
                            Sender ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start  font-medium uppercase text-[#A7B0AF]"
                          >
                            Receiver ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start  font-medium uppercase text-[#A7B0AF]"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end  font-medium uppercase text-[#A7B0AF]"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end  font-medium uppercase text-[#A7B0AF]"
                          >
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className='text-[12px] sm:text-[16px] '>
                        {txns?.map(
                          (transaction, index) => (
                            <tr key={index} >
                              <td className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4  font-medium  ${userName(transaction.from).toLocaleLowerCase() === 'tokenwale'? 'text-[#38F68F]' : 'text-white'}`}>
                                {userName(transaction.from)}
                              </td>
                              <td className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4  font-medium ${userName(transaction.to).toLocaleLowerCase() === 'burnt'? 'text-red-500' : 'text-white'}`}>
                                {userName(transaction.to)}
                              </td>
                              <td className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4  ${userName(transaction.from).toLocaleLowerCase() === 'tokenwale'? 'text-[#38F68F]' : userName(transaction.to).toLocaleLowerCase() === 'burnt'? 'text-red-500' : 'text-white'} `}>
                                {transaction.amount}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4 text-end text-white">
                                {
                                  formatFirestoreTimestamp(
                                    transaction.timestamp,
                                  )?.date
                                }
                              </td>
                              <td className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-4 text-end text-white">
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
                      
                  {/* transfefr now */}
                  <div className="flex justify-end mt-4">
                                    <Dialog
                                        onOpenChange={(e) => (e === false ? handleSearch("") : null)}
                                      >
                                        <DialogTrigger asChild>
                                          <Button className="bg-[#38F68F] text-black hover:bg-[#38f68fbb]">
                                            Transfer Now
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="h-[90vh] w-screen border-0 bg-[#262626ED] p-3 py-10 md:p-10 text-white md:w-screen md:max-w-fit ">
                                          <DialogHeader>
                                            <DialogTitle className="flex justify-between my-2 text-[30px] text-white md:text-[30px]">
                                              <p className="whitespace-nowrap text-base sm:text-lg md:text-xl lg:text-2xl text-center text-white">
                                                Transfer Tokens
                                              </p>
                  
                                              <ScanDialog
                                                setAddNote={setAddNote}
                                                id={qrId}
                                                handleSearch={handleSearch}
                                              />
                                            </DialogTitle>
                                            <div className="relative w-full">
                                              <input
                                                type="number"
                                                placeholder="Recent"
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="w-full my-3 border-b-[1px] border-[#38F68F] bg-[#232323] px-2 sm:px-4 py-1 sm:pr-12 text-white outline-none"
                                              />
                                              <button className="rounded-[0 12px 12px 0] absolute right-0 top-0 h-full px-4 text-black">
                                                <Image
                                                  alt=""
                                                  height={18}
                                                  width={18}
                                                  src="/icons/search-icon.svg"
                                                />
                                              </button>
                                            </div>
                                            <DialogDescription className="flex w-full flex-col justify-center px-4 md:w-[100vh] md:flex-row">
                                              <div className="flex w-full flex-col">
                                                <PaginatedUserList
                                                  userIds={userIds}
                                                  handleSelectUser={handleSelectUser}
                                                  selectedUser={selectedUser ?? ""}
                                                  amount={amount ?? 0}
                                                  getAmountAfterTxnCost={getAmountAfterTxnCost}
                                                  setAddNote={setAddNote}
                                                  qrUserId={qrId}
                                                  setAmount={setAmount}
                                                  setSelectedUser={setSelectedUser}
                                                />
                                              </div>
                                            </DialogDescription>
                                          </DialogHeader>
                                        </DialogContent>
                                      </Dialog>
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