import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getFeatures } from '@/redux/actions/featuresActions';
import Features1 from '@/components/sections/Features1';
import Features4 from '@/components/sections/Features4';
import Features5 from '@/components/sections/Features5';
import Features8 from '@/components/sections/Features8';
import Features10 from '@/components/sections/Features10';

interface FeaturesSectionProps {
  // Optional props to override Redux data
  previewData?: any;
}

export default function FeaturesSection({ previewData }: FeaturesSectionProps) {
  const dispatch = useDispatch();
  const { features, loading } = useSelector((state: RootState) => state.features);
  const [data, setData] = useState<any>(null);

  // Fetch features data if not provided
  useEffect(() => {
    if (!previewData && !features) {
      dispatch(getFeatures() as any);
    }
  }, [dispatch, previewData, features]);

  // Update local state when features data changes
  useEffect(() => {
    if (previewData) {
      setData(previewData);
    } else if (features) {
      setData(features);
    }
  }, [features, previewData]);

  if (loading || !data) {
    return <div className="py-5 text-center">Loading features section...</div>;
  }

  // Render the selected features component
  const activeFeature = data.activeFeature || 'features1';

  if (activeFeature === 'features1') {
    return <Features1 previewData={data} />;
  } else if (activeFeature === 'features4') {
    return <Features4 previewData={data} />;
  } else if (activeFeature === 'features5') {
    return <Features5 previewData={data} />;
  } else if (activeFeature === 'features8') {
    return <Features8 previewData={data} />;
  } else if (activeFeature === 'features10') {
    return <Features10 previewData={data} />;
  }

  // Fallback
  return <div className="py-5 text-center">Features section not available</div>;
} 