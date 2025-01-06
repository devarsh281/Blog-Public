import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const URL=import.meta.env.VITE_API_URL||'http://localhost:8085';

export async function disAPI (url:string,method:string="GET",body?:any){
  const response=await fetch(`${URL}/${url}`,{
    method,
    body,
    headers:{
      'Content-Type':"application/json"
    }
  })

  if(!response.ok){
    throw new Error("Something Went wrong")
  }
  return response.json();
}