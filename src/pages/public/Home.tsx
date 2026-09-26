import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Coins,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldCheck,
  Upload,
  GraduationCap,
  Compass,
  Quote,
} from 'lucide-react';
import { Carousel } from '../../components/common/Carousel';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: Coins,
    tint: 'brand',
    title: 'Allowance Baseline & Savings Goal',
    desc: 'Define your monthly financial cushion from family or part-time work, set a semester savings target, and see live progress toward your goal.',
  },
  {
    icon: PieChart,
    tint: 'emerald',
    title: 'Category Budgets & 75% Alerts',
    desc: 'Set monthly spending caps for Food, Hostel, Transit, Subscriptions, and Academics. Campus Coin automatically triggers alerts at 75% and 100% capacity.',
  },
  {
    icon: Sparkles,
    tint: 'gold',
    title: 'AI Categorization & Monthly Digest',
    desc: 'Type "Starbucks latte" or "Calculus textbook" and let AI auto-assign the exact category. Get personalized monthly digests on where to save next.',
  },
  {
    icon: Upload,
    tint: 'amber',
    title: 'One-Click CSV Statement Import',
    desc: 'Export statements from your student debit card or mobile wallet and bulk import them in seconds with instant validation and category mapping.',
  },
  {
    icon: Compass,
    tint: 'brand',
    title: 'Student Saving Tips & Bookmarks',
    desc: 'Learn practical university money hacks: library reserve books, student transit pass discounts, and bulk cooking ideas. Save favorites for later review.',
  },
  {
    icon: ShieldCheck,
    tint: 'rose',
    title: 'Admin & Campus Community Hub',
    desc: 'University administrators can broadcast campus financial aid announcements, manage categories, curate saving tips, and review macro spending health.',
  },
];

const tintClasses: Record<string, string> = {
  brand: 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
  gold: 'bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400',
  amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
};

const testimonials = [
  {
    name: 'Ayesha, 3rd Year — Business',
    quote: 'I finally know where my monthly allowance actually goes. The 75% budget alert has saved me from three overdrafts this semester alone.',
  },
  {
    name: 'Daniyal, 2nd Year — Computer Science',
    quote: 'The CSV import took my entire bank statement and sorted it into categories in under a minute. Genuinely faster than doing it in Excel.',
  },
  {
    name: 'Sara, 4th Year — Architecture',
    quote: 'The saving tips are actually written for students, not generic finance advice. Bookmarked half of them.',
  },
  {
    name: 'Hamza, 1st Year — Engineering',
    quote: 'Splitting hostel costs with roommates used to be a mess of screenshots. Campus Coin just tracks it cleanly.',
  },
];

const CoinBackdrop: React.FC = () => (
  <div className="cc-hero-bg">
    <div className="cc-hero-blob w-96 h-96 bg-brand-400 -top-16 -left-16" />
    <div className="cc-hero-blob w-[28rem] h-[28rem] bg-violet-400 top-10 right-0" />
    <div className="cc-hero-blob w-72 h-72 bg-gold-400 bottom-0 left-1/3" />

    <div className="cc-coin w-14 h-14 bg-gradient-to-br from-brand-400 to-brand-600 top-[18%] left-[10%]" style={{ animationDelay: '0s' }}>
      <Coins className="w-6 h-6" />
    </div>
    <div className="cc-coin w-10 h-10 bg-gradient-to-br from-gold-300 to-gold-500 top-[65%] left-[6%]" style={{ animationDelay: '1.4s' }}>
      <Coins className="w-4 h-4" />
    </div>
    <div className="cc-coin w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-600 top-[12%] right-[12%]" style={{ animationDelay: '0.8s' }}>
      <Coins className="w-7 h-7" />
    </div>
    <div className="cc-coin w-12 h-12 bg-gradient-to-br from-brand-300 to-brand-500 top-[60%] right-[8%]" style={{ animationDelay: '2.2s' }}>
      <Coins className="w-5 h-5" />
    </div>
  </div>
);

export const Home: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-4">
        <CoinBackdrop />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial="hidden"
              animate="show"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Personal Finance, Built for University Life</span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]"
            >
              Manage your allowance.{' '}
              <span className="bg-gradient-to-r from-brand-600 via-violet-500 to-gold-500 bg-clip-text text-transparent">
                Master campus life.
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
            >
              Campus Coin helps university students track monthly allowances, split shared hostel expenses, manage everyday spending, and receive automated financial insights — all in one place.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25 hover:shadow-brand-600/35 transition-all transform hover:-translate-y-0.5"
              >
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Log In (Demo Ready)</span>
              </Link>
            </motion.div>

            <motion.div initial="hidden" animate="show" custom={4} variants={fadeUp} className="pt-2">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Demo Access:</span>
                <span>Student: <code className="text-brand-600 dark:text-brand-400 font-mono">student@campuscoin.local / Student@12345</code></span>
                <span>•</span>
                <span>Admin: <code className="text-brand-600 dark:text-brand-400 font-mono">admin@campuscoin.local / Admin@12345</code></span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Straightforward tools built around real student priorities.
          </p>
        </div>

        <Carousel perView={3}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${tintClasses[f.tint]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </Carousel>
      </section>

      {/* Testimonial Carousel */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            What Students Are Saying
          </h2>
        </div>
        <Carousel perView={2} autoPlayMs={5000}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-7 rounded-3xl bg-gradient-to-br from-brand-50 to-white dark:from-slate-900 dark:to-slate-900 border border-brand-100 dark:border-slate-800 shadow-xs"
            >
              <Quote className="w-6 h-6 text-brand-400 mb-3" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-4">"{t.quote}"</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
            </div>
          ))}
        </Carousel>
      </section>

      {/* SRS Sitemap Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-brand-200">
              <GraduationCap className="w-4 h-4" />
              <span>Full SRS Compliance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Looking for our structured application directory?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Explore the complete sitemap documenting all public, student, and administration endpoints as required by university specifications.
            </p>
          </div>
          <Link
            to="/sitemap"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white text-slate-900 hover:bg-brand-50 transition-colors shrink-0 shadow-md"
          >
            <span>View Complete Sitemap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};
