import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Button, ConfigProvider, Input, Space, theme} from 'antd';


const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "TalkGPT",
    description: "Power By OpenAI",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
      
        </body>
        </html>
    );
}
