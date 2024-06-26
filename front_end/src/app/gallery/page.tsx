"use client";

import React, { useEffect, useState } from "react";
import GalleryImageHolder from "../components/ui/GalleryImageHolder";
import { supabase } from "@/app/utils/supabase/supabase";
import { AuroraBackground } from "../components/ui/aurora_background";
import FileUpload from "../components/ui/FileUpload";
import BackButton from "../components/back_button";

interface ImageInfo {
  imageUrl: string;
  title: string;
  subtitle: string;
  key: string;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const eventName =
    typeof window !== "undefined" ? localStorage.getItem("eventName") : null;

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase.storage
        .from("SnapSync Photos")
        .list(`${eventName}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("Error fetching images:", error);
        return;
      }

      if (data) {
        const urls = await Promise.all(
          data.map(async (file, index) => {
            const { data: response } = await supabase.storage
              .from("SnapSync Photos")
              .getPublicUrl(`${eventName}/${file.name}`);

            return {
              imageUrl: response.publicUrl, // Correctly access the publicUrl directly
              title: file.name,
              subtitle: "From Supabase",
              key: `${file.name}-${index}`,
            };
          })
        );

        // Filter out any null values (in case of errors)
        setImages(urls.filter((url): url is ImageInfo => url !== null));
      }
    }

    fetchImages();
  }, [refreshFlag]);

  const triggerRefresh = () => {
    setRefreshFlag(!refreshFlag); // Toggle refreshFlag to trigger useEffect
  };

  return (
    <div className="bg-black">
      <section className="text-gray-600 body-font">
        <AuroraBackground className=" bg-slate-800">
          <BackButton />
          <div className="object-contain px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className=" title-font mb-3 text-white font-bold z-50 text-6xl">
                SnapSync
              </h1>
              <h2 className="text-slate-200 font-light">Event : {eventName} </h2>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-white z-50"></p>
              <div className="z-100">
                <FileUpload onUpload={triggerRefresh} />
              </div>
            </div>
            <div className="flex flex-wrap -m-4">
              {images.map((img) => (
                <GalleryImageHolder
                  key={img.key}
                  imageUrl={img.imageUrl}
                  title={img.title}
                  subtitle={img.subtitle}
                />
              ))}
            </div>
          </div>
        </AuroraBackground>
      </section>
    </div>
  );
}
