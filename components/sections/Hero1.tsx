"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getHero } from "@/redux/actions/heroActions"
import { AppDispatch } from "@/redux/store"

interface Hero1Props {
	previewData?: any;
}

export default function Hero1({ previewData }: Hero1Props = {}) {
	const [data, setData] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { hero } = useSelector((state: RootState) => state.hero)

	useEffect(() => {
		// Only fetch if we don't already have data
		if (!hero?.hero1) {
			dispatch(getHero())
		}
	}, [dispatch, hero])

	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.hero1) {
			setData(previewData.hero1)
		} 
		// Otherwise use Redux data
		else if (hero && hero.hero1) {
			setData(hero.hero1)
		}
	}, [previewData, hero])

	// Return placeholder during data loading (minimal and without text)
	if (!data) {
		return (
			<section className="position-relative overflow-hidden py-5">
				<div className="container">
					<div className="row content align-items-center">
						<div className="col-lg-6 col-12 mb-4 mb-lg-0">
							<div className="pe-lg-2" style={{ minHeight: "300px" }}></div>
						</div>
						<div className="col-lg-6 col-12 position-relative justify-content-center" style={{ minHeight: "300px" }}></div>
					</div>
				</div>
			</section>
		)
	}

	return (
		<>
			<section className="position-relative overflow-hidden py-4 py-lg-5 mb-16 mb-lg-32">
				<div className="container">
					<div className="row content align-items-center">
						<div className="col-lg-6 col-12 mb-5 mb-lg-0 text-center text-lg-start">
							<div className="pe-lg-2">
								{data?.badge?.visible !== false && (
									<Link href={data?.badge?.link || "#"} className="d-flex align-items-center bg-linear-1 d-inline-flex rounded-pill px-2 py-1 justify-content-center justify-content-lg-start" style={{backgroundColor: data?.badge?.backgroundColor || ''}}>
										<span className="bg-primary fs-9 fw-bold rounded-pill px-2 py-1 text-white" style={{backgroundColor: data?.badge?.labelBgColor || '', color: data?.badge?.labelTextColor || ''}}>
											{data?.badge?.label || ""}
										</span>
										<span className="fs-7 fw-medium text-primary mx-2" style={{color: data?.badge?.textColor || ''}}>
											{data?.badge?.text || ""}
										</span>
										<svg xmlns="http://www.w3.org/2000/svg" width={18} height={19} viewBox="0 0 18 19" fill="none">
											<path d="M10.3125 5.5625L14.4375 9.5L10.3125 13.4375" stroke={data?.badge?.iconColor || "#6342EC"} strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M14.25 9.5H3.5625" stroke={data?.badge?.iconColor || "#6342EC"} strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</Link>
								)}
								<h4 className="ds-4 mt-4 mb-4 mb-lg-5" data-aos="fade-zoom-in" data-aos-delay={0}>
									{data?.title || ""}
								</h4>
								<p className="pe-lg-10 mb-4 mb-lg-5" data-aos="fade-zoom-in" data-aos-delay={200}>
									{data?.description || ""}
								</p>
								<div className="d-flex flex-column flex-sm-row gap-3 align-items-center align-items-lg-start justify-content-center justify-content-lg-start">
									{data?.primaryButton?.visible !== false && (
										<Link 
											href={data?.primaryButton?.link || "#"} 
											className="btn d-flex align-items-center w-100 w-sm-auto justify-content-center" 
											data-aos="fade-zoom-in" 
											data-aos-delay={300} 
											style={{
												backgroundColor: data?.primaryButton?.backgroundColor || '#6342EC',
												backgroundImage: data?.primaryButton?.backgroundColor ? 'none' : 'linear-gradient(90deg, #6342EC 0%, #8B6FE7 100%)',
												color: data?.primaryButton?.textColor || '#FFFFFF',
												padding: '12px 24px',
												borderRadius: '8px',
												border: 'none',
												transition: 'all 0.3s ease',
												minHeight: '48px'
											}}
										>
											{data?.primaryButton?.text || ""}
											<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none">
												<path className="stroke-white" d="M17.25 15.25V6.75H8.75" stroke={data?.primaryButton?.iconColor || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												<path className="stroke-white" d="M17 7L6.75 17.25" stroke={data?.primaryButton?.iconColor || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									)}
									{data?.secondaryButton?.visible !== false && (
										<Link 
											href={data?.secondaryButton?.link || "#"} 
											className="btn d-flex align-items-center w-100 w-sm-auto justify-content-center" 
											data-aos="fade-zoom-in" 
											data-aos-delay={500} 
											style={{
												backgroundColor: data?.secondaryButton?.backgroundColor || 'transparent',
												color: data?.secondaryButton?.textColor || '#111827',
												padding: '11px 23px',
												borderRadius: '8px',
												border: `1px solid ${data?.secondaryButton?.borderColor || '#d1d5db'}`,
												transition: 'all 0.3s ease',
												minHeight: '48px'
											}}
										>
											<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none">
												<path className="stroke-dark" d="M8.89286 4.75H6.06818C5.34017 4.75 4.75 5.34017 4.75 6.06818C4.75 13.3483 10.6517 19.25 17.9318 19.25C18.6598 19.25 19.25 18.6598 19.25 17.9318V15.1071L16.1429 13.0357L14.5317 14.6468C14.2519 14.9267 13.8337 15.0137 13.4821 14.8321C12.8858 14.524 11.9181 13.9452 10.9643 13.0357C9.98768 12.1045 9.41548 11.1011 9.12829 10.494C8.96734 10.1537 9.06052 9.76091 9.32669 9.49474L10.9643 7.85714L8.89286 4.75Z" stroke={data?.secondaryButton?.iconColor || "#111827"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											<span className="ms-2">{data?.secondaryButton?.text || ""}</span>
										</Link>
									)}
								</div>
							</div>
						</div>
						<div className="col-lg-6 col-12 position-relative d-flex justify-content-center mt-4 mt-lg-0 d-none d-lg-block">
							<div className="hero-image-container position-relative w-100">
								<img 
									className="hero-img w-100" 
									src={data?.images?.background || ""} 
									alt="infinia" 
									style={{ 
										maxWidth: "100%", 
										height: "auto", 
										maxHeight: "600px",
										objectFit: "contain"
									}}
								/>
								<div className="shape-1 position-absolute d-none d-md-block">
									<img 
										className="rightToLeft" 
										src={data?.images?.shape1 || ""} 
										alt="infinia" 
										data-aos="zoom-in" 
										data-aos-delay={500}
										style={{ 
											maxWidth: "280px", 
											width: "100%",
											height: "auto", 
											borderRadius: "15px" 
										}}
									/>
								</div>
								<div className="shape-2 position-absolute d-none d-lg-block">
									<img 
										src={data?.images?.shape2 || ""} 
										alt="infinia" 
										data-aos="zoom-in" 
										data-aos-delay={200}
										style={{ 
											maxWidth: "200px", 
											width: "100%",
											height: "auto", 
											borderRadius: "15px" 
										}}
									/>
								</div>
								<div className="shape-3 position-absolute d-none d-lg-block">
									<img 
										src={data?.images?.shape3 || ""} 
										alt="infinia" 
										data-aos="zoom-in" 
										data-aos-delay={300}
										style={{ 
											maxWidth: "210px", 
											width: "100%",
											height: "auto",
											borderRadius: "15px"
										}}
									/>
								</div>
								{data?.card?.visible !== false && (
									<div className="alltuchtopdown card-hero backdrop-filter rounded-3 text-center d-inline-block p-2 p-md-3 position-absolute d-none d-md-block" style={{backgroundColor: data?.card?.backgroundColor || ''}}>
										<img 
											className="rounded-3 w-100" 
											src={data?.card?.image || ""} 
											alt="infinia"
											style={{ 
												maxWidth: "100%", 
												height: "auto", 
												maxHeight: "150px", 
												borderRadius: "15px",
												objectFit: "cover"
											}}
										/>
										<h6 className="mt-2 mt-md-3 fs-7 fs-md-6" style={{color: data?.card?.titleColor || ''}}>
											{data?.card?.title || ""}
										</h6>
										<p className="fs-8 fs-md-7 text-700 mb-2" style={{color: data?.card?.descriptionColor || ''}}>
											{data?.card?.description || ""}
										</p>
										<Link href={data?.card?.button?.link || "#"} className="shadow-sm d-flex align-items-center bg-white d-inline-flex rounded-pill px-2 py-1 mb-2 mb-md-3" style={{backgroundColor: data?.card?.button?.backgroundColor || ''}}>
											<span className="bg-primary fs-9 fw-bold rounded-pill px-2 py-1 text-white" style={{backgroundColor: data?.card?.button?.labelBgColor || '', color: data?.card?.button?.labelTextColor || ''}}>
												{data?.card?.button?.label || ""}
											</span>
											<span className="fs-8 fs-md-7 fw-medium text-primary mx-2" style={{color: data?.card?.button?.textColor || ''}}>
												{data?.card?.button?.text || ""}
											</span>
											<svg xmlns="http://www.w3.org/2000/svg" width={16} height={17} viewBox="0 0 18 19" fill="none">
												<path d="M10.3125 5.5625L14.4375 9.5L10.3125 13.4375" stroke={data?.card?.button?.iconColor || "#6D4DF2"} strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M14.25 9.5H3.5625" stroke={data?.card?.button?.iconColor || "#6D4DF2"} strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
