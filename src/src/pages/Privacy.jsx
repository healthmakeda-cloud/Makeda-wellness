export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">PRIVACY & DATA PROTECTION</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">Privacy & GDPR Policy</h1>
      <p className="text-sm text-ink/50 mb-10">Last updated: [insert date before publishing]</p>

      <div className="space-y-8 text-sm text-ink/80 leading-relaxed">
        <p className="bg-cream border border-moss/10 rounded-lg p-4 text-ink/70 italic">
          This policy explains what information Makéda Health collects, why, and what rights you
          have over it, in line with UK GDPR and the Data Protection Act 2018.
        </p>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Who we are</h2>
          <p>
            Makéda Health, operated by Makéda Hemans, a medical herbalist and colon hydrotherapist
            practising across three South London clinic locations. For any question about this
            policy or your data, contact: <strong>[insert contact email]</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contact details</strong> — name, date of birth, address, email, phone number</li>
            <li><strong>Health information</strong> — your medical history, current medications, symptoms,
              and answers given on the health journey (intake) form. This is "special category data"
              under UK GDPR, given extra protection because of its sensitivity</li>
            <li><strong>GP details</strong> — only if you choose to provide them</li>
            <li><strong>Payment information</strong> — if you purchase a test kit through the shop, payment
              is handled entirely by Stripe. We never see or store your card details ourselves</li>
            <li><strong>Account access</strong> — if you sign in to the Members area, we use your email
              to send a one-time sign-in link. We don't use passwords</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Why we collect it, and our legal basis</h2>
          <p className="mb-2">
            We collect health information with your <strong>explicit consent</strong>, given when you
            tick the consent box on the health journey form — this is required under UK GDPR for
            processing special category (health) data. We use this information to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Prepare for and provide your consultation and treatment</li>
            <li>Identify anything that may affect the safety of a treatment (contraindications)</li>
            <li>Keep clinical records, as required for safe practice</li>
            <li>Contact you about your appointment or order</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Where your data is stored</h2>
          <p>
            Your data is stored using Supabase (a database provider), hosted in a UK/EU region, and
            the website itself runs on Vercel. Payments are processed by Stripe. These providers act
            as data processors on our behalf, each under their own security and data protection
            obligations. None of these providers use your data for their own purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Who can see your information</h2>
          <p>
            Only Makéda and authorised clinic staff can access your health journey submissions, through
            a password-protected back office. Your information is never sold, and is never shared with
            third parties for marketing. Your GP is only contacted if you've given specific permission
            to do so on the intake form.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Cookies & local storage</h2>
          <p>
            This site uses limited, functional-only browser storage: to save your progress while
            filling in a multi-step form (so you don't lose your answers), and to keep you signed in
            to the Members area. We do not use advertising or analytics trackers at this time. If
            that changes, this policy will be updated.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">How long we keep your data</h2>
          <p>
            Clinical records are generally kept for a period appropriate to safe, responsible practice
            and any requirements set by Makéda's professional bodies. <em>[This section needs a specific,
            confirmed retention period — please check current guidance from your professional
            association(s) and insert it here before publishing.]</em>
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Your rights</h2>
          <p className="mb-2">Under UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ask what personal data we hold about you, and get a copy of it</li>
            <li>Ask us to correct inaccurate information</li>
            <li>Ask us to delete your data, where we're not required to keep it for clinical or legal reasons</li>
            <li>Object to or restrict certain processing</li>
            <li>Withdraw consent at any time — this won't affect any treatment already provided</li>
            <li>Complain to the Information Commissioner's Office (ICO) at ico.org.uk if you're unhappy
              with how your data has been handled</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact <strong>[insert contact email]</strong>.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Children</h2>
          <p>
            This site is not intended for use by anyone under 16 without the involvement of a parent
            or guardian.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-moss mb-3">Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The "last updated" date at the top will
            always reflect the latest version.
          </p>
        </section>
      </div>
    </div>
  )
}
