import React, { useState, useEffect, useRef } from 'react';
import './InfiniteScroll.css';

// Import your images (replace with actual image paths)
import churchImage from '../assets/n1.png';
import cavesImage from '../assets/n1.png';
import beach1Image from '../assets/n1.png';
import beach2Image from '../assets/n1.png';

const InfiniteScroll = () => {
  const wrapperRef = useRef(null);
  const autoScrollRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [cardMetrics, setCardMetrics] = useState({
    width: 100,
    visible: 1
  });

  const cards = [
    {
      title: "ST. PAUL CHURCH",
      description: "St. Paul Church, as it is widely known is also called the Church of Immaculate Concept!.",
      image: churchImage
    },
    {
      title: "NAIDA CAVES",
      description: "The Naida Caves are situated outside Zampa Gate following Vijaypath Road in Diu. They are a network of stunning caves with beautiful light patterns.",
      image: cavesImage
    },
    {
      title: "GOMTIMATA BEACH",
      description: "The beach is situated to the extreme west side of the island, 13 kms from Diu in village.",
      image: beach1Image
    },
    {
      title: "JALLANDHAR BEACH",
      description: "The beach is at a distance of 1 km. from Diu Town. It has beautiful panoramic view. It's known for its serene atmosphere.",
      image: beach2Image
    }
  ];

  // Current position state
  const positionRef = useRef(0);
  const originalCardsLength = cards.length;

  // Duplicate cards for infinite effect
  const allCards = [...cards, ...cards];

  const updateCardMetrics = () => {
    const screenWidth = window.innerWidth;
    let newWidth = 100;
    let newVisible = 1;
    
    if (screenWidth >= 1200) {
      newWidth = 25; // 4 cards
      newVisible = 4;
    } else if (screenWidth >= 900) {
      newWidth = 33.33; // 3 cards
      newVisible = 3;
    } else if (screenWidth >= 600) {
      newWidth = 50; // 2 cards
      newVisible = 2;
    }

    setCardMetrics({
      width: newWidth,
      visible: newVisible
    });

    // Reset position when screen size changes
    positionRef.current = 0;
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'none';
      wrapperRef.current.style.transform = `translateX(0)`;
    }
  };

  const scrollToPosition = (newPosition) => {
    if (!wrapperRef.current) return;

    // When reaching the end of original cards, reset to start
    if (newPosition > originalCardsLength - cardMetrics.visible) {
      // Jump to start without animation
      wrapperRef.current.style.transition = 'none';
      wrapperRef.current.style.transform = `translateX(0)`;
      // Force reflow
      void wrapperRef.current.offsetWidth;
      // Then animate the next transition
      wrapperRef.current.style.transition = 'transform 0.5s ease';
      positionRef.current = 1;
      wrapperRef.current.style.transform = `translateX(-${positionRef.current * cardMetrics.width}vw)`;
    } else {
      positionRef.current = newPosition;
      wrapperRef.current.style.transform = `translateX(-${positionRef.current * cardMetrics.width}vw)`;
    }
  };

  const handleNext = () => {
    scrollToPosition(positionRef.current + 1);
    resetAutoScroll();
  };

  const handlePrev = () => {
    if (positionRef.current <= 0) {
      // Jump to the end of original cards
      if (!wrapperRef.current) return;
      
      const jumpPosition = originalCardsLength - cardMetrics.visible;
      wrapperRef.current.style.transition = 'none';
      wrapperRef.current.style.transform = `translateX(-${jumpPosition * cardMetrics.width}vw)`;
      void wrapperRef.current.offsetWidth;
      wrapperRef.current.style.transition = 'transform 0.5s ease';
      positionRef.current = jumpPosition;
      wrapperRef.current.style.transform = `translateX(-${positionRef.current * cardMetrics.width}vw)`;
    } else {
      scrollToPosition(positionRef.current - 1);
    }
    resetAutoScroll();
  };

  const resetAutoScroll = () => {
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      scrollToPosition(positionRef.current + 1);
    }, 3000);
  };

  useEffect(() => {
    updateCardMetrics();
    autoScrollRef.current = setInterval(() => {
      scrollToPosition(positionRef.current + 1);
    }, 3000);

    const handleResize = () => {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => {
        updateCardMetrics();
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(autoScrollRef.current);
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="scroll-container">
      <button className="nav-btn prev" onClick={handlePrev}>&lt;</button>
      <div 
        className="scroll-wrapper" 
        ref={wrapperRef}
        onMouseEnter={() => clearInterval(autoScrollRef.current)}
        onMouseLeave={resetAutoScroll}
      >
        {allCards.map((card, index) => (
          <div className="card" key={`${card.title}-${index}`}>
            <div className="card-image-container">
              <img src={card.image} alt={card.title} className="card-image" />
            </div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <button className="view-btn">VIEW</button>
          </div>
        ))}
      </div>
      <button className="nav-btn next" onClick={handleNext}>&gt;</button>
    </div>
  );
};

export default InfiniteScroll;