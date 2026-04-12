import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';
import { Plus, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { templates } from '../utils/demoData';

export default function Create() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  const [formData, setFormData] = useState(() => {
    const demoId = searchParams.get('demo');
    if (demoId) {
      const template = templates.find(t => t.id === demoId);
      if (template?.demoData) {
        const demoData = template.demoData as any;
        return {
          eventType: demoData.eventType || 'wedding',
          introGreeting: demoData.introGreeting || '',
          primaryName: demoData.primaryName || '',
          secondaryName: demoData.secondaryName || '',
          date: demoData.date || '',
          venue: demoData.venue || '',
          mapUrl: demoData.mapUrl || '',
          theme: demoData.theme || 'modern',
          story: demoData.story || '',
          musicUrl: demoData.musicUrl || '',
          pin: '',
          adminPin: '',
        };
      }
    }
    return {
      eventType: searchParams.get('type') || 'wedding',
      introGreeting: '',
      primaryName: '',
      secondaryName: '',
      date: '',
      venue: '',
      mapUrl: '',
      theme: searchParams.get('theme') || 'modern',
      story: '',
      musicUrl: '',
      pin: '',
      adminPin: '',
    };
  });

  const [events, setEvents] = useState(() => {
    const demoId = searchParams.get('demo');
    if (demoId) {
      const template = templates.find(t => t.id === demoId);
      if (template?.demoData?.events) {
        return template.demoData.events;
      }
    }
    return [{ name: '', time: '', description: '' }];
  });

  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    const demoId = searchParams.get('demo');
    if (demoId) {
      const template = templates.find(t => t.id === demoId);
      if (template?.demoData?.imageUrls) {
        return template.demoData.imageUrls;
      }
    }
    return [];
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const base64 = await compressImage(files[i]);
        newUrls.push(base64);
      }
      setImageUrls(prev => [...prev, ...newUrls]);
    } catch (error) {
      console.error("Error reading images:", error);
      alert("Failed to read images.");
    } finally {
      setUploadingImages(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">Please sign in to create an invitation</h2>
          <p className="text-stone-600">Use the Sign In button in the navigation bar.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validEvents = events.filter(ev => ev.name && ev.time);
      const validImages = imageUrls.filter(url => url.trim() !== '');

      const inviteData = {
        creatorId: user.uid,
        eventType: formData.eventType,
        introGreeting: formData.introGreeting,
        primaryName: formData.primaryName,
        secondaryName: formData.secondaryName,
        brideName: formData.primaryName, // For backward compatibility
        groomName: formData.secondaryName, // For backward compatibility
        date: formData.date,
        venue: formData.venue,
        mapUrl: formData.mapUrl,
        theme: formData.theme,
        story: formData.story,
        musicUrl: formData.musicUrl,
        pin: formData.pin,
        adminPin: formData.adminPin,
        events: validEvents,
        imageUrls: validImages, // Stored directly in Firestore as Base64
        createdAt: serverTimestamp(),
      };

      // Check if the payload is too large for a Firestore document (1MB limit)
      const approxSize = JSON.stringify(inviteData).length;
      if (approxSize > 900000) {
        alert("The images you selected are too large to save. Please select fewer images.");
        setLoading(false);
        return;
      }

      const docRef = await addDoc(collection(db, 'invitations'), inviteData);
      
      navigate(`/invite/${docRef.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'invitations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Create Your Invitation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event & Host Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-800 border-b pb-2">Event & Host Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Event Type *</label>
                <select className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                  <option value="wedding">Wedding</option>
                  <option value="engagement">Engagement</option>
                  <option value="housewarming">Housewarming</option>
                  <option value="baby_shower">Baby Shower</option>
                  <option value="birthday">Birthday Celebration</option>
                  <option value="company_party">Company Party</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Intro Greeting / God's Name (Optional)</label>
                <input type="text" placeholder="e.g., Shree Ganeshay Namah, Bismillah, or Welcome" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.introGreeting} onChange={e => setFormData({...formData, introGreeting: e.target.value})} />
                <p className="text-xs text-stone-500 mt-1">This will appear on the 'Tap to Open' welcome screen.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  {formData.eventType === 'housewarming' ? 'Host Name(s) *' : 
                   formData.eventType === 'baby_shower' ? 'Honoree Name(s) *' : 
                   formData.eventType === 'birthday' ? 'Birthday Person Name *' :
                   formData.eventType === 'company_party' ? 'Company / Host Name *' :
                   'Partner 1 Name *'}
                </label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.primaryName} onChange={e => setFormData({...formData, primaryName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  {formData.eventType === 'housewarming' ? 'Co-Host (Optional)' : 
                   formData.eventType === 'baby_shower' ? 'Co-Honoree (Optional)' : 
                   formData.eventType === 'birthday' ? 'Age / Co-Host (Optional)' :
                   formData.eventType === 'company_party' ? 'Department / Occasion (Optional)' :
                   'Partner 2 Name *'}
                </label>
                <input type="text" required={formData.eventType === 'wedding' || formData.eventType === 'engagement'} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.secondaryName} onChange={e => setFormData({...formData, secondaryName: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Our Story / Message</label>
              <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} />
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-800 border-b pb-2">Main Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date & Time *</label>
                <input required type="datetime-local" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Venue Name/Address *</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Google Maps Link (Optional)</label>
                <input type="url" placeholder="https://maps.app.goo.gl/..." className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.mapUrl} onChange={e => setFormData({...formData, mapUrl: e.target.value})} />
                <p className="text-xs text-stone-500 mt-1">Paste a link to the venue on Google Maps so guests can get directions.</p>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-stone-800">Timeline Events</h2>
              <button type="button" onClick={() => setEvents([...events, { name: '', time: '', description: '' }])} className="text-sm text-rose-600 hover:text-rose-700 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Event
              </button>
            </div>
            {events.map((ev, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-100 relative">
                <button type="button" onClick={() => setEvents(events.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-stone-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Event Name</label>
                    <input type="text" placeholder="e.g., Haldi, Sangeet" className="w-full px-3 py-1.5 rounded border border-stone-300 text-sm" value={ev.name} onChange={e => { const newEvs = [...events]; newEvs[idx].name = e.target.value; setEvents(newEvs); }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Time</label>
                    <input type="text" placeholder="e.g., 10:00 AM" className="w-full px-3 py-1.5 rounded border border-stone-300 text-sm" value={ev.time} onChange={e => { const newEvs = [...events]; newEvs[idx].time = e.target.value; setEvents(newEvs); }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Description</label>
                  <input type="text" className="w-full px-3 py-1.5 rounded border border-stone-300 text-sm" value={ev.description} onChange={e => { const newEvs = [...events]; newEvs[idx].description = e.target.value; setEvents(newEvs); }} />
                </div>
              </div>
            ))}
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-800 border-b pb-2">Media & Gallery</h2>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Background Music URL (Optional)</label>
              <input type="url" placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.musicUrl} onChange={e => setFormData({...formData, musicUrl: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Gallery Images</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-stone-200 group">
                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${uploadingImages ? 'border-stone-200 bg-stone-50 cursor-not-allowed' : 'border-stone-300 cursor-pointer hover:border-rose-500 hover:bg-rose-50'}`}>
                  {uploadingImages ? (
                    <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-stone-400 mb-1" />
                      <span className="text-xs text-stone-500 font-medium">Upload</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                </label>
              </div>
              <p className="text-xs text-stone-500">Upload photos from your device to display in the invitation gallery.</p>
              <p className="text-xs text-amber-600 mt-1 font-medium">Note: Images are heavily compressed to keep the service free. Maximum 3-4 images recommended.</p>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-stone-800 border-b pb-2">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Theme *</label>
                <select className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})}>
                  <option value="modern">Modern</option>
                  <option value="royal">Royal</option>
                  <option value="minimal">Minimal</option>
                  <option value="botanical">Botanical</option>
                  <option value="ocean">Ocean</option>
                  <option value="midnight">Midnight</option>
                  <option value="sunset">Sunset Glow</option>
                  <option value="glassmorphism">Glassmorphism</option>
                  <option value="neon">Neon Nights</option>
                  <option value="vintage">Vintage Classic</option>
                  <option value="elegant">Elegant Monochrome</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="confetti">Confetti Pop</option>
                  <option value="corporate">Corporate Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Guest PIN (Optional)</label>
                <input type="text" maxLength={4} placeholder="e.g., 1234" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} />
                <p className="text-xs text-stone-500 mt-1">Leave empty for public access</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Admin PIN (To view RSVPs)</label>
                <input type="text" maxLength={4} placeholder="e.g., 9999" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" value={formData.adminPin} onChange={e => setFormData({...formData, adminPin: e.target.value})} />
                <p className="text-xs text-stone-500 mt-1">Required to access your invite's admin panel</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generate Invitation'}
          </button>
        </form>
      </div>
    </div>
  );
}
