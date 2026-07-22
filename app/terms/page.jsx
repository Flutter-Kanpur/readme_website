import StaticPage from "@/components/StaticPage/StaticPage";
import Link from "next/link";

const CONTACT_EMAIL = "readme.flutterkanpur@gmail.com";
const LAST_UPDATED = "July 19, 2026";

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service">
      <p>
        <strong>Last updated: {LAST_UPDATED}</strong>
      </p>

      <p className="mt-6">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of{" "}
        <strong>Readme</strong> (the &quot;Service&quot;), including our website and
        mobile application, operated by Flutter Kanpur (&quot;we&quot;, &quot;us&quot;,
        or &quot;our&quot;).
      </p>

      <p>
        By creating an account, accessing, or using Readme, you agree to these
        Terms and our{" "}
        <Link href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </Link>
        . If you do not agree, do not use the Service.
      </p>

      <section className="mt-10 space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">1. Acceptance of Terms</h2>
          <p>
            You must be at least 13 years old (or the minimum age required in your
            country) to use Readme. If you use Readme on behalf of an
            organization, you represent that you have authority to bind that
            organization to these Terms.
          </p>
          <p>
            We may update these Terms from time to time. When we do, we will
            revise the &quot;Last updated&quot; date above. Continued use of Readme
            after changes means you accept the updated Terms.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">2. The Service</h2>
          <p>Readme is a reader-first community platform that lets you:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Read and publish articles</li>
            <li>Create and save drafts</li>
            <li>Build a public profile</li>
            <li>Follow authors and support (like) articles</li>
            <li>Explore and join communities</li>
            <li>Subscribe to community newsletters (where available)</li>
            <li>Use related features we may add over time</li>
          </ul>
          <p>
            We may change, suspend, or discontinue parts of the Service at any
            time, including for maintenance, security, or legal reasons.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">3. Accounts and Security</h2>
          <p>
            You may create an account using email or Google Sign-In. You are
            responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Providing accurate account and profile information</li>
            <li>Keeping your login credentials secure</li>
            <li>All activity that occurs under your account</li>
          </ul>
          <p>
            Notify us promptly if you believe your account has been compromised.
            We may suspend or terminate accounts that violate these Terms or that
            we reasonably believe pose a security or abuse risk.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">4. Content Ownership and License</h2>
          <h3 className="text-lg font-semibold text-black">Your content</h3>
          <p>
            You retain ownership of the content you create and publish on Readme,
            including articles, drafts, images, profile information, community
            posts, and newsletter materials (&quot;Your Content&quot;).
          </p>
          <h3 className="text-lg font-semibold text-black">License you grant us</h3>
          <p>
            By submitting or publishing Your Content on Readme, you grant us a
            worldwide, non-exclusive, royalty-free license to host, store,
            reproduce, display, distribute, and otherwise use Your Content as
            needed to operate, promote, and improve the Service. This includes
            showing Your Content to other users and making published content
            available on the web and in the mobile app.
          </p>
          <p>
            You represent that you have all rights needed to grant this license
            and that Your Content does not infringe the rights of others.
          </p>
          <h3 className="text-lg font-semibold text-black">Our content</h3>
          <p>
            The Readme name, branding, software, design, and other materials we
            provide are owned by Flutter Kanpur or our licensors. You may not copy
            or use them except as allowed through normal use of the Service.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">5. Publishing and Visibility</h2>
          <p>
            When you publish an article, profile details, community information,
            or other public content, it may be visible to other users and, in
            some cases, to the public on the web. Aggregate engagement signals
            such as support (likes) and view counts may also be shown.
          </p>
          <p>
            Drafts remain private to you (and any coauthors you invite, if that
            feature is available) until you publish them. You are responsible for
            choosing what to publish.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">6. Communities and Newsletters</h2>
          <p>
            Communities on Readme may have their own membership rules, roles, and
            moderation practices. If you join or create a community, you agree to
            follow any additional guidelines set by that community, as long as
            they do not conflict with these Terms.
          </p>
          <p>
            Community organizers may send newsletter issues to subscribers.
            Subscribers can unsubscribe where that option is available. Do not
            use newsletters or community tools to spam users or send unlawful
            content.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">7. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Post illegal, harmful, fraudulent, hateful, harassing, or sexually
              exploitative content
            </li>
            <li>
              Impersonate others or misrepresent your identity or affiliation
            </li>
            <li>
              Infringe copyrights, trademarks, privacy, or other rights of any
              person
            </li>
            <li>
              Spam, scrape, or use automated means to access the Service in a way
              that harms performance or violates these Terms
            </li>
            <li>
              Attempt to gain unauthorized access to accounts, systems, or data
            </li>
            <li>
              Interfere with or disrupt the Service, including by introducing
              malware
            </li>
            <li>
              Abuse engagement features (for example, artificially inflating
              views or support counts)
            </li>
            <li>
              Use Readme for any purpose that violates applicable law
            </li>
          </ul>
          <p>
            We may remove content, restrict features, or suspend accounts that
            violate these rules.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">8. Feedback</h2>
          <p>
            If you send us ideas, suggestions, or feedback about Readme, you
            grant us permission to use that feedback without obligation or
            compensation to you.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">9. Third-Party Services</h2>
          <p>
            Readme relies on third-party services such as Supabase
            (authentication, database, and storage) and Google (Sign-In). Your
            use of those services may also be subject to their terms and privacy
            policies. We are not responsible for third-party services we do not
            control.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">10. Disclaimers</h2>
          <p>
            Readme is provided on an &quot;as is&quot; and &quot;as available&quot;
            basis. To the fullest extent permitted by law, we disclaim warranties
            of merchantability, fitness for a particular purpose, and
            non-infringement. We do not guarantee that the Service will be
            uninterrupted, secure, or error-free, or that content posted by users
            is accurate or reliable.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Flutter Kanpur and its
            contributors will not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits,
            data, or goodwill, arising from your use of Readme. Our total
            liability for any claim relating to the Service will not exceed the
            greater of (a) the amount you paid us (if any) to use Readme in the
            12 months before the claim, or (b) USD $50.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">12. Indemnity</h2>
          <p>
            You agree to defend and indemnify Flutter Kanpur against claims,
            damages, and expenses arising from Your Content or your use of
            Readme in violation of these Terms or applicable law.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">13. Termination</h2>
          <p>
            You may stop using Readme at any time. You may delete your account
            from the app via <strong>Profile → Edit Profile → Delete Account</strong>
            , where available.
          </p>
          <p>
            We may suspend or terminate your access if you violate these Terms,
            if required by law, or if we discontinue the Service. Provisions that
            by their nature should survive (including ownership, licenses granted
            to us for previously published content as needed to operate the
            Service, disclaimers, and limitations of liability) will survive
            termination.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">14. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India, without regard to
            conflict-of-law principles. Courts in India will have exclusive
            jurisdiction over disputes arising from these Terms, unless
            applicable law requires otherwise.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">15. Contact Us</h2>
          <p>
            If you have questions about these Terms, contact us at:
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
