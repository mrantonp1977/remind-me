import { UserButton } from '@clerk/nextjs'
import React from 'react'
import Logo from './Logo'
import { ModeToggle } from './ModeToggle'

function Navbar() {
  return (
    <nav className='flex justify-between items-center w-full p-4 px-8 h-[60px]'>
      <Logo />
      <div className="flex gap-4 items-center">
      <UserButton afterSignOutUrl="/"/>
      <ModeToggle />
      </div>
    </nav>
  )
}

export default Navbar
