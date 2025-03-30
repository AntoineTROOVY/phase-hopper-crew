
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loading project details...</h2>
        <p className="text-gray-500">Please wait while we fetch your data.</p>
      </div>
    </div>
  );
};

export default LoadingState;
