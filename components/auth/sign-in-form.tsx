"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"

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
import { useState } from "react"
import Link from "next/link"
import { createAccount } from "@/lib/action/user.action"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

type FormType = "sign-in" | "sign-up";

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
  const [errorMessage, setErrorMessage] = useState('')           
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
    setErrorMessage('')

    try {
      const user = await createAccount(
        { 
          fullName: values.fullName || "",  
          email: values.email 
        }
      );
      setAccountId(user.accountId ?? null); 
    }
    
    catch {
      setErrorMessage("Error creating account")
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
          {type === "sign-up" && 
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
          }

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
    </>
  )
};
