import React, { useState } from 'react';
import {
  Save,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api, ApiError } from '../../services/api';
import { SiteSettings, Facility } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSettingsContext } from '../../context/SettingsContext';

// Friendly names for the fields the server may complain about
const FIELD_LABELS: Record<string, string> = {
  lawnName: 'Venue name',
  ownerName: 'Proprietor name',
  description: 'Short description',
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  email: 'Email',
  businessHours: 'Business hours',
  address: 'Address',
  mapsEmbedUrl: 'Map embed link',
  directionsUrl: 'Directions link',
  heroHeading: 'Hero heading',
  heroDescription: 'Hero description',
  heroImageUrl: 'Hero image',
  aboutStory: 'About story',
  enquiryInstructions: 'Enquiry instructions',
  'socialLinks.instagram': 'Instagram link',
  'socialLinks.facebook': 'Facebook link',
  'socialLinks.youtube': 'YouTube link',
};

function describeField(field: string): string {
  const facility = field.match(/^facilities\.(\d+)\.(\w+)$/);
  if (facility) return `Facility ${Number(facility[1]) + 1} (${facility[2]})`;
  return FIELD_LABELS[field] ?? field;
}

/** Waits for the saved settings to load, then shows the form. */
export const AdminSettingsPage: React.FC = () => {
  const { settings, status, reload } = useSettingsContext();

  if (status === 'loading') {
    return <p className="text-sm text-stone-500">Loading settings…</p>;
  }
  if (status === 'error') {
    return (
      <div className="space-y-3">
        <p className="text-sm text-stone-700">Could not load the settings. Please try again.</p>
        <button
          type="button"
          onClick={reload}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#183D32]"
        >
          Try again
        </button>
      </div>
    );
  }
  return <SettingsForm initial={settings} />;
};

const SettingsForm: React.FC<{ initial: SiteSettings }> = ({ initial }) => {
  const toast = useToast();
  const { logout } = useAuth();
  const { applySettings } = useSettingsContext();
  const [settings, setSettings] = useState<SiteSettings>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacilityChange = (id: string, field: keyof Facility, val: any) => {
    setSettings((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, [field]: val } : f)),
    }));
  };

  const handleAddFacility = () => {
    const newFac: Facility = {
      id: `fac-${Date.now()}`,
      name: 'New Custom Facility',
      description: 'Describe amenities included with lawn booking.',
      iconName: 'CheckCircle2',
      isHighlight: false,
    };
    setSettings((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newFac],
    }));
    toast.info('New facility row added. Remember to click Save.');
  };

  const handleRemoveFacility = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== id),
    }));
    toast.info('Facility removed.');
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormErrors([]);
    try {
      const data = await api.put<{ settings: SiteSettings }>('/admin/settings', settings);
      setSettings(data.settings); // the form now shows exactly what was saved
      applySettings(data.settings); // the public pages update at once
      toast.success('Website settings & owner contact details saved!');
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setFormErrors(err.details.map((d) => `${describeField(d.field)}: ${d.message}`));
        toast.error('Some settings need fixing. See the list at the top of the form.');
      } else if (err instanceof ApiError && err.status === 401) {
        toast.error('Your session has ended. Please log in again.');
        await logout();
      } else {
        toast.error(err instanceof ApiError ? err.message : 'Failed to save settings.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#102820]">
            Lawn & Website Settings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure official owner contacts, Google Maps location, hero copywriting, and venue facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50"
          >
            <span>Preview Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {formErrors.length > 0 && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 space-y-2"
          >
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Please fix the following before saving:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {formErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Section 1: Venue & Owner Identity */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-display text-lg font-bold text-[#102820] flex items-center gap-2">
            <Building className="w-5 h-5 text-[#C6A66B]" />
            <span>Venue Identity & Proprietor Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Lawn / Venue Name
              </label>
              <input
                type="text"
                required
                value={settings.lawnName}
                onChange={(e) => handleChange('lawnName', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Owner / Proprietor Name
              </label>
              <input
                type="text"
                required
                value={settings.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Short Description / Meta Tag
            </label>
            <textarea
              rows={2}
              value={settings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Phone Number (tel: link)
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                WhatsApp Number (wa.me link)
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Email (mailto: link)
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Visiting & Consultation Hours
            </label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) => handleChange('businessHours', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            />
          </div>
        </div>

        {/* Section 2: Address & Google Maps Embed */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-display text-lg font-bold text-[#102820] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C6A66B]" />
            <span>Location & Navigation Links</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Full Postal Address
            </label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Google Maps Embed URL (iframe source)
              </label>
              <input
                type="text"
                value={settings.mapsEmbedUrl}
                onChange={(e) => handleChange('mapsEmbedUrl', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Google Maps Directions URL
              </label>
              <input
                type="text"
                value={settings.directionsUrl}
                onChange={(e) => handleChange('directionsUrl', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Hero & Story Copywriting */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-display text-lg font-bold text-[#102820] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C6A66B]" />
            <span>Home Page Hero & Story Content</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Hero Headline
            </label>
            <input
              type="text"
              value={settings.heroHeading}
              onChange={(e) => handleChange('heroHeading', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={settings.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              About Section Venue Narrative
            </label>
            <textarea
              rows={4}
              value={settings.aboutStory}
              onChange={(e) => handleChange('aboutStory', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C6A66B]"
            />
          </div>
        </div>

        {/* Section 4: Configurable Facilities */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-[#102820]">
                Configurable Facilities & Highlights
              </h2>
              <p className="text-xs text-stone-500">
                These amenities appear on the public About and Home page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFacility}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#183D32] bg-[#183D32]/10 hover:bg-[#183D32]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Facility</span>
            </button>
          </div>

          <div className="space-y-3">
            {settings.facilities.map((fac) => (
              <div
                key={fac.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={fac.name}
                    onChange={(e) => handleFacilityChange(fac.id, 'name', e.target.value)}
                    placeholder="Facility Name (e.g. 100% Power Backup)"
                    className="flex-1 font-semibold text-xs px-3 py-1.5 rounded border border-stone-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(fac.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                    title="Delete facility"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={fac.description}
                  onChange={(e) => handleFacilityChange(fac.id, 'description', e.target.value)}
                  placeholder="Facility description..."
                  className="w-full text-xs px-3 py-1.5 rounded border border-stone-300 bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-stone-200">

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-[#183D32] hover:bg-[#102820] shadow transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#DFC493]" />
            <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>    
    </div>
  );
};
