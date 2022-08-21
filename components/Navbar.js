import React, { useEffect, useState } from 'react'
import { IoMenu, IoSquare } from 'react-icons/io5'
import { useRouter } from "next/router";
import Link from 'next/link'
import { useMoralis } from "react-moralis";

const Navbar = ({ Links, active, home }) => {
    const { logout } = useMoralis();
    const router = useRouter();
    let [open, setOpen] = useState(false);

    const { isInitialized, isAuthenticated } = useMoralis();

    const Logout = async () => {
        await logout();
        router.replace('/');
    }

    useEffect(() => {

        if(isInitialized) {
            if (!isAuthenticated) {
                
                router.replace('/');
            }
        }

    }, [isInitialized, isAuthenticated])
    

    return (
        <div className='sticky top-0 z-50 w-full shadow-md'>
            <div className='items-center justify-between py-4 bg-white md:flex md:px-10 px-7'>
                <Link href={home}>
                    <a >
                        <div className='font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-800'>
                            <span className='mr-1 text-4xl'>
                                <IoSquare />
                            </span>
                            AcademicBlock
                        </div>
                    </a>
                </Link>

                <div onClick={() => setOpen(!open)} className='absolute text-3xl cursor-pointer right-8 top-6 lg:hidden'>
                    <IoMenu />
                </div>

                <ul className={`lg:flex lg:items-center lg:pb-0 pb-12 absolute lg:static bg-white lg:z-auto z-[-1] left-0 w-full lg:w-auto lg:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-16 ' : 'top-[-490px]'}`}>
                    {
                        Links.map((link) => (
                            <li key={link.name} className='text-xl lg:ml-8 lg:my-0 my-7'>
                                <Link href={link.link}>
                                    <a className={` ${active == link.name ? 'text-cyan-500' : 'text-black-800'} duration-500 hover:bg-cyan-300 block px-3 py-2 rounded`} onClick={() => {link.name === 'SAIR' ? Logout() : undefined}} >{link.name}</a>

                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default Navbar