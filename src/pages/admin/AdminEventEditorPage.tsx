import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Star,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { LawnEvent, EventCategory } from '../../types';
import { useToast } from '../../context/ToastContext';

// Preset gallery images available for fast selection
const PRESET_IMAGES = [
  '/src/assets/images/hero_wedding_lawn_1792477779485.jpg',
  '/src/assets/images/lawn_reception_stage_1792477779365.jpg',
  '/src/assets/images/lawn_mandap_ceremony_1792477779867.jpg',
  '/src/assets/images/lawn_entrance_walkway_1792477779864.jpg',
];

export const AdminEventEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const isEditMode = Boolean(id);
  const existingEvent = id ? dataService.getEventById(id) : undefined;

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [slug, setSlug] = useState(existingEvent?.slug || '');
  const [category, setCategory] = useState<EventCategory>(existingEvent?.category || 'wedding');
  const [eventDate, setEventDate] = useState(existingEvent?.eventDate || '2026-11-20');
  const [endDate, setEndDate] = useState(existingEvent?.endDate || '');
  const [guestCount, setGuestCount] = useState(existingEvent?.guestCountEstimated?.toString() || '600');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [status, setStatus] = useState<'draft' | 'published'>(existingEvent?.status || 'published');
  const [featured, setFeatured] = useState(existingEvent?.featured ?? false);

  const [images, setImages] = useState<string[]>(
    existingEvent?.images && existingEvent.images.length > 0
      ? existingEvent.images
      : [PRESET_IMAGES[0], PRESET_IMAGES[1]]
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    existingEvent?.coverImageUrl || PRESET_IMAGES[0]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setSlug(existingEvent.slug);
      setCategory(existingEvent.category);
      setEventDate(existingEvent.eventDate);
      setEndDate(existingEvent.endDate || '');
      setGuestCount(existingEvent.guestCountEstimated?.toString() || '');
      setDescription(existingEvent.description);
      setStatus(existingEvent.status);
      setFeatured(Boolean(existingEvent.featured));
      setImages(existingEvent.images);
      setCoverImageUrl(existingEvent.coverImageUrl);
    }
  }, [existingEvent]);

  // Handle local mock image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setImages((prev) => [...prev, dataUrl]);
          toast.success(`Photo "${file.name}" attached.`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPreset = (presetUrl: string) => {
    if (!images.includes(presetUrl)) {
      setImages((prev) => [...prev, presetUrl]);
      toast.info('Venue photograph added to album.');
    }
  };

  const handleRemoveImage = (imgUrl: string) => {
    if (images.length <= 1) {
      toast.error('An event must have at least one photograph.');
      return;
    }
    const filtered = images.filter((i) => i !== imgUrl);
    setImages(filtered);
    if (coverImageUrl === imgUrl) {
      setCoverImageUrl(filtered[0]);
    }
  };

  const handleSetCover = (imgUrl: string) => {
    setCoverImageUrl(imgUrl);
    toast.success('Cover image updated.');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required.';
    if (!eventDate) errs.eventDate = 'Event date is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    if (images.length === 0) errs.images = 'At least one photograph is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors before saving.');
      return;
    }

    setIsSaving(true);
    try {
      dataService.saveEvent({
        id: existingEvent?.id,
        title: title.trim(),
        slug: slug.trim() || undefined,
        category,
        eventDate,
        endDate: endDate || undefined,
        guestCountEstimated: guestCount ? parseInt(guestCount, 10) : undefined,
        description: description.trim(),
        coverImageUrl: coverImageUrl || images[0],
        images,
        status,
        featured,
      });

      toast.success(isEditMode ? 'Event album updated!' : 'New event album created!');
      navigate('/admin/events');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save event.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events List</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatus((prev) => (prev === 'published' ? 'draft' : 'published'))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border ${
              status === 'published'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 text-stone-700 border-stone-300'
            }`}
          >
            Status: {status}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-[#102820] mb-6">
          {isEditMode ? 'Edit Celebration Album' : 'Create New Celebration Album'}
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isEditMode) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '')
                    );
                  }
                }}
                placeholder="e.g. Royal Verma & Kapoor Vivah Celebration"
                className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${
                  errors.title ? 'border-red-500 bg-red-50/40' : 'border-stone-300'
                } focus:outline-none focus:ring-2 focus:ring-[#C6A66B]`}
              />
              {errors.title && <p className="mt-1 text-[11px] text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                URL Slug <span className="text-stone-400 font-normal">(Auto-generated or custom)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="verma-kapoor-vivah-celebration"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>
          </div>

          {/* Category, Date, Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Celebration Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B] bg-white"
              >
                <option value="wedding">Wedding</option>
                <option value="reception">Reception</option>
                <option value="engagement">Engagement</option>
                <option value="anniversary">Anniversary</option>
                <option value="birthday">Birthday</option>
                <option value="celebration">Family Celebration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${
                  errors.eventDate ? 'border-red-500' : 'border-stone-300'
                } focus:outline-none focus:ring-2 focus:ring-[#C6A66B]`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Guest Count <span className="text-stone-400 font-normal">(Estimated)</span>
              </label>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="e.g. 750"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Event Description & Highlights <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the ceremony, decor theme, seating arrangement, mandap details, and celebration atmosphere..."
              className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${
                errors.description ? 'border-red-500' : 'border-stone-300'
              } focus:outline-none focus:ring-2 focus:ring-[#C6A66B]`}
            />
            {errors.description && (
              <p className="mt-1 text-[11px] text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Image Management Section */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-stone-900">
                  Event Photographs & Cover Image
                </h3>
                <p className="text-xs text-stone-500">
                  Select a cover photo (marked with a gold star) and manage gallery photos.
                </p>
              </div>

              {/* Upload Action */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Current Attached Photos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((imgUrl, idx) => {
                const isCover = coverImageUrl === imgUrl;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 bg-stone-100 group aspect-[4/3] ${
                      isCover ? 'border-[#C6A66B] ring-2 ring-[#C6A66B]/30' : 'border-stone-200'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Cover badge */}
                    {isCover && (
                      <span className="absolute top-2 left-2 bg-[#102820] text-[#DFC493] text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow">
                        Cover Photo
                      </span>
                    )}

                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(imgUrl)}
                          title="Set as Cover"
                          className="p-1.5 rounded-full bg-white text-stone-800 hover:text-amber-600 shadow"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imgUrl)}
                        title="Remove photo"
                        className="p-1.5 rounded-full bg-white text-stone-800 hover:text-red-600 shadow"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets Picker */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Or add from venue image library:
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 hover:bg-stone-50"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#183D32]" />
                    <span>Venue Asset {pIdx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured on Home Page Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-[#183D32] focus:ring-[#C6A66B]"
              />
              <span className="text-xs font-semibold text-stone-700">
                Feature on Public Home Page Showcase
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <Link
              to="/admin/events"
              className="px-5 py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#183D32] hover:bg-[#102820] shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#DFC493]" />
              <span>{isSaving ? 'Saving...' : 'Save Event Album'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
