import DobInput from "@/components/DobInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { infoSchema } from "@/lib/zodValidation";
import { Loader2 } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const EditInfo = ({
  openDialog,
  setOpenDialog,
  form,
  onSubmit,
}: {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<z.infer<typeof infoSchema>>;
  onSubmit: (values: z.infer<typeof infoSchema>) => Promise<void>;
}) => {
  const loading = form.formState.isSubmitting;
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="p-0 pt-6 gap-0">
        <DialogTitle className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
          Edit details
        </DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <ScrollArea className="max-h-[70vh]">
              <div className="flex flex-col gap-2 px-4 pb-3 pt-1">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <Label>City</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Dhaka,Bangladesh"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Education</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your school/college name"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="work"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Work</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your work place"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Website</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Any website link"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Date of birth</Label>
                      <FormControl>
                        <DobInput
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <div className="bg-white dark:bg-zinc-950 py-3 rounded-b-md flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 px-4">
              <h1>Update Your Information</h1>
              <div className="flex items-center gap-3">
                <Button
                  variant={"destructive"}
                  size={"sm"}
                  disabled={loading}
                  onClick={() => setOpenDialog(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button size={"sm"} disabled={loading} type="submit">
                  {loading && <Loader2 className="animate-spin" />}
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInfo;
