import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ScanDialog from './QrScannerPopup';
import Image from 'next/image';
import PaginatedUserList from './PagedUserList';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { getAmountAfterTxnCost } from '@/utils/random';

const TransferModalUser = ({qrUserId}:{
    qrUserId:string
}) => {
    const [addNote, setAddNote] = useState("");
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

      

  return (
    <div className="flex justify-end">
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
                                                id={qrUserId}
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
                                                  qrUserId={qrUserId}
                                                  setAmount={setAmount}
                                                  setSelectedUser={setSelectedUser}
                                                />
                                              </div>
                                            </DialogDescription>
                                          </DialogHeader>
                                        </DialogContent>
                                      </Dialog>
                                </div>
  )
}

export default TransferModalUser