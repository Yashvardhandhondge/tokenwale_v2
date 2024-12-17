"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import Link from 'next/link'
import ScanDialog from "./QrScannerPopup";
import { ScanQrCode } from "lucide-react";

export const Navbar = ({ toggleSidebar,handleSearch, setAddNote }: { toggleSidebar?: () => void, handleSearch?: (userId: string) => void, setAddNote?: (note:string) => void }) => {
  const { data:session, status } = useSession();
  const router = useRouter();


  const handleRulesClick = () => {
    router.push('/rules');
  };

  return (
    <nav className='flex flex-row h-[72px] w-full items-center justify-between text-white bg-black pl-2 sm:pl-4 md:pl-12 fixed z-20'>
      <div className='flex flex-row justify-center items-center gap-2'>
        
      <Link href="/">
        <Image width={50} height={50} 
          onClick={() => { router.push('/') }} 
          src="/logos/tokenwale-logo.svg" 
          alt="Tokenwale Logo" 
          className='h-8 sm:h-10 cursor-pointer hover:scale-105 transition-transform duration-200'
        />
        </Link>
        <Link href="/">
        <p 
          className='text-white text-sm sm:text-xl sm:flex hidden cursor-pointer hover:text-gray-300 transition-colors duration-200'
        >
          TOKENWALE
        </p>
        </Link>
      </div>

      <div className="flex flex-row items-center justify-center gap-2 sm:gap-8">
      {
          (status == 'authenticated' && toggleSidebar) &&
            
            <div className='flex flex-row items-center h-full bg-[#38F68F] px-4 sm:px-6 md:px-8 py-7 sm:py-6 cursor-pointer hover:bg-[#2dcf70] transition-colors duration-200'>
              <button 
                className='text-black font-semibold tracking-widest text-xs sm:text-sm md:text-base' 
                onClick={toggleSidebar}
              >
                MY WALLET
              </button>
              <Image width={50} height={50} src="/logos/arrow.svg" alt="Arrow" className='w-5 mx-2 h-4 sm:h-5' />
            </div>
        }
        <span className="flex gap-2 sm:gap-8">
          <button className="text-[0.5rem] font-semibold tracking-widest text-white sm:text-base hover:text-gray-300 transition-colors duration-200">
            REWARDS
          </button>
          <button
            className="text-[0.5rem] font-semibold tracking-widest text-white sm:text-base hover:text-gray-300 transition-colors duration-200"
            onClick={handleRulesClick}
          >
            RULES
          </button>
        </span>
        {
          (status == 'authenticated') ?
            <div className="pr-4 flex gap-2 items-center">
              <Image 
                width={50} 
                height={50} 
                src={'/icons/profile-icon.svg'} 
                alt={''} 
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => { router.push('/dashboard') }}
              />
              {handleSearch && setAddNote && <ScanDialog setAddNote={setAddNote} id={session.user.id}  handleSearch={handleSearch} scanIcon={<ScanQrCode  color='#38F68F' size={24} />} />}  
            </div> :
            <Link href="/auth/new-wallet" >
            <div className='flex flex-row items-center justify-between h-full bg-[#38F68F] px-3 sm:px-6 md:px-8 py-7 sm:py-6 cursor-pointer hover:bg-[#2dcf70] transition-colors duration-200'>
              <button 
                className='flex-1  text-black m-0 font-semibold text-[0.7rem] sm:text-sm md:text-base' 
              >
                CONNECT TO WALLET
              </button>
              <Image width={100} height={100} src="/logos/arrow.svg" alt="Arrow" className=' w-4 mx-2 h-4 sm:h-5 ' />
            </div>
            </Link>
        }
      </div>
    </nav>
  );
};
