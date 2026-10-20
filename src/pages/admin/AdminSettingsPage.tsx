import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
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
import { dataService } from '../../services/dataService';
import { SiteSettings, Facility } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<SiteSettings>(() => dataService.getSettings());
  const [showResetModal, setShowResetModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = dataService.subscribe(() => {
      setSettings(dataService.getSettings());
    });
    return unsub;
  }, []);

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

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      dataService.updateSettings(settings);
      toast.success('Website settings & owner contact details saved!');
    } catch (err: any) {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    dataService.resetToDefaults();
    setSettings(dataService.getSettings());
    setShowResetModal(false);
    toast.success('Lawn database reset to pristine factory demo data.');
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-red-700 border border-stone-300 hover:border-red-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Defaults</span>
          </button>

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

      {/* Reset Confirmation Dialog */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-display text-lg font-bold text-stone-900">
                Reset Demo Data?
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              This will restore the initial events, availability blocks, enquiries, and settings for K.N. Lawn.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
