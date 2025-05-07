import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./HorizontalImageScroll.css";

const images = [
  '/assets/Nagoa.jpg',
  '/assets/n1.png',
  '/assets/n2.png',
  '/assets/n3.png',
  '/assets/n4.png',
  '/assets/n5.png',
  '/assets/chakratirth.jpg',
  '/assets/ghoghla.png'
];

const InfiniteImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Always slide to the right
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="slider-image"
          custom={direction}
          initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.32, 0.72, 0, 1] // Smoother easing curve
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default InfiniteImageSlider;