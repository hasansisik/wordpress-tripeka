'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { getFeatures } from "@/redux/actions/featuresActions"

interface Features10Props {
	previewData?: any;
}

export default function Features10({ previewData }: Features10Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { features, loading } = useSelector((state: RootState) => state.features)

	// Helper function to convert color to CSS filter
	const getColorFilter = (color: string) => {
		// Common color mappings to CSS filters
		const colorFilters: { [key: string]: string } = {
			'#FFFFFF': 'invert(100%)',
			'white': 'invert(100%)',
			'#000000': 'invert(0%)',
			'black': 'invert(0%)',
			'#6342EC': 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(240deg) brightness(119%) contrast(119%)',
			'#FF0000': 'invert(13%) sepia(99%) saturate(7404%) hue-rotate(4deg) brightness(102%) contrast(118%)',
			'red': 'invert(13%) sepia(99%) saturate(7404%) hue-rotate(4deg) brightness(102%) contrast(118%)',
			'#00FF00': 'invert(50%) sepia(100%) saturate(2000%) hue-rotate(120deg) brightness(100%) contrast(100%)',
			'green': 'invert(50%) sepia(100%) saturate(2000%) hue-rotate(120deg) brightness(100%) contrast(100%)',
			'#0000FF': 'invert(20%) sepia(100%) saturate(2000%) hue-rotate(240deg) brightness(100%) contrast(100%)',
			'blue': 'invert(20%) sepia(100%) saturate(2000%) hue-rotate(240deg) brightness(100%) contrast(100%)'
		};

		// Return specific filter if available, otherwise try to convert hex to filter
		if (colorFilters[color]) {
			return colorFilters[color];
		}

		// For hex colors, create a basic filter (this is a simplified approach)
		if (color.startsWith('#')) {
			const hex = color.replace('#', '');
			const r = parseInt(hex.substr(0, 2), 16);
			const g = parseInt(hex.substr(2, 2), 16);
			const b = parseInt(hex.substr(4, 2), 16);
			
			// Calculate brightness and apply basic filter
			const brightness = (r * 299 + g * 587 + b * 114) / 1000;
			const invert = brightness > 127 ? 0 : 100;
			
			return `invert(${invert}%)`;
		}

		return 'none';
	};

	useEffect(() => {
		// Only fetch if we don't already have features data
		if (!features?.features10) {
			dispatch(getFeatures())
		}
	}, [dispatch, features])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.features10) {
			setData(previewData.features10)
		} 
		// Otherwise use Redux data
		else if (features && features.features10) {
			setData(features.features10)
		}
	}, [previewData, features])

	// Return placeholder during data loading (minimal and without text)
	if (!data) {
		return (
			<section className="features-10 py-9" style={{ backgroundColor: '#6342EC' }}>
				<div className="container">
					<div className="row">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="col-lg-3 col-md-6">
								<div className="feature-item mb-5 position-relative mb-lg-0 p-5 rounded-4" style={{ backgroundColor: 'white', minHeight: "200px" }}></div>
							</div>
						))}
					</div>
				</div>
			</section>
		)
	}

	return (
		<>
			<section 
				className="features-10 py-9" 
				style={{ 
					backgroundColor: data.backgroundColor || '#6342EC' 
				}}
			>
				<div className="container">
					<div className="row">
						{data.features && data.features.map((feature: any, index: number) => (
							<div key={index} className="col-lg-3 col-md-6">
								<div 
									className="feature-item mb-5 position-relative mb-lg-0 p-5 rounded-4 hover-up" 
									style={{ 
										backgroundColor: feature.backgroundColor || 'white' 
									}}
								>
									<div 
										className="icon-flip position-relative icon-shape icon-xxl rounded-3 mb-4" 
										style={{ 
											backgroundColor: feature.iconBackgroundColor || '#f8f4ff' 
										}}
									>
										<div className="icon">
											<img 
												src={feature.icon || `/assets/imgs/features-1/icon-${index + 1}.svg`} 
												alt="infinia" 
												style={{
													filter: feature.iconColor ? `brightness(0) saturate(100%) ${getColorFilter(feature.iconColor)}` : 'none'
												}}
											/>
										</div>
									</div>
									<h6 
										style={{ 
											color: feature.titleColor || '' 
										}}
									>
										{feature.title || `Feature ${index + 1}`}
									</h6>
									<p 
										style={{ 
											color: feature.descriptionColor || '' 
										}}
									>
										{feature.description || "Feature description"}
									</p>
								
									<div className="position-absolute end-0 top-0">
										<img src={data.backgroundImage || "/assets/imgs/feature-10/bg-line.png"} alt="" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
