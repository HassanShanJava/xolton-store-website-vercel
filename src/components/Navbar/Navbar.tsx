import Image from 'next/image'
import React from 'react'


import Logo from "../../public/images/logo.png"

const Navbar = () => {
  return (
    <div className='bg-white w-full flex justify-between items-center p-4 sticky top-0 z-10'>
        <div className='ml-4 relative w-10 h-10'>
            <Image src={Logo} alt="/logo" fill/>
        </div>
        <ul className='flex justify-between items-center '>
            <li className='mx-4'>Homepage</li>
            <li className='mx-4'>Blog</li>
            <li className='mx-4'>FAQ</li>
        </ul>
        <div className='mr-4'>
            <button type="button" className=' p-3 bg-accentLinear-1 rounded-3xl text-white'>Connect Wallet</button>
        </div>
    </div>
  )
}

export default Navbar