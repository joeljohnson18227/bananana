import React, { useState } from 'react';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';

const CATEGORIES = [
  { label: 'Classroom', value: 'Classroom' },
  { label: 'Laboratory', value: 'Laboratory' },
  { label: 'Hostel', value: 'Hostel' },
  { label: 'Library', value: 'Library' },
  { label: 'Internet/Wi-Fi', value: 'Internet/Wi-Fi' },
  { label: 'Electrical', value: 'Electrical' },
  { label: 'Water Supply', value: 'Water Supply' },
  { label: 'Cleanliness', value: 'Cleanliness' },
  { label: 'Other', value: 'Other' },
];

const MAX_ATTACHMENT_SIZE_MB = 8;
const MAX_ATTACHMENTS = 5;
const EMPTY_INITIAL_DATA = {};

function buildInitialFormData(initialData) {
  return {
    title: initialData.title || '',
    category: initialData.category || '',
    description: initialData.description || '',
    location: initialData.location || '',
    attachments: Array.isArray(initialData.attachments) ? initialData.attachments : [],
    ...initialData,
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

const ComplaintForm = ({ onSubmit, initialData = EMPTY_INITIAL_DATA, submitButtonText = "Submit Complaint" }) => {
  const [formData, setFormData] = useState(() => buildInitialFormData(initialData));
  const [errors, setErrors] = useState({});
  const [attachmentError, setAttachmentError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAttachmentChange = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    const unsupportedFile = files.find(
      (file) => !file.type.startsWith('image/') && !file.type.startsWith('video/'),
    );

    if (unsupportedFile) {
      setAttachmentError('Only image and video files are supported.');
      e.target.value = '';
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_ATTACHMENT_SIZE_MB * 1024 * 1024);

    if (oversizedFile) {
      setAttachmentError(`Each file must be ${MAX_ATTACHMENT_SIZE_MB} MB or smaller.`);
      e.target.value = '';
      return;
    }

    if ((formData.attachments || []).length + files.length > MAX_ATTACHMENTS) {
      setAttachmentError(`You can attach up to ${MAX_ATTACHMENTS} files.`);
      e.target.value = '';
      return;
    }

    try {
      const converted = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: await readFileAsDataUrl(file),
          kind: file.type.startsWith('video/') ? 'video' : 'image',
        })),
      );

      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...converted],
      }));
      setAttachmentError('');
    } catch (error) {
      setAttachmentError(error.message || 'Failed to read the selected file.');
    } finally {
      e.target.value = '';
    }
  };

  const removeAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleReset = () => {
    setFormData(buildInitialFormData(initialData));
    setErrors({});
    setAttachmentError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
    handleReset(); // Reset after successful submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Complaint Title"
        id="title"
        name="title"
        placeholder="Brief title of the issue"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
      />

      <Select
        label="Category"
        id="category"
        name="category"
        placeholder="Select a category"
        options={CATEGORIES}
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
        required
      />

      <Input
        label="Location"
        id="location"
        name="location"
        placeholder="Room number, Building, etc."
        value={formData.location}
        onChange={handleChange}
        error={errors.location}
        required
      />

      <TextArea
        label="Description"
        id="description"
        name="description"
        placeholder="Describe the issue in detail"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        rows={5}
        required
      />

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-warm-cream/70">
          Photos or Videos
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleAttachmentChange}
          className="block w-full rounded-2xl border border-dashed border-charcoal-900 bg-pitch-black px-4 py-3 text-sm text-warm-cream/70 file:mr-4 file:rounded-full file:border-0 file:bg-acid-lime file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-widest file:text-pitch-black hover:file:bg-lime-400 cursor-pointer"
        />
        <p className="text-[10px] uppercase tracking-wider text-warm-cream/40">
          Up to {MAX_ATTACHMENTS} files, max {MAX_ATTACHMENT_SIZE_MB} MB each.
        </p>
        {attachmentError && <p className="text-xs text-ember-orange font-semibold">{attachmentError}</p>}
      </div>

      {(formData.attachments || []).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-warm-cream/70">Attached Media</h3>
            <span className="text-[10px] uppercase tracking-wider text-warm-cream/40">
              {(formData.attachments || []).length} / {MAX_ATTACHMENTS}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(formData.attachments || []).map((attachment, index) => {
              const isVideo = attachment.kind === 'video' || attachment.type?.startsWith('video/');

              return (
                <div key={`${attachment.name}-${index}`} className="rounded-[24px] border border-charcoal-900 bg-pitch-black/80 overflow-hidden">
                  <div className="aspect-video bg-charcoal-900/50">
                    {isVideo ? (
                      <video className="h-full w-full object-cover" controls src={attachment.dataUrl} />
                    ) : (
                      <img className="h-full w-full object-cover" src={attachment.dataUrl} alt={attachment.name} />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-warm-cream">{attachment.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-warm-cream/40">
                        {isVideo ? 'Video' : 'Photo'} • {Math.max(1, Math.round((attachment.size || 0) / 1024))} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="rounded-full border border-ember-orange/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ember-orange hover:bg-ember-orange/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-charcoal-900">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-charcoal-900 bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-warm-cream/60 hover:text-warm-cream hover:border-warm-cream/20 transition-all cursor-pointer"
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="rounded-full bg-acid-lime hover:bg-lime-400 px-8 py-2.5 text-xs font-black uppercase tracking-widest text-pitch-black transition-all cursor-pointer"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;
