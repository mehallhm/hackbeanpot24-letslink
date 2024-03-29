import React from "react";
import { Balsamiq_Sans } from "next/font/google";
import Link from "next/link";

const s = Balsamiq_Sans({
  display: "swap",
  weight: "400",
  subsets: ["latin"],
});

export function TopTitle() {
  return (
    <Link href="/" className="w-screen">
      <div className=" flex gap-0.5 items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 160 160"
            className="w-16 h-16"
          >
            <path d="M13.3,126.4V37.4c0-2.4,.9-4.5,2.6-6.3c1.7-1.8,3.8-2.6,6.2-2.6h8.8v-6.7c0-3.1,1.1-5.7,3.2-7.9c2.2-2.2,4.7-3.3,7.8-3.3h4.4c3,0,5.6,1.1,7.8,3.3c2.2,2.2,3.2,4.8,3.2,7.9v6.7h26.4v-6.7c0-3.1,1.1-5.7,3.2-7.9c2.2-2.2,4.7-3.3,7.8-3.3h4.4c3,0,5.6,1.1,7.8,3.3c2.2,2.2,3.2,4.8,3.2,7.9v6.7h8.8c2.4,0,4.4,.9,6.2,2.6c1.7,1.8,2.6,3.8,2.6,6.3v88.9c0,2.4-.9,4.5-2.6,6.3c-1.7,1.8-3.8,2.6-6.2,2.6H22.1c-2.4,0-4.4-.9-6.2-2.6C14.2,130.8,13.3,128.8,13.3,126.4z M22.1,126.4h96.8V55.2H22.1V126.4z M39.7,41.9c0,.6,.2,1.2,.6,1.6c.4,.4,.9,.6,1.6,.6h4.4c.6,0,1.2-.2,1.6-.6c.4-.4,.6-.9,.6-1.6v-20c0-.6-.2-1.2-.6-1.6c-.4-.4-.9-.6-1.6-.6h-4.4c-.6,0-1.2,.2-1.6,.6c-.4,.4-.6,1-.6,1.6V41.9z M92.5,41.9c0,.6,.2,1.2,.6,1.6c.4,.4,.9,.6,1.6,.6h4.4c.6,0,1.2-.2,1.6-.6c.4-.4,.6-.9,.6-1.6v-20c0-.6-.2-1.2-.6-1.6c-.4-.4-.9-.6-1.6-.6h-4.4c-.6,0-1.2,.2-1.6,.6c-.4,.4-.6,1-.6,1.6V41.9z" />
          </svg>
        </div>
        <div>
          <div className={s.className + " " + "text-3xl font-bold"}>
            Let&apos;s Link
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TopTitle;
