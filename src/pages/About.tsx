import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Truck, Star, Leaf, Users, Award, ArrowRight, Linkedin, Twitter, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const TEAM = [
  {
    name: 'Nishant Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80',
    bio: 'Visionary entrepreneur passionate about premium hydration and brand experiences.',
    socials: [
      { icon: 'Linkedin', url: 'https://linkedin.com/', label: 'LinkedIn' },
      { icon: 'Twitter', url: 'https://twitter.com/', label: 'Twitter' },
    ],
  },
  {
    name: 'Ava Patel',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    bio: 'Designs bottles and labels that make brands unforgettable.',
    socials: [
      { icon: 'Instagram', url: 'https://instagram.com/', label: 'Instagram' },
      { icon: 'Linkedin', url: 'https://linkedin.com/', label: 'LinkedIn' },
    ],
  },
  {
    name: 'Liam Chen',
    role: 'Production Lead',
    image: 'https://images.unsplash.com/photo-1519340333755-c6e2a6a2c5fe?auto=format&fit=crop&w=800&q=80',
    bio: 'Ensures every bottle meets our high standards and ships on time.',
    socials: [
      { icon: 'Linkedin', url: 'https://linkedin.com/', label: 'LinkedIn' },
    ],
  },
]

const VALUES = [
  {
    icon: <Sparkles className="w-7 h-7 text-cyan-600" />,
    title: 'Unmatched Customization',
    desc: 'We empower brands to stand out with vibrant, fully personalized water bottles.',
  },
  {
    icon: <Leaf className="w-7 h-7 text-cyan-600" />,
    title: 'Eco Commitment',
    desc: 'Sustainability is at our core. Choose recycled bottles and biodegradable labels.',
  },
  {
    icon: <Truck className="w-7 h-7 text-cyan-600" />,
    title: 'Lightning Fast Delivery',
    desc: 'From design to doorstep, we deliver with speed and reliability.',
  },
  {
    icon: <Star className="w-7 h-7 text-cyan-600" />,
    title: 'Premium Quality',
    desc: 'Crystal-clear, BPA-free bottles and vibrant labels—no compromises.',
  },
  {
    icon: <Users className="w-7 h-7 text-cyan-600" />,
    title: 'Customer-First',
    desc: 'Our team is here for you at every step. 100% satisfaction guaranteed.',
  },
  {
    icon: <Award className="w-7 h-7 text-cyan-600" />,
    title: 'Award-Winning Service',
    desc: 'Trusted by top brands and event planners across the country.',
  },
]

function About() {
  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative min-h-[60vh] flex items-center pt-24 pb-16 bg-gradient-to-br from-sky-50 via-cyan-50 to-white border-b border-sky-100"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="text-5xl md:text-6xl font-serif font-extrabold tracking-tighter text-slate-900 leading-tight"
            >
              About <span className="bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">Nishant Waters</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-lg text-slate-600 max-w-lg"
            >
              Nishant Waters is redefining hydration for brands, events, and organizations. We believe every bottle is an opportunity to make a lasting impression—on your guests, your clients, and the planet.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <Link
                to="/contact"
                className={cn(
                  'inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base',
                  'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
                  'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                )}
              >
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/shop"
                className={cn(
                  'inline-flex items-center px-6 py-3 rounded-xl font-semibold text-base',
                  'bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
                  'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
                )}
              >
                Shop Bottles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="aspect-video bg-white rounded-2xl border border-slate-100 shadow-xl p-4 flex items-center justify-center"
          >
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
              alt="Custom labeled water bottles"
              className="object-cover w-full h-full rounded-xl"
              crossOrigin="anonymous"
              draggable={false}
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-24 px-6 bg-white border-t border-sky-100"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tighter text-slate-900 mb-10 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 + i * 0.05, ease: 'easeOut' }}
                whileHover={{
                  scale: 1.03,
                  y: -4,
                  boxShadow: '0 8px 32px 0 rgba(56,189,248,0.08)',
                }}
                className="bg-sky-50 p-8 rounded-2xl border border-sky-100 hover:shadow-lg transition-all flex flex-col items-center text-center"
              >
                <div className="mb-4">{val.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{val.title}</h3>
                <p className="text-slate-600">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-24 px-6 bg-gradient-to-b from-white via-cyan-50 to-sky-50 border-t border-sky-100"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tighter text-slate-900 mb-10 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 + i * 0.07, ease: 'easeOut' }}
                whileHover={{
                  scale: 1.025,
                  y: -4,
                  boxShadow: '0 8px 32px 0 rgba(56,189,248,0.10)',
                }}
                className="bg-white p-8 rounded-2xl border border-sky-100 hover:shadow-lg transition-all flex flex-col items-center text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 object-cover rounded-full border-4 border-cyan-100 mb-4"
                  crossOrigin="anonymous"
                  draggable={false}
                />
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <span className="text-cyan-700 font-semibold mb-2">{member.role}</span>
                <p className="text-slate-600 text-sm mb-4">{member.bio}</p>
                <div className="flex gap-3 justify-center">
                  {member.socials.map(soc => {
                    let Icon = null
                    if (soc.icon === 'Linkedin') {
                      Icon = Linkedin
                    } else if (soc.icon === 'Twitter') {
                      Icon = Twitter
                    } else if (soc.icon === 'Instagram') {
                      Icon = Instagram
                    }
                    return Icon ? (
                      <a
                        key={soc.icon}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={soc.label}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 text-cyan-700 hover:text-cyan-900 transition-all"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ) : null
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="py-20 px-6 bg-white border-t border-sky-100"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-slate-900 mb-4">
            Ready to Make a Splash?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Whether you’re planning an event, launching a campaign, or elevating your office, Nishant Waters is here to help you create a lasting impression—one bottle at a time.
          </p>
          <Link
            to="/contact"
            className={cn(
              'inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg',
              'bg-gradient-to-b from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-800 text-white shadow-sm',
              'border border-cyan-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'
            )}
          >
            Get in Touch
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

export default About