import Link from 'next/link'
import MobileMenu from '../MobileMenu'
import Search from '../Search'
import OffCanvas from '../OffCanvas'
import ThemeSwitch from '@/components/elements/ThemeSwitch'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getHeader } from '@/redux/actions/headerActions'
import { getMyProfile } from '@/redux/actions/userActions'

import { User } from 'lucide-react'

export default function Header2({ scroll, hideHeader, isMobileMenu, handleMobileMenu, isSearch, handleSearch, isOffCanvas, handleOffCanvas }: any) {
	const dispatch = useDispatch();
	const { header, loading } = useSelector((state: RootState) => state.header);
	const { user } = useSelector((state: RootState) => state.user);

	const [showDestinations, setShowDestinations] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [showHotels, setShowHotels] = useState(false);
	const [activeCategory, setActiveCategory] = useState('trending');

	// Always fetch header data when component mounts
	useEffect(() => {
		dispatch(getHeader() as any);
		dispatch(getMyProfile() as any);
	}, [dispatch]) // Dependency on dispatch ensures this runs only when dispatch changes (effectively once)

	// Display loading state while header data is being fetched
	if (loading || !header) {
		return 
	}



	return (
		<>
			<header>
				<nav 
					className={`navbar navbar-expand-lg navbar-light w-100 z-9 ${scroll ? 'navbar-stick' : ''}`} 
					style={{ 
						position: `${scroll ? "fixed" : "relative"}`, 
						top: `${scroll ? (hideHeader ? "-100px" : "0") : "auto"}`, 
						bottom: `${scroll ? "auto" : "0"}`,
						transition: "top 0.3s ease-in-out"
					}}
				>
					<div className="container-fluid px-md-8 px-2">
						<Link className="navbar-brand d-flex main-logo align-items-center gap-3" href="/">
							<img 
								src={header.logo.src} 
								alt={header.logo.alt} 
								style={{ 
									maxWidth: '40px', 
									maxHeight: '40px', 
									width: 'auto', 
									height: 'auto', 
									objectFit: 'contain' 
								}} 
							/>
							<span>{header.logo.text}</span>
						</Link>
						
						{/* Custom menu with Destinations dropdown */}
						<div className="d-none d-lg-flex">
							<ul className="navbar-nav mx-auto gap-4 align-items-lg-center">
																{/* Destinations Dropdown - Only show if enabled in header settings */}
								{header?.showDestinationsDropdown && (
									<li 
										className="nav-item dropdown position-relative"
										onMouseEnter={() => setShowDestinations(true)}
										onMouseLeave={() => setShowDestinations(false)}
									>
										<span
											className="nav-link fw-bold d-flex align-items-center"
											style={{ cursor: 'pointer' }}
										>
											Destinations
										</span>
									
									{/* Destinations Dropdown Menu */}
									<div 
										className={`dropdown-menu destinations-dropdown ${showDestinations ? 'show' : ''}`}
										style={{
											display: showDestinations ? 'block' : 'none',
											position: 'absolute',
											top: 'calc(100% + 0px)',
											left: '50%',
											transform: 'translateX(-50%)',
											width: '400px',
											padding: '25px',
											border: 'none',
											borderRadius: '12px',
											boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
											backgroundColor: '#fff',
											zIndex: 1000
										}}
									>
										<div className="row">
											{header?.destinationsCategories && header.destinationsCategories.length > 0 ? (
												<>
													{header.destinationsCategories.map((category: string, index: number) => (
														<div key={index} className="col-12 mb-3">
															<Link 
																href={`/blog/kategori?category=${category}`}
																className="text-decoration-none d-block p-3 rounded hover-bg-light"
																style={{ 
																	transition: 'all 0.2s ease',
																	border: '1px solid transparent'
																}}
																onMouseEnter={(e) => {
																	e.currentTarget.style.backgroundColor = '#f8f9fa';
																	e.currentTarget.style.borderColor = '#e9ecef';
																	e.currentTarget.style.transform = 'translateY(-2px)';
																}}
																onMouseLeave={(e) => {
																	e.currentTarget.style.backgroundColor = 'transparent';
																	e.currentTarget.style.borderColor = 'transparent';
																	e.currentTarget.style.transform = 'translateY(0)';
																}}
															>
																<h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '12px' }}>
																	{category}
																</h5>
															</Link>
														</div>
													))}
													{/* View All Option */}
													<div className="col-12 mb-3 mt-2 pt-2" style={{ borderTop: '1px solid #e9ecef' }}>
														<Link 
															href={`/blog/kategori?category=${header.destinationsCategories.join(',')}`}
															className="text-decoration-none d-block p-3 rounded hover-bg-light text-center"
															style={{ 
																transition: 'all 0.2s ease',
																border: '1px solid transparent',
																fontWeight: 'bold'
															}}
															onMouseEnter={(e) => {
																e.currentTarget.style.backgroundColor = '#f8f9fa';
																e.currentTarget.style.borderColor = '#e9ecef';
																e.currentTarget.style.transform = 'translateY(-2px)';
															}}
															onMouseLeave={(e) => {
																e.currentTarget.style.backgroundColor = 'transparent';
																e.currentTarget.style.borderColor = 'transparent';
																e.currentTarget.style.transform = 'translateY(0)';
															}}
														>
															<h5 className="mb-0 text-primary fw-bold" style={{ fontSize: '12px' }}>
																View All Destinations
															</h5>
														</Link>
													</div>
												</>
											) : (
												<div className="col-12 mb-3">
													<div className="text-center p-3 text-muted">
														<small>Kategoriler seçilmemiş</small>
													</div>
												</div>
											)}
										</div>
									</div>
								</li>
								)}
								
								{/* Hotels Dropdown - Only show if enabled in header settings */}
								{header?.showHotelsDropdown && (
									<li 
										className="nav-item dropdown position-relative"
										onMouseEnter={() => setShowHotels(true)}
										onMouseLeave={() => setShowHotels(false)}
									>
										<span
											className="nav-link fw-bold d-flex align-items-center"
											style={{ cursor: 'pointer' }}
										>
											Hotels
										</span>
									
									{/* Hotels Dropdown Menu */}
									<div 
										className={`dropdown-menu destinations-dropdown ${showHotels ? 'show' : ''}`}
										style={{
											display: showHotels ? 'block' : 'none',
											position: 'absolute',
											top: 'calc(100% + 0px)',
											left: '50%',
											transform: 'translateX(-50%)',
											width: '400px',
											padding: '25px',
											border: 'none',
											borderRadius: '12px',
											boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
											backgroundColor: '#fff',
											zIndex: 1000
										}}
									>
										<div className="row">
											{header?.hotelsCategories && header.hotelsCategories.length > 0 ? (
												<>
													{header.hotelsCategories.map((category: string, index: number) => (
														<div key={index} className="col-12 mb-3">
															<Link 
																href={`/blog/kategori?category=${category}`}
																className="text-decoration-none d-block p-3 rounded hover-bg-light"
																style={{ 
																	transition: 'all 0.2s ease',
																	border: '1px solid transparent'
																}}
																onMouseEnter={(e) => {
																	e.currentTarget.style.backgroundColor = '#f8f9fa';
																	e.currentTarget.style.borderColor = '#e9ecef';
																	e.currentTarget.style.transform = 'translateY(-2px)';
																}}
																onMouseLeave={(e) => {
																	e.currentTarget.style.backgroundColor = 'transparent';
																	e.currentTarget.style.borderColor = 'transparent';
																	e.currentTarget.style.transform = 'translateY(0)';
																}}
															>
																<h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '12px' }}>
																	{category}
																</h5>
															</Link>
														</div>
													))}
													{/* View All Option */}
													<div className="col-12 mb-3 mt-2 pt-2" style={{ borderTop: '1px solid #e9ecef' }}>
														<Link 
															href={`/blog/kategori?category=${header.hotelsCategories.join(',')}`}
															className="text-decoration-none d-block p-3 rounded hover-bg-light text-center"
															style={{ 
																transition: 'all 0.2s ease',
																border: '1px solid transparent',
																fontWeight: 'bold'
															}}
															onMouseEnter={(e) => {
																e.currentTarget.style.backgroundColor = '#f8f9fa';
																e.currentTarget.style.borderColor = '#e9ecef';
																e.currentTarget.style.transform = 'translateY(-2px)';
															}}
															onMouseLeave={(e) => {
																e.currentTarget.style.backgroundColor = 'transparent';
																e.currentTarget.style.borderColor = 'transparent';
																e.currentTarget.style.transform = 'translateY(0)';
															}}
														>
															<h5 className="mb-0 text-primary fw-bold" style={{ fontSize: '12px' }}>
																View All Hotels
															</h5>
														</Link>
													</div>
												</>
											) : (
												<div className="col-12 mb-3">
													<div className="text-center p-3 text-muted">
														<small>Kategoriler seçilmemiş</small>
													</div>
												</div>
											)}
										</div>
									</div>
								</li>
								)}
								
								{/* More Dropdown - Only show if enabled in header settings */}
								{header?.showMoreDropdown && (
									<li 
										className="nav-item dropdown position-relative"
										onMouseEnter={() => setShowMore(true)}
										onMouseLeave={() => setShowMore(false)}
									>
										<span
											className="nav-link fw-bold d-flex align-items-center"
											style={{ cursor: 'pointer' }}
										>
											More
										</span>
									
									{/* More Dropdown Menu */}
									<div 
										className={`dropdown-menu destinations-dropdown ${showMore ? 'show' : ''}`}
										style={{
											display: showMore ? 'block' : 'none',
											position: 'absolute',
											top: 'calc(100% + 0px)',
											left: '50%',
											transform: 'translateX(-50%)',
											width: '400px',
											padding: '25px',
											border: 'none',
											borderRadius: '12px',
											boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
											backgroundColor: '#fff',
											zIndex: 1000
										}}
									>
										<div className="row">
											{header?.moreCategories && header.moreCategories.length > 0 ? (
												<>
													{header.moreCategories.map((category: string, index: number) => (
														<div key={index} className="col-12 mb-3">
															<Link 
																href={`/blog/kategori?category=${category}`}
																className="text-decoration-none d-block p-3 rounded hover-bg-light"
																style={{ 
																	transition: 'all 0.2s ease',
																	border: '1px solid transparent'
																}}
																onMouseEnter={(e) => {
																	e.currentTarget.style.backgroundColor = '#f8f9fa';
																	e.currentTarget.style.borderColor = '#e9ecef';
																	e.currentTarget.style.transform = 'translateY(-2px)';
																}}
																onMouseLeave={(e) => {
																	e.currentTarget.style.backgroundColor = 'transparent';
																	e.currentTarget.style.borderColor = 'transparent';
																	e.currentTarget.style.transform = 'translateY(0)';
																}}
															>
																<h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '12px' }}>
																	{category}
																</h5>
															</Link>
														</div>
													))}
													{/* View All Option */}
													<div className="col-12 mb-3 mt-2 pt-2" style={{ borderTop: '1px solid #e9ecef' }}>
														<Link 
															href={`/blog/kategori?category=${header.moreCategories.join(',')}`}
															className="text-decoration-none d-block p-3 rounded hover-bg-light text-center"
															style={{ 
																transition: 'all 0.2s ease',
																border: '1px solid transparent',
																fontWeight: 'bold'
															}}
															onMouseEnter={(e) => {
																e.currentTarget.style.backgroundColor = '#f8f9fa';
																e.currentTarget.style.borderColor = '#e9ecef';
																e.currentTarget.style.transform = 'translateY(-2px)';
															}}
															onMouseLeave={(e) => {
																e.currentTarget.style.backgroundColor = 'transparent';
																e.currentTarget.style.borderColor = 'transparent';
																e.currentTarget.style.transform = 'translateY(0)';
															}}
														>
															<h5 className="mb-0 text-primary fw-bold" style={{ fontSize: '12px' }}>
																View All More
															</h5>
														</Link>
													</div>
												</>
											) : (
												<div className="col-12 mb-3">
													<div className="text-center p-3 text-muted">
														<small>Kategoriler seçilmemiş</small>
													</div>
												</div>
											)}
										</div>
									</div>
								</li>
								)}
								
								{/* Existing Menu Items */}
								{header.mainMenu?.map((item: any) => (
									<li key={item._id || `menu-item-${item.name}`} className="nav-item">
										<Link
											className="nav-link fw-bold d-flex align-items-center"
											href={item.link || "#"}
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="d-flex align-items-center pe-5 pe-lg-0 me-5 me-lg-0">
							{header.showDarkModeToggle && <ThemeSwitch />}
							
							{/* Profil Butonu - Kullanıcı giriş yapmışsa göster */}
							{user?._id && (
								<Link 
									href="/profile" 
									className="ms-2 d-flex align-items-center justify-content-center bg-white rounded icon-shape border icon-md"
									style={{
										width: '32px',
										height: '32px',
										color: '#111827'
									}}
								>
									<User size={18} />
								</Link>
							)}
							
							{header.showActionButton && (
								<Link 
									href={header.links.freeTrialLink.href} 
									className="btn d-none d-md-block ms-2"
									style={{
										backgroundColor: header.buttonColor || "#3b71fe",
										color: header.buttonTextColor || "#ffffff"
									}}
								>
									{header.links.freeTrialLink.text}
								</Link>
							)}
							<div 
								className="burger-icon burger-icon-white border rounded-3" 
								onClick={handleMobileMenu}
								style={{ backgroundColor: header.mobileMenuButtonColor || 'transparent' }}
							>
								<span className="burger-icon-top" />
								<span className="burger-icon-mid" />
								<span className="burger-icon-bottom" />
							</div>
						</div>
					</div>
				</nav>
				
				<OffCanvas handleOffCanvas={handleOffCanvas} isOffCanvas={isOffCanvas} />
				<Search isSearch={isSearch} handleSearch={handleSearch} />
				<MobileMenu 
					handleMobileMenu={handleMobileMenu} 
					isMobileMenu={isMobileMenu} 
					menuItems={header.mainMenu}
					socialLinks={header.socialLinks} 
				/>
			</header>

			{/* Custom CSS for destinations dropdown */}
			<style jsx>{`
				.destinations-dropdown {
					animation: fadeInUp 0.3s ease-out;
				}
				
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateX(-50%) translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateX(-50%) translateY(0);
					}
				}
				
				.destination-card {
					cursor: pointer;
				}
				
				.destination-card:hover {
					box-shadow: 0 5px 20px rgba(0,0,0,0.2);
				}
				
				.hover-bg-primary-soft:hover {
					background-color: #f0f7ff !important;
					color: #3b71fe !important;
				}
			`}</style>
		</>
	)
}
