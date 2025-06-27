"use client"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getOther } from "@/redux/actions/otherActions"
import { AppDispatch, RootState } from "@/redux/store"
import { toast } from "sonner"
import { uploadImageToCloudinary } from "@/utils/cloudinary"

interface Contact1Props {
	previewData?: any;
}

export default function Contact1({ previewData }: Contact1Props = {}) {
	const [data, setData] = useState<any>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isUploadingImages, setIsUploadingImages] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: ''
	})
	const [selectedImages, setSelectedImages] = useState<File[]>([])
	const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
	const [previewUrls, setPreviewUrls] = useState<string[]>([])
	const formRef = useRef<HTMLFormElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const dispatch = useDispatch<AppDispatch>()
	const { other, loading } = useSelector((state: RootState) => state.other)

	useEffect(() => {
		// Fetch other data if not provided in preview
		if (!previewData) {
			dispatch(getOther())
		}
	}, [dispatch, previewData])
		
	useEffect(() => {
		// If preview data is provided, use it
		if (previewData && previewData.contact1) {
			setData(previewData.contact1);
		} 
		// Otherwise use Redux data
		else if (other && other.contact1) {
			setData(other.contact1);
		}
	}, [previewData, other])

	// Handle image selection
	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		const maxFiles = 5 // Maximum 5 images
		
		if (selectedImages.length + files.length > maxFiles) {
			toast.error(`En fazla ${maxFiles} görsel yükleyebilirsiniz`)
			return
		}

		// Validate file types and sizes
		const validFiles = files.filter(file => {
			const isValidType = file.type.startsWith('image/')
			const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB max
			
			if (!isValidType) {
				toast.error(`${file.name} geçerli bir görsel dosyası değil`)
				return false
			}
			if (!isValidSize) {
				toast.error(`${file.name} dosyası çok büyük (max 5MB)`)
				return false
			}
			return true
		})

		if (validFiles.length > 0) {
			setSelectedImages(prev => [...prev, ...validFiles])
			
			// Create preview URLs
			const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
			setPreviewUrls(prev => [...prev, ...newPreviewUrls])
		}
	}

	// Remove selected image
	const removeImage = (index: number) => {
		setSelectedImages(prev => prev.filter((_, i) => i !== index))
		setPreviewUrls(prev => {
			// Revoke the URL to free memory
			URL.revokeObjectURL(prev[index])
			return prev.filter((_, i) => i !== index)
		})
		setUploadedImageUrls(prev => prev.filter((_, i) => i !== index))
	}

	// Upload images to Cloudinary
	const uploadImages = async (): Promise<string[]> => {
		if (selectedImages.length === 0) return []
		
		setIsUploadingImages(true)
		const uploadPromises = selectedImages.map(file => uploadImageToCloudinary(file))
		
		try {
			const urls = await Promise.all(uploadPromises)
			setUploadedImageUrls(urls)
			return urls
		} catch (error) {
			console.error('Error uploading images:', error)
			toast.error('Görseller yüklenirken hata oluştu')
			throw error
		} finally {
			setIsUploadingImages(false)
		}
	}

	// Create dynamic styles for button colors
	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const styleId = 'contact1-dynamic-styles';
		let existingStyle = document.getElementById(styleId);
		
		if (existingStyle) {
			existingStyle.remove();
		}
		
		if (!data) return;
		
		const buttonColor = data.buttonColor || "#6342EC";
		const buttonTextColor = data.buttonTextColor || "#FFFFFF";
		
		const style = document.createElement('style');
		style.id = styleId;
		style.innerHTML = `
			.contact1-submit-btn {
				background-color: ${buttonColor} !important;
				color: ${buttonTextColor} !important;
				border: none !important;
			}
			.contact1-submit-btn:hover {
				background-color: ${buttonColor} !important;
				color: ${buttonTextColor} !important;
				opacity: 0.9;
			}
			.contact1-submit-btn:disabled {
				background-color: ${buttonColor} !important;
				color: ${buttonTextColor} !important;
				opacity: 0.6;
			}
		`;
		document.head.appendChild(style);
		
		return () => {
			const styleToRemove = document.getElementById(styleId);
			if (styleToRemove) {
				styleToRemove.remove();
			}
		};
	}, [data]);

	// Clean up preview URLs on unmount
	useEffect(() => {
		return () => {
			previewUrls.forEach(url => URL.revokeObjectURL(url))
		}
	}, [])

	if (!data || loading) {
		return <section>Contact1 Loading...</section>
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		
		try {
			const formDataObj = new FormData(e.currentTarget);
			let imageUrls: string[] = []
			
			// Upload images first if any are selected
			if (selectedImages.length > 0) {
				try {
					imageUrls = await uploadImages()
				} catch (error) {
					// If image upload fails, don't submit the form
					setIsSubmitting(false)
					return
				}
			}
			
			const formValues = {
				name: formDataObj.get('name') as string,
				email: formDataObj.get('email') as string,
				phone: formDataObj.get('phone') as string || '',
				subject: formDataObj.get('subject') as string,
				message: formDataObj.get('message') as string,
				images: imageUrls
			};

			console.log('Form values:', formValues);

			// Send the form data to our API
			const response = await fetch('/api/contact-form', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formValues),
			});
			
			console.log('Response status:', response.status);
			const responseData = await response.json();
			console.log('Response data:', responseData);
			
			if (!response.ok) {
				console.log('Response not ok, throwing error');
				throw new Error(responseData.error || 'Form could not be sent');
			}
			
			console.log('Form submitted successfully, showing toast');
			toast.success('Your message has been sent successfully!');
			
			// Reset the form safely using ref
			if (formRef.current) {
				formRef.current.reset();
				console.log('Form reset successfully');
			}
			
			// Also reset the form state
			setFormData({
				name: '',
				email: '',
				phone: '',
				subject: '',
				message: ''
			});
			
			// Reset image states
			setSelectedImages([])
			setUploadedImageUrls([])
			previewUrls.forEach(url => URL.revokeObjectURL(url))
			setPreviewUrls([])
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
			
			setIsSubmitted(true);
			
			// Reset the submitted state after 3 seconds
			setTimeout(() => {
				setIsSubmitted(false);
			}, 3000);
		} catch (error: any) {
			console.error('Error sending form:', error);
			toast.error(error.message || 'Form could not be sent. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Create styles for customizable elements
	const sectionStyle = {
		backgroundColor: data.backgroundColor || "#ffffff"
	};

	const titleStyle = {
		color: data.titleColor || "#111827"
	};

	const descriptionStyle = {
		color: data.descriptionColor || "#6E6E6E"
	};

	// Get badge background color or use default
	const badgeStyle = {
		backgroundColor: data.badgeColor || "rgba(99, 66, 236, 0.1)",
		display: data.badgeVisible !== false ? "flex" : "none"
	};

	// Get button background color or use default
	const buttonStyle = {
		backgroundColor: data.buttonColor || "#6342EC",
		color: data.buttonTextColor || "#ffffff"
	};

	// Add badge text color style
	const badgeTextStyle = {
		color: data.badgeTextColor || "#6342EC"
	};

	return (
		<>
			<style jsx global>{`
				/* Contact section specific styles */
				.section-contact-3 {
					width: 100%;
					margin: 0;
					padding: 80px 0;
					box-sizing: border-box;
					position: relative;
					overflow: hidden;
				}
				
				.section-contact-3 .container {
					width: 100%;
					max-width: 1140px;
					margin: 0 auto;
					padding: 0 15px;
				}
				
				.section-contact-3 .row {
					display: flex;
					flex-wrap: wrap;
					margin: 0 -15px;
					width: 100%;
				}
				
				.section-contact-3 .col-lg-6 {
					width: 100%;
					padding: 0 15px;
				}
				
				@media (min-width: 992px) {
					.section-contact-3 .col-lg-6 {
						flex: 0 0 50%;
						max-width: 50%;
					}
					
					.section-contact-3 .col-lg-10 {
						flex: 0 0 83.333333%;
						max-width: 83.333333%;
					}
				}
				
				.section-contact-3 .mt-8 {
					margin-top: 2rem;
				}
				
				@media (min-width: 768px) {
					.section-contact-3 .mt-8 {
						margin-top: 3rem;
					}
				}
				
				.section-contact-3 form {
					width: 100%;
				}

				/* Image upload styles */
				.image-upload-area {
					border: 2px dashed #ddd;
					border-radius: 8px;
					padding: 20px;
					text-align: center;
					cursor: pointer;
					transition: border-color 0.3s ease;
				}
				
				.image-upload-area:hover {
					border-color: #6342EC;
				}
				
				.image-preview-grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
					gap: 10px;
					margin-top: 15px;
				}
				
				.image-preview-item {
					position: relative;
					aspect-ratio: 1;
					border-radius: 8px;
					overflow: hidden;
					border: 2px solid #ddd;
				}
				
				.image-preview-item img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
				
				.image-remove-btn {
					position: absolute;
					top: 5px;
					right: 5px;
					background: rgba(255, 0, 0, 0.8);
					color: white;
					border: none;
					border-radius: 50%;
					width: 24px;
					height: 24px;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
				}
			`}</style>
			<section className="section-contact-3 position-relative py-5 fix" style={sectionStyle}>
				<div className="container position-relative z-1">
					<div className="text-center">
						{data.badgeVisible !== false && (
							<div className="d-flex align-items-center justify-content-center border border-2 border-white d-inline-flex rounded-pill px-4 py-2" style={badgeStyle}>
								<span className="tag-spacing fs-7 fw-bold ms-2 text-uppercase" style={badgeTextStyle}>{data.badge}</span>
							</div>
						)}
						<h3 className="ds-3 mt-3 mb-3" style={titleStyle}>{data.title}</h3>
						<p className="fs-5" dangerouslySetInnerHTML={{ __html: data.description }} style={descriptionStyle}></p>
					</div>
					<div className="row mt-8">
						<div className="col-lg-10 mx-lg-auto">
							<div className="row">
								<div className="col-lg-6 ps-lg-0 pb-5 pb-lg-0">
									<h4 className="text-center text-lg-start">{data.formTitle}</h4>
									<form ref={formRef} onSubmit={handleSubmit} className="px-3 px-lg-0">
										<div className="row mt-5">
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M12 11.25C13.7949 11.25 15.25 9.79493 15.25 8C15.25 6.20507 13.7949 4.75 12 4.75C10.2051 4.75 8.75 6.20507 8.75 8C8.75 9.79493 10.2051 11.25 12 11.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M6.84723 19.25H17.1522C18.2941 19.25 19.1737 18.2681 18.6405 17.2584C17.856 15.7731 16.0677 14 11.9997 14C7.93174 14 6.1434 15.7731 5.35897 17.2584C4.8257 18.2681 5.70531 19.25 6.84723 19.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input 
														type="text" 
														className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" 
														name="name" 
														placeholder="Your Name *" 
														aria-label="username" 
														value={formData.name}
														onChange={(e) => setFormData({...formData, name: e.target.value})}
														required 
													/>
												</div>
											</div>
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center mt-4 mt-md-0" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M5.5 6.5L12 12.25L18.5 6.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input 
														type="email" 
														className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" 
														name="email" 
														placeholder="example@email.com" 
														aria-label="email" 
														value={formData.email}
														onChange={(e) => setFormData({...formData, email: e.target.value})}
														required 
													/>
												</div>
											</div>
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center mt-4" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M8.89286 4.75H6.06818C5.34017 4.75 4.75 5.34017 4.75 6.06818C4.75 13.3483 10.6517 19.25 17.9318 19.25C18.6598 19.25 19.25 18.6598 19.25 17.9318V15.1071L16.1429 13.0357L14.5317 14.6468C14.2519 14.9267 13.8337 15.0137 13.4821 14.8321C12.8858 14.524 11.9181 13.9452 10.9643 13.0357C9.98768 12.1045 9.41548 11.1011 9.12829 10.494C8.96734 10.1537 9.06052 9.76091 9.32669 9.49474L10.9643 7.85714L8.89286 4.75Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input 
														type="tel" 
														className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" 
														name="phone" 
														placeholder="Phone (optional)" 
														aria-label="phone" 
														value={formData.phone}
														onChange={(e) => setFormData({...formData, phone: e.target.value})}
													/>
												</div>
											</div>
											<div className="col-md-6 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex align-items-center mt-4" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input border border-end-0 rounded-2 rounded-end-0 ps-3">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-dark" d="M6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V9.75001L12 4.75L4.75 9.75001V17.25C4.75 18.3546 5.64544 19.25 6.75 19.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M9.75 15.749C9.75 14.6444 10.6455 13.749 11.75 13.749H12.25C13.3546 13.749 14.25 14.6444 14.25 15.749V19.249H9.75V15.749Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														</svg>
													</div>
													<input 
														type="text" 
														className="form-control ms-0 border rounded-2 rounded-start-0 border-start-0" 
														name="subject" 
														placeholder="Subject" 
														aria-label="subject" 
														value={formData.subject}
														onChange={(e) => setFormData({...formData, subject: e.target.value})}
														required 
													/>
												</div>
											</div>
											<div className="col-12 d-flex justify-content-center justify-content-md-start">
												<div className="input-group d-flex mt-4" style={{ maxWidth: '100%', width: '100%' }}>
													<div className="icon-input pt-2 ps-3 align-items-start border border-end-0 rounded-1 rounded-end-0">
														<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none">
															<path className="stroke-dark" d="M5.5 2.14844H3C1.89543 2.14844 1 3.04387 1 4.14844V14.6484C1 15.753 1.89543 16.6484 3 16.6484H13.5C14.6046 16.6484 15.5 15.753 15.5 14.6484V12.1484" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
															<path className="stroke-dark" d="M17.3285 1.20344L16.4448 0.319749C16.0185 -0.106583 15.3248 -0.106583 14.8984 0.319749L7.82915 7.38907C7.76373 7.45449 7.71914 7.53782 7.70096 7.62854L7.2591 9.83772C7.22839 9.99137 7.27647 10.1502 7.38729 10.261C7.47605 10.3498 7.59561 10.3983 7.71864 10.3983C7.74923 10.3983 7.77997 10.3953 7.81053 10.3892L10.0197 9.94732C10.1104 9.92917 10.1938 9.88455 10.2592 9.81913L17.3285 2.74984C17.3285 2.74984 17.3286 2.74984 17.3286 2.74981C17.7549 2.32351 17.7549 1.6298 17.3285 1.20344ZM9.69678 9.05607L8.31606 9.33225L8.59224 7.95153L14.3461 2.19754L15.4507 3.30214L9.69678 9.05607ZM16.6658 2.0871L16.1135 2.6394L15.0089 1.53479L15.5612 0.982524C15.6221 0.921601 15.7212 0.92157 15.7821 0.982493L16.6658 1.86618C16.7267 1.92707 16.7267 2.0262 16.6658 2.0871Z" fill="black" />
														</svg>
													</div>
													<textarea 
														className="form-control border border-start-0 ms-0 rounded-start-0 rounded-1 pb-10" 
														name="message" 
														placeholder="Briefly Describe Your Message" 
														aria-label="With textarea" 
														value={formData.message}
														onChange={(e) => setFormData({...formData, message: e.target.value})}
														required
													></textarea>
												</div>
											</div>
											
											{/* Image Upload Section */}
											<div className="col-12 mt-4">
												<div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
													<input
														ref={fileInputRef}
														type="file"
														multiple
														accept="image/*"
														onChange={handleImageSelect}
														style={{ display: 'none' }}
													/>
													<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
														<circle cx="9" cy="9" r="2"/>
														<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
													</svg>
													<p className="mt-2 mb-0">Görsel Yükle (İsteğe bağlı)</p>
													<p className="text-muted small mb-0">En fazla 5 görsel, her biri max 5MB</p>
												</div>
												
												{/* Image Previews */}
												{previewUrls.length > 0 && (
													<div className="image-preview-grid">
														{previewUrls.map((url, index) => (
															<div key={index} className="image-preview-item">
																<img src={url} alt={`Preview ${index + 1}`} />
																<button
																	type="button"
																	className="image-remove-btn"
																	onClick={() => removeImage(index)}
																	title="Remove image"
																>
																	×
																</button>
															</div>
														))}
													</div>
												)}
											</div>
											
											<div className="col-12 text-center text-lg-start">
												<button 
													type="submit" 
													className="btn text-white hover-up mt-4 d-flex align-items-center justify-content-center mx-auto mx-lg-0 contact1-submit-btn" 
													style={{...buttonStyle, maxWidth: '200px'}}
													disabled={isSubmitting || isSubmitted || isUploadingImages}
												>
													<span>
														{isUploadingImages 
															? 'Görseller Yükleniyor...'
															: isSubmitting 
																? (data.buttonSubmittingText || 'Sending...') 
																: isSubmitted 
																	? (data.buttonSubmittedText || 'Sent') 
																	: (data.buttonText || 'Send Message')
														}
													</span>
													{!isUploadingImages && (
														<svg className="ms-2" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
															<path className="stroke-white" d="M21.1059 12.2562H0.5V11.7443H21.1059H22.313L21.4594 10.8907L17.0558 6.48705L17.4177 6.12508L23.2929 12.0002L17.4177 17.8754L17.0558 17.5134L21.4594 13.1098L22.313 12.2562H21.1059Z" fill="black" stroke="white" />
														</svg>
													)}
												</button>
											</div>
										</div>
									</form>
								</div>
								<div className="col-lg-6">
									<div className="ps-lg-6 mt-4 mt-lg-0">
										{data.showEmail && (
											<>
												<h6 className="text-center text-lg-start">{data.emailTitle}</h6>
												<p className="text-500 text-center text-lg-start">{data.emailDescription}</p>
												<div className="d-flex mb-5 justify-content-center justify-content-lg-start">
													<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
														<path d="M18.2422 2.96875H1.75781C0.786602 2.96875 0 3.76023 0 4.72656V15.2734C0 16.2455 0.792383 17.0312 1.75781 17.0312H18.2422C19.2053 17.0312 20 16.2488 20 15.2734V4.72656C20 3.76195 19.2165 2.96875 18.2422 2.96875ZM17.996 4.14062C17.6369 4.49785 11.4564 10.6458 11.243 10.8581C10.9109 11.1901 10.4695 11.3729 10 11.3729C9.53047 11.3729 9.08906 11.1901 8.75594 10.857C8.61242 10.7142 2.50012 4.63414 2.00398 4.14062H17.996ZM1.17188 15.0349V4.96582L6.23586 10.0031L1.17188 15.0349ZM2.00473 15.8594L7.06672 10.8296L7.9284 11.6867C8.48176 12.2401 9.21746 12.5448 10 12.5448C10.7825 12.5448 11.5182 12.2401 12.0705 11.6878L12.9333 10.8296L17.9953 15.8594H2.00473ZM18.8281 15.0349L13.7641 10.0031L18.8281 4.96582V15.0349Z" fill="#6B7280" />
													</svg>
													<Link className="ms-2 text-decoration-underline text-900 fs-7" href="#">{data.supportEmail}</Link>
												</div>
											</>
										)}
										
										{data.showPhone && (
											<>
												<h6 className="text-center text-lg-start">{data.inquiryTitle}</h6>
												<p className="text-500 text-center text-lg-start">{data.inquiryDescription}</p>
												<div className="d-flex mb-4 justify-content-center justify-content-lg-start">
													<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
														<g clipPath="url(#clip0_602_10701)">
															<path d="M15.8064 12.3892C15.397 11.9628 14.9031 11.7349 14.3797 11.7349C13.8605 11.7349 13.3624 11.9586 12.936 12.385L11.6022 13.7146C11.4924 13.6555 11.3827 13.6006 11.2771 13.5458C11.1252 13.4698 10.9816 13.398 10.8592 13.3221C9.60978 12.5285 8.47429 11.4943 7.38524 10.1562C6.8576 9.48926 6.50302 8.92785 6.24553 8.358C6.59166 8.04141 6.91247 7.71216 7.22484 7.39558C7.34303 7.27739 7.46122 7.15497 7.57941 7.03678C8.46585 6.15034 8.46585 5.00219 7.57941 4.11576L6.42704 2.96338C6.29619 2.83253 6.16111 2.69745 6.03447 2.56238C5.78121 2.30067 5.51527 2.03051 5.2409 1.77725C4.83145 1.37202 4.3418 1.15674 3.82682 1.15674C3.31184 1.15674 2.81375 1.37202 2.39163 1.77725C2.38741 1.78147 2.38741 1.78147 2.38319 1.78569L0.948004 3.23354C0.407699 3.77384 0.099556 4.43234 0.0320178 5.19637C-0.0692895 6.42894 0.293728 7.57709 0.572323 8.32845C1.25615 10.1731 2.27766 11.8826 3.80149 13.7146C5.65035 15.9223 7.87489 17.6656 10.416 18.894C11.3869 19.3541 12.6828 19.8986 14.1306 19.9914C14.2193 19.9957 14.3121 19.9999 14.3965 19.9999C15.3716 19.9999 16.1905 19.6495 16.8321 18.9531C16.8364 18.9446 16.8448 18.9404 16.849 18.9319C17.0685 18.666 17.3218 18.4254 17.5877 18.1679C17.7692 17.9949 17.955 17.8133 18.1365 17.6234C18.5544 17.1886 18.7739 16.6821 18.7739 16.1629C18.7739 15.6395 18.5501 15.1371 18.1238 14.715L15.8064 12.3892ZM17.3176 16.834C17.3134 16.834 17.3134 16.8383 17.3176 16.834C17.153 17.0113 16.9841 17.1717 16.8026 17.349C16.5282 17.6107 16.2496 17.8851 15.9879 18.1932C15.5616 18.6491 15.0593 18.8644 14.4008 18.8644C14.3375 18.8644 14.2699 18.8644 14.2066 18.8602C12.9529 18.78 11.7879 18.2903 10.9141 17.8724C8.52495 16.7158 6.42704 15.0738 4.68371 12.9928C3.2443 11.2579 2.28188 9.65389 1.64449 7.93166C1.25193 6.8806 1.10841 6.0617 1.17172 5.28923C1.21394 4.79536 1.40389 4.38591 1.75424 4.03555L3.19365 2.59615C3.40049 2.40197 3.61998 2.29645 3.83526 2.29645C4.10119 2.29645 4.31647 2.45685 4.45155 2.59192C4.45577 2.59615 4.45999 2.60037 4.46421 2.60459C4.7217 2.84519 4.96653 3.09424 5.22402 3.36017C5.35487 3.49525 5.48995 3.63032 5.62502 3.76962L6.77739 4.92199C7.22483 5.36943 7.22483 5.7831 6.77739 6.23055C6.65498 6.35296 6.53679 6.47537 6.41438 6.59356C6.0598 6.95658 5.72211 7.29427 5.35487 7.62352C5.34643 7.63196 5.33799 7.63618 5.33377 7.64463C4.97075 8.00764 5.03829 8.36222 5.11427 8.60282C5.11849 8.61549 5.12271 8.62815 5.12693 8.64081C5.42663 9.36685 5.84874 10.0507 6.49036 10.8654L6.49458 10.8696C7.65961 12.3048 8.88796 13.4234 10.2429 14.2803C10.416 14.39 10.5933 14.4786 10.7621 14.5631C10.9141 14.639 11.0576 14.7108 11.18 14.7868C11.1969 14.7952 11.2138 14.8079 11.2307 14.8163C11.3742 14.8881 11.5093 14.9219 11.6486 14.9219C11.9989 14.9219 12.2184 14.7024 12.2902 14.6306L13.7338 13.187C13.8773 13.0435 14.1053 12.8704 14.3712 12.8704C14.6329 12.8704 14.8482 13.035 14.9791 13.1785C14.9833 13.1828 14.9833 13.1828 14.9875 13.187L17.3134 15.5128C17.7481 15.9434 17.7481 16.3866 17.3176 16.834Z" fill="#6B7280" />
														</g>
														<defs>
															<clipPath id="clip0_602_10701">
																<rect width={20} height={20} fill="white" />
															</clipPath>
														</defs>
													</svg>
													<Link className="ms-2 text-decoration-underline text-900 fs-5 " href={`tel:${data.phoneNumber}`}>{data.phoneNumber}</Link>
												</div>
											</>
										)}

										{data.showAddress && (
											<>
												<h6 className="text-center text-lg-start">{data.addressTitle}</h6>
												<p className="text-500 text-center text-lg-start">{data.addressDescription}</p>
												<div className="d-flex mb-4 justify-content-center justify-content-lg-start">
													<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
														<path d="M10.0001 1.66675C7.69727 1.66675 5.83341 3.5306 5.83341 5.83341C5.83341 8.89175 10.0001 14.1667 10.0001 14.1667C10.0001 14.1667 14.1667 8.89175 14.1667 5.83341C14.1667 3.5306 12.3029 1.66675 10.0001 1.66675ZM10.0001 7.50008C9.08341 7.50008 8.33341 6.75008 8.33341 5.83341C8.33341 4.91675 9.08341 4.16675 10.0001 4.16675C10.9167 4.16675 11.6667 4.91675 11.6667 5.83341C11.6667 6.75008 10.9167 7.50008 10.0001 7.50008Z" fill="#6B7280"/>
													</svg>
													<span className="ms-2 text-900 fs-7">{data.address}</span>
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="rotate-center ellipse-rotate-success position-absolute z-0" />
				<div className="rotate-center-rev ellipse-rotate-primary position-absolute z-0" />
				<div className="rotate-center-rev ellipse-rotate-info position-absolute z-0" />
			</section>
		</>
	)
}
