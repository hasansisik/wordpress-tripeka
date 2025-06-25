'use client'
import Link from "next/link"
import { useState, useEffect } from 'react'
import ModalVideo from 'react-modal-video'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getFeatures } from "@/redux/actions/featuresActions"
import { AppDispatch } from "@/redux/store"

interface Features1Props {
	previewData?: any;
}

export default function Features1({ previewData }: Features1Props = {}) {
	const [isOpen, setOpen] = useState(false)
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { features, loading } = useSelector((state: RootState) => state.features)

	useEffect(() => {
		// Only fetch if we don't already have features data
		if (!features?.features1) {
			dispatch(getFeatures())
		}
	}, [dispatch, features])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.features1) {
			setData(previewData.features1)
		} 
		// Otherwise use Redux data
		else if (features && features.features1) {
			setData(features.features1)
		}
	}, [previewData, features])

	// Return placeholder during data loading (minimal and without text)
	if (!data) {
		return (
			<section className="features-1 py-5">
				<div className="container">
					<div className="row">
						<div className="col-lg-4" style={{ minHeight: "200px" }}></div>
						<div className="col-lg-8" style={{ minHeight: "200px" }}></div>
					</div>
				</div>
			</section>
		)
	}
	
	// Function to handle video click
	const handleVideoClick = () => {
		setOpen(true)
	}

	// Image style constraints
	const getImageStyle = (index: number) => {
		// Base style for all images
		const baseStyle: React.CSSProperties = {
			height: 'auto',
			objectFit: 'cover'
		};
		
		// Different constraints based on image position
		switch(index) {
			// First image (smallest)
			case 1:
				return {
					...baseStyle,
					maxWidth: '172px',
					maxHeight: '120px'
				};
			// Second image (medium)
			case 2:
				return {
					...baseStyle,
					maxWidth: '242px',
					maxHeight: '168px'
				};
			// Third image (largest)
			case 3:
				return {
					...baseStyle,
					maxWidth: '372px',
					maxHeight: '258px'
				};
			// Default
			default:
				return baseStyle;
		}
	};

	// Background and decoration image styles
	const bgEllipseStyle = {
		maxWidth: '762px',
		height: 'auto',
		maxHeight: '530px'
	};

	const starLgStyle = {
		width: '59px',
		height: '71px'
	};

	const starMdStyle = {
		width: '45px',
		height: '54px'
	};

	// Feature icon style
	const featureIconStyle = {
		maxWidth: '100%',
		height: 'auto'
	};

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

	return (
		<>
			<section className="features-1 py-5">
				<div className="container">
					<div className="row">
						<div className="col-lg-4">
							{data.badge?.visible !== false && (
								<div 
									className="d-flex align-items-center border border-2 border-white d-inline-flex rounded-pill px-3 py-1" 
									style={{ 
										backgroundColor: data.badge?.backgroundColor || '#f8f4ff'
									}}
								>
									<span 
										className="tag-spacing fs-7 fw-bold ms-2 text-uppercase" 
										style={{ 
											color: data.badge?.labelTextColor || '#6342EC' 
										}}
									>
										{data.badge?.label || "Our Features"}
									</span>
								</div>
							)}
							<h2 className="fw-medium mt-4 lh-sm">
								{data.title?.part1 || "1, we are creating a"}
								<span className="fw-black"> {data.title?.part2 || "Bright Future."}</span>
								<span 
									className="fst-italic" 
									data-aos="fade-zoom-in" 
									data-aos-delay={400} 
									style={{ color: data.title?.part3TextColor || '#6342EC' }}
								>
									{data.title?.part3 || " Join us."}
								</span>
							</h2>
						</div>
						<div className="col-lg-8">
							<div className="d-flex flex-md-row flex-column align-items-center position-relative ps-lg-8 pt-lg-0 pt-10">
								<div className="pe-md-3 pb-3 pb-md-0 position-relative z-1" data-aos="fade-zoom-in" data-aos-delay={100}>
									<img 
										className="rounded-3 border border-3 border-white" 
										src={data.images?.img1 || "/assets/imgs/features-1/img-1.png"} 
										alt="infinia" 
										style={getImageStyle(1)}
									/>
								</div>
								<div className="pe-md-3 pb-3 pb-md-0 position-relative z-1" data-aos="fade-zoom-in" data-aos-delay={200}>
									<img 
										className="rounded-3 border border-3 border-white" 
										src={data.images?.img2 || "/assets/imgs/features-1/img-2.png"} 
										alt="infinia" 
										style={getImageStyle(2)}
									/>
								</div>
								<div className="pe-md-3 pb-3 pb-md-0 position-relative z-1" data-aos="fade-zoom-in" data-aos-delay={300}>
									<img 
										className="rounded-3 border border-3 border-white cursor-pointer"
										src={data.images?.img3 || "/assets/imgs/features-1/img-3.png"} 
										alt="infinia"
										onClick={handleVideoClick}
										style={getImageStyle(3)}
									/>
									
									<ModalVideo 
										channel='youtube' 
										isOpen={isOpen} 
										videoId={data.videoId || "gXFATcwrO-U"} 
										onClose={() => setOpen(false)} 
									/>
								</div>
								<img 
									className="position-absolute top-50 start-0 translate-middle-y z-0" 
									src={data.images?.bgEllipse || "/assets/imgs/features-1/bg-ellipse.png"} 
									alt="infinia" 
									style={bgEllipseStyle}
								/>
								<img 
									className="position-absolute z-2 star-lg" 
									src={data.images?.starLg || "/assets/imgs/features-1/star-lg.png"} 
									alt="infinia" 
									style={starLgStyle}
								/>
								<img 
									className="position-absolute z-2 star-md" 
									src={data.images?.starMd || "/assets/imgs/features-1/star-md.png"} 
									alt="infinia" 
									style={starMdStyle}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row mt-10">
						{data.features && data.features.map((feature: any, index: number) => (
							<div key={index} className="col-lg-3 col-md-6" data-aos="fade-zoom-in" data-aos-delay={50 * (index + 1)}>
								<div 
									className="feature-item mb-5 mb-lg-0 p-4 rounded-3" 
									style={{ 
										backgroundColor: feature.backgroundColor || '' 
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
													...featureIconStyle,
													filter: feature.iconColor ? `brightness(0) saturate(100%) ${getColorFilter(feature.iconColor)}` : 'none'
												}}
											/>
										</div>
									</div>
									<h6 style={{ color: feature.titleColor || '' }}>{feature.title}</h6>
									<p style={{ color: feature.descriptionColor || '' }}>{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
