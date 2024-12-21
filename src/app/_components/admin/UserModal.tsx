import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Settings } from 'lucide-react'
import React, { useState } from 'react'

const UserModal = ({user}:{
    user:any
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Settings className='cursor-pointer' size={32} color='#38f68f' />
        </DialogTrigger>
        <DialogContent showOverlay={false} className='bg-[#38f68f] bg-opacity-20 backdrop-blur-md border-none w-full h-[95vh]'>
           {
            !user ? 
            <div>Load</div>:
            <UserDialogContent user={user} />
           }
        </DialogContent>
    </Dialog>
  )
}


const UserDialogContent = ({user}:{
    user:any
}) => {
    return <div>{user.fullName}</div>
}

export default UserModal