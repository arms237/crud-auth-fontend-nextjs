import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <div className='flex justify-between items-center px-6 py-2'>
      <h1 className='text-4xl font-bold italic'>Football</h1>
      <div>
        <ul className=' flex gap-4 font-semibold'>
            <li><Link href='/players'>players</Link></li>
            <li><Link href='/positions'>Positions</Link></li>
            <li><Link href='/teams'>Teams</Link></li>
        </ul>
      </div>
      <div className='flex gap-x-4'>
        <button className='btn btn-outline btn-secondary'>S'inscrire</button>
        <button className='btn btn-secondary'>Se connecter</button>
      </div>
    </div>
  )
}
