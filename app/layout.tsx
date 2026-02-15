import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import SidebarToggle from "@/app/components/SidebarToggle";
import {SessionListProvider} from '@/app/util/SessionContext';
import {ConfigProvider} from '@/app/util/ConfigContext';


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
        <body className='flex'>
        <ConfigProvider>
            <SessionListProvider>
                <SidebarToggle></SidebarToggle>
                {children}
            </SessionListProvider>
        </ConfigProvider>
        </body>
        </html>
    );
}
