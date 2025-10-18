import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      image: "/World Store.jpg"
    },
    {
      id: 2,
      title: "PREMIUM COSMETICS",
      description: "Discover luxury skincare and beauty essentials from renowned international brands",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=1080&fit=crop&q=90"
    },
    {
      id: 3,
      title: "HOME ESSENTIALS",
      description: "Transform your living space with curated home décor and lifestyle products",
      image: "https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=1920&h=1080&fit=crop&q=90"
    },
    {
      id: 4,
      title: "GOURMET DELIGHTS",
      description: "Indulge in premium chocolates and imported confectionery from around the world",
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=1920&h=1080&fit=crop&q=90"
    },
    {
      id: 5,
      title: "INTERNATIONAL SELECTION",
      description: "Experience authentic flavors with our carefully selected imported food and beverages",
      image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1920&h=1080&fit=crop&q=90"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  };

  return (
    <div className="slideshow-container">
      <div className="slideshow-wrapper">
        {/* Slides */}
        <div className="slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''} ${index === 0 ? 'no-overlay' : ''}`}
            >
              <div className="slide-image">
                <img src={slide.image} alt={slide.title} />
                <div className="overlay"></div>
              </div>
              <div className="slide-content">
                {slide.title && <h2 className="slide-title">{slide.title}</h2>}
                {slide.description && <p className="slide-description">{slide.description}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className={`nav-arrow left ${currentSlide === 0 ? 'dark' : ''}`} onClick={handlePrev}>
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <button className={`nav-arrow right ${currentSlide === 0 ? 'dark' : ''}`} onClick={handleNext}>
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>

        {/* Dots Navigation */}
        <div className={`dots-container ${currentSlide === 0 ? 'dark' : ''}`}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .slideshow-container {
          width: 100%;
          margin: 0;
          padding: 0;
        
        }

        .slideshow-wrapper {
          position: relative;
          width: 100%;
          height: 85vh;
          overflow: hidden;
          background: #000;
        }

        .slides {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
          transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide.active {
          opacity: 1;
          pointer-events: auto;
        }

        .slide-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slide-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide.active .slide-image img {
          animation: kenBurns 8s ease-out forwards;
        }

        @keyframes kenBurns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.08);
          }
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.15) 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
        }

        .slide.no-overlay .overlay {
          display: none;
        }

        .slide-content {
          position: absolute;
          bottom: 140px;
          left: 0;
          right: 0;
          padding: 0 5%;
          color: white;
          z-index: 10;
          text-align: center;
        }

        .slide-title {
          font-size: 3.5rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          font-family: 'Helvetica Neue', 'Arial', sans-serif;
          opacity: 0;
        }

        .slide.active .slide-title {
          animation: luxuryFadeUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }

        .slide-description {
          font-size: 0.95rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          margin: 0;
          text-transform: lowercase;
          font-family: 'Helvetica Neue', 'Arial', sans-serif;
          opacity: 0;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .slide.active .slide-description {
          animation: luxuryFadeUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
        }

        @keyframes luxuryFadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          color: #fff;
          backdrop-filter: blur(5px);
        }

        .nav-arrow.dark {
          border-color: rgba(0, 0, 0, 0.3);
          color: #333;
        }

        .nav-arrow:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-50%) scale(1.05);
        }

        .nav-arrow.dark:hover {
          background: rgba(0, 0, 0, 0.1);
          border-color: rgba(0, 0, 0, 0.6);
        }

        .nav-arrow:active {
          transform: translateY(-50%) scale(0.95);
        }

        .nav-arrow.left {
          left: 3rem;
        }

        .nav-arrow.right {
          right: 3rem;
        }

        .dots-container {
          position: absolute;
          bottom: 4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          z-index: 20;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
        }

        .dots-container.dark .dot {
          border-color: rgba(0, 0, 0, 0.5);
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.8);
        }

        .dots-container.dark .dot:hover {
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 0, 0, 0.8);
        }

        .dot.active {
          background: rgba(255, 255, 255, 1);
          width: 40px;
          border-radius: 4px;
          border-color: rgba(255, 255, 255, 1);
        }

        .dots-container.dark .dot.active {
          background: rgba(0, 0, 0, 1);
          border-color: rgba(0, 0, 0, 1);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .slideshow-wrapper {
            height: 70vh;
          }

          .random-subcategories{
          margin-top:0
          }
          .slide-title {
            font-size: 2.3rem !important;
          }

          .slide-description {
            font-size: 0.9rem;  
          }

          .nav-arrow.left {
            left: 2rem;
          }

          .nav-arrow.right {
            right: 2rem;
          }
        }

        @media (max-width: 768px) {
          .slideshow-wrapper {
            height: 65vh;
          }

          .slide-content {
            padding: 0 3%;
            bottom: 100px;
          }

          .slide-title {
            font-size: 1.5rem !important;
            letter-spacing: 0.12em;
          }

          .slide-description {
            font-size: 0.8rem;
            text-transform: capitalize;
            letter-spacing: 0.06em;
          }

          .nav-arrow {
            width: 42px;
            height: 42px;
          }

          .nav-arrow.left {
            left: 1rem;
          }

          .nav-arrow.right {
            right: 1rem;
          }

          .dots-container {
            gap: 0.8rem;
            bottom: 3rem;
          }

          .dot {
            width: 7px;
            height: 7px;
          }

          .dot.active {
            width: 32px;
          }
        }

        @media (max-width: 480px) {
          .slideshow-wrapper {
            height: 55vh;
          }

          .slide-content {
            padding: 0 5%;
            bottom: 80px;
          }

          .slide-title {
            font-size: 1.5rem;
            letter-spacing: 0.1em;
            margin-bottom: 0.6rem;
          }

          

          .nav-arrow {
            width: 36px;
            height: 36px;
          }

          .nav-arrow svg {
            width: 16px;
            height: 16px;
          }

          .nav-arrow.left {
            left: 0.8rem;
          }

          .nav-arrow.right {
            right: 0.8rem;
          }

          .dots-container {
            gap: 0.7rem;
            bottom: 2.5rem;
          }

          .dot {
            width: 6px;
            height: 6px;
          }

          .dot.active {
            width: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default Slideshow;