import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Heart, Clock, Image as ImageIcon, MapPin, Music, ShieldCheck, ArrowRight, Leaf, TreePine, Globe2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
          <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
          <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 text-sm font-medium text-stone-600 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>The new standard for event invitations</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-8 leading-[1.1] tracking-tight">
              Craft your perfect <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
                digital invitation
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-2xl text-stone-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Share your story, manage RSVPs, and create a breathtaking digital experience for your guests in minutes. Perfect for weddings, birthdays, corporate events, and more.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-stone-900 rounded-full hover:bg-stone-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Create Invitation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-stone-900 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-all hover:scale-105 shadow-sm"
              >
                View Demos
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">Everything you need</h2>
            <p className="text-xl text-stone-500 font-light">Powerful features wrapped in an elegant design.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Large Card */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.01 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              className="md:col-span-2 bg-stone-50 rounded-3xl p-8 border border-stone-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <Heart className="w-10 h-10 text-rose-500 mb-6" />
              <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Beautiful Themes</h3>
              <p className="text-lg text-stone-600 max-w-md">Choose from 13+ carefully crafted themes like Cyberpunk, Confetti, and Glassmorphism. Each designed to perfectly match your event's unique aesthetic.</p>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="bg-stone-900 rounded-3xl p-8 text-white relative overflow-hidden group"
            >
              <ShieldCheck className="w-10 h-10 text-rose-400 mb-6" />
              <h3 className="text-2xl font-serif font-bold mb-4">Secure RSVPs</h3>
              <p className="text-stone-400">Protect your invite with a PIN and manage guest responses seamlessly.</p>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              className="bg-amber-50 rounded-3xl p-8 border border-amber-100 relative overflow-hidden group"
            >
              <MapPin className="w-10 h-10 text-amber-600 mb-6" />
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">Interactive Maps</h3>
              <p className="text-stone-600">Integrated Google Maps to help your guests find the venue easily.</p>
            </motion.div>

            {/* Large Card 2 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.01 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
              className="md:col-span-2 bg-stone-50 rounded-3xl p-8 border border-stone-100 relative overflow-hidden group flex flex-col justify-end"
            >
              <div className="absolute top-8 right-8 flex gap-4">
                <Music className="w-10 h-10 text-stone-400" />
                <ImageIcon className="w-10 h-10 text-stone-400" />
                <Clock className="w-10 h-10 text-stone-400" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Rich Media Experience</h3>
              <p className="text-lg text-stone-600 max-w-md">Add background music from YouTube, create a stunning photo gallery, and showcase your event timeline.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eco-Friendly Mission Section */}
      <section className="py-24 bg-emerald-950 text-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[120px]" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <Leaf className="w-16 h-16 text-emerald-400" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Join Our Green Mission</h2>
            <p className="text-xl text-emerald-200/80 font-light leading-relaxed">
              Traditional paper invitations produce thousands of pounds of waste every year. By choosing Vox Invites, you're not just creating a stunning digital experience—you're actively saving trees and protecting our planet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-emerald-900/50 backdrop-blur-sm p-8 rounded-3xl border border-emerald-800/50 text-center"
            >
              <TreePine className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Save Trees</h3>
              <p className="text-emerald-200/70">Every digital invite sent means fewer trees cut down for paper and envelopes.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-900/50 backdrop-blur-sm p-8 rounded-3xl border border-emerald-800/50 text-center"
            >
              <Globe2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Zero Carbon Footprint</h3>
              <p className="text-emerald-200/70">Eliminate the carbon emissions associated with printing and postal delivery.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-emerald-900/50 backdrop-blur-sm p-8 rounded-3xl border border-emerald-800/50 text-center"
            >
              <Heart className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Zero Waste</h3>
              <p className="text-emerald-200/70">No discarded paper, no plastic packaging. Just pure, sustainable celebration.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500 rounded-full mix-blend-screen filter blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-serif font-bold mb-8"
          >
            Ready to create your invite?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-300 mb-12 font-light"
          >
            Join thousands of hosts who have shared their special day with Vox Invites.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/create"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-medium text-stone-900 bg-white rounded-full hover:bg-stone-100 transition-all hover:scale-105 shadow-2xl"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
