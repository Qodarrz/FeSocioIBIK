/* eslint-disable */
import React from 'react'
import SpotlightCard from '../fraction/SpotlightCard'
import Carousel from '../fraction/CarouselCard'
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import FullWidthCarousel from '../fraction/CarouselCard2';
import { FaUserPlus } from "react-icons/fa";

const DonateCard = ({ items, title, description, donasiId, contributors = 5000 }: { items: any[], title: string, description: string, donasiId: string, contributors?: number }) => {
  // Sample profile images - in real app, these would come from props
  const profileImages = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
  ];

  // Format number with dots for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <SpotlightCard className="custom-spotlight-card bg-primary-foreground dark:!border-none border-1 !p-5 !border-gray-200 rounded-xl" spotlightColor="rgba(158, 207, 212, 0.5)">
        
        <div style={{ height: '200px', position: 'relative' }} className='flex w-full items-center justify-center'>
            <FullWidthCarousel items={items} />
        </div>

        <div className='mt-5 title-desc'>
            <div className="mb-1 font-black text-lg text-black dark:text-white">{title}</div>
            <p className="text-sm text-gray-400">{description}</p>
        </div>

        {/* Contributors Section */}
        <div className='mt-4 flex items-center'>
          <div className='relative flex mr-3'>
            {profileImages.map((image, index) => (
              <div 
                key={index}
                className="relative"
                style={{ 
                  marginLeft: index > 0 ? '-10px' : '0',
                  zIndex: profileImages.length - index
                }}
              >
                <div className="w-8 h-8 rounded-full dark:border-gray-800 overflow-hidden bg-gray-200 flex items-center justify-center">
                  {index === profileImages.length - 1 ? (
                    <div className="w-full h-full bg-primary bg-opacity-20 flex items-center justify-center">
                      <FaUserPlus className="text-primary text-sm" />
                    </div>
                  ) : (
                    <img 
                      src={image} 
                      alt={`Contributor ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            <span className='font-semibold text-black dark:text-white'>{formatNumber(contributors)} orang</span> sudah berkontribusi
          </div>
        </div>

        <div className='w-full mt-5 flex  p-0 flex-col md:flex-row justify-between items-start text-black'>
            <div className='flex flex-col mb-5 md:mb-0  w-full md:w-auto'>
                <span className='font-bold text-lg text-primary dark:text-secondary'>Rp 20.400.000</span>
                <span className='text-sm text-gray-400 flex'>terkumpul dari <div className='hover:text-primary dark:hover:text-secondary ml-1 transition-all ease-in-out'>Rp 50.000.000</div></span>
            </div>

            <button className='bg-primary btn-border-reveal px-4 py-3 z-50 cursor-pointer text-sm rounded text-white font-semibold transition-colors flex items-center gap-2 duration-300' onClick={() => window.location.href = '/donasi/detail/' + donasiId}>Donasi <BsFillArrowUpRightCircleFill /></button>
        </div>
    </SpotlightCard>
  )
}

export default DonateCard