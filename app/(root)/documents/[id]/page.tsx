import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
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

      const userIds = Object.keys(room.usersAccesses);
      const users  = await getClerkUsers({userIds});
      const usersData  = users.map((user:User)=>({
            ...user,
            userType : room.usersAccesses[user.email]?.includes('room:write')
            ? 'editor':'viewer'
      }))

      const CurrentUserType = room.usersAccesses[clerkuser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor':'viwer'
  return (
   <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId = {id}
        roomMetadata = {room.metadata}
        users={usersData}
        currentUserType={CurrentUserType}
      />
   </main>
  )
}

export default Document