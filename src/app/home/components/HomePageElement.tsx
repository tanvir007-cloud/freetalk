import { cn } from '@/lib/utils'
import React from 'react'
import LeftMenu from './LeftMenu'
import AddPost from './AddPost'
import Stories from './Stories'
import Feed from './Feed'
import RightMenu from './RightMenu'
import { User } from '@prisma/client'

const HomePageElement = ({currentUser}:{currentUser:User}) => {
  return (
    <div className={cn("flex md:pt-6 sm:pt-3 lg:gap-3")}>
    <div className="hidden lg:block w-[25.5%]">
      <LeftMenu />
    </div>
    <div className="lg:w-[44%] md:w-[60%] w-full flex justify-center">
      <div className="flex flex-col md:gap-6 sm:gap-3 gap-2 w-full">
        <AddPost
          currentUser={currentUser}
          queryKey={["posts", currentUser.id]}
        />
        <Stories currentUser={currentUser} />
        <Feed
          currentUser={currentUser}
          type="HOME"
          apiUrl={`/api/posts`}
          queryKey={["posts", currentUser.id]}
        />
      </div>
    </div>
    <div className="hidden md:block lg:w-[29%] md:w-[40%]">
      <RightMenu currentUser={currentUser} />
    </div>
  </div>
  )
}

export default HomePageElement