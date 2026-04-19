import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
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
          customId: '',
          eventType: demoData.eventType || 'wedding',
          introGreeting: demoData.introGreeting || '',
          primaryName: demoData.primaryName || '',
          secondaryName: demoData.secondaryName || '',
          primaryParents: demoData.primaryParents || '',
          secondaryParents: demoData.secondaryParents || '',
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
      customId: '',
      eventType: searchParams.get('type') || 'wedding',
      introGreeting: '',
      primaryName: '',
      secondaryName: '',
      primaryParents: '',
      secondaryParents: '',
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
  
  const [introImageUrl, setIntroImageUrl] = useState<string>(() => {
    const demoId = searchParams.get('demo');
    if (demoId) {
      const template = templates.find(t => t.id === demoId);
      if (template?.demoData?.introImageUrl) {
        return template.demoData.introImageUrl;
      }
    }
    return '';
  });

  const [primaryPhotoUrl, setPrimaryPhotoUrl] = useState<string>(() => {
    const demoId = searchParams.get('demo');
    if (demoId) {
      const template = templates.find(t => t.id === demoId);
      if (template?.demoData?.primaryPhotoUrl) {
        return template.demoData.primaryPhotoUrl;
      }
    }
    return '';
  });

  const [secondaryPhotoUrl, setSecondaryPhotoUrl] = useState<string>(() => {
    const demoId = searchParams.get('demo');
    if (demoId) {
      const template = templates.find(t => t.id === demoId);
      if (template?.demoData?.secondaryPhotoUrl) {
        return template.demoData.secondaryPhotoUrl;
      }
    }
    return '';
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

  const handleSingleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const base64 = await compressImage(files[0]);
      setter(base64);
    } catch (error) {
      console.error("Error reading image:", error);
      alert("Failed to read image.");
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
    console.log("[Create] Submit started");

    let timeoutId: NodeJS.Timeout;

    try {
      const validEvents = events.filter(ev => ev.name && ev.time);
      const validImages = imageUrls.filter(url => url.trim() !== '');

      const inviteData = {
        creatorId: user.uid,
        eventType: formData.eventType,
        introGreeting: formData.introGreeting,
        primaryName: formData.primaryName,
        secondaryName: formData.secondaryName,
        primaryParents: formData.primaryParents,
        secondaryParents: formData.secondaryParents,
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
        introImageUrl,
        primaryPhotoUrl,
        secondaryPhotoUrl,
        createdAt: serverTimestamp(),
      };
      console.log("[Create] Payload prepared:", JSON.stringify({...inviteData, createdAt: 'serverTimestamp', imageUrls: `[${validImages.length} images]`}));

      // Check if the payload is too large for a Firestore document (1MB limit)
      const inviteDataForSize = { ...inviteData };
      delete inviteDataForSize.createdAt;
      const approxSize = JSON.stringify(inviteDataForSize).length;
      console.log(`[Create] Approximate payload size: ${approxSize} bytes`);
      if (approxSize > 900000) {
        alert("The images you selected are too large to save. Please select fewer images.");
        setLoading(false);
        return;
      }

      let inviteId = '';
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Database connection timed out. Please check if your Firestore Database is created and active in the Firebase Console, and ensure your internet connection is stable.")), 30000);
      });

      if (formData.customId) {
        console.log(`[Create] Checking custom ID: ${formData.customId}`);
        // Validate custom ID format
        const customIdRegex = /^[a-z0-9-]+$/;
        if (!customIdRegex.test(formData.customId)) {
          alert("Custom URL ID can only contain lowercase letters, numbers, and hyphens.");
          setLoading(false);
          clearTimeout(timeoutId!);
          return;
        }

        // Check if custom ID already exists
        const docRef = doc(db, 'invitations', formData.customId);
        try {
          const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);
          console.log(`[Create] Custom ID existence check complete: exists=${docSnap.exists()}`);
          if (docSnap.exists()) {
            alert("This Custom URL ID is already taken. Please choose another one.");
            setLoading(false);
            clearTimeout(timeoutId!);
            return;
          }
        } catch(error) {
          console.error("[Create] getDoc custom ID error");
          throw error;
        }

        console.log(`[Create] Saving with custom ID...`);
        try {
          await Promise.race([setDoc(docRef, inviteData), timeoutPromise]);
          console.log(`[Create] Saved with custom ID successfully`);
          inviteId = formData.customId;
        } catch(error) {
          console.error("[Create] setDoc error");
          throw error;
        }
      } else {
        console.log(`[Create] Saving with auto-generated ID...`);
        try {
          const docRef = await Promise.race([
            addDoc(collection(db, 'invitations'), inviteData),
            timeoutPromise
          ]);
          console.log(`[Create] Saved with auto ID completely: ${docRef.id}`);
          inviteId = docRef.id;
        } catch(error) {
          console.error("[Create] addDoc error");
          throw error;
        }
      }
      
      clearTimeout(timeoutId!);
      console.log(`[Create] Navigating to /invite/${inviteId}`);
      navigate(`/invite/${inviteId}`);
    } catch (error) {
      if (timeoutId!) clearTimeout(timeoutId);
      console.error("[Create] Caught error in handleSubmit:", error);
      handleFirestoreError(error, OperationType.CREATE, 'invitations');
    } finally {
      console.log("[Create] Finalizing submit state");
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
                
                {(formData.eventType === 'wedding' || formData.eventType === 'engagement') && (
                  <div className="mt-2 text-sm space-y-2">
                    <input type="text" placeholder="Partner 1's Parents (e.g. S/o Mr & Mrs...)" className="w-full px-3 py-1.5 rounded-lg border border-stone-300 outline-none text-xs" value={formData.primaryParents} onChange={e => setFormData({...formData, primaryParents: e.target.value})} />
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Partner 1 Photo (Optional)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleSingleImageUpload(e, setPrimaryPhotoUrl)} className="text-xs" />
                      {primaryPhotoUrl && <span className="text-xs text-green-600 ml-2">✓ Uploaded</span>}
                    </div>
                  </div>
                )}
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

                {(formData.eventType === 'wedding' || formData.eventType === 'engagement') && (
                  <div className="mt-2 text-sm space-y-2">
                    <input type="text" placeholder="Partner 2's Parents (e.g. D/o Mr & Mrs...)" className="w-full px-3 py-1.5 rounded-lg border border-stone-300 outline-none text-xs" value={formData.secondaryParents} onChange={e => setFormData({...formData, secondaryParents: e.target.value})} />
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Partner 2 Photo (Optional)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleSingleImageUpload(e, setSecondaryPhotoUrl)} className="text-xs" />
                      {secondaryPhotoUrl && <span className="text-xs text-green-600 ml-2">✓ Uploaded</span>}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 mt-4 pt-4 border-t border-stone-100">
                <label className="block text-sm font-medium text-stone-700 mb-1">Full-Screen Intro Background Image (Optional)</label>
                <p className="text-xs text-stone-500 mb-2">Upload a beautiful vertical photo of the couple/host to be shown on the 'Tap to Open' screen.</p>
                <div className="flex items-center gap-4">
                  <input type="file" accept="image/*" onChange={(e) => handleSingleImageUpload(e, setIntroImageUrl)} className="text-sm" />
                  {introImageUrl && <span className="text-sm text-green-600 font-medium">✓ Uploaded successfully</span>}
                </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Cover Photo (Optional)</label>
                <div className={`w-full aspect-[4/3] relative rounded-xl border-2 ${introImageUrl ? 'border-indigo-500' : 'border-dashed border-stone-300 hover:border-indigo-500'} flex items-center justify-center overflow-hidden group`}>
                  {introImageUrl ? (
                    <>
                      <img src={introImageUrl} className="w-full h-full object-cover" alt="Cover" />
                      <button type="button" onClick={() => setIntroImageUrl('')} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Trash2 className="w-6 h-6 text-rose-400" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <UploadCloud className="w-6 h-6 text-stone-400 mb-2" />
                      <span className="text-xs text-stone-500 font-medium leading-tight">Upload<br/>Cover Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSingleImageUpload(e, setIntroImageUrl)} disabled={uploadingImages} />
                    </label>
                  )}
                  {uploadingImages && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Bride / Host 1 Photo</label>
                <div className={`w-full aspect-[4/3] relative rounded-xl border-2 ${primaryPhotoUrl ? 'border-rose-400' : 'border-dashed border-stone-300 hover:border-rose-400'} flex items-center justify-center overflow-hidden group`}>
                  {primaryPhotoUrl ? (
                    <>
                      <img src={primaryPhotoUrl} className="w-full h-full object-cover" alt="Host 1" />
                      <button type="button" onClick={() => setPrimaryPhotoUrl('')} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Trash2 className="w-6 h-6 text-rose-400" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <UploadCloud className="w-6 h-6 text-stone-400 mb-2" />
                      <span className="text-xs text-stone-500 font-medium leading-tight">Upload<br/>Photo 1</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSingleImageUpload(e, setPrimaryPhotoUrl)} disabled={uploadingImages} />
                    </label>
                  )}
                  {uploadingImages && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Groom / Host 2 Photo</label>
                <div className={`w-full aspect-[4/3] relative rounded-xl border-2 ${secondaryPhotoUrl ? 'border-amber-400' : 'border-dashed border-stone-300 hover:border-amber-400'} flex items-center justify-center overflow-hidden group`}>
                  {secondaryPhotoUrl ? (
                    <>
                      <img src={secondaryPhotoUrl} className="w-full h-full object-cover" alt="Host 2" />
                      <button type="button" onClick={() => setSecondaryPhotoUrl('')} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Trash2 className="w-6 h-6 text-rose-400" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                      <UploadCloud className="w-6 h-6 text-stone-400 mb-2" />
                      <span className="text-xs text-stone-500 font-medium leading-tight">Upload<br/>Photo 2</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSingleImageUpload(e, setSecondaryPhotoUrl)} disabled={uploadingImages} />
                    </label>
                  )}
                  {uploadingImages && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-stone-400" /></div>}
                </div>
              </div>
            </div>

            <div className="pt-2">
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Custom URL ID (Optional)</label>
                <div className="flex items-center">
                  <span className="bg-stone-100 border border-r-0 border-stone-300 rounded-l-lg px-3 py-2 text-stone-500 text-sm">
                    {window.location.origin}/invite/
                  </span>
                  <input 
                    type="text" 
                    placeholder="e.g., john-and-jane-wedding" 
                    className="flex-1 px-4 py-2 rounded-r-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" 
                    value={formData.customId} 
                    onChange={e => setFormData({...formData, customId: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                  />
                </div>
                <p className="text-xs text-stone-500 mt-1">Create a memorable link. Only lowercase letters, numbers, and hyphens allowed.</p>
              </div>
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
                  <option value="boho">Boho Chic</option>
                  <option value="artdeco">Art Deco / Gatsby</option>
                  <option value="watercolor">Watercolor / Pastel</option>
                  <option value="rustic">Rustic Charm</option>
                  <option value="gothic">Dark Romance / Gothic</option>
                  <option value="tropical">Tropical Vibes</option>
                  <option value="fairytale">Enchanted Fairytale</option>
                  <option value="retro">Retro 70s/80s</option>
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
