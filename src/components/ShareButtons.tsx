import { Facebook, LinkIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { FaWhatsapp, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const ShareButtons = ({
  postUrl,
  setOpen,
}: {
  postUrl: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex gap-4 items-center mb-5 flex-wrap">
      <FacebookShareButton
        onClick={() => setOpen(false)}
        url={postUrl}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="dark:bg-zinc-800 dark:group-hover:bg-zinc-800/90 bg-zinc-200 group-hover:bg-zinc-300 rounded-full size-12 flex items-center justify-center transition cursor-pointer">
          <Facebook className="text-3xl" />
        </div>
        <h1 className="font-thin text-sm">WhatsApp</h1>
      </FacebookShareButton>
      <WhatsappShareButton
        onClick={() => setOpen(false)}
        url={postUrl}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="dark:bg-zinc-800 dark:group-hover:bg-zinc-800/90 bg-zinc-200 group-hover:bg-zinc-300 rounded-full size-12 flex items-center justify-center transition cursor-pointer">
          <FaWhatsapp className="text-3xl" />
        </div>
        <h1 className="font-thin text-sm">WhatsApp</h1>
      </WhatsappShareButton>
      <LinkedinShareButton
        onClick={() => setOpen(false)}
        url={postUrl}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="dark:bg-zinc-800 dark:group-hover:bg-zinc-800/90 bg-zinc-200 group-hover:bg-zinc-300 rounded-full size-12 flex items-center justify-center transition cursor-pointer">
          <FaLinkedin className="text-3xl" />
        </div>
        <h1 className="font-thin text-sm">Linkdin</h1>
      </LinkedinShareButton>
      <TwitterShareButton
        onClick={() => setOpen(false)}
        url={postUrl}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="dark:bg-zinc-800 dark:group-hover:bg-zinc-800/90 bg-zinc-200 group-hover:bg-zinc-300 rounded-full size-12 flex items-center justify-center transition cursor-pointer">
          <FaXTwitter className="text-3xl" />
        </div>
        <h1 className="font-thin text-sm">Twitter</h1>
      </TwitterShareButton>
      <div
        className="flex flex-col items-center gap-1 group cursor-pointer"
        onClick={async () => {
          await navigator.clipboard.writeText(postUrl);
          setOpen(false);
          toast.success("Link copied");
        }}
      >
        <button className="dark:bg-zinc-800 dark:group-hover:bg-zinc-800/90 bg-zinc-200 group-hover:bg-zinc-300 rounded-full size-12 flex items-center justify-center transition cursor-pointer">
          <LinkIcon />
        </button>
        <h1 className="font-thin text-sm">Copy link</h1>
      </div>
    </div>
  );
};

export default ShareButtons;
