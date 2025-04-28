'use client';
import { IoSearchOutline, IoNotificationsOutline } from 'react-icons/io5';
import { IoMdNotifications } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';

const Header = () => {
  return (
    <header className="bg-white h-16 px-6 flex items-center justify-between border-b">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#23A8B0] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative">
          <IoMdNotifications className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">Sonu Kumar</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <CgProfile className="text-2xl text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 