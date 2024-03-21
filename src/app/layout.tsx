import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";
import React, {Suspense} from "react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "题材库-定力数影",
    description: "查看最新题材库排行榜！",
    icons: null,
    openGraph: {
        title: '题材库-定力数影',
        images: ['/previewImg.png'],
    },
    // viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover",
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    viewportFit: 'cover',
    userScalable: false,
    // userScalable: false,
    // Also supported by less commonly used
    // interactiveWidget: 'resizes-visual',
}

// @ts-ignore
// dynamic(() => import("amfe-flexible"), {
//     ssr: false,
// });

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ fontSize: "37.5px" }}>
        <body className={inter.className}>
        <Suspense>
            {children}
        </Suspense>
        <Script
            type="text/javascript"
            src="/amfe-flexible.js"
            strategy="beforeInteractive"
        />
        </body>
        </html>
    );
}
