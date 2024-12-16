import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import QrScanner from "@/app/_components/common/QrScanner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ScanDialog = ({
  handleSearch,
  scanIcon,
  id
}: {
  handleSearch: (userId: string) => void;
  scanIcon?: React.ReactNode;
  id?: string
}) => {
  
  const [open, setOpen] = useState(false);
  const [myQr, setMyQr] = useState(false)
  const handleScan = (data: string | null) => {
    if (data) {
      handleSearch(data);
      console.log("QR Code Result:", data); // Log to console
      setOpen(false);
    }
  };
  return (
    <Dialog defaultOpen={open} open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <button className={`h-10 rounded-[10px] border text-white px-4 py-2 text-[14px] focus:outline-none ${scanIcon ? 'flex items-center gap-2 border-none' : 'border-[#38F68F] w-[200px]'}`}>
        {scanIcon ? scanIcon : "Scan QR Code"}
        </button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] w-screen border-0 bg-[#262626ED] md:w-screen md:max-w-fit text-white">
        <DialogTitle className="mb-4 text-2xl font-bold">
          QR Code Scanner
        </DialogTitle>
        {
          myQr ?
            (
              <Image
                src={`https://qrcode.tec-it.com/API/QRCode?data=${id}&color=000000&istransparent=false&size=small&quietzone=1&dpi=300`}
                alt="qrcode"
                width={153}
                height={153}
                className="w-full aspect-square p-5"
              />
            ): <QrScanner onScan={handleScan} />
        }
        <Button className="bg-[#2d2d2d] rouned-xl text-[#38f68f]" onClick={()=>{
          setMyQr(!myQr)
        }}>{myQr ? "Scan QR":"My QR Code"}</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ScanDialog;
