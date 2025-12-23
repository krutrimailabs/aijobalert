export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Disclaimer</h1>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
            <p className="text-lg font-semibold text-slate-900">
              Please read this disclaimer carefully before using AI Job Alert website.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                1. No Official Affiliation
              </h2>
              <p>
                AI Job Alert is an <strong>independent job information portal</strong> and is{' '}
                <strong>NOT associated, affiliated, or endorsed</strong> by any government
                organization, private institution, or recruiting body. We are not the official
                source of any job notifications, admit cards, results, or answer keys published on
                this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                2. Information Accuracy
              </h2>
              <p>
                All information published on AI Job Alert is collected from various official
                government websites, employment newspapers, and public sources. While we strive to
                provide accurate and up-to-date information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We cannot guarantee 100% accuracy of all information</li>
                <li>Information may contain inadvertent errors or omissions</li>
                <li>Dates, eligibility criteria, and other details may change</li>
                <li>
                  Users must verify all information from official sources before taking any action
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. No Liability</h2>
              <p>
                AI Job Alert and its team members shall <strong>NOT be held liable</strong> for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any loss or damage arising from the use of information on this website</li>
                <li>Any decision made based on the information provided</li>
                <li>Technical errors, website downtime, or data loss</li>
                <li>Third-party website content linked from our platform</li>
                <li>Any consequences of missed deadlines or incorrect applications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. No Fee Policy</h2>
              <p className="font-semibold text-red-600">
                ⚠️ AI Job Alert DOES NOT charge any fee for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Viewing job notifications</li>
                <li>Downloading admit cards or results</li>
                <li>Accessing study materials</li>
                <li>Registration on our website</li>
                <li>Email or Telegram job alerts</li>
              </ul>
              <p className="font-semibold">
                If anyone asks for payment claiming to be from AI Job Alert, please report it
                immediately. We DO NOT have any agents or representatives.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                5. User Responsibility
              </h2>
              <p>Users of AI Job Alert are solely responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verifying all information from official government websites</li>
                <li>Reading complete official notifications before applying</li>
                <li>Checking eligibility criteria thoroughly</li>
                <li>Meeting application deadlines</li>
                <li>Following official application procedures</li>
                <li>Maintaining confidentiality of their login credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                6. Copyright & Trademarks
              </h2>
              <p>
                All logos, trademarks, and brand names displayed on AI Job Alert belong to their
                respective owners. Use of these names, logos, and brands does not imply endorsement.
                We use them solely for informational and reference purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Third-Party Links</h2>
              <p>
                AI Job Alert contains links to external websites for users&apos; convenience. We
                have no control over the content, privacy policies, or practices of these
                third-party sites. Visiting these links is at the user&apos;s own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Content Updates</h2>
              <p>
                We reserve the right to modify, update, or remove any content on AI Job Alert
                without prior notice. Information published on our website may become outdated, and
                we are not obligated to update historical content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                9. AI-Generated Content
              </h2>
              <p>
                Some content on AI Job Alert may be generated or assisted by artificial
                intelligence. While we review all AI-generated content, users should independently
                verify important information, especially regarding job applications and eligibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                10. Acceptance of Terms
              </h2>
              <p>
                By using AI Job Alert, you acknowledge that you have read, understood, and agree to
                this disclaimer. If you do not agree with any part of this disclaimer, please
                discontinue use of our website immediately.
              </p>
            </section>

            <section className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-900 mb-3">📧 Contact Us</h3>
              <p className="text-blue-800">
                For any queries, corrections, or feedback regarding the content on AI Job Alert,
                please contact us at:{' '}
                <a href="mailto:contact@aijobalert.com" className="font-semibold underline">
                  contact@aijobalert.com
                </a>
              </p>
            </section>

            <p className="text-sm text-slate-500 mt-8 pt-6 border-t">
              <strong>Last Updated:</strong> December 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
