import StaticPage from "@/components/StaticPage/StaticPage";

const CONTACT_EMAIL = "hello@flutterkanpur.in";
const LAST_UPDATED = "July 18, 2026";

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>
        <strong>Last updated: {LAST_UPDATED}</strong>
      </p>

      <p className="mt-6">
        This Privacy Policy explains how <strong>Readme</strong> (&quot;we&quot;,
        &quot;us&quot;, or &quot;our&quot;), operated by Flutter Kanpur, collects,
        uses, and shares information when you use our mobile app and website.
      </p>

      <p>By using Readme, you agree to this Privacy Policy.</p>

      <section className="mt-10 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">1. Information We Collect</h2>

          <h3 className="text-lg font-semibold text-black">
            Account and profile information
          </h3>
          <p>When you create or update an account, we may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name and username</li>
            <li>Email address</li>
            <li>Profile photo / avatar</li>
            <li>Headline, bio, and optional social links</li>
            <li>
              Authentication data from Google Sign-In (such as your Google
              account ID, name, email, and profile photo)
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-black">Content you create</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Articles, drafts, images, and other media you publish or upload</li>
            <li>
              Community content, membership details, and newsletter issues you
              create
            </li>
            <li>Likes / support actions and related engagement</li>
          </ul>

          <h3 className="text-lg font-semibold text-black">
            Newsletter and communication
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email address when you subscribe to a community newsletter</li>
            <li>Messages you send us for support</li>
          </ul>

          <h3 className="text-lg font-semibold text-black">Usage information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Article view counts (we store an aggregated view counter; we do not
              sell personal browsing profiles)
            </li>
            <li>
              Basic technical information needed to operate the service (for
              example, device/app version when diagnosing issues)
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-black">
            Permissions and device access
          </h3>
          <p>Depending on features you use, the app may access:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Photos / files you choose to upload (profile photo, article images,
              newsletter attachments)
            </li>
            <li>Network access to sync your content with our servers</li>
          </ul>

          <p>
            We do <strong>not</strong> sell your personal information.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">2. How We Use Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve Readme</li>
            <li>Create and manage your account</li>
            <li>Publish and display your content and profile</li>
            <li>Enable likes, views, follows, communities, and newsletters</li>
            <li>Authenticate you (including via Google Sign-In)</li>
            <li>Communicate with you about the service</li>
            <li>
              Protect security, prevent abuse, and comply with legal obligations
            </li>
            <li>Delete your account and associated data when you request it</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">3. Sharing of Information</h2>
          <p>We do not sell your private personal information.</p>
          <p>We may share information only:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>With service providers</strong> that help us run Readme (for
              example, <strong>Supabase</strong> for authentication, database, and
              file storage; <strong>Google</strong> for Sign-In)
            </li>
            <li>
              <strong>Publicly</strong>, when you choose to publish content,
              profile details, or community information that is meant to be
              visible to other users
            </li>
            <li>
              <strong>When required by law</strong>, or to protect rights, safety,
              and security
            </li>
            <li>
              <strong>With your direction</strong>, such as when you share content
              yourself
            </li>
          </ul>
          <p>
            Published articles, public profile fields, community pages, and
            aggregate like/view counts may be visible to other users.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">4. Third-Party Services</h2>
          <p>Readme relies on third-party services, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Supabase</strong> — authentication, database, and storage
            </li>
            <li>
              <strong>Google</strong> — Google Sign-In
            </li>
          </ul>
          <p>
            Their use of information is governed by their own privacy policies, in
            addition to this one.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">5. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as
            needed to provide the service. If you delete your account, we delete
            or anonymize personal account data associated with you, subject to
            limited retention required for security, backup, or legal reasons.
          </p>
          <p>
            Content you published may be removed when your account is deleted,
            according to our deletion process.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">6. Account Deletion</h2>
          <p>You can delete your account from the app:</p>
          <p>
            <strong>Profile → Edit Profile → Delete Account</strong>
          </p>
          <p>
            Account deletion permanently removes your authentication account and
            associated personal profile data. This action cannot be undone.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">7. Children&apos;s Privacy</h2>
          <p>
            Readme is not directed to children under 13 (or the minimum age
            required in your country). We do not knowingly collect personal
            information from children. If you believe a child has provided us
            personal information, contact us and we will take appropriate steps to
            remove it.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">8. Your Choices</h2>
          <p>You may:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Update your profile information in the app</li>
            <li>Choose what content to publish</li>
            <li>
              Unsubscribe from community newsletters where that option is
              available
            </li>
            <li>Delete your account as described above</li>
            <li>Contact us to ask questions about your data</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">9. Data Security</h2>
          <p>
            We use reasonable administrative, technical, and organizational
            measures to protect your information. No method of transmission or
            storage is 100% secure, so we cannot guarantee absolute security.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">
            10. International Processing
          </h2>
          <p>
            Your information may be processed and stored on servers operated by
            our service providers, which may be located in different countries.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will revise
            the &quot;Last updated&quot; date above when we do. Continued use of
            Readme after changes means you accept the updated policy.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or your data, contact
            us at:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-blue-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p>
            <strong>App:</strong> Readme by Flutter Kanpur
          </p>
        </div>
      </section>
    </StaticPage>
  );
}
