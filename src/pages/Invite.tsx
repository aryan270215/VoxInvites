import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Heart, Calendar, MapPin, Music, Music2, Share2, Copy, Settings } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';
import AdBanner from '../components/AdBanner';
import { templates } from '../utils/demoData';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function Invite() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [galleryUnlocked, setGalleryUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Default to false, will play on open
  const audioRef = useRef<HTMLAudioElement>(null);
  const ytIframeRef = useRef<HTMLIFrameElement>(null);
  const [isYoutube, setIsYoutube] = useState(false);
  const [ytId, setYtId] = useState('');

  // RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: '', attending: true, guests: 1, message: '' });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!invite?.date) return;

    const calculateTimeLeft = () => {
      if (!invite?.date) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      const difference = +new Date(invite.date) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0 && !isNaN(difference)) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [invite?.date]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    const fetchInvite = async () => {
      if (!id) return;

      if (id.startsWith('demo-')) {
        const demoId = id.replace('demo-', '');
        const template = templates.find(t => t.id === demoId);
        if (template && template.demoData) {
          const data = { ...template.demoData, id, creatorId: 'demo-creator' };
          setInvite(data);
          setUnlocked(true);
          setLoading(false);
          
          if ((data as any).musicUrl) {
            const ytMatch = (data as any).musicUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
            if (ytMatch) {
              setIsYoutube(true);
              setYtId(ytMatch[1]);
            } else {
              setIsYoutube(false);
            }
          }
          return;
        }
      }

      try {
        const docRef = doc(db, 'invitations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          setInvite(data);
          if (!data.pin) setUnlocked(true);
          if (data.musicUrl) {
            const ytMatch = data.musicUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
            if (ytMatch) {
              setIsYoutube(true);
              setYtId(ytMatch[1]);
            } else {
              setIsYoutube(false);
            }
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `invitations/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();

    return () => unsubscribe();
  }, [id]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invite?.pin === pin) {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const toggleMusic = () => {
    if (isYoutube && ytIframeRef.current) {
      const func = isPlaying ? 'pauseVideo' : 'playVideo';
      ytIframeRef.current.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: func, args: [] }), '*');
      setIsPlaying(!isPlaying);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    if (id.startsWith('demo-')) {
      setRsvpSuccess(true);
      return;
    }

    setRsvpLoading(true);
    try {
      await addDoc(collection(db, 'invitations', id, 'rsvps'), {
        ...rsvpForm,
        createdAt: serverTimestamp()
      });
      setRsvpSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `invitations/${id}/rsvps`);
    } finally {
      setRsvpLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    const pName = invite.primaryName || invite.brideName || '';
    const sName = invite.secondaryName || invite.groomName || '';
    const names = sName ? `${pName} & ${sName}` : pName;
    const text = `You are invited to ${names}'s event! RSVP here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div></div>;
  if (!invite) return <div className="min-h-screen flex items-center justify-center text-2xl font-serif">Invitation not found</div>;

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Private Invitation</h2>
          <p className="text-stone-600 mb-6">Please enter the PIN provided by {invite.primaryName || invite.brideName} {(invite.secondaryName || invite.groomName) ? `& ${invite.secondaryName || invite.groomName}` : ''}</p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              maxLength={4}
              className="w-full text-center text-2xl tracking-[1em] px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none mb-4"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="••••"
            />
            {pinError && <p className="text-red-500 text-sm mb-4">Incorrect PIN. Please try again.</p>}
            <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors">
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const handleOpen = () => {
    setIsOpened(true);
    if (invite.musicUrl) {
      setIsPlaying(true);
    }
  };

  // Theme classes
  const themeStylesMap = {
    modern: { bg: 'bg-stone-50', text: 'text-stone-900', accent: 'text-rose-500', card: 'bg-white', font: 'font-sans', button: 'bg-stone-900 hover:bg-stone-800', border: 'border-stone-300' },
    royal: { bg: 'bg-amber-50', text: 'text-amber-900', accent: 'text-red-700', card: 'bg-white border border-amber-200', font: 'font-serif', button: 'bg-amber-900 hover:bg-amber-800', border: 'border-amber-300' },
    minimal: { bg: 'bg-slate-50', text: 'text-slate-800', accent: 'text-slate-500', card: 'bg-white shadow-sm', font: 'font-sans font-light', button: 'bg-slate-800 hover:bg-slate-700', border: 'border-slate-300' },
    botanical: { bg: 'bg-green-50', text: 'text-green-900', accent: 'text-emerald-600', card: 'bg-white border border-green-200', font: 'font-serif', button: 'bg-emerald-700 hover:bg-emerald-800', border: 'border-green-300' },
    ocean: { bg: 'bg-cyan-50', text: 'text-cyan-900', accent: 'text-cyan-600', card: 'bg-white shadow-md', font: 'font-sans', button: 'bg-cyan-700 hover:bg-cyan-800', border: 'border-cyan-300' },
    midnight: { bg: 'bg-slate-900', text: 'text-slate-100', accent: 'text-indigo-400', card: 'bg-slate-800 border border-slate-700', font: 'font-sans tracking-wide', button: 'bg-indigo-500 hover:bg-indigo-600', border: 'border-slate-600' },
    sunset: { bg: 'bg-gradient-to-br from-orange-50 to-rose-100', text: 'text-orange-900', accent: 'text-rose-600', card: 'bg-white/80 backdrop-blur-sm shadow-xl', font: 'font-sans', button: 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white', border: 'border-orange-200' },
    glassmorphism: { bg: 'bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100', text: 'text-stone-800', accent: 'text-indigo-600', card: 'bg-white/40 backdrop-blur-md border border-white/50 shadow-2xl', font: 'font-sans', button: 'bg-white/50 hover:bg-white/60 backdrop-blur-md text-stone-900 border border-white/50', border: 'border-white/30' },
    neon: { bg: 'bg-gray-950', text: 'text-gray-100', accent: 'text-fuchsia-500', card: 'bg-gray-900 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.15)]', font: 'font-sans', button: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]', border: 'border-fuchsia-500/30' },
    vintage: { bg: 'bg-[#f4ebd0]', text: 'text-[#4a3b32]', accent: 'text-[#8b5a2b]', card: 'bg-[#faebd7] border-2 border-[#deb887] shadow-md', font: 'font-serif', button: 'bg-[#8b5a2b] hover:bg-[#a0522d] text-white', border: 'border-[#deb887]' },
    elegant: { bg: 'bg-zinc-50', text: 'text-zinc-900', accent: 'text-zinc-500', card: 'bg-white border border-zinc-200 shadow-sm', font: 'font-serif tracking-wide', button: 'bg-zinc-900 hover:bg-zinc-800 text-white', border: 'border-zinc-200' },
    cyberpunk: { bg: 'bg-zinc-950', text: 'text-cyan-400', accent: 'text-fuchsia-500', card: 'bg-zinc-900 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]', font: 'font-mono tracking-tight', button: 'bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]', border: 'border-cyan-500/30' },
    confetti: { bg: 'bg-pink-50', text: 'text-purple-900', accent: 'text-pink-500', card: 'bg-white border-2 border-pink-200 shadow-xl rounded-3xl', font: 'font-sans font-medium', button: 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg', border: 'border-pink-200' },
    corporate: { bg: 'bg-slate-50', text: 'text-slate-900', accent: 'text-blue-600', card: 'bg-white border border-slate-200 shadow-md rounded-none', font: 'font-sans', button: 'bg-blue-600 hover:bg-blue-700 text-white rounded-none', border: 'border-slate-200' }
  };
  const themeStyles = themeStylesMap[invite.theme as keyof typeof themeStylesMap] || themeStylesMap.modern;

  if (!isOpened) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center relative ${themeStyles.bg} ${themeStyles.text} ${themeStyles.font}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center z-10 px-4"
        >
          {invite.introGreeting && (
            <p className="text-xl md:text-2xl mb-8 font-medium opacity-80">{invite.introGreeting}</p>
          )}
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12">
            {invite.primaryName || invite.brideName} {(invite.secondaryName || invite.groomName) && <><span className={themeStyles.accent}>&</span> {invite.secondaryName || invite.groomName}</>}
          </h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            onClick={handleOpen}
            className={`px-8 py-4 rounded-full font-medium text-white shadow-xl ${themeStyles.button}`}
          >
            Tap to Open
          </motion.button>
        </motion.div>
        
        <div className="absolute bottom-6 left-0 right-0 text-center opacity-60 text-sm font-medium tracking-wide">
          Made With ❤️ By VoxInvites
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} ${themeStyles.font} pb-20`}>
      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Link to={`/invite/${id}/admin`} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <Settings className="text-stone-400" />
        </Link>
        {invite.musicUrl && (
          <button onClick={toggleMusic} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            {isPlaying ? <Music className={themeStyles.accent} /> : <Music2 className="text-stone-400" />}
          </button>
        )}
        <button onClick={shareOnWhatsApp} className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <WhatsAppIcon className="w-6 h-6" />
        </button>
        <button onClick={copyLink} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <Share2 className={themeStyles.accent} />
        </button>
      </div>

      {/* Hidden Audio Players */}
      {isOpened && invite.musicUrl && (
        <div className="hidden">
          {isYoutube ? (
            <iframe
              ref={ytIframeRef}
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&enablejsapi=1`}
              allow="autoplay"
            />
          ) : (
            <audio
              ref={audioRef}
              src={invite.musicUrl}
              loop
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
        </div>
      )}

      {/* Hero */}
      <AdBanner />
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p className="text-sm tracking-[0.3em] uppercase mb-6">
            {invite.eventType === 'engagement' ? 'You are invited to the engagement of' : 
             invite.eventType === 'housewarming' ? 'You are invited to the housewarming of' : 
             invite.eventType === 'baby_shower' ? 'You are invited to the baby shower honoring' : 
             invite.eventType === 'birthday' ? 'You are invited to the birthday celebration of' :
             invite.eventType === 'company_party' ? 'You are invited to the company party hosted by' :
             'You are invited to the wedding of'}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            {invite.primaryName || invite.brideName} {(invite.secondaryName || invite.groomName) && <><span className={themeStyles.accent}>&</span> {invite.secondaryName || invite.groomName}</>}
          </h1>
          <p className="text-xl md:text-2xl mb-12">
            {invite.date && !isNaN(+new Date(invite.date)) ? format(new Date(invite.date), 'EEEE, MMMM do, yyyy') : ''}
          </p>
          
          {+new Date(invite.date) > +new Date() && timeLeft && (
            <div className="mt-8 flex justify-center gap-3 sm:gap-6">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div key={idx} className={`flex flex-col items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-2xl ${themeStyles.card} shadow-lg border border-stone-200/50 backdrop-blur-sm`}>
                  <span className="text-xl sm:text-4xl font-serif font-bold">{unit.value}</span>
                  <span className="text-[9px] sm:text-xs uppercase tracking-widest opacity-80 mt-1">{unit.label}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Story */}
      {invite.story && (
        <section className="py-20 px-4 max-w-3xl mx-auto text-center">
          <Heart className={`w-8 h-8 mx-auto mb-6 ${themeStyles.accent}`} />
          <h2 className="text-3xl font-serif mb-8">{invite.eventType === 'wedding' || invite.eventType === 'engagement' ? 'Our Story' : 'Message'}</h2>
          <p className="text-lg leading-relaxed opacity-80">{invite.story}</p>
        </section>
      )}

      {/* Events */}
      {invite.events && invite.events.length > 0 && (
        <section className="py-20 px-4 bg-black/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-12">Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {invite.events.map((ev: any, idx: number) => (
                <div key={idx} className={`${themeStyles.card} p-8 rounded-xl text-center`}>
                  <h3 className="text-xl font-bold mb-2">{ev.name}</h3>
                  <p className="opacity-70 mb-4">{ev.time}</p>
                  <p className="text-sm">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <MapPin className={`w-8 h-8 mx-auto mb-6 ${themeStyles.accent}`} />
        <h2 className="text-3xl font-serif mb-8">Venue</h2>
        <p className="text-xl mb-4">{invite.venue}</p>
        <p className="opacity-70 mb-8">
          {invite.date && !isNaN(+new Date(invite.date)) ? format(new Date(invite.date), 'h:mm a') : ''}
        </p>
        
        {invite.mapUrl && (
          <a 
            href={invite.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-block px-8 py-3 rounded-full font-medium text-white mb-12 transition-transform hover:scale-105 ${themeStyles.button}`}
          >
            Open in Google Maps
          </a>
        )}

        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(invite.venue || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>
      </section>

      {/* Gallery */}
      {invite.imageUrls && invite.imageUrls.length > 0 && (
        <section className="py-20 px-4">
          <h2 className="text-3xl font-serif text-center mb-12">Gallery</h2>
          {!galleryUnlocked ? (
            <div className="max-w-md mx-auto text-center">
              <p className="mb-6 opacity-80">The photo gallery is locked. Watch a short sponsor message to unlock it.</p>
              <AdBanner format="rewarded" onReward={() => setGalleryUnlocked(true)} />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {invite.imageUrls.map((url: string, idx: number) => (
                <img key={idx} src={url} alt="Gallery" className="w-full rounded-lg shadow-md hover:opacity-90 transition-opacity" referrerPolicy="no-referrer" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* RSVP */}
      <AdBanner />
      <section className="py-20 px-4 max-w-xl mx-auto">
        <div className={`${themeStyles.card} p-8 md:p-12 rounded-2xl shadow-xl`}>
          <h2 className="text-3xl font-serif text-center mb-8">RSVP</h2>
          
          {rsvpSuccess ? (
            <div className="text-center py-8">
              <Heart className={`w-12 h-12 mx-auto mb-4 ${themeStyles.accent}`} />
              <h3 className="text-2xl font-serif mb-2">Thank You!</h3>
              <p className="opacity-70">Your response has been recorded.</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required type="text" className={`w-full px-4 py-2 rounded-lg border ${themeStyles.border} bg-transparent outline-none focus:ring-2 focus:ring-current`} value={rsvpForm.name} onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Will you attend?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="attending" checked={rsvpForm.attending} onChange={() => setRsvpForm({...rsvpForm, attending: true})} />
                    <span>Joyfully Accept</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="attending" checked={!rsvpForm.attending} onChange={() => setRsvpForm({...rsvpForm, attending: false})} />
                    <span>Regretfully Decline</span>
                  </label>
                </div>
              </div>

              {rsvpForm.attending && (
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Guests</label>
                  <input type="number" min="1" max="10" className={`w-full px-4 py-2 rounded-lg border ${themeStyles.border} bg-transparent outline-none focus:ring-2 focus:ring-current`} value={rsvpForm.guests} onChange={e => setRsvpForm({...rsvpForm, guests: parseInt(e.target.value)})} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  {invite.eventType === 'housewarming' || invite.eventType === 'baby_shower' ? 'Message for the host(s) (Optional)' : 'Message for the couple (Optional)'}
                </label>
                <textarea rows={3} className={`w-full px-4 py-2 rounded-lg border ${themeStyles.border} bg-transparent outline-none focus:ring-2 focus:ring-current`} value={rsvpForm.message} onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})} />
              </div>

              <button type="submit" disabled={rsvpLoading} className={`w-full py-3 rounded-xl font-medium text-white transition-opacity disabled:opacity-70 ${themeStyles.button}`}>
                {rsvpLoading ? 'Submitting...' : 'Send RSVP'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
