import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { getAmountAfterTxnCost } from "@/utils/random";
import { userName } from "@/utils/random";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

const Transfer = ({
  setAmount,
  amount,
  selectedUser,
  setAddNote,
}: {
  getAmountAfterTxnCost?:(amount: number) => number,
  setAmount: (amount: number) => void;
  qrUserId?: string;
  amount: number;
  selectedUser: string;

  setAddNote: (note: string) => void;
}) => {
  const { data: session } = useSession();
  const [wonDialogOpen, setWonDialogOpen] = useState(false)
  const { mutate: send, error } = api.txn.send.useMutation({
    onSuccess: (data) => {
      console.log("Success");
    },
  });
  const { data: transaction } = api.user.getUserDetailsByUserId.useQuery();
  const handleCoinTransfer = async (
    amount: number,
    selectedUser: string,
    from: string
  ) => {
    if (amount < 100) {
      alert("please transfer tokens more than 100");
      return;
    }
    if (from == selectedUser) {
      alert("you can't transfer tokens to yourself");
      return;
    }
    if (selectedUser) {
      // send({ to: selectedUser, amt: Number(amount), note: addNote });
      try{
        if(transaction && transaction?.balance < amount){
          alert("Insufficient Funds");
          return
        };
        send({ to: selectedUser, amt: Number(amount) });
        setWonDialogOpen(true)
      }catch(e){
        alert(e);
      }
    }
  };

  return (
    <div>
      <div className="flex max-h-[80vh]  w-full flex-col justify-center overflow-y-auto px-4 py-0 md:max-h-full md:w-[100vh] md:py-0">
        <div className=" mt-32 min-[400px]:mt-28 flex flex-row items-center justify-center gap-4 md:mt-20">
          <p className="text-[12px] uppercase text-white md:text-[20px]">
            Enter Amount :
          </p>
          <input
            minLength={3}
            placeholder="9.00"
            min={0}
            max={1_00_000_000}
            className="w-1/3 rounded-[10px] border-none bg-[#38F68F] bg-opacity-25 px-4 py-1 text-end text-[20px] text-white outline-none md:w-1/2 md:text-[24px]"
            type="number"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setAmount(Number(e.target.value));
            }}
          />
        </div>
        <div className="mt-4 flex flex-row items-center justify-center gap-4 text-white">
          <p>Transfers below 100 are not allowed.</p>
        </div>

        <div className="mt-4 sm:mt-8 flex w-full flex-col md:flex-row">
          <div className="mb-4 flex w-full flex-col items-center justify-center text-white md:mb-0 md:w-1/3">
            <div className="text-center max-sm:flex max-sm:gap-2 text-[14px] md:text-[16px]">
              <p>From</p>
              <p>{userName(session?.user.id ?? "") ?? ""}</p>
            </div>
            <div className="mb-4 mt-4 h-[2rem] w-[2rem] sm:h-[4rem] sm:w-[4rem] rounded-full bg-white md:mb-8 md:h-[6rem] md:w-[6rem]"></div>
            <div className="text-center text-[14px] md:text-[16px]">
              <p>Total Sent</p>
              <p>{amount ?? 0} Tokens</p>
            </div>
          </div>
          <div className="mb-4 flex w-full items-center justify-center text-center md:mb-0 md:w-1/3">
            <div className="flex gap-2 items-center md:block md:gap-0 text-[12px] md:text-[16px]">
              <p className="py-2 text-[14px] uppercase text-white md:text-[16px]">
                Transaction Fees
              </p>
              <p className="text-[16px] font-semibold text-[#EE1818] md:text-[18px]">
                {(amount ?? 0) - getAmountAfterTxnCost(amount ?? 0) > 0
                  ? (amount ?? 0) - getAmountAfterTxnCost(amount ?? 0)
                  : 2}{" "}
                TOKENS
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center text-white md:w-1/3">
            <div className="text-center max-sm:flex max-sm:gap-2 text-[14px] md:text-[16px]">
              <p>To</p>
              <p>{userName(selectedUser ?? "")}</p>
            </div>
            <div className="mb-4 mt-4 h-[2rem] w-[2rem] sm:h-[4rem] sm:w-[4rem] rounded-full bg-white md:mb-8 md:h-[6rem] md:w-[6rem]"></div>
            <div className="text-center text-[14px] md:text-[16px]">
              <p>Total Receivable</p>
              <p>{getAmountAfterTxnCost(amount ?? 0)} Tokens</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <input
            placeholder="Add Note"
            className="rounded-[10px] mt-3 border-none bg-[#38F68F] bg-opacity-25 px-4 py-1 text-center text-[15px] text-white outline-none md:text-[24px]"
            type="text"
            onChange={(e) => {
              setAddNote(e.target.value);
            }}
          />
          <button
            className="mt-4 w-full max-w-[300px] rounded-[10px] bg-[#38F68F] py-3 text-center text-[16px] sm:text-[24px] font-[600] text-black md:text-[26px]"
            onClick={() =>
              handleCoinTransfer(
                amount ?? 0,
                selectedUser ?? "",
                session?.user.id ?? ""
              )
            }
          >
            Transfer Now
          </button>
        </div>
      </div>
      <Dialog open={wonDialogOpen} onOpenChange={setWonDialogOpen}>
        <DialogContent className="h-[90vh] w-screen border-0 bg-[#262626ED] text-white md:w-screen md:max-w-fit">
          <DialogHeader>
            <DialogDescription className="flex h-full w-full flex-col items-center justify-center px-4 md:w-[100vh]">
              <div className="flex w-full items-center justify-center text-[40px] font-semibold text-white">
                <Image
                  width={120}
                  height={120}
                  src="/icons/correct-icon.png"
                  className=""
                  alt="img"
                />
              </div>
              <div className="mt-12 flex flex-col gap-2 w-full items-center justify-center text-[20px] lg:text-[40px] font-bold text-[#38F68F] md:mt-20">
                <p>{amount ?? 0} Tokens!</p>
                <p className="text-sm lg:text-2xl mt-2">
                  Transfered to {userName(selectedUser ?? "")} successfully.
                </p>
                <p className="text-[16px]">{new Date().toLocaleString()}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transfer;
