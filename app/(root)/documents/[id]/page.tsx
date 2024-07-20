import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";


const Document = async ({params:{id}}:SearchParamProps) => {
  const clerkuser = await currentUser();
    if(!clerkuser){
   redirect("/sign-in")
    }

    const room = await getDocument({
      roomId:id,
      userId: clerkuser.emailAddresses[0].emailAddress
    })

    if(!room) redirect("/")
  return (
   <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId = {id}
        roomMetadata = {room.metadata}
      />
   </main>
  )
}

export default Document