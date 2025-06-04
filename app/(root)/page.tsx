"use client";

import { useEffect } from "react"
import { toast } from "sonner"

export default function Home() {

  useEffect(() => {
   // toast.success("Welcome to my Google Drive clone!")
  })

  return(
     <div className="flex-center h-screen">
        <h1 className='text-3xl text-brand'>my name is jinuk</h1>
     </div>
  )
}