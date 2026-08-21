import { useState } from 'react'
import { embedUrl } from '../pages/Vlog.jsx'

const inputClass = 'w-full rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre'

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="font-mono text-xs tracking-wide text-moss/70">{label}</span>
      {hint && <span className="block text-xs text-ink/50 italic mt-0.5">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  )
}

const emptyPost = {
  title: '',
  excerpt: '',
  body: '',
  video_url: '',
  thumbnail_url: '',
  category: '',
  visibility: 'public',
  status: 'draft',
  published_date: new Date().toISOString().slice(0, 10)
}

function PostForm({ existing, onSave, onCancel, saving }) {
  const [form, setForm] = useState(existing ? { ...emptyPost, ...existing } : emptyPost)
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const preview = embedUrl(form.video_url)

  return (
    <div className="bg-linen border border-moss/20 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-moss">{existing ? 'Edit post' : 'New post'}</p>
        <button onClick={onCancel} className="h-8 w-8 rounded-full border border-moss/20 text-moss hover:border-ochre hover:text-ochre text-lg leading-none">×</button>
      </div>

      <Field label="TITLE">
        <input className={inputClass} value={form.title} onChange={(e) => update('title', e.target.value)} />
      </Field>

      <Field label="VIDEO LINK" hint="Paste a YouTube or Vimeo link — it'll embed automatically.">
        <input className={inputClass} value={form.video_url || ''} onChange={(e) => update('video_url', e.target.value)} />
      </Field>

      {form.video_url && !preview && (
        <p className="text-xs text-ochre">That doesn't look like a YouTube or Vimeo link — the video won't embed.</p>
      )}
      {preview && (
        <div className="aspect-video rounded-md overflow-hidden bg-cream">
          <iframe src={preview} title="Preview" className="w-full h-full" allowFullScreen />
        </div>
      )}

      <Field label="SHORT SUMMARY" hint="Shown on the card in the list.">
        <textarea rows={2} className={inputClass} value={form.excerpt || ''} onChange={(e) => update('excerpt', e.target.value)} />
      </Field>

      <Field label="POST TEXT" hint="Optional — anything you want to write alongside the video.">
        <textarea rows={6} className={inputClass} value={form.body || ''} onChange={(e) => update('body', e.target.value)} />
      </Field>

      <Field label="THUMBNAIL IMAGE URL" hint="Optional. Leave blank to use a placeholder.">
        <input className={inputClass} value={form.thumbnail_url || ''} onChange={(e) => update('thumbnail_url', e.target.value)} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="WHO CAN SEE IT">
          <select className={inputClass} value={form.visibility} onChange={(e) => update('visibility', e.target.value)}>
            <option value="public">Everyone</option>
            <option value="members">Members only</option>
          </select>
        </Field>
        <Field label="STATUS">
          <select className={inputClass} value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="draft">Draft — not visible</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="DATE">
          <input type="date" className={inputClass} value={form.published_date || ''} onChange={(e) => update('published_date', e.target.value)} />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          disabled={saving || !form.title.trim()}
          onClick={() => onSave({ ...form, published_date: form.published_date || null })}
          className="bg-ochre text-linen px-6 py-2.5 rounded text-sm disabled:opacity-50"
        >
          {saving ? 'Saving…' : existing ? 'Save changes' : 'Create post'}
        </button>
      </div>
    </div>
  )
}

export default function VlogPanel({ posts, onSave, onUpdate, onDelete, saving }) {
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink/60">{posts.length} post{posts.length === 1 ? '' : 's'}</p>
        {!creating && !editing && (
          <button
            onClick={() => setCreating(true)}
            className="text-xs bg-moss text-linen px-3 py-1.5 rounded hover:bg-ink transition-colors"
          >
            + New post
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-4">
          <PostForm
            saving={saving}
            onCancel={() => setCreating(false)}
            onSave={async (p) => { await onSave(p); setCreating(false) }}
          />
        </div>
      )}

      {editing && (
        <div className="mb-4">
          <PostForm
            existing={editing}
            saving={saving}
            onCancel={() => setEditing(null)}
            onSave={async (p) => { await onUpdate({ ...p, id: editing.id }); setEditing(null) }}
          />
        </div>
      )}

      {posts.length === 0 && !creating && (
        <p className="text-sm text-ink/60">No posts yet. Create one to get started.</p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-cream border border-moss/10 rounded-lg px-5 py-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-ink">{post.title}</p>
              <p className="font-mono text-xs text-ink/50">
                {post.published_date || 'no date'}
                {post.category ? ` · ${post.category}` : ''}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="flex gap-1.5">
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                  post.status === 'published' ? 'bg-sage/20 text-sage' : 'bg-ochre/10 text-ochre'
                }`}>
                  {post.status}
                </span>
                {post.visibility === 'members' && (
                  <span className="font-mono text-[10px] bg-amber/25 text-bronze px-2 py-0.5 rounded">members</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(post); setCreating(false) }} className="text-xs text-moss hover:text-ochre">Edit</button>
                <button onClick={() => onDelete(post.id)} className="text-xs text-ochre/70 hover:text-ochre">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
