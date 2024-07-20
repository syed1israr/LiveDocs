'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators'
import { Input } from './ui/input'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'


const CollaborativeRoom = ({roomMetadata,roomId}:CollaborativeRoomProps) => {

  const currentUserType = 'editor'
  const [editing, setediting] = useState(false)
  const [loading, setloading] = useState(false)
  const [documentTitle, setdocumentTitle] = useState(roomMetadata.title)
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const updateTitleHander = async (e:React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === 'Enter'){
          setloading(true)
          try {
            if(documentTitle!== roomMetadata.title){
            const updatedDocument = await updateDocument(roomId,documentTitle)

              if(updatedDocument){
                setediting(false);
              }
            }
          } catch (error) {
            console.log(error)
          }
          setloading(false)
        }
  }
  useEffect(()=>{
    const handleClickOutside = (e:MouseEvent) =>{
      if(containerRef.current && !containerRef.current.contains(e.target as Node)){
        setediting(false);
        updateDocument(roomId,documentTitle)
      }
    }

    document.addEventListener('mousedown',handleClickOutside)

    return ()=>{
      document.removeEventListener('mousedown',handleClickOutside)
    }
  },[documentTitle,roomId])

  useEffect(()=>{
    if(editing && inputRef.current){
      inputRef.current.focus();
    }
  },[editing])
  return (
    <RoomProvider id={roomId}>
    <ClientSideSuspense fallback={<div>Loading…</div>}>
      <div className='collaborative-room'>
      <Header>
      <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
        {editing && !loading ?
        (
          <Input
          type='text'
          value={documentTitle}
          ref={inputRef}
          placeholder='Enter Title'
          onChange={(e)=>setdocumentTitle(e.target.value)}
          onKeyDown={updateTitleHander}
          disabled={!editing}
          className='document-title-input'
          />
        ):
        (
          <>
          <p className='document-title'>{documentTitle}</p>
          </>
        )}
        {currentUserType === 'editor' && !editing && (
          <Image
            src="/assets/icons/edit.svg"
            alt='edit'
            width={24}
            height={24}
            onClick={()=>setediting(true)}
            className='pointer'
          />
        )}

        {currentUserType !== 'editor' && !editing && (
          <p className='view-only-tag'>View Only</p>
        )}

        {loading && <p className='text-gray-400 text-sm'>Saving...</p>}
      </div>
      <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
        <ActiveCollaborators/>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </Header>
     <Editor/>    
      </div>
    </ClientSideSuspense>
  </RoomProvider>
  )
}

export default CollaborativeRoom