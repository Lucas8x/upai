'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type MediaCarousel = {
  files: {
    id: string;
    url: string;
    blurHash?: string | null;
  }[];
  title: string;
};

export function MediaCarousel({ files, title }: MediaCarousel) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={5}
      className='h-full w-full'
    >
      {files.map((file, index) => {
        const blurData = file.blurHash
          ? `data:image/webp;base64,${file.blurHash}`
          : '';

        return (
          <SwiperSlide
            key={file.id}
            className='relative flex w-full items-center justify-center bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage: `url(${blurData})`,
            }}
          >
            <Image
              className='h-full rounded-md object-contain'
              sizes='100vw'
              fill
              src={file.url}
              alt={title}
              fetchPriority={index === 0 ? 'high' : 'low'}
              placeholder={blurData ? 'blur' : 'empty'}
              blurDataURL={blurData}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
