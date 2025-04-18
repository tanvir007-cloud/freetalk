import Trim from "@/components/Trim";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { PostType } from "@/lib/zodValidation";
import { User } from "@prisma/client";
import { Download, Ellipsis, LockKeyhole, Trash } from "lucide-react";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { RiShareForwardFill } from "react-icons/ri";
import { FaComment } from "react-icons/fa6";
import DialogLikes from "./DialogLikes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DownloadImage from "@/components/DownloadImage";
import RemovePost from "./RemovePost";
import PostDesign from "./PostDesign";
import PostAvatar from "@/components/PostAvatar";

const PostMainPart = ({
  currentUser,
  post,
  open,
  setOpen,
  likeCount,
  isYouLike,
  shareCount,
  commentCount,
}: {
  currentUser: User | null;
  post: PostType;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  isYouLike: boolean;
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  let isPostAuther = false;
  if (currentUser) isPostAuther = currentUser.id === post.userId;
  return (
    <Fragment>
      <div className="flex items-center justify-between px-4 pt-4">
        <PostAvatar post={post} />
        {(isPostAuther || post.image || post.profileImage) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-hidden">
              <Ellipsis className="dark:text-zinc-400 dark:hover:text-white transition text-zinc-700 hover:text-black" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {isPostAuther && (
                <div onClick={() => setOpenRemove(true)}>
                  <DropdownMenuItem>
                    <Trash />
                    Remove
                  </DropdownMenuItem>
                </div>
              )}
              {(post.image || post.profileImage) && (
                <div onClick={() => setOpenDropdown(true)}>
                  <DropdownMenuItem>
                    <Download />
                    Download
                  </DropdownMenuItem>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <RemovePost
          currentUserId={currentUser?.id}
          openRemove={openRemove}
          setOpenRemove={setOpenRemove}
          isPostAuther={isPostAuther}
          postId={post.id}
        />

        {post.postType === "PROFILE" && post.profileImage ? (
          <DownloadImage
            openDropdown={openDropdown}
            imageUrl={post.profileImage}
            setOpenDropdown={setOpenDropdown}
          />
        ) : (
          post.image && (
            <DownloadImage
              openDropdown={openDropdown}
              imageUrl={post.image}
              setOpenDropdown={setOpenDropdown}
            />
          )
        )}
      </div>
      {post.sharePost && post.desc && (
        <div className="px-4 mt-1">
          <Trim
            text={post.desc}
            className="text-base text-zinc-800 dark:text-zinc-300"
            length={400}
          />
        </div>
      )}
      {post.sharePost ? (
        <div className="px-4 pt-1">
          <div
            className={cn(
              "border dark:border-zinc-800 border-zinc-200 rounded-xl pt-2 flex flex-col gap-y-1.5",
              post.sharePost.deletePost &&
                "px-3 pb-3 rounded-none dark:border-zinc-950"
            )}
          >
            {post.sharePost.deletePost ? (
              <div className="flex items-center gap-x-3">
                <LockKeyhole size={50} />
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold">
                    This content isn&apos;t available right now
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    When this happens, it&apos;s usually because the owner only
                    shared it with a small group of people, changed who can see
                    it or it&apos;s been deleted.
                  </p>
                </div>
              </div>
            ) : (
              <Fragment>
                <PostAvatar post={post.sharePost} type="SHAREPOST" />
                <div className="flex flex-col">
                  <PostDesign post={post.sharePost} type="SHAREPOST" />
                </div>
              </Fragment>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-1">
          <PostDesign post={post} />
        </div>
      )}
      <div className="flex flex-col gap-1 px-4 mt-1 ">
        <div
          className={cn(
            "flex items-center mb-2",
            commentCount === 0 &&
              likeCount === 0 &&
              shareCount === 0 &&
              "hidden",
            likeCount === 0 ? "justify-end" : "justify-between"
          )}
        >
          <DialogLikes
            isYouLike={isYouLike}
            count={likeCount}
            post={post}
            currentUser={currentUser}
          />
          <div className={cn("flex items-center gap-3")}>
            <div
              className={cn(
                "flex items-center gap-1 relative cursor-pointer",
                commentCount === 0 && "hidden"
              )}
              onClick={() =>
                open === false && setOpen !== undefined && setOpen(true)
              }
            >
              <FaComment className="text-[22px] dark:text-zinc-400 text-zinc-600" />
              <span className="dark:text-zinc-400 relative -bottom-[1px] text-zinc-600 hover:underline transition px-1">
                {formatNumber(commentCount)}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center relative pointer-events-none",
                shareCount === 0 && "hidden"
              )}
            >
              <RiShareForwardFill className="text-2xl dark:text-zinc-400 text-zinc-600" />
              <span className="dark:text-zinc-400 relative -bottom-[2px] text-zinc-600  transition px-1">
                {formatNumber(shareCount)}
              </span>
            </div>
          </div>
        </div>
        {commentCount === 0 &&
        likeCount === 0 &&
        shareCount === 0 &&
        (post.image || post.sharePost) ? null : (
          <Separator />
        )}
      </div>
    </Fragment>
  );
};

export default PostMainPart;
