import React from 'react'

export default function Home() {
  return (
    <div className='p-4'>
      <div className='flex items-center justify-center mb-8'>
        <h1 className='text-4xl font-bold'>Layered Starter</h1>
      </div>
      
      <div className='max-w-4xl mx-auto'>
        <div className='text-center py-12'>
          <p className='text-gray-600 text-lg mb-6'>Your application is ready to build</p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>Frontend</h3>
              <p className='text-sm text-gray-600'>React with Next.js</p>
            </div>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>Backend</h3>
              <p className='text-sm text-gray-600'>Node.js API</p>
            </div>
            <div className='p-4 border rounded-lg'>
              <h3 className='font-semibold mb-2'>Database</h3>
              <p className='text-sm text-gray-600'>MongoDB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
