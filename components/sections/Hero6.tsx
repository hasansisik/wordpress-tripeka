"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getHero } from "@/redux/actions/heroActions";
import { AppDispatch } from "@/redux/store";

export default function Hero6({ previewData }: { previewData?: any }) {
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
    
    const styleId = 'hero6-dynamic-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const data = heroData?.hero6 || {};
    const primaryButtonBackgroundColor = data.primaryButtonBackgroundColor || "linear-gradient(90deg, #6342EC 0%, #4731D8 100%)";
    const primaryButtonTextColor = data.primaryButtonTextColor || "#FFFFFF";
    
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .hero6-primary-btn {
        background: ${primaryButtonBackgroundColor} !important;
        color: ${primaryButtonTextColor} !important;
        border: none !important;
      }
      .hero6-video {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
      }
      .section-hero-6 {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
      }
      .section-hero-6 .hero6-container {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: center;
      }
      .section-hero-6 .hero6-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1;
      }
      .section-hero-6 .hero6-content {
        position: relative;
        z-index: 2;
      }
      @media (max-width: 768px) {
        .section-hero-6 {
          min-height: 70vh;
        }
        .section-hero-6 .hero6-container {
          min-height: 70vh;
        }
        .section-hero-6 .backdrop-filter {
          max-width: 100% !important;
          overflow: hidden !important;
        }
        .section-hero-6 .container {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }
        .section-hero-6 h4 {
          font-size: 1.5rem !important;
          line-height: 1.2 !important;
        }
        .section-hero-6 p {
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
    return <div className="py-5 text-center">Loading hero information...</div>;
  }
  
  // Get hero6 data with fallback to default values if not provided
  const data = heroData?.hero6 || {};
  
  // Destructure properties with fallbacks
  const {
    videoSrc = "/assets/video.mp4",
    badge = "🚀 Welcome to Infinia",
    title = "Best Solutions for Innovation",
    description = "Infinia offers full range of consultancy training methods for business consultation.",
    primaryButtonText = "View Our Services",
    primaryButtonLink = "#",
    badgeBackgroundColor = "rgba(255, 255, 255, 0.5)",
    badgeTextColor = "#6342EC",
    badgeBorderColor = "rgba(99, 66, 236, 0.3)",
    titleColor = "#111827",
    descriptionColor = "#4B5563",
    primaryButtonBackgroundColor = "linear-gradient(90deg, #6342EC 0%, #4731D8 100%)",
    primaryButtonTextColor = "#FFFFFF",
    lineImage = "/assets/imgs/hero-5/img-bg-line.png"
  } = data;
  
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

  // Video style constraints
  const videoStyle = {
    objectFit: 'cover' as const,
    width: '100%',
    height: '100%'
  };

  const lineImageStyle = {
    maxWidth: '999px',
    height: 'auto',
    maxHeight: '720px'
  };

  return (
    <>
      <div className="section-hero-6">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero6-video"
          style={videoStyle}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="hero6-overlay"></div>
        
        <div className="hero6-container">
          <div className="container hero6-content">
            <div className="row">
              <div className="col-lg-6 col-12">
                <div className="backdrop-filter p-3 p-md-4 p-lg-8 position-relative rounded-3" style={{maxWidth: '100%', wordWrap: 'break-word'}}>
                  <div 
                    className="bg-opacity-50 border d-inline-flex rounded-pill px-3 px-lg-4 py-1"
                    style={badgeStyle}
                  >
                    <span className="tag-spacing fs-7 fs-lg-6">{badge}</span>
                  </div>
                  <h4 className="ds-6 ds-md-5 ds-lg-4 my-2 my-md-3" style={{...titleStyle, lineHeight: '1.2', wordBreak: 'break-word'}}>
                    {title}
                  </h4>
                  <p className="fs-7 fs-md-6 fs-lg-5 text-900 mb-3" style={{...descriptionStyle, lineHeight: '1.4', wordBreak: 'break-word'}}>
                    {description}
                  </p>
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-0">
                    <Link 
                      href={primaryButtonLink} 
                      className="btn btn-sm btn-lg-md rounded-4 d-flex align-items-center hero6-primary-btn"
                      style={primaryButtonStyle}
                    >
                      <span className="fs-7 fs-lg-6">{primaryButtonText}</span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Line image overlay */}
          <div className="position-absolute top-0 start-0" style={{zIndex: 1, pointerEvents: 'none'}}>
            <img 
              src={lineImage} 
              alt="background line" 
              style={lineImageStyle}
            />
          </div>
        </div>
      </div>
    </>
  );
} 