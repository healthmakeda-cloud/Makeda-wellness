import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { socialLinks } from '../data/socialLinks.js'
import { products } from '../data/products.js'
import { testimonials } from '../data/testimonials.js'
import { specialOffer } from '../data/specialOffer.js'
import SocialIcon from '../components/SocialIcon.jsx'
import MakedaMethodModule from '../components/MakedaMethodModule.jsx'
import RootDivider from '../components/RootDivider.jsx'

const featuredProducts = products.filter((p) => p.image)

export default function Connect() {
  const [vlogPosts, setVlogPosts] = useState([])

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('vlog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('published_date', { ascending: false, nullsFirst: false })
      .limit(2)
      .then(({ data }) => setVlogPosts(data || []))
  }, [])

  return (
    <div>
      {specialOffer.active && (
        <div className="bg-ochre text-linen text-center px-6 py-3">
          <p className="text-sm">
            <strong>{specialOffer.headline}</strong>
            {specialOffer.detail && <span className="opacity-90"> — {specialOffer.detail}</span>}
            {' '}
            <Link to={specialOffer.cta.to} className="underline underline-offset-2 font-medium">
              {specialOffer.cta.label}
            </Link>
          </p>
        </div>
      )}

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img src="/images/logo-circle.png" alt="Makéda's Health" className="h-16 w-16 rounded-full mb-6" />
          <p className="font-mono text-xs tracking-widest text-ochre mb-4">MEDICAL HERBALIST · COLON HYDROTHERAPIST</p>
          <h1 className="font-display text-3xl md:text-4xl text-moss leading-tight">
            The gut is the root.
            <br />Everything else grows from it.
          </h1>
          <p className="mt-6 text-ink/80 max-w-md italic">
            Personalised, evidence-informed, whole-person care — book your consultation today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/client-intake" className="bg-moss text-linen px-6 py-3 rounded font-body text-sm hover:bg-ink transition-colors">
              Start Your Health Journey →
            </Link>
            <Link to="/contact" className="border border-moss text-moss px-6 py-3 rounded font-body text-sm hover:bg-moss/5 transition-colors">
              Book Now
            </Link>
          </div>
        </div>
        <img
          src="/images/connect-hero.jpg"
          alt="Makéda Hemans with a client during a herbal medicine consultation"
          className="w-full aspect-[4/3] object-cover object-top rounded-xl"
        />
      </section>

      {featuredProducts.length > 0 && (
        <>
          <div className="max-w-6xl mx-auto px-6"><RootDivider /></div>
          <section className="max-w-4xl mx-auto px-6 py-10">
            <h2 className="font-display text-xl text-moss text-center mb-6">Shop Our Products</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {featuredProducts.map((p) => (
                <div key={p.id} className="bg-cream border border-moss/10 rounded-xl overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
                  <div className="p-4">
                    <p className="font-display text-moss">{p.name}</p>
                    <p className="text-xs text-ink/60 mt-1 mb-3">{p.description}</p>
                    <Link to="/shop" className="inline-block text-xs font-mono text-ochre">
                      View in shop →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="max-w-6xl mx-auto px-6"><RootDivider /></div>

      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="font-display text-xl text-moss text-center mb-6">What Clients Say</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-cream border border-moss/10 rounded-xl p-5">
              <p className="text-sm text-ink/80 italic mb-3">"{t.quote}"</p>
              <p className="text-xs font-mono text-ochre">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {vlogPosts.length > 0 && (
        <>
          <div className="max-w-6xl mx-auto px-6"><RootDivider /></div>
          <section className="max-w-4xl mx-auto px-6 py-10">
            <h2 className="font-display text-xl text-moss text-center mb-6">From the Vlog</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {vlogPosts.map((post) => (
                <Link key={post.id} to="/vlog" className="bg-cream border border-moss/10 rounded-xl p-5 block hover:border-ochre/40 transition-colors">
                  <p className="font-display text-moss mb-1">{post.title}</p>
                  {post.excerpt && <p className="text-xs text-ink/60">{post.excerpt}</p>}
                  <span className="inline-block mt-3 text-xs font-mono text-ochre">Watch →</span>
                </Link>
              ))}
            </div>
            <p className="text-center mt-4">
              <Link to="/vlog" className="text-xs font-mono text-ochre">See all posts →</Link>
            </p>
          </section>
        </>
      )}

      <div className="max-w-6xl mx-auto px-6"><RootDivider /></div>

      <div className="max-w-2xl mx-auto px-6 pb-10">
        <MakedaMethodModule />
      </div>

      <section className="max-w-sm mx-auto px-6 py-10 text-center">
        <Link to="/client-intake" className="block bg-moss text-linen px-6 py-4 rounded-xl font-body text-sm mb-3 hover:bg-ink transition-colors">
          Start Your Health Journey →
        </Link>
        <Link to="/contact" className="block border border-moss text-moss px-6 py-4 rounded-xl font-body text-sm mb-3 hover:bg-moss/5 transition-colors">
          Book a Consultation
        </Link>
        <Link to="/shop" className="block border border-moss text-moss px-6 py-4 rounded-xl font-body text-sm mb-8 hover:bg-moss/5 transition-colors">
          Shop
        </Link>
        <div className="flex justify-center gap-4 text-moss">
          {socialLinks.map((s) => (
            <SocialIcon key={s.label} label={s.label} href={s.href} path={s.path} size="lg" />
          ))}
        </div>
      </section>
    </div>
  )
}
