import { Carousel, CarouselItem } from '@/components/ui/carousel'
import React from 'react'

const ChartCarousal = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Carousel>
            {children}
        </Carousel>
    </div>
  )
}

export default ChartCarousal