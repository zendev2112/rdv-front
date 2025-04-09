import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MainFeature {
  quoteText: string;
  titleText: string;
  subheading: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  imageUrl: string;
}

interface SecondaryFeature {
  titleBold: string;
  titleRegular: string;
  imageUrl: string;
  author?: string;
}

interface EntertainmentMainFeatureProps {
  mainFeature: MainFeature;
  secondaryFeatures: SecondaryFeature[];
  adData: {
    title: string;
    description: string;
    imageUrl: string;
  };
}

export default function EntertainmentMainFeature({
  mainFeature,
  secondaryFeatures,
  adData,
}: EntertainmentMainFeatureProps) {
  return (
    <section className="container mx-auto px-4 py-6 border-t border-gray-200">
      <h2 className="text-blue-600 uppercase text-sm font-bold mb-6">ESPECTÁCULOS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Interviewee image */}
        <div>
          <div className="mb-4">
            <Image
              src={mainFeature.imageUrl}
              alt={`${mainFeature.quoteText} ${mainFeature.titleText}`}
              width={500}
              height={700}
              className="w-full object-cover"
            />
          </div>
        </div>
        
        {/* Center column - Main feature and secondary articles */}
        <div className="space-y-6">
          {/* Main feature article */}
          <article className="mb-6">
            <h3 className="text-2xl font-serif leading-tight mb-3">
              <span className="font-bold">"{mainFeature.quoteText}".</span> {mainFeature.titleText}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{mainFeature.subheading}</p>
            <div className="flex items-center">
              {mainFeature.author.avatarUrl && (
                <Image
                  src={mainFeature.author.avatarUrl}
                  alt={mainFeature.author.name}
                  width={30}
                  height={30}
                  className="w-6 h-6 rounded-full mr-2"
                />
              )}
              <span className="text-xs text-gray-500">Por {mainFeature.author.name}</span>
            </div>
          </article>
          
          {/* Secondary features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secondaryFeatures.map((feature, index) => (
              <article key={index} className="flex gap-3">
                <div className="flex-1">
                  <h4 className="text-base leading-tight mb-1">
                    <Link href="#" className="hover:text-blue-800">
                      <span className="font-bold">{feature.titleBold}.</span> {feature.titleRegular}
                    </Link>
                  </h4>
                  {feature.author && (
                    <p className="text-xs text-gray-500">Por {feature.author}</p>
                  )}
                </div>
                <div className="flex-shrink-0 w-1/3">
                  <Image
                    src={feature.imageUrl}
                    alt={`${feature.titleBold} ${feature.titleRegular}`}
                    width={100}
                    height={75}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
        
        {/* Right column - Static advertisement */}
        <div className="bg-gray-100 p-4 rounded">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg mb-2">{adData.title}</h3>
            <p className="text-sm text-gray-700 mb-4">{adData.description}</p>
          </div>
          <div className="flex justify-center mb-4">
            <Image
              src={adData.imageUrl}
              alt="Test visual"
              width={200}
              height={200}
              className="w-40 h-40 object-contain"
            />
          </div>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
              Comenzar el test
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}