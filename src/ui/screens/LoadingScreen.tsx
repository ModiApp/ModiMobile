import React from 'react';

import { ScreenContainer, LoadingSpinner } from '../components';

const LoadingScreen: React.FC = () => (
  <ScreenContainer>
    <LoadingSpinner />
  </ScreenContainer>
);

export default LoadingScreen;
