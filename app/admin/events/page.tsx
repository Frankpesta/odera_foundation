"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, Trash2, Edit, Eye, Loader2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { UploadImageButton } from "@/components/upload-image-button";
import {
	getEvents,
	getEventCategories,
	createEvent,
	updateEvent,
	deleteEvent,
	type Event,
	type EventCategory,
	type EventFormData,
	getEventCount,
} from "@/actions/events";
import { Pagination } from "@/components/ui/pagination";

export default function AdminEventsPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("manage");
	const [events, setEvents] = useState<Event[]>([]);
	const [categories, setCategories] = useState<EventCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date()
	);
	const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
		undefined
	);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [formData, setFormData] = useState<EventFormData>({
		title: "",
		slug: "",
		description: "",
		content: "",
		location: "",
		event_date: new Date(),
		status: "draft",
		is_featured: false,
		images: [],
	});
	const [editingEventId, setEditingEventId] = useState<number | null>(null);

	useEffect(() => {
		loadEvents();
	}, [page]);

	async function loadEvents() {
		try {
			setLoading(true);
			const [eventsData, categoriesData, totalCount] = await Promise.all([
				getEvents({ page, pageSize: 10 }),
				getEventCategories(),
				getEventCount(),
			]);
			setEvents(eventsData);
			setCategories(categoriesData);
			setTotalPages(Math.ceil(totalCount / 10));
		} catch (error) {
			console.error("Error loading data:", error);
			toast("Failed to load events or categories");
		} finally {
			setLoading(false);
		}
	}

	// Generate slug from title
	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-");
	};

	// Handle form input changes
	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;

		// If title is changed, also update the slug
		if (name === "title" && !editingEventId) {
			setFormData({
				...formData,
				title: value,
				slug: generateSlug(value),
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	// Handle switch toggle for is_featured
	const handleFeaturedToggle = (checked: boolean) => {
		setFormData({
			...formData,
			is_featured: checked,
		});
	};

	// Handle date selection
	useEffect(() => {
		if (selectedDate) {
			setFormData((prev) => ({
				...prev,
				event_date: selectedDate,
			}));
		}
	}, [selectedDate]);

	useEffect(() => {
		if (selectedEndDate) {
			setFormData((prev) => ({
				...prev,
				event_end_date: selectedEndDate,
			}));
		} else {
			// Remove end date if not selected
			const { event_end_date, ...rest } = formData;
			setFormData(rest);
		}
	}, [selectedEndDate]);

	// Handle image upload
	const handleImageUpload = (urls: string[]) => {
		const newImages = [...uploadedImages, ...urls];
		setUploadedImages(newImages);
		setFormData({
			...formData,
			images: newImages,
		});
	};

	// Handle image removal
	const handleRemoveImage = (url: string) => {
		const newImages = uploadedImages.filter((image) => image !== url);
		setUploadedImages(newImages);
		setFormData({
			...formData,
			images: newImages,
		});
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			let result;

			// Ensure event_date and event_end_date are Date objects before submitting
			const submitData = {
				...formData,
				event_date:
					typeof formData.event_date === "string"
						? new Date(formData.event_date)
						: formData.event_date,
				event_end_date: formData.event_end_date
					? typeof formData.event_end_date === "string"
						? new Date(formData.event_end_date)
						: formData.event_end_date
					: undefined,
			};

			if (editingEventId) {
				result = await updateEvent(editingEventId, submitData);
			} else {
				result = await createEvent({
					...submitData,
					event_date: submitData.event_date,
					event_end_date: submitData.event_end_date,
				});
			}

			if (result.success) {
				toast(
					`${editingEventId ? "Event updated" : "Event created"} successfully`
				);

				// Reset form and refresh events
				resetForm();
				await loadEvents();
				setActiveTab("manage");
			} else {
				toast(
					`${
						typeof result.error === "string"
							? result.error
							: "Please check the form for errors"
					}`
				);
			}
		} catch (error) {
			console.error("Error submitting event:", error);
			toast("An unexpected error occurred while submitting the event");
		} finally {
			setSubmitting(false);
		}
	};

	// Handle event deletion
	const handleDeleteEvent = async (id: number) => {
		if (confirm("Are you sure you want to delete this event?")) {
			try {
				const result = await deleteEvent(id);

				if (result.success) {
					toast("Event deleted successfully");

					// Refresh events
					await loadEvents();
				} else {
					toast("Failed to delete event");
				}
			} catch (error) {
				console.error("Error deleting event:", error);
				toast("An unexpected error occurred while deleting the event");
			}
		}
	};

	// Handle edit event
	const handleEditEvent = (event: Event) => {
		setEditingEventId(event.id);

		// Get image URLs from event.images
		const imageUrls = event.images
			? event.images.map((img) => img.image_url)
			: [];
		setUploadedImages(imageUrls);

		setFormData({
			title: event.title,
			slug: event.slug,
			description: event.description,
			content: event.content || "",
			location: event.location,
			event_date: new Date(event.event_date),
			event_end_date: event.event_end_date
				? new Date(event.event_end_date)
				: undefined,
			image_url: event.image_url,
			category_id: event.category_id,
			status: event.status as any,
			is_featured: event.is_featured,
			images: imageUrls,
		});
		setSelectedDate(new Date(event.event_date));
		setSelectedEndDate(
			event.event_end_date ? new Date(event.event_end_date) : undefined
		);
		setActiveTab("create");
	};

	// Reset form
	const resetForm = () => {
		setFormData({
			title: "",
			slug: "",
			description: "",
			content: "",
			location: "",
			event_date: new Date(),
			status: "draft",
			is_featured: false,
			images: [],
		});
		setSelectedDate(new Date());
		setSelectedEndDate(undefined);
		setUploadedImages([]);
		setEditingEventId(null);
	};

	// View event details
	const handleViewEvent = (slug: string) => {
		router.push(`/events/${slug}`);
	};

	return (
		<div className="container px-4 py-12">
			<h1 className="text-3xl font-bold tracking-tight mb-8">
				Event Management
			</h1>

			<Tabs
				defaultValue="manage"
				value={activeTab}
				onValueChange={setActiveTab}
				className="max-w-5xl">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="create">
						{editingEventId ? "Edit Event" : "Create Event"}
					</TabsTrigger>
					<TabsTrigger value="manage">Manage Events</TabsTrigger>
				</TabsList>

				<TabsContent value="create" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>
								{editingEventId ? "Edit Event" : "Create New Event"}
							</CardTitle>
							<CardDescription>
								Fill in the details below to{" "}
								{editingEventId ? "update the" : "create a new"} event. All
								fields marked with * are required.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="title">Event Title *</Label>
										<Input
											id="title"
											name="title"
											value={formData.title}
											onChange={handleInputChange}
											placeholder="Enter event title"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="slug">Slug *</Label>
										<Input
											id="slug"
											name="slug"
											value={formData.slug}
											onChange={handleInputChange}
											placeholder="event-slug"
											required
										/>
										<p className="text-xs text-muted-foreground">
											Used in the URL: /events/your-slug
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="location">Location *</Label>
										<Input
											id="location"
											name="location"
											value={formData.location}
											onChange={handleInputChange}
											placeholder="Enter event location"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="category">Category</Label>
										<Select
											value={formData.category_id?.toString() || ""}
											onValueChange={(value) =>
												setFormData({
													...formData,
													category_id: value
														? Number.parseInt(value)
														: undefined,
												})
											}>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												{categories.map((category) => (
													<SelectItem
														key={category.id}
														value={category.id.toString()}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Start Date *</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal">
													<CalendarIcon className="mr-2 h-4 w-4" />
													{selectedDate ? (
														format(selectedDate, "PPP")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={selectedDate}
													onSelect={setSelectedDate}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</div>

									<div className="space-y-2">
										<Label>End Date</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal">
													<CalendarIcon className="mr-2 h-4 w-4" />
													{selectedEndDate ? (
														format(selectedEndDate, "PPP")
													) : (
														<span>Pick a date (optional)</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={selectedEndDate}
													onSelect={setSelectedEndDate}
													initialFocus
													disabled={(date) =>
														date < (selectedDate || new Date())
													}
												/>
											</PopoverContent>
										</Popover>
									</div>

									<div className="space-y-2">
										<Label htmlFor="time">Time *</Label>
										<div className="relative">
											<Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
											<Input
												id="time"
												name="time"
												placeholder="e.g., 9:00 AM - 3:00 PM"
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="status">Event Status *</Label>
										<Select
											value={formData.status}
											onValueChange={(value: any) =>
												setFormData({
													...formData,
													status: value,
												})
											}>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="draft">Draft</SelectItem>
												<SelectItem value="published">Published</SelectItem>
												<SelectItem value="cancelled">Cancelled</SelectItem>
												<SelectItem value="completed">Completed</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<Switch
											id="is-featured"
											checked={formData.is_featured}
											onCheckedChange={handleFeaturedToggle}
										/>
										<Label htmlFor="is-featured">
											Feature this event on the homepage
										</Label>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Short Description *</Label>
									<Textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										placeholder="Enter a brief description of the event"
										className="min-h-[80px]"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="content">Full Content</Label>
									<Textarea
										id="content"
										name="content"
										value={formData.content || ""}
										onChange={handleInputChange}
										placeholder="Enter the full content/details of the event"
										className="min-h-[200px]"
									/>
								</div>

								<div className="space-y-2">
									<Label>Event Images</Label>
									<UploadImageButton
										onUploadComplete={handleImageUpload}
										existingImages={uploadedImages}
										onRemoveImage={handleRemoveImage}
									/>
									<p className="text-xs text-muted-foreground">
										Upload images for this event. The first image will be used
										as the featured image.
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="image_url">Legacy Image URL (Optional)</Label>
									<Input
										id="image_url"
										name="image_url"
										value={formData.image_url || ""}
										onChange={handleInputChange}
										placeholder="https://example.com/image.jpg"
									/>
									<p className="text-xs text-muted-foreground">
										This is for backward compatibility. Prefer using the image
										upload above.
									</p>
								</div>
							</form>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button
								variant="outline"
								onClick={() => {
									resetForm();
									setActiveTab("manage");
								}}>
								Cancel
							</Button>
							<Button
								className="bg-emerald-600 hover:bg-emerald-700 text-white"
								onClick={handleSubmit}
								disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{editingEventId ? "Updating..." : "Creating..."}
									</>
								) : editingEventId ? (
									"Update Event"
								) : (
									"Create Event"
								)}
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="manage" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Manage Events</CardTitle>
							<CardDescription>
								View, edit, or delete existing events.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="flex justify-center items-center py-8">
									<Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
								</div>
							) : events.length === 0 ? (
								<div className="text-center py-8">
									<p className="text-muted-foreground mb-4">No events found</p>
									<Button
										onClick={() => setActiveTab("create")}
										className="bg-emerald-600 hover:bg-emerald-700 text-white">
										Create Your First Event
									</Button>
								</div>
							) : (
								<>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Title</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Location</TableHead>
												<TableHead>Status</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{events.map((event) => (
												<TableRow key={event.id}>
													<TableCell className="font-medium">
														{event.title}
													</TableCell>
													<TableCell>
														{format(new Date(event.event_date), "PPP")}
													</TableCell>
													<TableCell>{event.location}</TableCell>
													<TableCell>
														<span
															className={`px-2 py-1 rounded-full text-xs ${
																event.status === "published" &&
																new Date(event.event_date) > new Date()
																	? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
																	: event.status === "completed" ||
																	  (event.status === "published" &&
																			new Date(event.event_date) < new Date())
																	? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
																	: event.status === "cancelled"
																	? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
																	: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
															}`}>
															{event.status === "published" &&
															new Date(event.event_date) > new Date()
																? "Upcoming"
																: event.status === "completed" ||
																  (event.status === "published" &&
																		new Date(event.event_date) < new Date())
																? "Completed"
																: event.status === "cancelled"
																? "Cancelled"
																: "Draft"}
														</span>
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleViewEvent(event.slug)}>
																<Eye className="h-4 w-4" />
																<span className="sr-only">View</span>
															</Button>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleEditEvent(event)}>
																<Edit className="h-4 w-4" />
																<span className="sr-only">Edit</span>
															</Button>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleDeleteEvent(event.id)}>
																<Trash2 className="h-4 w-4" />
																<span className="sr-only">Delete</span>
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>

									{totalPages > 1 && (
										<div className="mt-4 flex justify-center">
											<Pagination
												currentPage={page}
												totalPages={totalPages}
												onPageChange={setPage}
											/>
										</div>
									)}
								</>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
