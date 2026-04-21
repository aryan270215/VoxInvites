import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Heart, Clock, Image as ImageIcon, MapPin, Music, ShieldCheck, ArrowRight, Leaf, TreePine, Globe2 } from 'lucide-react';

const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      staggerChildren: 0.04,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    transition: { type: "spring", stiffness: 120, damping: 10 } 
  },
};

const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <motion.span
      variants={sentenceVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className || ""}`}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={letterVariants}
          className="inline-block"
          style={{ transformOrigin: "bottom center" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const AnimatedWords = ({ text, className }: { text: string, className?: string }) => {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        hidden: { opacity: 1 },
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className={`inline-block ${className || ""}`}
    >
      {text.split(" ").map((word, index) => (
        <motion.span key={index} variants={wordVariants} className="inline-block mr-2">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fdfbf7] overflow-hidden text-stone-900" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <motion.div style={{ y: yBg, opacity: opacityFade }} className="absolute inset-0 z-0 pointer-events-none">
          <motion.div animate={{ y: [0, -30, 0], rotate: [0, 5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-rose-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70" />
          <motion.div animate={{ y: [0, 30, 0], rotate: [0, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-amber-100/60 rounded-full mix-blend-multiply filter blur-[80px] opacity-70" />
          <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-50 border border-rose-100 text-sm font-medium text-rose-800 mb-10 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
            </motion.div>
            <span className="tracking-wide">✨ Save up to ₹10,000+ on printing & postage</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold text-stone-900 mb-8 leading-[1.1] tracking-tight relative perspective-[1000px]">
            <AnimatedText text="Craft your perfect" className="block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 block pb-2">
              <AnimatedText text="digital invitation" />
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="text-lg md:text-2xl text-stone-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Share your story, manage RSVPs, and create a breathtaking digital experience for your guests in minutes. Perfect for weddings, birthdays, corporate events, and more.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, type: "spring" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/create"
              className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-rose-600 rounded-full hover:bg-rose-700 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center">
                Create Invitation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300 left-0" />
            </Link>
            <Link
              to="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-stone-700 bg-white border border-stone-200 shadow-sm rounded-full hover:bg-stone-50 transition-all hover:shadow-md hover:-translate-y-1"
            >
              View Demos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 bg-white relative z-10 rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)] border-t border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-6 tracking-tight">
              <AnimatedWords text="Everything you need" />
            </h2>
            <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto">
              <AnimatedWords text="Powerful features wrapped in an elegant and deeply immersive design." />
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="md:col-span-2 bg-[#fffcf9] rounded-[2rem] p-8 border border-orange-100/50 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-32 -right-32 w-80 h-80 bg-rose-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" 
              />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <Heart className="w-12 h-12 text-rose-500 mb-6 drop-shadow-md" />
                <div>
                  <h3 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 mb-4">Beautiful Themes</h3>
                  <p className="text-lg text-stone-600 max-w-md leading-relaxed">Choose from 25+ carefully crafted themes like Botanical, Elegant, and Classic. Each designed to perfectly match your event's unique aesthetic.</p>
                </div>
              </div>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
              className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-[2rem] p-8 text-stone-900 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <ShieldCheck className="w-12 h-12 text-rose-500 mb-6 drop-shadow-md" />
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-3 text-stone-900">Secure RSVPs</h3>
                  <p className="text-stone-600 leading-relaxed">Protect your invite with a PIN and manage guest responses seamlessly.</p>
                </div>
              </div>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
              className="bg-[#f0f4f1] rounded-[2rem] p-8 border border-emerald-100 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-tr from-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <MapPin className="w-12 h-12 text-emerald-600 mb-6 drop-shadow-md" />
                <div>
                  <h3 className="text-2xl font-serif font-bold text-emerald-950 mb-3">Interactive Maps</h3>
                  <p className="text-emerald-800/80 leading-relaxed">Integrated Google Maps to help your guests easily find your perfect venue.</p>
                </div>
              </div>
            </motion.div>

            {/* Large Card 2 */}
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
              className="md:col-span-2 bg-[#fffdfa] rounded-[2rem] p-8 border border-amber-100/50 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end"
            >
              <motion.div 
                animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 flex gap-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500"
              >
                <ImageIcon className="w-12 h-12 text-rose-400 -rotate-12" />
                <Music className="w-12 h-12 text-amber-500 rotate-6" />
                <Clock className="w-12 h-12 text-emerald-400 -rotate-6" />
              </motion.div>
              <div className="relative z-10 mt-20">
                <h3 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 mb-4">Rich Media Experience</h3>
                <p className="text-lg text-stone-600 max-w-md leading-relaxed">Create a stunning photo gallery and showcase your elaborate event timeline natively inside the beautiful UI.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eco-Friendly Mission Section */}
      <section className="py-32 bg-[#ebf0ec] text-emerald-950 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[120px]" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 bg-white border border-emerald-100 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <Leaf className="w-12 h-12 text-emerald-500" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 tracking-tight text-emerald-950">
              <AnimatedWords text="Join Our Green Mission" />
            </h2>
            <p className="text-xl text-emerald-800/80 font-light leading-relaxed">
              Traditional paper invitations produce thousands of pounds of waste every year. By choosing Vox Invites, you're not just saving up to ₹10,000+—you're actively saving trees and protecting our planet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: TreePine, title: "Save Trees", desc: "Every digital invite sent means fewer trees cut down for paper and envelopes.", delay: 0.1 },
              { icon: Globe2, title: "Zero Carbon", desc: "Eliminate the carbon emissions associated with printing and postal delivery.", delay: 0.2 },
              { icon: Heart, title: "Zero Waste", desc: "No discarded paper, no plastic packaging. Just pure, sustainable celebration.", delay: 0.3 }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: item.delay, type: "spring", stiffness: 100 }}
                className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-emerald-100 text-center shadow-lg relative overflow-hidden group hover:border-emerald-200"
              >
                <item.icon className="w-12 h-12 text-emerald-500 mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold mb-4 text-emerald-950">{item.title}</h3>
                <p className="text-emerald-800/80 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-rose-950 text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-rose-500/20 rounded-full mix-blend-screen filter blur-[150px]" />
        </motion.div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-8 tracking-tight leading-tight"
          >
             <AnimatedWords text="Ready to craft your invite?" />
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-2xl text-rose-100 mb-14 font-light max-w-2xl mx-auto"
          >
            Join thousands of hosts who have saved time, money, and trees by sharing their special day beautifully.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          >
            <Link
              to="/create"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-medium text-rose-950 bg-white rounded-full hover:bg-stone-50 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-100/50 to-transparent -translate-x-[200%]"
                animate={{ translateX: ["-200%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              />
              <span className="relative z-10 flex items-center">
                Get Started for Free
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
