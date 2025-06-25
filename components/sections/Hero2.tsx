"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { Keyboard, Navigation, Pagination, Autoplay } from "swiper/modules";
import ModalVideo from "react-modal-video";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getHero } from "@/redux/actions/heroActions";
import { AppDispatch } from "@/redux/store";

interface SlideItem {
  backgroundImage: string;
  badge: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  videoButtonVisible: boolean;
  videoButtonText: string;
  lineImage: string;
}

export default function Hero2({ previewData }: { previewData?: any }) {
  const [isOpen, setOpen] = useState(false);
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { hero, loading: reduxLoading } = useSelector((state: RootState) => state.hero);

  // Always trigger getHero() on component mount
  useEffect(() => {
    dispatch(getHero());
  }, [dispatch]);

  // Set data based on either preview data or Redux data
  useEffect(() => {
    // If preview data is provided, use it
    if (previewData) {
      setHeroData(previewData);
      setLoading(false);
      return;
    }
    
    // Otherwise use Redux data
    if (hero) {
      setHeroData(hero);
      setLoading(false);
    }
  }, [previewData, hero]);
  
  // Listen for messages from parent iframe (preview updates)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "UPDATE_HERO_DATA") {
        setHeroData(event.data.heroData);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Create dynamic styles for button colors
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const styleId = 'hero2-dynamic-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const data = heroData?.hero2 || {};
    const primaryButtonBackgroundColor = data.primaryButtonBackgroundColor || "linear-gradient(90deg, #6342EC 0%, #4731D8 100%)";
    const primaryButtonTextColor = data.primaryButtonTextColor || "#FFFFFF";
    const videoButtonBackgroundColor = data.videoButtonBackgroundColor || "rgba(255, 255, 255, 0.3)";
    const videoButtonTextColor = data.videoButtonTextColor || "#111827";
    const videoButtonIconColor = data.videoButtonIconColor || "#111827";
    const navigationButtonColor = data.navigationButtonColor || "#ffffff";
    
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .hero2-primary-btn {
        background: ${primaryButtonBackgroundColor} !important;
        color: ${primaryButtonTextColor} !important;
        border: none !important;
      }
      .hero2-video-btn {
        background-color: ${videoButtonBackgroundColor} !important;
        color: ${videoButtonTextColor} !important;
      }
      .hero2-video-icon {
        color: ${videoButtonIconColor} !important;
      }
      .hero2-nav-btn {
        background-color: ${navigationButtonColor} !important;
      }
      .hero2-nav-btn:hover {
        background-color: ${navigationButtonColor} !important;
      }
      .hero2-nav-btn i {
        color: #000000 !important;
      }
      .hero2-nav-btn:hover i {
        color: #000000 !important;
      }
      @media (max-width: 768px) {
        .section-hero-5 .backdrop-filter {
          max-width: 100% !important;
          overflow: hidden !important;
        }
        .section-hero-5 .container {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }
        .section-hero-5 h4 {
          font-size: 1.5rem !important;
          line-height: 1.2 !important;
        }
        .section-hero-5 p {
          font-size: 0.9rem !important;
          line-height: 1.4 !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [heroData]);

  if (loading || reduxLoading) {
    return <div className="py-5 text-center">Yükleniyor...ro information...</div>;
  }
  
  // Get hero2 data with fallback to default values if not provided
  const data = heroData?.hero2 || {};
  
  // Destructure properties with fallbacks
  const {
    autoplay = true,
    slideDelay = 4000,
    showNavigation = true,
    navigationButtonColor = "#ffffff",
    paginationVisible = true,
    videoId = "gXFATcwrO-U",
    slides = [
      {
        backgroundImage: "/assets/imgs/hero-5/img-bg-1.png",
        badge: "🚀 Welcome to Infinia",
        title: "Best Solutions for Innovation",
        description: "Infinia offers full range of consultancy training methods for business consultation.",
        primaryButtonText: "View Our Services",
        primaryButtonLink: "#",
        videoButtonVisible: true,
        videoButtonText: "Video Guide",
        lineImage: "/assets/imgs/hero-5/img-bg-line.png"
      },
      {
        backgroundImage: "/assets/imgs/hero-5/img-bg-2.png",
        badge: "🚀 Welcome to Infinia",
        title: "Best Solutions for Innovation",
        description: "Infinia offers full range of consultancy training methods for business consultation.",
        primaryButtonText: "View Our Services",
        primaryButtonLink: "#",
        videoButtonVisible: true,
        videoButtonText: "Video Guide",
        lineImage: "/assets/imgs/hero-5/img-bg-line.png"
      }
    ],
    badgeBackgroundColor = "rgba(255, 255, 255, 0.5)",
    badgeTextColor = "#6342EC",
    badgeBorderColor = "rgba(99, 66, 236, 0.3)",
    titleColor = "#111827",
    descriptionColor = "#4B5563",
    primaryButtonBackgroundColor = "linear-gradient(90deg, #6342EC 0%, #4731D8 100%)",
    primaryButtonTextColor = "#FFFFFF",
    videoButtonBackgroundColor = "rgba(255, 255, 255, 0.3)",
    videoButtonTextColor = "#111827",
    videoButtonIconColor = "#111827"
  } = data;

  const swiperOptions = {
    slidesPerView: 1,
    slidesPerGroup: 1,
    centeredSlides: false,
    loop: true,
    autoplay: autoplay ? {
      delay: slideDelay,
    } : false,
    pagination: paginationVisible ? {
      el: ".swiper-pagination",
      clickable: true
    } : false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };
  
  // Create styles for dynamic theming
  const badgeStyle = {
    backgroundColor: badgeBackgroundColor,
    color: badgeTextColor,
    borderColor: badgeBorderColor
  };

  const titleStyle = {
    color: titleColor,
  };

  const descriptionStyle = {
    color: descriptionColor,
  };

  const primaryButtonStyle = {
    background: primaryButtonBackgroundColor,
    color: primaryButtonTextColor,
    border: 'none'
  } as React.CSSProperties;

  const videoButtonStyle = {
    backgroundColor: videoButtonBackgroundColor,
    color: videoButtonTextColor
  } as React.CSSProperties;

  const videoButtonIconStyle = {
    color: videoButtonIconColor
  } as React.CSSProperties;

  const navigationButtonStyle = {
    backgroundColor: navigationButtonColor
  } as React.CSSProperties;

  // Image style constraints
  const backgroundImageStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    maxHeight: '927px',
    minHeight: '400px'
  };

  const lineImageStyle = {
    maxWidth: '999px',
    height: 'auto',
    maxHeight: '720px'
  };

  return (
    <>
      <div className="section-hero-5 position-relative">
        <Swiper
          {...swiperOptions}
          className="swiper slider-two"
          modules={[Keyboard, Pagination, Navigation, Autoplay]}
        >
          <div className="swiper-wrapper">
            {slides.map((slide: SlideItem, index: number) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <div 
                  className="position-relative py-75 py-md-100 py-lg-188 img-pull" 
                  style={{ 
                    backgroundImage: `url(${slide.backgroundImage})`,
                    ...backgroundImageStyle
                  }}
                >
                  <div className="container position-relative z-2">
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="backdrop-filter p-3 p-md-4 p-lg-8 position-relative rounded-3" style={{maxWidth: '100%', wordWrap: 'break-word'}}>
                                                      <div 
                              className="bg-opacity-50 border d-inline-flex rounded-pill px-3 px-lg-4 py-1"
                              style={badgeStyle}
                            >
                              <span className="tag-spacing fs-7 fs-lg-6">{slide.badge}</span>
                            </div>
                          <h4 className="ds-6 ds-md-5 ds-lg-4 my-2 my-md-3" style={{...titleStyle, lineHeight: '1.2', wordBreak: 'break-word'}}>
                            {slide.title}
                          </h4>
                          <p className="fs-7 fs-md-6 fs-lg-5 text-900 mb-3" style={{...descriptionStyle, lineHeight: '1.4', wordBreak: 'break-word'}}>
                            {slide.description}
                          </p>
                          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-0">
                            <Link 
                              href={slide.primaryButtonLink} 
                              className="btn btn-sm btn-lg-md rounded-4 d-flex align-items-center hero2-primary-btn"
                              style={primaryButtonStyle}
                            >
                              <span className="fs-7 fs-lg-6">{slide.primaryButtonText}</span>
                              <svg 
                                className="ms-2" 
                                xmlns="http://www.w3.org/2000/svg" 
                                width={20} 
                                height={20} 
                                viewBox="0 0 24 24" 
                                fill="none"
                              >
                                <path 
                                  d="M17.25 15.25V6.75H8.75" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                />
                                <path 
                                  d="M17 7L6.75 17.25" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                />
                              </svg>
                            </Link>
                            
                            {slide.videoButtonVisible && (
                              <Link 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpen(true);
                                }} 
                                scroll={false} 
                                className="d-inline-flex align-items-center rounded-4 text-nowrap backdrop-filter px-3 py-2 popup-video hover-up ms-md-3 hero2-video-btn"
                                style={videoButtonStyle}
                              >
                                <span 
                                  className="backdrop-filter me-2 icon-shape icon-md rounded-circle hero2-video-icon"
                                  style={videoButtonIconStyle}
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width={16} 
                                    height={16} 
                                    viewBox="0 0 16 16" 
                                    fill="none"
                                  >
                                    <path 
                                      d="M5.0978 3.31244L12.0958 6.80342C13.077 7.29449 13.0767 8.69249 12.0954 9.18316L5.09734 12.6927C4.21074 13.136 3.16687 12.4925 3.16687 11.5027L3.16687 4.50219C3.16687 3.51217 4.2112 2.86872 5.0978 3.31244Z" 
                                      stroke="currentColor" 
                                      strokeWidth="1.5" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                    />
                                  </svg>
                                </span>
                                <span className="fw-bold fs-8 fs-lg-7">
                                  {slide.videoButtonText}
                                </span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="position-absolute top-0 start-0 z-0">
                    <img 
                      src={slide.lineImage} 
                      alt="background line" 
                      style={lineImageStyle}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </div>
          
          {showNavigation && (
            <>
              <div 
                className="swiper-button-prev d-none d-lg-flex shadow-2 position-absolute top-50 translate-middle-y ms-lg-7 hero2-nav-btn"
                style={navigationButtonStyle}
              >
                <i className="bi bi-arrow-left" />
              </div>
              <div 
                className="swiper-button-next d-none d-lg-flex shadow-2 position-absolute top-50 translate-middle-y me-lg-7 hero2-nav-btn"
                style={navigationButtonStyle}
              >
                <i className="bi bi-arrow-right" />
              </div>
            </>
          )}
          
          {paginationVisible && <div className="swiper-pagination mb-8" />}
        </Swiper>
      </div>
      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId={videoId}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
