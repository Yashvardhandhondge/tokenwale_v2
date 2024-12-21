"use client";

import { Navbar } from "@/app/_components/common/Navbar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Line, LineChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect, ChangeEvent, ChangeEventHandler } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/router";
import { api } from "@/trpc/react";
import {
  userName,
  formatFirestoreTimestamp,
  getAmountAfterTxnCost,
} from "@/utils/random";
import Confetti from "confetti-react";
import { ProfileSidebar } from "@/app/_components/dashboard/ProfileSidebar";
import QRCodeGenerator from "@/app/_components/dashboard/QRgenerator";
import useLocalStorage from "@/hooks/storage/localStorage";
import QRCode from "qrcode.react";
import ScanDialog from "@/app/_components/common/QrScannerPopup";
import { CarouselAds } from "@/app/_components/dashboard/CarousalAds";
import { useSwipeable } from "react-swipeable";
import { TooltipProps } from "recharts";
import MobileNav from "@/app/_components/common/MobileNav";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TokensCount from "@/app/_components/common/TokensCount";
import PaginatedUserList from "@/app/_components/common/PagedUserList";
import MiningHistoryModal from "@/app/_components/common/MiningHistoryModal";
import { XIcon } from "lucide-react";
import RecentTransfer from "@/app/_components/admin/RecentTransfer";
import RecentTransferCommon from "@/app/_components/common/RecentTransferCommon";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TokenChartTooltipContent(props: TooltipProps<any, any>) {
  const { payload, label } = props;
  if (!payload || payload.length === 0) return null;

  const data = payload[0]?.payload;
  return (
    <div className="rounded border bg-white p-2 shadow">
      <p className="text-sm font-medium">{`Date: ${data.date}`}</p>
      <p className="text-sm font-medium">{`Tokens: ${data.token}`}</p>
    </div>
  );
}

const chartConfig = {
  token: {
    label: "token",
    color: "hsl(var(--chart-1))",
  },
};

// const [searchParam,setSearchParam]=useState<string>()
interface UserDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
}
export default function Dashboard() {
  const { data: session, status } = useSession();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const router = useRouter();
  const { data: user } = api.user.getUserDetailsByUserId.useQuery();
  const { data: remainingToken } = api.global.getRemainingToken.useQuery();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userId] = useLocalStorage<string>("userId", "");
  const [qrUserId, setQrUserId] = useState<string>("12345");
  const [wonDialogOpen, setWonDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [redeemCode, setRedeemCode] = useState<string>("");
  const [codeRedeemValue, setCodeRedeemValue] = useState<number>(0);
  const [codeRedeemPopup, setCodeRedeemPopup] = useState(false);
  const [profileProgress, setProfileProgress] = useState<number>(0);
  const [addNote, setAddNote] = useState("");
  const [rows, setRows] = useState(3);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false)
  const { data: userDetails } = api.user.getUserDetailsByUserId.useQuery();
  useEffect(() => {
    if (router.isReady) {
      if (status === "unauthenticated") {
        void router.push("/auth/login");
      }
    }
  }, [router, status]);

  useEffect(() => {
    console.log("userDetails", userDetails);

    if (userDetails) {
      const fields: (keyof UserDetails)[] = [
        "name",
        "email",
        "phone",
        "address",
        "gender",
      ];
      const completedFields = fields.filter(
        (field) =>
          userDetails[field] !== null && userDetails[field] !== undefined
      );
      const progress = (completedFields.length / fields.length) * 100;
      setProfileProgress(progress);
    }
  }, [userDetails]);

  const { mutate, isPending } = api.user.findUserByUserId.useMutation({
    onSuccess: (data) => {
      setUserIds(data.map((e) => e));
    },
  });
  const { data: allTxn } = api.txn.getLatestTxnByUserId.useQuery({ limit: 10 });
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
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTimestamp = (timestamp: any) => {
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
    );
    return date.toLocaleString();
  };
  const { data: graph } = api.txn.getTxnGraphByUserId.useQuery();
  const chartData = graph?.map((value, index) => ({
    name: index + 1,
    token: typeof value === "string" ? parseInt(value) : value.amount,
    date: formatTimestamp(value.timestamp),
  }));

  console.log(chartData);

  const { mutate: send } = api.txn.send.useMutation({
    onSuccess: (data) => {
      setShowConfetti(true);
      setWonDialogOpen(true);
    },
  });
  const { mutate: redeemPromoCode } = api.global.promocode.useMutation({
    onSuccess: (data) => {
      console.log(data.value);
      setCodeRedeemValue(data.value);
      setCodeRedeemPopup(true);
    },
  });

  const handleNextPage = async () => {
    await fetchNextPage();
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageNumberClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };



  // const userIds = ['#USER3107L2106', '#USER3107L2107', '#USER3107L2108'];
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  const handleSpinWheel = () => {
    void router.push("/wheel-spinner");
  };
  const handleScratchCard = () => {
    void router.push("/scratch-card");
  };

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

  const handleCoinTransfer = (
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
      send({ to: selectedUser, amt: Number(amount) });
    }
  };

  useEffect(() => {
    setQrUserId(userId);
    setUserIds([]);
  }, []);
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showConfetti]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth / 1.85);
      setScreenHeight(window.innerHeight);
    };

    // Initial setup
    setScreenWidth(window.innerWidth / 1.85);
    setScreenHeight(window.innerHeight);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(qrUserId)
      .then(() => {
        console.log("logs");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const numbers = Array.from({ length: 4 }, (_, i) => (i + 1) * 3);

  const handleRedeemCode = () => {
    redeemPromoCode({ code: redeemCode });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSlideChange((activeSlide + 1) % 2),
    onSwipedRight: () => handleSlideChange((activeSlide - 1 + 2) % 2),
    // preventDefaultTouchmoveEvent: true,

    // trackMouse: true,
  });

  if (screenWidth < 500) {
    return (
      <>
        <MobileNav
          handleSearch={handleSearch}
          userId={userId}
          userIds={[...userIds]}
          handleSelectUser={handleSelectUser}
          setAmount={setAmount}
          qrUserId={qrUserId}
          selectedUser={selectedUser}
          addNote={addNote}
          handleCoinTransfer={handleCoinTransfer}
          amount={amount}
          setAddNote={setAddNote}
          setSelectedUser={setSelectedUser}
        />
        <div className="flex flex-col gap-8 p-4 mb-16">
          <CarouselAds />
          <div className="grid grid-cols-2 gap-4">
            <div className="dashboard-card-bg flex h-[150px] w-full flex-col justify-between rounded-xl border-[1px] border-[#2D2D2D] p-4 md:w-2/5 overflow-hidden">
              <p className="mb-2 text-xs sm:text-md sm:mb-4  text-white">
                Available tokens
              </p>
              <p className="text-[24px] sm:text-[30px] md:text-[36px] text-[#38F68F] font-bold overflow-hidden">
                {user?.balance.toLocaleString() ?? "999999999"}
              </p>
            </div>

            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <div className="dashboard-card-bg flex h-[150px] w-full flex-col rounded-xl border-[1px] border-[#2D2D2D] p-4 md:w-3/5">
                    <div className="flex justify-between">
                      <p className=" mb-2 text-xs sm:text-md sm:mb-4 text-white">
                        Mining History
                      </p>
                    </div>
                    <Card
                      style={{ backgroundColor: "transparent", border: "none" }}
                    >
                      <CardContent>
                        <ChartContainer
                          config={chartConfig}
                          style={{ height: "100px", width: "100%" }}
                        >
                          <LineChart
                            data={chartData}
                            style={{ height: "100%" }}
                          >
                            <ChartTooltip
                              cursor={false}
                              content={<TokenChartTooltipContent />}
                            />
                            <Line
                              dataKey="token"
                              type="linear"
                              stroke="var(--color-token)"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
          <TokensCount
            burnt={remainingToken?.burnt ?? 0}
            remainingToken={remainingToken?.remainingToken ?? 0}
          />
        </div>
        <div className="flex flex-col gap-4 mb-40  text-white md:flex-row">
          {/* Recent code here */}
          <RecentTransferCommon qrUserId={qrUserId} />
          {/* <div>
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
          </div> */}

          <div className="fixed bottom-0 w-full bg-black">
            <div className="flex w-full gap-1 justify-center">
              <Link
                href="/wheel-spinner"
                className="bg-gray-800 text-[#2DC574] text-[12px] text-center flex-1 sm:w-[200px] md:w-[250px] lg:w-[300px] m-2 py-5 rounded-xl"
              >
                Spin The Wheel
              </Link>

              <Link
                href="/scratch-card"
                className="bg-gray-800 text-[#2DC574] text-[12px] text-center flex-1 sm:w-[200px] md:w-[250px] lg:w-[300px] m-2 py-5 rounded-xl"
              >
                Scratch the Card
              </Link>
            </div>

            <Dialog
              onOpenChange={(e) => (e === false ? handleSearch("") : null)}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#38F68F] rounded-full w-14 h-14 min-[500px]:w-16 min-[500px]:h-16  absolute -top-6 min-[500px]:-top-5 left-[50%] translate-x-[-50%]">
                  <Image
                    width={32}
                    height={32}
                    src="/icons/exchange-icon.svg"
                    alt="exchange"
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className="h-[90vh] w-screen border-0 dashboard-card-bg p-3 py-10 md:p-10 text-white md:w-screen md:max-w-fit ">
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
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} handleSearch={handleSearch} />
      <div
        className={`flex flex-col gap-8 p-10 pt-24 ${
          isSidebarOpen ? "blur-md" : ""
        }`}
      >
        <div className="flex flex-col gap-8 text-white md:flex-row">
          <div className="dashboard-card-bg flex h-[210px] w-full items-center justify-center rounded-xl border-[1px] border-[#2D2D2D] text-[50px] md:w-2/3">
            <CarouselAds />
          </div>
          <div className="dashboard-card-bg flex h-[210px] w-full flex-col items-start justify-start gap-4 rounded-xl border-[1px] border-[#2D2D2D] p-8 md:w-1/3">
            <div className="flex items-center justify-center gap-2 text-[20px]">
              <Image
                width={50}
                height={50}
                src={"/icons/profile-icon.svg"}
                alt={""}
                className="cursor-pointer transition-transform duration-200 hover:scale-105 md:mr-4"
                onClick={toggleSidebar}
              />
              <p className="uppercase">{userName(qrUserId)}</p>
              <Image
                width={16}
                className="cursor-pointer"
                height={16}
                src="/icons/copy-icon.svg"
                alt=""
                onClick={copyToClipboard}
              />
            </div>
            <div>
              <p className="mb-4 text-[14px] text-[#38F68F]">
                Complete your profile & earn tokens!
              </p>
              <div className="flex w-full items-center justify-center gap-4">
                <div className="h-1.5 w-full rounded-full bg-gray-200">
                  <div
                    style={{ width: `${profileProgress}%` }}
                    className="h-1.5 rounded-full bg-[#38F68F]"
                  ></div>
                </div>
                <p>{profileProgress}%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 text-white md:flex-row">
          <div className="flex h-full w-full flex-col items-center justify-center gap-8 rounded-xl md:w-2/3 md:flex-row">
            <div className="dashboard-card-bg flex h-[210px] w-full flex-col justify-between rounded-xl border-[1px] border-[#2D2D2D] p-8 md:w-2/5">
              <div className="overflow-hidden text-ellipsis">
                <p className="text-[16px]">Available tokens</p>
                <p className="text-[40px] text-[#38F68F] md:text-[44px] max-w-full truncate ">
                  {user?.balance.toLocaleString() ?? "0"}
                </p>
              </div>

              <Dialog open={redeemModalOpen} onOpenChange={setRedeemModalOpen}>
                <DialogTrigger asChild>
                  <button className="flex w-60 items-center justify-center gap-2 rounded-[10px] bg-[#38F68F] px-4 py-2 text-[12px] text-black md:w-40 md:text-[14px] lg:w-60">
                    <Image
                      width={18}
                      height={18}
                      src="/icons/black-generate-icon.svg"
                      alt=""
                      className="cursor-pointer"
                    />
                    <p>Redeem Your Code</p>
                    <Image
                      width={18}
                      height={18}
                      src="/icons/black-generate-icon.svg"
                      alt=""
                      className="cursor-pointer"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="[&>button]:hidden h-[70vh] p-0 border-0 bg-transparent text-white md:w-screen md:max-w-fit overflow-hidden">
                
                  <div className="relative w-full h-[70vh] top-0 left-0 rounded-b-[50px] rounded-tr-[50px] dashboard-card-bg bg-opacity-30 backdrop-blur-lg overflow-hidden">
                    <DialogTitle className="z-50 text-wrap px-9 mt-8 flex w-full items-center justify-center text-center text-[20px] text-white md:mt-28 md:text-[36px]">
                    <div className="absolute top-8 right-10 w-full flex justify-end">
                <Button variant={"ghost"} className="hover:bg-transparent hover:text-[#fff]" onClick={()=>{setRedeemModalOpen(false)}}><XIcon size={24} /></Button>
                </div>
                      Get extra tokens by using your premium promocode
                    </DialogTitle>
                    <Image
                      width={121}
                      height={127}
                      src="/backgrounds/redeem-bg.png"
                      alt=""
                      className="absolute -z-40 top-0 left-0 cursor-pointer"
                    />
                    <DialogDescription className=" absolute left-[50%] -translate-x-[50%] mt-8 flex h-full w-full items-start justify-center px-4 md:w-[100vh]">
                      <div className="item-center relative flex w-full md:w-3/4 justify-center text-[12px]  md:text-[16px]">
                        <input
                          onChange={(e) => {
                            setRedeemCode(e.target.value);
                          }}
                          className="focus-none w-full rounded-[10px] bg-[#2EC173] bg-opacity-[0.3] p-2 text-[#D8D8D8] outline-none md:p-3"
                          placeholder="Enter Promo Code"
                        />
                        <button
                          onClick={handleRedeemCode}
                          className="absolute right-0 -ml-4 rounded-[10px] bg-[#38F68F] px-6 py-2 font-semibold text-black md:py-3"
                        >
                          Apply Now
                        </button>
                      </div>
                    </DialogDescription>
                    <Image
                      width={150}
                      height={200}
                      src="/backgrounds/redeem-bg2.png"
                      alt=""
                      className="absolute bottom-0 right-0 -z-40 cursor-pointer"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="dashboard-card-bg flex h-[210px] w-full flex-col rounded-xl border-[1px] border-[#2D2D2D] p-8 md:w-3/5">
              <div className="flex justify-between mb-4">
                <p className="">Mining History</p>
                <MiningHistoryModal  />
              </div>
              <Card style={{ backgroundColor: "transparent", border: "none" }}>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    style={{ height: "100px", width: "100%" }}
                  >
                    <LineChart data={chartData} style={{ height: "100%" }}>
                      <ChartTooltip
                        cursor={false}
                        content={<TokenChartTooltipContent />}
                      />
                      <Line
                        dataKey="token"
                        type="linear"
                        stroke="var(--color-token)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="dashboard-card-bg flex h-[210px] w-full flex-col items-center rounded-xl border-[1px] border-[#2D2D2D] p-8 md:w-1/3">
            {/* <p>Your QR Code</p>
            {qrUserId && (
              <Image
                src={`https://qrcode.tec-it.com/API/QRCode?data=${qrUserId}&color=000000&istransparent=false&size=small&quietzone=1&dpi=300`}
                alt="qrcode"
                width={153}
                height={153}
              />
            )} */}
            <TokensCount
              burnt={remainingToken?.burnt ?? 0}
              remainingToken={remainingToken?.remainingToken ?? 0}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 text-white md:flex-row mt-4">
          {/* recent transfer */}
          <div className="flex-1 flex flex-col">
            <RecentTransferCommon qrUserId={qrUserId} />
          
          </div>
          <div
            {...handlers}
            className="dashboard-card-bg relative flex h-[500px] w-full flex-col items-center justify-center rounded-xl border-[1px] border-[#2D2D2D] md:w-1/3"
          >
            <div className="flex px-5 bottom-32 justify-between w-full absolute z-30">
              <button
                className="w-10 h-10 bg-black opacity-80 rounded-full"
                onClick={() => {
                  handleSlideChange(0);
                }}
              >
                &larr;
              </button>
              <button
                className="w-10 h-10 bg-black opacity-80 rounded-full"
                onClick={() => {
                  handleSlideChange(1);
                }}
              >
                &rarr;
              </button>
            </div>
            {activeSlide === 0 && (
              <Image
                width={240}
                height={240}
                src="/backgrounds/dashboard-spinner-card-bg.png"
                className="absolute left-0 top-0"
                alt="img"
              />
            )}
            {activeSlide === 1 && (
              <Image
                width={240}
                height={240}
                src="/backgrounds/scratch-card.png"
                className="mt-8 w-6/12 md:w-1/2"
                alt="card"
              />
            )}
            <div className="relative z-10 flex h-full flex-col items-center justify-end gap-4 pb-10">
              {activeSlide === 0 && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-[18px] text-[#38F68F]">EARN TOKENS</p>
                  <button
                    className="rounded-[10px] bg-[#38F68F] px-4 py-2 text-black"
                    onClick={handleSpinWheel}
                  >
                    Spin the Wheel
                  </button>
                </div>
              )}
              {activeSlide === 1 && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-[18px] text-[#38F68F]">WIN MORE TOKENS</p>
                  <button
                    className="rounded-[10px] bg-[#38F68F] px-4 py-2 text-black"
                    onClick={handleScratchCard}
                  >
                    Scratch & Win
                  </button>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <span
                  className={`h-3 w-3 cursor-pointer rounded-full ${
                    activeSlide === 0 ? "bg-[#38F68F]" : "bg-gray-400"
                  }`}
                  onClick={() => handleSlideChange(0)}
                ></span>
                <span
                  className={`h-3 w-3 cursor-pointer rounded-full ${
                    activeSlide === 1 ? "bg-[#38F68F]" : "bg-gray-400"
                  }`}
                  onClick={() => handleSlideChange(1)}
                ></span>
              </div>
            </div>
          </div>
        </div>
        <Dialog open={codeRedeemPopup} onOpenChange={setCodeRedeemPopup}>
          <DialogContent className="h-[60vh] border-0 bg-[#262626ED] md:w-screen md:max-w-fit">
            <DialogTitle className="z-40 mt-8 flex w-full items-center justify-center text-center text-[20px] text-white md:mt-16 md:text-[36px]">
              Got {codeRedeemValue} extra tokens by using your premium promocode
            </DialogTitle>
            <Image
              width={121}
              height={127}
              src="/backgrounds/redeem-bg.png"
              alt=""
              className="absolute z-10 cursor-pointer"
            />
            <Image
              width={150}
              height={200}
              src="/backgrounds/redeem-bg2.png"
              alt=""
              className="absolute bottom-0 right-0 z-10 cursor-pointer"
            />
          </DialogContent>
        </Dialog>
      </div>
      <ProfileSidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />
    </>
  );
}
