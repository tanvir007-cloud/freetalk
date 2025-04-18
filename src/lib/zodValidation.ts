import { Comment, Like, Post, User } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signinSchema = z.object({
  name: z
    .string({ required_error: "Full name is required" })
    .min(1, "Full name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const postSchema = z.object({
  image: z.string(),
  desc: z.string(),
});

export const shareSchema = z.object({
  desc: z.string(),
});

export const commentSchema = z.object({
  comment: z.string().min(1, "Please add comment"),
});

export const infoSchema = z.object({
  city: z.string(),
  school: z.string(),
  work: z.string(),
  website: z.string(),
  dob: z.string(),
});

export type PostType = Post & {
  user: User;
  sharePost?: (Post & { user: User }) | null;
  _count: { likes: number; comments: number; sharedBy: number };
  likes: (Like & { user: { name: string } })[];
};

export type LikeType = Like & {
  user: User;
};
export type CommentType = Comment & {
  user: User;
  _count: { likes: number; replies: number };
  likes: Like[];
};

export type ReplyCommentType = Comment & {
  user: User;
  _count: { likes: number; replies: number; parentReplies: number };
  likes: Like[];
  replyTo: { user: { name: string } };
};
