// The new code for app/restaurant/page.tsx

import React, { Suspense } from 'react';
import RestaurantPageContent from './RestaurantPageContent';

const RestaurantPage = () => {
  return (
    <div>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading Restaurants...</div>}>
        <RestaurantPageContent />
      </Suspense>
    </div>
  );
};

export default RestaurantPage;