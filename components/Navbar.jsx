"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useState } from 'react'

const Navbar = () => {

    const [open, setOpen] = useState(false);
    
    return (
        <header>
            <div className="fixed w-full flex justify-center items-center bg-basePrimary z-[11]">

                <div className="flex justify-between items-center max-w-7xl w-full h-20 p-5">

                    {/* Logo */}
                    <Link href={"/"} onClick={() => setOpen(false)} className="flex items-center gap-5 ">
                        {/* <Image src={"/assets/images/logoTransparentWhite.png"} alt="logo" width={50} height={50} className="w-10" /> */}
                        <h2 className="text-lg md:text-xl font-bold">tutors.com.sg</h2>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center">
                        <Link href={"/"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Home</Link>
                        <Link href={"/tiktok-to-article"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Tiktok To Article</Link>
                        <Link href={"/silence"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Silencer</Link>
                        <Link href={"/splitter"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Splitter</Link>
                    </nav>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center gap-5">

                        <div onClick={() => setOpen(!open)} className="md:hidden cursor-pointer">
                            { open ? 
                                <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                :
                                <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4C2.22386 4 2 4.22386 2 4.5C2 4.77614 2.22386 5 2.5 5H12.5C12.7761 5 13 4.77614 13 4.5C13 4.22386 12.7761 4 12.5 4H2.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            }           
                        </div>

                    </div>

                </div>
            </div>

            {/* Hamburger Menu */}
            <nav className={`fixed z-[10] md:hidden flex flex-col gap-5 p-5 w-full bg-basePrimary ${ open ? "translate-y-0 top-20" : "-translate-y-full top-0"} transition-transform duration-300 ease-in-out delay-0`}>
                <Link href={"/"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Home</Link>
                <Link href={"/tiktok-to-article"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Tiktok To Article</Link>
                <Link href={"/silence"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Silencer</Link>
                <Link href={"/splitter"} onClick={() => setOpen(false)} className="hover:text-textSecondary">Splitter</Link>
            </nav>

        </header>
    )
}

export default Navbar;
