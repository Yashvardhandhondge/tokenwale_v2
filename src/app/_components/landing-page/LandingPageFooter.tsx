import Image from "next/image";
import React from "react";

export const LandingPageFooter = () => {
  const images = [
    { src: "/backgrounds/mail.svg", alt: "Mail" },
    { src: "/backgrounds/telegram.svg", alt: "Telegram" },
    { src: "/backgrounds/discord.svg", alt: "Discord" },
    { src: "/backgrounds/twitter.svg", alt: "Twitter" },
  ];

  return (
    <section className="flex h-[70vh] w-full flex-col items-center px-4 md:px-24 bg-[#121212]">
      <div className="flex w-full justify-center sm:justify-end">
        <p className="text-[20px] max-sm:text-center uppercase text-[#38F68F] md:text-[40px] lg:text-[64px]">
          Join our community
        </p>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-8 py-16 sm:gap-16 md:flex-row md:justify-start">
        {images.map(({ src, alt }, index) => (
          <span className="box w-24 h-24 sm:h-24 sm:w-24 p-2 md:h-44 md:w-44" key={index}>
            <span
              key={index}
              className="flex w-10 h-10 sm:h-20 sm:w-20 cursor-pointer items-center justify-center bg-[#1a1b19] md:h-40 md:w-40 hover:scale-105 transition-transform duration-200"
            >
              <Image width={1000} height={1000} src={src} alt={alt} />
            </span>
          </span>
        ))}
      </div>
    </section>
  );
};
