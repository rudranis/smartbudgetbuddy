
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"student" | "professional">("student");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signup(values.name, values.email, values.password, userType);
      toast.success("Account created! Welcome to SmartBudget.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">I am a:</label>
            <div className="grid grid-cols-2 gap-4">
              <Toggle
                pressed={userType === "student"}
                onPressedChange={() => setUserType("student")}
                className="flex flex-col items-center justify-center p-4 h-auto data-[state=on]:bg-primary/10 dark:data-[state=on]:bg-primary/20"
              >
                <GraduationCap className="h-6 w-6 mb-2" />
                <span>Student</span>
              </Toggle>
              
              <Toggle
                pressed={userType === "professional"}
                onPressedChange={() => setUserType("professional")}
                className="flex flex-col items-center justify-center p-4 h-auto data-[state=on]:bg-primary/10 dark:data-[state=on]:bg-primary/20"
              >
                <Briefcase className="h-6 w-6 mb-2" />
                <span>Professional</span>
              </Toggle>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
