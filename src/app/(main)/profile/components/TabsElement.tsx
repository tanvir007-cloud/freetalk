import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaCaretDown } from "react-icons/fa";
import Feed from "../../(home)/components/Feed";
import UserInfoCard from "./UserInfoCard";
import UserMediaCard from "./UserMediaCard";
import AddPost from "../../(home)/components/AddPost";
import UserFriendCard from "./UserFriendCard";
import { User } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import AllPhotos from "../[profileId]/components/AllPhotos";
import LockProfile from "./LockProfile";
import AllMyFriends from "./AllMyFriends";

const TabsElement = ({
  isCurrentUserProfile,
  currentUser,
  profileUser,
}: {
  currentUser: User;
  isCurrentUserProfile: boolean;
  profileUser: User;
}) => {
  return (
    <Tabs defaultValue="posts" className="w-full flex flex-col items-center">
      <div className="w-full dark:bg-zinc-900 bg-white flex justify-center shadow-md pb-1">
        <div className="max-w-5xl w-full flex items-center justify-between md:px-7 px-4">
          <TabsList className="flex items-center justify-start gap-2 dark:bg-zinc-900 bg-white">
            <TabsTrigger
              value="posts"
              className="text-base data-[state=active]:bg-zinc-200"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              className="text-base data-[state=active]:bg-zinc-200"
              value="about"
            >
              About
            </TabsTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger className="mx-2 flex items-start gap-1 sm:hidden">
                More <FaCaretDown className="mt-[2px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="p-0">
                    <TabsTrigger
                      className="text-base data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-800 w-full justify-start"
                      value="friends"
                    >
                      Friends
                    </TabsTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <TabsTrigger
                      className="text-base data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-800 w-full justify-start"
                      value="photos"
                    >
                      Photos
                    </TabsTrigger>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TabsTrigger
              className="text-base data-[state=active]:bg-zinc-200 hidden sm:block"
              value="friends"
            >
              Friends
            </TabsTrigger>
            <TabsTrigger
              className="text-base data-[state=active]:bg-zinc-200 hidden sm:block"
              value="photos"
            >
              Photos
            </TabsTrigger>
          </TabsList>
          {isCurrentUserProfile && (
            <LockProfile
              profileUser={profileUser}
              isCurrentUserProfile={isCurrentUserProfile}
            />
          )}
        </div>
      </div>
      <TabsContent
        value="posts"
        className="w-full max-w-5xl lg:px-7 md:my-6 sm:my-3 my-2"
      >
        <div className="flex md:gap-6 sm:gap-3 gap-2 lg:flex-row flex-col lg:justify-center lg:items-start items-center">
          <div
            className={`lg:max-w-[22rem] w-full max-w-2xl lg:sticky lg:top-16`}
          >
            <ScrollArea className="flex flex-col lg:max-h-[calc(100vh-10.5vh)]">
              <div className={`flex flex-col md:gap-6 sm:gap-3 gap-2`}>
                <UserInfoCard
                  profileUser={profileUser}
                  isCurrentUserProfile={isCurrentUserProfile}
                />
                <UserMediaCard userId={profileUser.id} />
                <UserFriendCard userId={profileUser.id} />
              </div>
            </ScrollArea>
          </div>

          <div className="flex flex-col md:gap-6 sm:gap-3 gap-2 w-full max-w-2xl">
            {isCurrentUserProfile && (
              <AddPost
                currentUser={currentUser}
                type="PROFILE"
                queryKey={["myPosts", profileUser.id]}
              />
            )}
            <Feed
              currentUser={currentUser}
              apiUrl={`/api/myPosts`}
              queryKey={["myPosts", profileUser.id]}
              paramKey="userId"
              paramValue={profileUser.id}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="about"
        className="w-full max-w-5xl md:px-7 my-2 md:my-6 sm:my-3"
      >
        <div className="flex flex-col md:gap-6 sm:gap-3 gap-2">
          <UserInfoCard
            type="ABOUT"
            profileUser={profileUser}
            isCurrentUserProfile={isCurrentUserProfile}
          />
          <AllMyFriends
            profileUserId={profileUser.id}
            isCurrentUserProfile={isCurrentUserProfile}
          />
        </div>
      </TabsContent>
      <TabsContent value="friends" className="w-full max-w-5xl md:px-7 my-2 md:my-6 sm:my-3">
        <AllMyFriends
          profileUserId={profileUser.id}
          isCurrentUserProfile={isCurrentUserProfile}
        />
      </TabsContent>
      <TabsContent
        value="photos"
        className="w-full max-w-5xl md:px-7 my-2 md:my-6 sm:my-3"
      >
        <AllPhotos userProfile={profileUser} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsElement;
