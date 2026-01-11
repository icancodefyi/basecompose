import React from 'react'
import { DemoHero } from '@/app/lib/components/demo-hero'

export default function Home() {
  return (
    <div className='p-4'>
      <div className='flex items-center justify-center mb-8'>
        <h1 className='text-4xl font-bold'>Layered Starter</h1>
      </div>
      
      <div className='max-w-4xl mx-auto'>
        <DemoHero />
      </div>
    </div>
  )
}
