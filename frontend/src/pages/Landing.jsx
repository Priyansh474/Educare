import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const stats = [
  { label: 'Active Learners', value: '120K+' },
  { label: 'Expert Mentors', value: '450+' },
  { label: 'Video Lessons', value: '12K+' },
  { label: 'Course Rating', value: '4.8/5' },
];

const features = [
  {
    title: 'Modern Design',
    desc: 'Clean, modern layouts that keep learners focused on what matters most.',
    icon: '⚙️',
  },
  {
    title: '24x7 User Support',
    desc: 'Dedicated support team available whenever you need help.',
    icon: '📞',
  },
  {
    title: 'Fast',
    desc: 'Optimized experience so pages and lessons load quickly.',
    icon: '⚡',
  },
  {
    title: 'Market Strategy',
    desc: 'Curriculum aligned with real market needs and skills.',
    icon: '📊',
  },
  {
    title: 'Affordable Cost',
    desc: 'High–quality education with flexible, affordable pricing.',
    icon: '💳',
  },
  {
    title: 'Safe',
    desc: 'Secure platform with protected payments and data.',
    icon: '🔒',
  },
  {
    title: 'Business Growth',
    desc: 'Practical skills that help you grow your career or business.',
    icon: '💼',
  },
];

const categories = [
  {
    id: 1,
    category: 'Design',
    title: 'UI design, prototype with Figma',
    level: 'Beginner',
    duration: '3 Months',
    lessons: '12 Lessons',
    price: '$16.00',
    bgFrom: '#064E3B',
    bgTo: '#059669',
    image:
      'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=500&auto=format&fit=crop&crop=faces',
  },
  {
    id: 2,
    category: 'Design',
    title: 'The complete graphic design for beginners',
    level: 'Intermediate',
    duration: '2 Months',
    lessons: '10 Lessons',
    price: '$18.00',
    bgFrom: '#022C22',
    bgTo: '#047857',
    image:
      'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=500&auto=format&fit=crop&crop=faces',
  },
  {
    id: 3,
    category: 'Business',
    title: 'Learn big marketing on Facebook',
    level: 'Beginner',
    duration: '1.5 Months',
    lessons: '8 Lessons',
    price: '$14.00',
    bgFrom: '#064E3B',
    bgTo: '#10B981',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&crop=faces',
  },
  {
    id: 4,
    category: 'Development',
    title: 'Financial Analyst training & investing course',
    level: 'Advanced',
    duration: '4 Months',
    lessons: '15 Lessons',
    price: '$20.00',
    bgFrom: '#022C22',
    bgTo: '#16A34A',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb0b90c1207?w=500&auto=format&fit=crop&crop=faces',
  },
];

const testimonials = [
  {
    quote: 'The live mentorship and weekly milestones kept me accountable. I shipped a portfolio-ready project in 6 weeks.',
    name: 'Anita George',
    role: 'Product Designer, Fintech',
  },
  {
    quote: 'The projects mirror real team workflows—PR reviews, standups, and sprints. It felt like working at a startup.',
    name: 'Miguel Santos',
    role: 'Fullstack Engineer, HealthTech',
  },
];

export default function Landing() {
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('All Courses');

  return (
    <div className="min-h-screen bg-[#F3F7F4]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-20">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="max-w-xl space-y-6">
            <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-emerald-700 text-xs font-semibold shadow-sm border border-emerald-100">
              100+ Online Courses
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Education is the best way to{' '}
              <span className="text-emerald-600 block">Grow Up Your Knowledge</span>
            </h1>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Our platform makes education flexible and convenient, so you can achieve your goals wherever and
              whenever you choose.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={user ? '/courses' : '/signup'}
                className="px-6 py-3 rounded-md bg-emerald-700 text-white font-semibold shadow-md hover:bg-emerald-800 transition"
              >
                Enroll Now
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                </span>
                Learn More
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              {/* Avatars */}
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1544723795-432537d12f6c?w=200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1544723795-3fb0b90c1207?w=200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop',
                ].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Student"
                    className="w-9 h-9 rounded-full border-2 border-[#F3F7F4] object-cover"
                  />
                ))}
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center border-2 border-[#F3F7F4]">
                  +
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center gap-1 text-emerald-700 text-sm font-semibold">
                  <span>★★★★☆</span>
                  <span>(4.5)</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">1000+ Reviews on our courses</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative w-full max-w-md lg:max-w-lg">
            <div className="relative mx-auto">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-emerald-800 mx-auto relative flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&crop=faces"
                  alt="Happy student"
                  className="h-full object-cover"
                />
              </div>

              {/* Dashed circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[115%] h-[115%] rounded-full border-2 border-dashed border-emerald-400" />
              </div>

              {/* UI Design class card */}
              <div className="absolute -bottom-4 left-2 md:left-6 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&auto=format&fit=crop"
                    alt="Instructor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">UI Design Class</p>
                  <p className="text-[11px] text-gray-500">Today at 05:00 pm</p>
                  <button className="mt-1 px-3 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-semibold">
                    Join now
                  </button>
                </div>
              </div>

              {/* Online courses pill */}
              <div className="absolute top-10 right-0 md:-right-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-3 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 text-lg">▶</span>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-gray-900">100+</p>
                  <p className="text-gray-500">Online courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="container mx-auto px-4 lg:px-10 py-16 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose <span className="text-emerald-600">Us</span>
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Discover why thousands of learners trust our platform for their online education.
          </p>
        </div>

        <div className="mx-auto max-w-5xl flex flex-col md:flex-row justify-center gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6 md:pt-8">
            {[features[0], features[3]].map(
              (item) =>
                item && (
                  <div key={item.title} className="flex justify-center">
                    <div className="w-52">
                      <div className="relative">
                        <div className="mx-auto w-full aspect-[5/4]">
                          <div
                            className="w-full h-full bg-gradient-to-b from-white to-[#F7FAF8] border border-emerald-50 shadow-sm"
                            style={{
                              clipPath:
                                'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                            <span className="text-emerald-600 text-xl">{item.icon}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[11px] leading-relaxed text-gray-500">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>

          {/* Center column */}
          <div className="flex flex-col gap-6">
            {[features[1], features[6], features[4]].map(
              (item) =>
                item && (
                  <div key={item.title} className="flex justify-center">
                    <div className="w-56">
                      <div className="relative">
                        <div className="mx-auto w-full aspect-[5/4]">
                          <div
                            className="w-full h-full bg-gradient-to-b from-white to-[#F7FAF8] border border-emerald-50 shadow-sm"
                            style={{
                              clipPath:
                                'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                            <span className="text-emerald-600 text-xl">{item.icon}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[11px] leading-relaxed text-gray-500">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 md:pt-8">
            {[features[2], features[5]].map(
              (item) =>
                item && (
                  <div key={item.title} className="flex justify-center">
                    <div className="w-52">
                      <div className="relative">
                        <div className="mx-auto w-full aspect-[5/4]">
                          <div
                            className="w-full h-full bg-gradient-to-b from-white to-[#F7FAF8] border border-emerald-50 shadow-sm"
                            style={{
                              clipPath:
                                'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                            <span className="text-emerald-600 text-xl">{item.icon}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[11px] leading-relaxed text-gray-500">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </section>

      {/* Categories / Courses slider style */}
      <section className="container mx-auto px-4 lg:px-10 pb-16 bg-[#E8F2EC]">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Popular Courses
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            Explore our top categories
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-6">
          {['All Courses', 'Design', 'Business', 'Development'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === tab
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-emerald-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards row */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories
            .filter((card) =>
              activeCategory === 'All Courses' ? true : card.category === activeCategory
            )
            .map((card) => (
              <div
                key={card.id}
                className="rounded-3xl bg-white border border-emerald-100 shadow-md hover:shadow-xl hover:border-emerald-300 transition overflow-hidden"
              >
                <div
                  className="relative px-4 pt-4 pb-20 rounded-t-3xl overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${card.bgFrom}, ${card.bgTo})`,
                  }}
                >
                  {/* Top labels */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-medium">
                      {card.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/90 text-white font-medium">
                      {card.level}
                    </span>
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white leading-snug">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-[11px] text-emerald-50/90">
                        {card.lessons} · {card.duration}
                      </p>
                    </div>
                    <div className="w-16 h-20 md:w-20 md:h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom white strip */}
                <div className="flex items-center justify-between px-4 py-3 bg-white">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full bg-emerald-500 text-xs font-semibold text-white shadow hover:bg-emerald-600 transition"
                  >
                    Enroll Now
                  </button>
                  <p className="text-sm font-bold text-emerald-600">{card.price}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Community / Testimonials */}
      <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
        <div className="container mx-auto px-6 lg:px-10 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left copy + stats */}
            <div>
              <p className="text-emerald-600 font-semibold uppercase text-xs tracking-[0.25em]">
                Community
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">
                Learn together with a vibrant community
              </h2>
              <p className="text-gray-700 mt-4 max-w-xl">
                Join live sessions, get feedback from peers and mentors, and stay accountable with a
                community that is building and shipping projects alongside you.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/80 border border-emerald-100 shadow-sm p-5">
                  <p className="text-3xl font-extrabold text-gray-900">92%</p>
                  <p className="text-sm text-gray-600 mt-1">
                    complete at least one capstone project
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 border border-emerald-100 shadow-sm p-5">
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-extrabold text-gray-900">4.8</p>
                    <span className="text-yellow-400 text-xl">★★★★★</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">average learner satisfaction</p>
                </div>
              </div>

              {/* Avatar row */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?w=200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop',
                  ].map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt="Learner"
                      className="w-9 h-9 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">10,000+</span> learners already in the
                  community
                </p>
              </div>
            </div>

            {/* Right testimonial cards */}
            <div className="grid gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="relative rounded-3xl bg-white shadow-lg border border-emerald-100 p-6 overflow-hidden"
                >
                  <div className="absolute -top-6 -right-4 text-emerald-100 text-7xl select-none">
                    “
                  </div>
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 mb-2">
                    Student story
                  </p>
                  <p className="text-lg leading-relaxed text-gray-900">“{t.quote}”</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-emerald-700">{t.role}</p>
                    </div>
                    <div className="text-xs text-gray-500">Verified learner</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-50 via-[#F3F7F4] to-emerald-50 border-t border-emerald-100">
        <div className="container mx-auto px-6 lg:px-10 py-14 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-600 font-semibold">Get started</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-gray-900">Launch your next career chapter</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Pick a cohort, join live sessions, and ship a project with mentor feedback. The fastest way to learn is together.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-800 transition"
            >
              Start for free
            </Link>
            <Link
              to="/courses"
              className="px-6 py-3 rounded-xl border border-emerald-700 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
            >
              Browse catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
