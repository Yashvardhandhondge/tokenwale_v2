import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScanQrCode, Search } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import ScanDialog from "./QrScannerPopup";
import { getAmountAfterTxnCost } from "@/utils/random";
import PaginatedUserList from "./PagedUserList";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const MobileNav = ({
  handleSearch,
  userId,
  userIds,
  handleSelectUser,
  setAmount,
  qrUserId,
  selectedUser,
  addNote,
  handleCoinTransfer,
  amount,
  setAddNote,
  setSelectedUser,
}: {
  handleSearch: (userId: string) => void;
  userId: string;
  userIds: string[];
  handleSelectUser: (userId: string) => void;
  setAmount: (amount: number) => void;
  qrUserId: string;
  selectedUser: string | null;
  addNote: string;
  handleCoinTransfer: (
    amount: number,
    selectedUser: string,
    from: string
  ) => void;
  amount: number | null;
  setAddNote: (note: string) => void;
  setSelectedUser: (userId: string) => void;
}) => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div className="flex flex-row items-center justify-between p-4 md:p-6">
      <Image
        src="/logos/tokenwale-logo.svg"
        alt="Logo"
        width={43}
        height={43}
      />
      <div className="flex flex-row justify-end items-center gap-4 w-full md:w-auto">
      <Dialog
              onOpenChange={(e) => (e === false ? handleSearch("") : null)}
            >
              <DialogTrigger asChild>
              <Search
              onClick={() => handleSearch(userId)}
              color="white"
              size={24}
            />
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
                        handleCoinTransfer={handleCoinTransfer}
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

        <ScanDialog
          setAddNote={setAddNote}
          id={session?.user.id}
          handleSearch={handleSearch}
          scanIcon={<ScanQrCode color="white" size={24} />}
        />
      </div>
    </div>
  );
};

export default MobileNav;
