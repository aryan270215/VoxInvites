import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Sparkles, ArrowRight, Eye, Calendar, MapPin, Heart } from 'lucide-react';
import { templates } from '../utils/demoData';

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'housewarming', label: 'Housewarming' },
  { id: 'baby_shower', label: 'Baby Shower' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'company_party', label: 'Company Party' },
];

const TemplateCard: React.FC<{ template: any, index: number }> = ({ template, index }) => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % 3);
      }, 2500);
    } else {
      setActiveSlide(0);
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  const demo = template.demoData;
  const names = demo.secondaryName ? `${demo.primaryName} & ${demo.secondaryName}` : demo.primaryName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-200 flex flex-col h-full"
    >
      <div className={`h-64 w-full ${template.color} relative overflow-hidden`}>
        {/* Slide 1: Cover */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeSlide === 0 ? 'opacity-100' : 'opacity-0'}`}>
          {demo?.imageUrls?.[0] && (
            <img 
              src={demo.imageUrls[0]} 
              alt={template.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-stone-900 drop-shadow-sm">
            <p className="text-xs uppercase tracking-widest mb-2 font-medium opacity-80">{demo.introGreeting}</p>
            <h4 className="text-3xl font-serif font-bold leading-tight">{names}</h4>
          </div>
        </div>

        {/* Slide 2: Details */}
        <div className={`absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity duration-700 flex flex-col items-center justify-center p-6 text-center text-white ${activeSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
          <Calendar className="w-8 h-8 mb-3 text-rose-400" />
          <p className="text-sm font-medium mb-4">{new Date(demo.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <MapPin className="w-8 h-8 mb-3 text-rose-400" />
          <p className="text-xs line-clamp-2 px-4">{demo.venue}</p>
        </div>

        {/* Slide 3: Story/Events */}
        <div className={`absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity duration-700 flex flex-col items-center justify-center p-6 text-center text-white ${activeSlide === 2 ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
          <Heart className="w-8 h-8 mb-4 text-rose-400" />
          <p className="text-sm italic line-clamp-4 leading-relaxed px-2">"{demo.story}"</p>
        </div>

        {/* Hover Overlay Actions */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex flex-col items-center justify-end pb-8 gap-2 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/invite/demo-${template.id}`)}
              className="transform translate-y-4 group-hover:translate-y-0 transition-all bg-white text-stone-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-1 hover:scale-105"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button 
              onClick={() => navigate(`/create?demo=${template.id}`)}
              className="transform translate-y-4 group-hover:translate-y-0 transition-all delay-75 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-1 hover:scale-105"
            >
              Customize <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className={`absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === i ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 capitalize">
            {template.type.replace('_', ' ')}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 capitalize flex items-center gap-1">
            <Palette className="w-3 h-3" /> {template.theme}
          </span>
        </div>
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{template.title}</h3>
        <p className="text-stone-500 text-sm flex-1">{template.desc}</p>
      </div>
    </motion.div>
  );
};

export default function Templates() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.type === filter);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            Invitation Templates
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-stone-600 max-w-2xl mx-auto"
          >
            Browse our collection of beautifully designed templates. Find the perfect match for your event and customize it in minutes.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === category.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
