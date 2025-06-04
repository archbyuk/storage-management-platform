"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createAccount, SignInUser } from "@/lib/action/user.action"
import OtpModal from "@/components/auth/otp-modal"
import { toast } from "sonner"


type FormType = "sign-in" | "sign-up";

// Define the schema for the authentication form using Zod
const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),                                        // email validation: only valid email is accepted 
    fullName: formType === "sign-up"                                  // if type is sign-up, fullName is required
      ? z.string().min(2).max(50)
      : z.string().optional(),                                        // if type is sign-in, fullName is optional
  });
};

export default function SignInForm({ type }: { type: FormType }) {
  const [isLoading, setIsLoading] = useState(false)                  
  const [errorMessage, setErrorMessage] = useState("")           
  const [accountId, setAccountId] = useState<string | null>(null)    
  
  const formSchema = authFormSchema(type)                             // get the form schema based on the form type
  
  // Define the form using react-hook-form and zod for validation
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })
 
  // Define a submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setErrorMessage("") // reset error message before submitting

    try {
      const user = 
        type === 'sign-up' 
          ? await createAccount({ 
            fullName: values.fullName || "",  
            email: values.email 
          })
          
          // if form type is sign-in, call SignInUser function
          : await SignInUser({ email: values.email})
      
      setAccountId(user?.accountId ?? null);
      console.log("User account ID:", user?.accountId);

      if (type === "sign-in" && !user?.accountId) {
       return toast.error("Account not found. Please sign up first.") // if account not found, show error message
      }
    }
    
    catch {
      setErrorMessage("Failed to create account. Please try again.") // set error message if account creation fails
    }
    
    finally {
      setIsLoading(false)
    }
  
  };
  
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          
          {/* text within a form title follows the form type */}
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          
          {/* if form type is sign-up, Full Name input form & Email input form */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full name</FormLabel>
                    <FormControl>
                      <Input 
                        className="shad-input" 
                        placeholder="Enter your full name" 
                        {...field} 
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="shad-form-message"/>
                </FormItem>
              )}
            /> 
          )}

          {/* if form type is sign-in, only Email input form */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  
                  <FormControl>
                    <Input 
                      className="shad-input" 
                      placeholder="Enter your Email" 
                      {...field} 
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message"/>
              </FormItem>
            )}
          />
          
          {/* submit button: text within button follows the form type */}
          <Button type="submit" className="shad-submit-btn py-6" disabled={isLoading}>
            {type === "sign-in" ? "Sign In" : "Sign Up"}

            {isLoading && (
              <Image 
                src="/assets/icons/loader.svg"
                alt="Loading..."
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          
          {/* */}
          {errorMessage && (
            <p className="error-message">*{errorMessage}</p> 
          )}

          {/*  */}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in" 
                ? "Don't have an account?" : "Already have an account?"}
            </p>

            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {" "}
              {type === "sign-in" ? "Sign Up" : "Login"}
            </Link>
          </div>
        
        </form>
      </Form>
      
      {/* OTP Validation */}
      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  )
};
