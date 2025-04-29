import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col h-full relative">
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-r from-[#E86F55] to-[#D84936] overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 320" className="w-full">
                  <path fill="#f8fafc" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
            </div>
            <div className="sticky top-0 z-10">
              <Header />
            </div>
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
              <main className="p-8">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
