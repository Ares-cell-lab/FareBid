import React from 'react'
import { products } from './data/data'

const Hero = () => {
  return (
    <div className='py-10 px-10 gap-8 flex flex-row  text-black'>
   {    products.map((product) => (
      <div key={product.id} className='mb-10 border p-5 rounded-lg shadow-md bg-white'>
        <h2 className='text-3xl font-bold mb-2'>{product.title}</h2>
        <p className='text-lg'>{product.description}</p>
      </div>
    ))}
    </div>
  )
}
  


export default Hero