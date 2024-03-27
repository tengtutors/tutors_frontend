"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import { poppins } from "@/styles/fonts";

const Navbar = () => {

    const [open, setOpen] = useState(false);
    
    return (
        <nav className={`${poppins.className} fixed p-5 w-full flex flex-col gap-5 bg-basePrimary text-textPrimary drop-shadow-md border-b border-b-basePrimaryHover z-[1] items-center`}>
            
            <div className="flex w-full justify-between items-center max-w-7xl">

                {/* Logo */}
                <Link href={"/"} onClick={() => setOpen(false)} className="flex items-center gap-5 ">
                    <h2 className="text-xl md:text-2xl font-bold">TIKTOK TO ARTICLE</h2>
                </Link>

                {/* Desktop Navigation */}
                <nav className="md:flex gap-8 items-center hidden">

                    <Link href={"/"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Home</Link>
                    {/* <Link href={"/create"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Create</Link>
                    <Link href={"/manage"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Manage</Link>
                    <Link href={"/transfer"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Transfer</Link> */}

                </nav>

                {/* Mobile Hamburger */}
                <div className="flex items-center gap-5 md:hidden">

                    <div onClick={() => setOpen(!open)} className="md:hidden cursor-pointer text-textPrimary ">
                        { open ? 
                            <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            :
                            <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4C2.22386 4 2 4.22386 2 4.5C2 4.77614 2.22386 5 2.5 5H12.5C12.7761 5 13 4.77614 13 4.5C13 4.22386 12.7761 4 12.5 4H2.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        }           
                    </div>

                </div>

            </div>

            {/* Hamburger Menu */}
            { open && 
                <nav className="flex flex-col gap-5 p-2 md:hidden self-start w-full">
                    <Link href={"/"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Home</Link>
                    {/* <Link href={"/create"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Create</Link>
                    <Link href={"/manage"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Manage</Link>
                    <Link href={"/transfer"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Transfer</Link> */}
                </nav>
            }
            
        </nav>
    )
}

export default Navbar;
