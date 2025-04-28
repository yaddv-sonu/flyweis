'use client';
import { MdPerson, MdShoppingCart, MdStorefront, MdAttachMoney } from 'react-icons/md';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';

const data = [
  { name: '5k', Sales: 20, Profit: 30 },
  { name: '10k', Sales: 40, Profit: 35 },
  { name: '15k', Sales: 30, Profit: 45 },
  { name: '20k', Sales: 45, Profit: 25 },
  { name: '25k', Sales: 35, Profit: 35 },
  { name: '30k', Sales: 85, Profit: 40 },
  { name: '35k', Sales: 45, Profit: 45 },
  { name: '40k', Sales: 55, Profit: 40 },
  { name: '45k', Sales: 60, Profit: 55 },
  { name: '50k', Sales: 45, Profit: 65 },
  { name: '55k', Sales: 50, Profit: 45 },
  { name: '60k', Sales: 55, Profit: 75 },
];

const statsCards = [
  {
    title: 'Active Users',
    value: '40,689',
    change: '8.5% Up from yesterday',
    isIncrease: true,
    icon: MdPerson,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    changeColor: 'text-green-500'
  },
  {
    title: 'Total Buyers',
    value: '10293',
    change: '1.3% Up from past week',
    isIncrease: true,
    icon: MdShoppingCart,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    changeColor: 'text-green-500'
  },
  {
    title: 'Total Sellers',
    value: '2040',
    change: '1.8% Up from yesterday',
    isIncrease: true,
    icon: MdStorefront,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    changeColor: 'text-green-500'
  },
  {
    title: 'Total Sales',
    value: '$89,000',
    change: '4.3% Down from yesterday',
    isIncrease: false,
    icon: MdAttachMoney,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    changeColor: 'text-red-500'
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                <div className={`${card.iconBg} p-2 rounded-lg`}>
                  <card.icon className={`text-xl ${card.iconColor}`} />
                </div>
              </div>
              
              <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
              
              <div className="flex items-center gap-1 text-sm">
                {card.isIncrease ? (
                  <BsArrowUpShort className={`text-lg ${card.changeColor}`} />
                ) : (
                  <BsArrowDownShort className="text-lg text-red-500" />
                )}
                <span className={card.isIncrease ? card.changeColor : 'text-red-500'}>
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* rdses Details Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Sales Details</h2>
            <select className="text-sm border rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#23A8B0]">
              <option>October</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Sales"
                  stroke="#F97316"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="Profit"
                  stroke="#A855F7"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Revenue</h2>
            <select className="text-sm border rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#23A8B0]">
              <option>October</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenueProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Sales"
                  stroke="#F97316"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="Profit"
                  stroke="#A855F7"
                  fillOpacity={1}
                  fill="url(#colorRevenueProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
