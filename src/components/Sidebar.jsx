'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdDashboard, MdArticle, MdDirectionsCar, MdLocationOn, MdHelp } from 'react-icons/md';
import { FaBlog, FaBriefcase, FaGlobe, FaQuestion, FaStore, MdKeyboardArrowDown } from 'react-icons/fa';
import { BiNews } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsBuildingsFill } from 'react-icons/bs';
import { FiPrinter } from 'react-icons/fi';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { HiChevronDown } from 'react-icons/hi';
import { RiProductHuntLine } from 'react-icons/ri';
import { IoShieldCheckmark } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';

const menuItems = [
  { title: 'Dashboard', icon: MdDashboard, path: '/' },
  { title: 'Article', icon: MdArticle, path: '/article' },
  { title: 'Auto dealership', icon: MdDirectionsCar, path: '/autodealership' },
  { title: 'Blog', icon: FaBlog, path: '/blog', hasSubmenu: true },
  { title: 'Career', icon: FaBriefcase, path: '/career', hasSubmenu: true },
  { title: 'Country, state, city', icon: FaGlobe, path: '/location' },
  { title: "FAQ's", icon: FaQuestion, path: '/faqs' },
  { title: 'Free shop news', icon: BiNews, path: '/news', hasSubmenu: true },
  { title: 'Help Center', icon: MdHelp, path: '/help', hasSubmenu: true },
  { title: 'How it works', icon: IoSettingsOutline, path: '/how-it-works', hasSubmenu: true },
  { title: 'Jobs', icon: BsBuildingsFill, path: '/jobs', hasSubmenu: true },
  { title: 'Press', icon: FiPrinter, path: '/press', hasSubmenu: true },
  { title: 'Product', icon: RiProductHuntLine, path: '/product', hasSubmenu: true },
  { title: 'Privacy & Terms', icon: AiFillSafetyCertificate, path: '/privacy-terms' },
  { title: 'Trust & safety', icon: IoShieldCheckmark, path: '/trust-safety', hasSubmenu: true },
];

const blogSubmenu = [
  { title: 'Blog Category', path: '/blog/category' },
  { title: 'Blog Page', path: '/blog/blogPage' },
  { title: 'Blog', path: '/blog' },
];

const careerSubmenu = [
  { title: 'Career', path: '/career' },
  { title: 'Career Openings', path: '/career/openings' },
  { title: 'Career Opening Category', path: '/career/opening-category' },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const getActiveItem = () => {
    const found = menuItems.find(item => {
      if (item.hasSubmenu) {
        if (item.title === 'Blog') {
          return blogSubmenu.some(sub => sub.path === pathname);
        }
        if (item.title === 'Career') {
          return careerSubmenu.some(sub => sub.path === pathname);
        }
      }
      return item.path === pathname;
    });
    return found ? found.title : 'Dashboard';
  };
  const [activeItem, setActiveItem] = useState(getActiveItem());

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [pathname]);

  const handleMenuClick = (item) => {
    if (item.hasSubmenu) {
      setOpenSubmenu(openSubmenu === item.title ? null : item.title);
      setActiveItem(item.title);
    } else {
      setActiveItem(item.title);
      setOpenSubmenu(null);
      router.push(item.path);
    }
  };

  const handleSubmenuClick = (sub, parent) => {
    setActiveItem(parent);
    setOpenSubmenu(parent);
    router.push(sub.path);
  };

  return (
    <div className={`h-screen bg-white shadow-lg transition-all duration-300 ${
      expanded ? 'w-64' : 'w-20'
    }`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-2xl">🛍️</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isBlog = item.title === 'Blog';
          const isCareer = item.title === 'Career';
          return (
            <div key={item.title}>
              <div
                className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors group cursor-pointer
                  ${activeItem === item.title
                    ? 'bg-[#23A8B0] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => handleMenuClick(item)}
              >
                <Icon className="text-xl mr-4" />
                {expanded && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.hasSubmenu && (
                      <HiChevronDown 
                        className={`text-sm transition-transform duration-200 
                          ${activeItem === item.title ? 'text-white' : 'text-gray-400'}
                          group-hover:text-gray-600 ${openSubmenu === item.title ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>
                )}
              </div>
              {/* Blog Submenu */}
              {isBlog && openSubmenu === 'Blog' && expanded && (
                <div className="ml-10 mb-2">
                  {blogSubmenu.map((sub) => (
                    <div
                      key={sub.title}
                      onClick={() => handleSubmenuClick(sub, 'Blog')}
                      className={`block py-1 text-sm cursor-pointer transition-colors
                        ${pathname === sub.path ? 'text-teal-600 font-semibold' : 'text-gray-400 hover:text-teal-600'}`}
                    >
                      {sub.title}
                    </div>
                  ))}
                </div>
              )}
              {/* Career Submenu */}
              {isCareer && openSubmenu === 'Career' && expanded && (
                <div className="ml-10 mb-2">
                  {careerSubmenu.map((sub) => (
                    <div
                      key={sub.title}
                      onClick={() => handleSubmenuClick(sub, 'Career')}
                      className={`block py-1 text-sm cursor-pointer transition-colors
                        ${pathname === sub.path ? 'text-teal-600 font-semibold' : 'text-gray-400 hover:text-teal-600'}`}
                    >
                      {sub.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 