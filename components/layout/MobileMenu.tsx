'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getHeader } from '@/redux/actions/headerActions'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Destinations data - same as in Header2
const destinationsData = [
	{
		id: 1,
		name: 'ATHENS',
		image: '/assets/imgs/destinations/athens.jpg',
		href: '/destinations/athens'
	},
	{
		id: 2,
		name: 'MALTA',
		image: '/assets/imgs/destinations/malta.jpg',
		href: '/destinations/malta'
	},
	{
		id: 3,
		name: 'PUERTO RICO',
		image: '/assets/imgs/destinations/puerto-rico.jpg',
		href: '/destinations/puerto-rico'
	},
	{
		id: 4,
		name: 'CANCUN',
		image: '/assets/imgs/destinations/cancun.jpg',
		href: '/destinations/cancun'
	},
	{
		id: 5,
		name: 'MIAMI',
		image: '/assets/imgs/destinations/miami.jpg',
		href: '/destinations/miami'
	},
	{
		id: 6,
		name: 'YELLOWSTONE',
		image: '/assets/imgs/destinations/yellowstone.jpg',
		href: '/destinations/yellowstone'
	}
];

// Categories for mobile menu
const destinationCategories = [
	{ name: 'TRENDING', href: '/destinations?category=trending' },
	{ name: 'COUNTRIES', href: '/destinations?category=countries' },
	{ name: 'REGIONS', href: '/destinations?category=regions' },
	{ name: 'CITIES', href: '/destinations?category=cities' },
	{ name: 'CONTINENTS', href: '/destinations?category=continents' }
];

export default function MobileMenu({ isMobileMenu, handleMobileMenu, menuItems = [], socialLinks = [] }: any) {
	const [isAccordion, setIsAccordion] = useState(0)
	const [showDestinations, setShowDestinations] = useState(false)
	const dispatch = useDispatch()
	const { header } = useSelector((state: RootState) => state.header)

	// Fetch header data once when component mounts if not already available
	useEffect(() => {
		if (!header || !header.mainMenu) {
			dispatch(getHeader() as any)
		}
	}, [])

	const handleAccordion = (key: any) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	const handleMenuItemClick = () => {
		// Close the mobile menu when a menu item is clicked
		handleMobileMenu()
	}

	const toggleDestinations = () => {
		setShowDestinations(!showDestinations)
	}

	return (
		<>
			{/* Offcanvas search */}
			<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2 ${isMobileMenu ? 'sidebar-visible' : ''}`}>
				<div className="mobile-header-wrapper-inner">
					<div className="mobile-header-logo">
						<Link className="navbar-brand d-flex main-logo align-items-center" href="/">
							<img 
								src={header?.logo?.src || "/assets/imgs/template/favicon.svg"} 
								alt={header?.logo?.alt || "Logo"}
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}} 
							/>
							<span>{header?.logo?.text || ""}</span>
						</Link>
						<div 
							className={`burger-icon burger-icon-white border rounded-3 ${isMobileMenu ? 'burger-close' : ''}`} 
							onClick={handleMobileMenu}
							style={{ 
								backgroundColor: header?.mobileMenuButtonColor || 'transparent' 
							}}
						>
							<span className="burger-icon-top" />
							<span className="burger-icon-mid" />
							<span className="burger-icon-bottom" />
						</div>
					</div>
					<div className="mobile-header-content-area">
						<div className="perfect-scroll">
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
									<ul className="mobile-menu font-heading ps-0">
										{/* Destinations Menu Item */}
										<li>
											<div 
												className="d-flex align-items-center justify-content-between cursor-pointer py-2"
												onClick={toggleDestinations}
												style={{ cursor: 'pointer' }}
											>
												<span>Destinations</span>
												{showDestinations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
											</div>
											{showDestinations && (
												<ul className="ps-3 mt-2 mb-3">
													{/* Categories */}
													<li className="mb-3">
														<p className="text-muted mb-2 fs-8 fw-bold">CATEGORIES</p>
														<ul className="list-unstyled ps-2">
															{destinationCategories.map((category, index) => (
																<li key={index} className="mb-1">
																	<Link 
																		href={category.href} 
																		onClick={handleMenuItemClick}
																		className="text-decoration-none fs-7 text-dark"
																	>
																		{category.name}
																	</Link>
																</li>
															))}
														</ul>
													</li>
													
													{/* Popular Destinations */}
													<li className="mb-3">
														<p className="text-muted mb-2 fs-8 fw-bold">POPULAR DESTINATIONS</p>
														<ul className="list-unstyled ps-2">
															{destinationsData.slice(0, 4).map((destination) => (
																<li key={destination.id} className="mb-2">
																	<Link 
																		href={destination.href} 
																		onClick={handleMenuItemClick}
																		className="d-flex align-items-center text-decoration-none"
																	>
																		<div 
																			className="me-3 rounded"
																			style={{
																				width: '30px',
																				height: '20px',
																				backgroundImage: `url(${destination.image})`,
																				backgroundSize: 'cover',
																				backgroundPosition: 'center'
																			}}
																		></div>
																		<span className="fs-7 text-dark">{destination.name}</span>
																	</Link>
																</li>
															))}
														</ul>
													</li>
													
												
												</ul>
											)}
										</li>
										
										{/* Existing Menu Items */}
										{menuItems && menuItems.length > 0 ? menuItems.map((item: any, index: number) => (
											<li key={item._id || index}>
												<Link href={item.link} onClick={handleMenuItemClick}>{item.name}</Link>
											</li>
										)) : header?.mainMenu?.map((item: any, index: number) => (
											<li key={item._id || index}>
												<Link href={item.link} onClick={handleMenuItemClick}>{item.name}</Link>
											</li>
										))}
									</ul>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
