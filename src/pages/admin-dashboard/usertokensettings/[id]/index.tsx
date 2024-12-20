import BarChartMain from "@/app/_components/admin/BarChartMain";
import BarChartUser from "@/app/_components/admin/BarChartUser";
import BarChartUserMine from "@/app/_components/admin/BarChartUserMine";
import FilterModal from "@/app/_components/admin/FilterModal";
import MiningHistoryModal from "@/app/_components/common/MiningHistoryModal";
import { Navbar } from "@/app/_components/common/Navbar";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Download, InfoIcon, Loader2, XIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserTokenSettingsByIdPage = () => {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [isMiningHistory, setIsMiningHistory] = useState(false)

  const {data:userData} = api.user.getUserDetailsForUserId.useQuery({
    id: params?.id ?? "76396130"
  })

  const toggle = (set:React.Dispatch<React.SetStateAction<boolean>> ) => {
    set(prev => !prev)
  }

  useEffect(() => {
    console.log(params?.id);

    if(userData){
      setUser(userData)
    }
    // setUser({
    //   address: "jhsj",
    //   balance: 192,
    //   email: "mayankmchandratre@gmail.com",
    //   gender: "M",
    //   name: "Roronoa Zo",
    //   phone: "7843065180",
    //   role: "Admin",
    //   userId: "76396130",
    // });
  }, [params, userData]);

  if (!params || !user) {
    return (
      <div className="text-white h-screen dashboard-card-bg grid place-items-center">
        <Loader2 className="w-10 h-10 animate-spin" color="#38f68f" />
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen dashboard-card-bg">
      <Navbar />
      <div className="pt-20 min-h-screen h-screen  px-4 pb-4">
        <div className="h-full overflow-y-auto rounded-md p-4 px-6 bg-[#38f68f] bg-opacity-10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">USER DETAILS</h2>
            <Link href={"/admin-dashboard/usertokensettings"}>
              <XIcon size={32} color="#ffffff" />
            </Link>
          </div>
          <p className="text-xl">
            BALANCE:{" "}
            <span className="text-[#38f68f]">{user.balance} TOKENS</span>
          </p>

          <div>
            <div className="px-4 mt-3 grid grid-cols-3 uppercase gap-8 text-md py-2">
              <p className="flex-1 text-center p-2 bg-[#121212aa] rounded-md">
                {user.name ? user.name.split(" ")[0]: "N/A"}
              </p>
              <p className="flex-1 text-center p-2 bg-[#121212aa] rounded-md">
                {user.name ? user.name.split(" ")[user.name.split(" ").length - 1]:"N/A"}
              </p>
              <p className="flex-1 text-center p-2 bg-[#121212aa] rounded-md">
                CITY: {user.address}
              </p>
            </div>
            <div className="px-4 mt-2 grid grid-cols-3 uppercase gap-8 text-md py-2 ">
              <p className=" text-center p-2 bg-[#121212aa] rounded-md">
                {user.phone ?? "N/A"}
              </p>
              <p className="col-span-2 text-center p-2 bg-[#121212aa] rounded-md">
                {user.email ?? "N/A"}
              </p>
            </div>

            <div className="mt-12">
              <div className="my-3 flex justify-between">
                <div>
                <Button onClick={()=>{
                  toggle(setIsMiningHistory)
                }} className={`${isMiningHistory ? "bg-[#38f68f] hover:bg-[#38f68faa] text-black":"bg-transparent hover:bg-transparent text-white"} text-sm`}>Mining History</Button>
                <Button onClick={()=>{
                  toggle(setIsMiningHistory)
                }} className={`${!isMiningHistory ? "bg-[#38f68f] hover:bg-[#38f68faa] text-black":"bg-transparent hover:bg-transparent text-white"} text-sm`}>Transaction History</Button>
                </div>

                <div className="flex items-center">
                  <FilterModal />
                  <Button className="bg-[#38f68f] text-sm hover:bg-[#38f68faa] text-black">
                    <Download size={16} className="mr-2" />Export To CSV</Button>
                </div>
              </div>
              <div className="h-fit py-4">
                {
                  isMiningHistory ? <BarChartUserMine id={params.id} />: <BarChartUser  id={params.id} />
                }
              </div>
            </div>
            <div className="pl-20 mt-5">
              <MiningHistoryModal />
            </div>

            <div className="w-full flex justify-end py-3">
              <Button variant={"destructive"} className="text-sm">
                Deactivate Account
              </Button>
            </div>
            <div className="w-full py-3 mt-4">
              <p className="flex items-center gap-1 mb-2">
                <InfoIcon size={20} />
                By Clicking on Ban Account, you restrict the user from creating
                a new account from the same credentials
              </p>
              <Button variant={"destructive"}>Ban Account</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTokenSettingsByIdPage;
