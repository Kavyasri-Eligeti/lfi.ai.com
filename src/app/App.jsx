import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MotionProvider } from '../features/motion/MotionProvider';
import { createRouter } from './router';

export default function App() {
  const [router] = useState(createRouter);
  return (
    <MotionProvider>
      <RouterProvider router={router} />
    </MotionProvider>
  );
}
