// src/app/page.tsx
'use client';

import ClocksPage from '@/components/ClocksPageMiniForMobile/ClocksPageMiniForMobile';

const Home = () => {
  return (
    <main className="p-4 bg-[#333863] min-h-screen">
      <h1 className="text-white text-3xl mb-4">تاریخ امروز</h1>
      <div className="relative bg-[#51546C] rounded-lg p-4 flex items-center overflow-hidden ">
        {/* Background Pattern */}
        <div className="bg-pattern">
          <div className="w-[150px] h-[150px] custom-border"></div>
          <div className="w-[150px] h-[150px] custom-border ml-[200px] "></div>
        </div>
        {/* Orange Circles */}
        <div className="relative flex space-x-4 z-10">
          <ClocksPage />
        </div>
        {/* Text */}
        <div className="relative ml-4 text-white z-10">
          <h1 className="text-2xl font-bold">۲۱ اردیبهشت</h1>
          <p className="text-lg">کیوان شید (آدینه)</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
