'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  
import { useSelf } from '@liveblocks/react/suspense'
import { useState } from 'react'
import { Button } from "./ui/button"
import Image from "next/image"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import UserTypeSelector from "./UserTypeSelector"
import { updateDocumentAccess } from "@/lib/actions/room.actions";
import Collaborator from "./Collaborator"

const ShareModal = ({roomId,collaborators,currentUserType,creatorId}:ShareDocumentDialogProps) => {
    const user = useSelf();

    const [open, setopen] = useState(false)
    const [Loading, setLoading] = useState(false);
    const [email, setemail] = useState('')
    const [userType, setuserType] = useState<UserType>('viewer')

    const shareDocumentHandler = async () => {
        setLoading(true);
    
        await updateDocumentAccess({ 
          roomId, 
          email, 
          userType: userType as UserType, 
          updatedBy: user.info,
        });
    
        setLoading(false);
      }

    return (
    <Dialog open={open} onOpenChange={setopen}>
        <DialogTrigger>
            <Button className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType!=='editor'}>
                <Image
                src="/assets/icons/share.svg"
                alt="share"
                width={20}
                height={20}
                className="min-w-4 md:size-5"
                />
                <p className="mr-1 hidden sm:block">
                    Share
                </p>
            </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog">
          <DialogHeader>
            <DialogTitle>Manage Who can View This Document</DialogTitle>
            <DialogDescription>
              Select Which user can View and Edit this Document
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor="email" className="mt-6 text-blue-100">email Address</Label>
            <div className="flex items-center gap-3">
                <div className="flex flex-1 rounded-md bg-dark-400">
                    <Input
                    id="email"
                    placeholder="Enter email Address"
                    value={email}
                    onChange={(e)=>setemail(e.target.value)}
                    className="share-input"
                    />
                    <UserTypeSelector
                    userType = {userType}
                    setUserType = {setuserType}
                    /> 
                </div>
                <Button type="submit" onClick={shareDocumentHandler} className="gradient-blue flex h-full gap-1 px-5" disabled={Loading}>
                {Loading ? 'Sending...' : 'Invite'}
          </Button>
            </div>

            <div className="my-2 space-y-2">
                <ul className="flex flex-col">
                {collaborators.map((collaborator) => (
              <Collaborator 
                key={collaborator.id}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
                </ul>

            </div>
        </DialogContent>
      </Dialog>
      
  )
}

export default ShareModal