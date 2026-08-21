import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import RootDivider from '../components/RootDivider.jsx'

// Turns a YouTube or Vimeo link into an embeddable URL
export function embedUrl(url) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

export default function Vlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [openPost, setOpenPost] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // RLS decides what comes back: public posts for everyone, plus
    // members-only posts if they're signed in.
    supabase
      .from('vlog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false, nullsFirst: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-24 text-center text-ink/50 text-sm">Loading…</div>
  }

  if (openPost) {
    const embed = embedUrl(openPost.video_url)
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <button onClick={() => setOpenPost(null)} className="font-mono text-xs tracking-widest text-ochre mb-6">
          ← BACK TO ALL POSTS
        </button>

        {openPost.visibility === 'members' && (
          <p className="font-mono text-xs text-ochre mb-3">MEMBERS ONLY</p>
        )}
        <h1 className="font-display text-3xl md:text-4xl text-moss mb-2">{openPost.title}</h1>
        {openPost.published_date && (
          <p className="font-mono text-xs text-ink/50 mb-8">{openPost.published_date}</p>
        )}

        {embed && (
          <div className="aspect-video mb-8 rounded-xl overflow-hidden bg-cream">
            <iframe
              src={embed}
              title={openPost.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {openPost.body && (
          <div className="space-y-4 text-ink/80 leading-relaxed whitespace-pre-wrap">{openPost.body}</div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">VLOG</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">Notes &amp; conversations</h1>
      <p className="text-ink/70 max-w-xl mb-12">
        Thoughts on gut health, herbal medicine and living well — in Makéda's own words.
      </p>

      {posts.length === 0 && (
        <p className="text-sm text-ink/60">No posts yet. Check back soon.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setOpenPost(post)}
            className="bg-cream border border-moss/10 rounded-xl overflow-hidden text-left hover:border-ochre/40 transition-colors flex flex-col"
          >
            {post.thumbnail_url ? (
              <img src={post.thumbnail_url} alt={post.title} className="w-full aspect-video object-cover" />
            ) : (
              <ImagePlaceholder className="aspect-video" label="" tone="linen" variant="herb" />
            )}
            <div className="p-5 flex flex-col flex-1">
              {post.visibility === 'members' && (
                <p className="font-mono text-[10px] text-ochre mb-1">MEMBERS ONLY</p>
              )}
              <h2 className="font-display text-lg text-moss mb-2">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-ink/70 flex-1">{post.excerpt}</p>}
              <span className="inline-block mt-4 text-xs font-mono text-ochre">Read more →</span>
            </div>
          </button>
        ))}
      </div>

      {!session && (
        <>
          <RootDivider />
          <p className="text-sm text-ink/60 text-center">
            Some posts are for members only. <a href="/members" className="text-ochre">Sign in</a> to see everything.
          </p>
        </>
      )}
    </div>
  )
}
