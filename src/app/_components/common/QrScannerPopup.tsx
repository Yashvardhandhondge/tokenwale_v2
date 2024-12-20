import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import QrScannerComponent from "@/app/_components/common/QrScanner";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import Transfer from "./Transfer";
import Image from "next/image";
import { QrCodeIcon, ScanLineIcon, Upload } from "lucide-react";

const ScanDialog = ({
  handleSearch,
  scanIcon,
  id,
  setAddNote,
}: {
  handleSearch: (userId: string) => void;
  scanIcon?: React.ReactNode;
  id?: string;
  setAddNote: (note: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [myQr, setMyQr] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState("");
  const [amounts, setAmounts] = useState(0);

  const handleFileUpload = async (file: File) => {
    try {
      const result = await QrScanner.scanImage(file);
      handleScan(result);
    } catch (error) {
      alert("No QR Detected in Image")
      console.error("Error scanning image from gallery:", error);
      handleScan(null);
    }
  };

  const handleScan = (data: string | null) => {
    if (data) {
      handleSearch(data);
      setSelectedUsers(data);
      console.log("QR Code Result:", data);
      setIsScanned(true); // Log to console
      // setOpen(false);
    }
  };
  return (
    <>
      <Dialog defaultOpen={open} open={open} onOpenChange={(e) => setOpen(e)}>
        <DialogTrigger asChild>
          <button
            className={`
    h-10 rounded-lg border  text-white px-4 py-2 text-sm 
    focus:outline-none 
    ${
      scanIcon
        ? "flex items-center gap-2 border-none"
        : "border-[#38F68F] max-sm:text-[0.7rem] w-[100px] sm:w-[140px] md:w-auto"
    }
  `}
          >
            {scanIcon ? scanIcon : "Scan QR Code"}
          </button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] w-screen border-0 bg-[#262626ED] md:w-screen md:max-w-fit text-white">
          <DialogTitle className="mb-4 text-2xl font-bold">
            QR Code Scanner
          </DialogTitle>
          {myQr ? (
            <Image
              src={`https://qrcode.tec-it.com/API/QRCode?data=${id}&color=000000&istransparent=false&size=small&quietzone=1&dpi=300`}
              alt="qrcode"
              width={153}
              height={153}
              className="w-full aspect-square p-5"
            />
          ) : (
            <QrScannerComponent onScan={handleScan} />
          )}
          <div className="w-full flex justify-evenly">
          <Button
            className="bg-[#cfcfcf99] rounded-full w-10 h-10 p-2 hover:bg-[#cfcfcf77]"
            onClick={() => {
              setMyQr(!myQr);
            }}
          >
            {!myQr ? <QrCodeIcon size={32} color="#ffffff" />:<ScanLineIcon size={32} color="#ffffff" />}
          </Button>
          <div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="bg-[#cfcfcf99] rounded-full w-10 h-10 flex items-center justify-center p-2 cursor-pointer hover:bg-[#cfcfcf77]"
            >
              <Upload size={24} color="#ffffff" />
            </label>
          </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        defaultOpen={isScanned}
        open={isScanned}
        onOpenChange={(e) => setIsScanned(e)}
      >
        <DialogContent className="h-[90vh] w-full border-0 bg-[#262626ED] text-white md:w-screen md:max-w-fit">
          <DialogHeader>
            <Transfer
              amount={amounts}
              setAddNote={setAddNote}
              setAmount={setAmounts}
              selectedUser={selectedUsers}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanDialog;
