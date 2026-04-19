import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { CheckCircle, Copy, ExternalLink, MessageCircle, Settings, ArrowRight } from 'lucide-react';

export default function Success() {
  const { id } = useParams<{ id: string }>();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvite = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'invitations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInvite(docSnap.data());
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching invite:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [id, navigate]);

  const inviteUrl = `${window.location.origin}/invite/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const pName = invite?.primaryName || invite?.brideName || '';
    const sName = invite?.secondaryName || invite?.groomName || '';
    const names = sName ? `${pName} & ${sName}` : pName;
    const text = `You're invited to ${names}'s event! RSVP and see the details here: ${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!invite) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-green-50 px-8 py-10 text-center border-b border-green-100">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-serif text-green-900 mb-4 tracking-tight">Your Invitation is Ready!</h1>
          <p className="text-green-700 text-lg">
            We've successfully generated your beautiful invitation. It's now live and ready to be shared with your guests.
          </p>
        </div>

        <div className="px-8 py-10">
          <div className="mb-8">
            <label className="block text-sm font-medium text-stone-700 mb-2">Your Invitation Link</label>
            <div className="flex w-full items-center">
              <div className="flex-1 shrink-0 px-4 py-4 bg-stone-100 text-stone-600 rounded-l-xl border border-stone-200 border-r-0 truncate font-mono text-sm">
                {inviteUrl}
              </div>
              <button 
                onClick={copyToClipboard}
                className="flex items-center justify-center px-6 py-4 bg-stone-900 text-white rounded-r-xl border border-stone-900 hover:bg-stone-800 transition-colors shrink-0"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span className="ml-2 font-medium">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <Link 
              to={`/invite/${id}`}
              className="flex items-center justify-center gap-2 w-full py-4 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View Invitation
            </Link>
            <button 
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Share on WhatsApp
            </button>
          </div>

          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
            <div className="flex items-start">
              <div className="bg-white p-3 rounded-xl shadow-sm mr-4">
                <Settings className="w-6 h-6 text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">Manage Your Invites</h3>
                <p className="text-stone-600 mb-4 text-sm">
                  View RSVPs, see who has accepted or declined, and manage your guest list from your dashboard.
                </p>
                <Link 
                  to={`/invite/${id}/admin`}
                  className="inline-flex items-center text-rose-600 font-medium hover:text-rose-700 transition-colors"
                >
                  Go to RSVP Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
