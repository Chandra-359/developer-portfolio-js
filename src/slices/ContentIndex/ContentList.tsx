"use client";

import React, { useRef, useState, useEffect } from "react";
import { Content } from "@prismicio/client";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import { asImageSrc, isFilled } from "@prismicio/client";
import {gsap} from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);


type ContentListProps = {
  items: Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
};

export default function ContentList({
  items,
  contentType,
  fallbackItemImage,
  viewMoreText = "Read More",
}: ContentListProps) {
  const component = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const urlPrefix = contentType === "Project" ? "/project" : "/";

  useEffect(() => {
    // Ensure items are loaded before proceeding with the animation
    if (items.length === 0) {
      return; // Exit if items are not yet available to avoid premature animation
    }
  
    // Animation logic remains the same
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        if (item) { // Ensure the item reference exists
          gsap.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 1.3,
              ease: "elastic.out(1,0.3)",
              stagger: 0.2,
              scrollTrigger: {
                trigger: item,
                start: "top bottom-=100px",
                end: "bottom center",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
      return () => ctx.revert(); // Ensure cleanup runs on component unmount or items change
    }, [items]); // Dependency array now includes items to re-run animations only if items change
  
  }, [items]); // Re-run effect only if items change
  

  return (
    <div ref={component}>
      <ul className="grid border-b border-b-slate-100">
        {items.map((item, index) => (
          <>
            {isFilled.keyText(item.data.title) && (
              <li key={index} className="list-item opacity-0f" ref = {(el)=>(itemsRef.current[index] = el)}>
                <Link
                  href={urlPrefix + "/" + item.uid}
                  className="flex flex-col justify-between border-t border-t-slate-100 py-10  text-slate-200 md:flex-row "
                  aria-label={item.data.title}
                >
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                      {item.data.title}
                    </span>
                    <div className="flex gap-3 text-yellow-400">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="text-lg font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                    {viewMoreText} <MdArrowOutward />
                  </span>
                </Link>
              </li>
            )}
          </>
        ))}
      </ul>
      {/* Hover Element */}
      {/* <div
        className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0f transition-[background] duration-300"
        style={{
          backgroundImage: currentItem !== null ? `url(${contentImages[currentItem]})` : "",
        }}
      ></div> */}
    </div>
  );
}
