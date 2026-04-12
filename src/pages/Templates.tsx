import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Palette, Sparkles, ArrowRight, Eye } from 'lucide-react';
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
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-200 flex flex-col h-full"
            >
              <div className={`h-48 w-full ${template.color} relative overflow-hidden`}>
                {template.demoData?.imageUrls?.[0] && (
                  <img 
                    src={template.demoData.imageUrls[0]} 
                    alt={template.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center gap-3 z-10">
                  <button 
                    onClick={() => navigate(`/invite/demo-${template.id}`)}
                    className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all bg-white text-stone-900 px-6 py-2 rounded-full font-medium shadow-lg flex items-center gap-2 hover:scale-105"
                  >
                    <Eye className="w-4 h-4" /> Preview Demo
                  </button>
                  <button 
                    onClick={() => navigate(`/create?demo=${template.id}`)}
                    className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all delay-75 bg-stone-900 text-white px-6 py-2 rounded-full font-medium shadow-lg flex items-center gap-2 hover:scale-105"
                  >
                    Customize <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 capitalize">
                    {template.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 capitalize flex items-center gap-1">
                    <Palette className="w-3 h-3" /> {template.theme}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{template.title}</h3>
                <p className="text-stone-500 text-sm flex-1">{template.desc}</p>
                
                <button 
                  onClick={() => navigate(`/create?demo=${template.id}`)}
                  className="mt-6 w-full py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 transition-colors"
                >
                  Customize
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
