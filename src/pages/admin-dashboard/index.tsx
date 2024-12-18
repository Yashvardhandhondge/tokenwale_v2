import { Navbar } from '@/app/_components/common/Navbar'
import React from 'react'
import "../../styles/globals.css"
import { BadgePercent, Ban, CreditCard, Settings, User } from 'lucide-react'
import Link from 'next/link'
import RecentTransfer from '@/app/_components/admin/RecentTransfer'
import BarChartMain from '@/app/_components/admin/BarChartMain'

const quickLinks = [
    {
        name: "Generate & Send",
        url:"/sendtoken",
        icon: CreditCard
    },
    {
        name: "Banned Accounts",
        url: "/bannedaccounts",
        icon: Ban
    },
    {
        name: "Token Settings",
        url:"/tokensettings",
        icon: Settings
    },
    {
        name: "User Token Settings",
        url:"/usertokensettings",
        icon: User
    },
    {
        name: "Generate a promocode",
        url:"/generatepromocode",
        icon: BadgePercent
    },
    
]


const AdminDashboard = () => {
  return (
    <div className='bg-gradient-to-br from-[#38f68e67] via-[] to-[#2d2d2d]'>
         <Navbar setAddNote={(text)=>console.log(text)
         } toggleSidebar={()=>{
            console.log("Print");
            
         }} handleSearch={(userId) => {console.log(userId);
         }} />
         <div className='pt-20'>
            <div className='grid grid-cols-3 p-3'>
                <div className='dashboard-card-bg p-3 text-white rounded-xl backdrop-blur-xl col-span-2'>
                    <BarChartMain />
                </div>
                <div className='p-3'>
                    <h3 className='text-white text-3xl mb-4'>Quick Links</h3>
                    <div className='grid grid-cols-3 gap-2'>
                        {
                            quickLinks.map((link, index)=>{
                                return (
                                    <Link key={index} href={link.url}>
                                        <div className='p-4 flex flex-col items-center gap-2'>
                                        <link.icon color='#38f68e' size={32} />
                                            <p className=' text-white text-center'>
                                            {link.name}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
            <div>
                <RecentTransfer />
            </div>
         </div>
    </div>
  )
}

export default AdminDashboard