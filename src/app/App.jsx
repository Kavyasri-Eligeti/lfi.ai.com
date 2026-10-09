import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MotionProvider } from '../features/motion/MotionProvider';
import SmoothScroll from '../features/motion/SmoothScroll';
import CardLight from '../features/motion/CardLight';
import { createRouter } from './router';

export default function App() {
  const [router] = useState(createRouter);
  return (
    <MotionProvider>
      <SmoothScroll />
      <CardLight />
      <RouterProvider router={router} />
    </MotionProvider>
  );
}
