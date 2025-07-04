"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { getAllContactForms, deleteContactForm } from '@/redux/actions/contactFormActions'
import { AppDispatch, RootState } from '@/redux/store'
import {
  ArrowLeft,
  Eye,
  Loader2,
  Mail,
  Phone,
  User,
  CalendarClock,
  Heading1,
  Trash2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { toast } from "sonner"

interface FormSubmission {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  images?: string[]
  createdAt: string
}

export default function ContactFormSubmissions() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { forms, loading, error } = useSelector((state: RootState) => state.contactForm)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    dispatch(getAllContactForms())
  }, [dispatch])

  const viewMessage = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    
    setIsDeleting(true)
    try {
      await dispatch(deleteContactForm(deletingId)).unwrap()
      toast.success('Form başarıyla silindi')
    } catch (error: any) {
      toast.error(error || 'Form silinemedi')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center border-b">
        <div className="flex items-center gap-2 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/dashboard/users')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Separator
            orientation="vertical"
            className="mx-4 h-6"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact Forms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Contact Form Submissions</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : forms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No form submissions yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>
                You have {forms.length} contact form {forms.length === 1 ? 'submission' : 'submissions'} in total.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((submission: FormSubmission) => (
                    <TableRow key={submission._id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.phone || "—"}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={submission.subject}>
                          {submission.subject}
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.images && submission.images.length > 0 ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {submission.images.length}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(submission.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewMessage(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(submission._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              View the complete message from {selectedSubmission?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Name</h4>
                  <p>{selectedSubmission.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Email</h4>
                  <p>{selectedSubmission.email}</p>
                </div>
              </div>

              {selectedSubmission.phone && (
                <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-semibold">Phone</h4>
                    <p>{selectedSubmission.phone}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <Heading1 className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Subject</h4>
                  <p>{selectedSubmission.subject}</p>
                </div>
              </div>

              <div className="grid grid-cols-[24px_1fr] items-start gap-4">
                <CalendarClock className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-sm font-semibold">Date</h4>
                  <p>{formatDate(selectedSubmission.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Message</h4>
                <Card>
                  <CardContent className="p-4 whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </CardContent>
                </Card>
              </div>

              {/* Images Section */}
              {selectedSubmission.images && selectedSubmission.images.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-primary" />
                        <h4 className="text-sm font-semibold">Attached Images ({selectedSubmission.images.length})</h4>
                      </div>
                      {process.env.NODE_ENV === 'development' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            console.log('Testing', selectedSubmission.images.length, 'images...')
                            for (const imageUrl of selectedSubmission.images) {
                              try {
                                const response = await fetch(`/api/test-image?url=${encodeURIComponent(imageUrl)}`)
                                const result = await response.json()
                                console.log('✅ Image accessible:', imageUrl.split('/').pop(), result)
                              } catch (error) {
                                console.error('❌ Image failed:', imageUrl.split('/').pop(), error)
                              }
                            }
                            toast.success('Image test completed - check console')
                          }}
                        >
                          Test Images
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedSubmission.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div 
                            className="relative w-full h-32 rounded-lg border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-gray-100"
                            onClick={() => window.open(imageUrl, '_blank')}
                          >
                            <img
                              src={imageUrl}
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-full object-cover relative z-10"
                              onError={(e) => {
                                console.error('Image load error for:', imageUrl)
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                              onLoad={(e) => {
                                console.log('Image loaded successfully:', imageUrl)
                                const target = e.target as HTMLImageElement
                                target.style.display = 'block'
                                // Hide the placeholder when image loads
                                const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement
                                if (placeholder) {
                                  placeholder.style.display = 'none'
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                            {/* Placeholder - shown by default, hidden when image loads */}
                            <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-gray-200 z-0">
                              <div className="text-center">
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">Loading...</p>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center pointer-events-none">
                            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                Confirm Deletion
              </div>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact form submission? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 