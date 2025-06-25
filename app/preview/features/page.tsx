"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeaturesSection from "@/components/layout/FeaturesSection";

// Wrapper component for preview functionality
function PreviewWrapper({ children }: { children: (data: any) => React.ReactNode }) {
  const [featuresData, setFeaturesData] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get data from URL params
    const dataParam = searchParams.get('featuresData');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setFeaturesData(parsedData);
      } catch (error) {
        console.error('Error parsing features data:', error);
      }
    }

    // Listen for messages from parent iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "UPDATE_FEATURES_DATA") {
        setFeaturesData(event.data.featuresData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [searchParams]);

  if (!featuresData) {
    return <div className="p-10 bg-gray-50 text-gray-500">Loading features preview...</div>;
  }

  return <>{children(featuresData)}</>;
}

export default function FeaturesPreview() {
  const renderFeatures = (featuresData: any) => {
    return <FeaturesSection previewData={featuresData} />;
  };

  return (
    <PreviewWrapper>
      {(featuresData) => renderFeatures(featuresData)}
    </PreviewWrapper>
  );
} 