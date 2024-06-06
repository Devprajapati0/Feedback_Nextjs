'use client'

import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Messages from "@/app/messages.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you have a Card component

const Homepage = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <h1 className='text-center text-2xl font-bold mb-8 md:mb-12 md:text-3xl lg:text-5xl'>Dive into the world of Anonymous Conversations</h1>
      <p className='text-lg mt-3 md:mt-4 md:text-lg'>Explore Mystery Messages - Where your identity remains a secret</p>
      <section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className=" w-full max-w-lg md:max-w-xl mt-14"
        >
          <CarouselContent>
            {Messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center" >{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className=" p-4 h-40">
                      <p className="p-4 font-serif text-lg">{message.content}</p>
                    </CardContent>
                    <p className="text-xs text-muted-foreground px-4 pb-2">
                      {message.received}
                    </p>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      <footer className="mt-24 text-center p-4 md:p-6 bg text-black">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </main>
  );
};

export default Homepage;
