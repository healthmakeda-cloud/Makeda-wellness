p = 'src/pages/Members.jsx'
s = open(p).read()
changed = []

old = """      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-linen border border-moss/10 rounded-lg p-5 text-center">
          <p className="font-display text-moss mb-1">Chat with Makéda's AI</p>
          <p className="text-xs text-ink/50">Coming soon</p>
        </div>
        <div className="bg-linen border border-moss/10 rounded-lg p-5 text-center">
          <p className="font-display text-moss mb-1">Updates</p>
          <p className="text-xs text-ink/50">Coming soon</p>
        </div>
      </div>"""

new = """      <div className="bg-linen border border-moss/10 rounded-lg p-5 text-center max-w-xs">
        <p className="font-display text-moss mb-1">Updates</p>
        <p className="text-xs text-ink/50">Coming soon</p>
      </div>"""

if old in s:
    s = s.replace(old, new, 1)
    changed.append("removed 'Chat with Makéda's AI' placeholder, kept Updates")
    open(p, 'w').write(s)
    print("Members.jsx:", changed)
else:
    print("NO MATCH — paste me the section of Members.jsx containing 'Chat with' and I'll adjust")
