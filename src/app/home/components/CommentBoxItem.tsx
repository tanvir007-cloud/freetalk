import EmojiPicker from "@/components/EmojiPicker";
import StyleTextArea from "@/components/StyleTextArea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { commentSchema as formSchema } from "@/lib/zodValidation";

const CommentBoxItem = ({
  form,
  loading,
  onSubmit,
  open,
  placeholder,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  placeholder?: string;
  open?: boolean;
  loading: boolean;
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div
      onFocus={() => setIsFocus(true)}
      className={cn(
        "flex flex-col gap-1 w-full rounded-2xl px-3 pt-1.5 dark:bg-zinc-800 bg-zinc-200/60"
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={cn(
                      !isFocus && "flex items-center justify-between"
                    )}
                  >
                    <div className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 overflow-x-hidden w-full">
                      <StyleTextArea
                        open={open}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={placeholder}
                        className="text-base"
                      />
                    </div>
                    <div className="flex items-center justify-between pb-2">
                      <EmojiPicker
                        onChange={(emoji: string) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                      />
                      <button
                        type="submit"
                        disabled={loading || !form.getValues("comment")}
                        className={cn(
                          isFocus ? "block" : "hidden",
                          "dark:disabled:text-zinc-600 disabled:text-zinc-400 transition-colors cursor-pointer"
                        )}
                      >
                        <SendHorizonal />
                      </button>
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default CommentBoxItem;
