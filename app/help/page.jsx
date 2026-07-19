import Link from "next/link";
import StaticPage from "@/components/StaticPage/StaticPage";

const CONTACT_EMAIL = "readme.flutterkanpur@gmail.com";

export default function HelpPage() {
  return (
    <StaticPage title="Help Center">
      <p className="text-xl text-gray-500">
        Welcome to the Readme Help Center. Find answers about accounts,
        writing, communities, and more.
      </p>

      <section className="mt-12 space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Getting started</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <Link href="/register" className="text-blue-600 hover:underline">
                Create an account
              </Link>{" "}
              with email or Google Sign-In
            </li>
            <li>
              Open your profile and add a name, headline, bio, and optional
              social links
            </li>
            <li>
              Browse{" "}
              <Link href="/articles" className="text-blue-600 hover:underline">
                articles
              </Link>{" "}
              or start writing from{" "}
              <Link href="/write" className="text-blue-600 hover:underline">
                Write
              </Link>
            </li>
          </ol>
          <p>
            New to publishing on Readme? See{" "}
            <Link href="/writers" className="text-blue-600 hover:underline">
              For Writers
            </Link>{" "}
            for a fuller overview.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Account and profile</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-black">Sign in</strong> — use email or
              Google from the{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                login
              </Link>{" "}
              page
            </li>
            <li>
              <strong className="text-black">Edit profile</strong> — update your
              avatar, name, headline, bio, and social links from your profile
            </li>
            <li>
              <strong className="text-black">Follow authors</strong> — follow
              writers you like to keep up with their work
            </li>
            <li>
              <strong className="text-black">Delete account</strong> — in the
              app, go to Profile → Edit Profile → Delete Account. This cannot be
              undone
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Writing articles</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Open{" "}
              <Link href="/write" className="text-blue-600 hover:underline">
                Write
              </Link>{" "}
              to start a new article
            </li>
            <li>
              Use the editor for rich text, headings, images, and formatting
            </li>
            <li>Add a title, category, and optional cover image before publishing</li>
            <li>
              Save drafts anytime — find them later on your{" "}
              <Link href="/drafts" className="text-blue-600 hover:underline">
                drafts
              </Link>{" "}
              page
            </li>
            <li>Invite coauthors when you want to collaborate on a piece</li>
            <li>
              Publish when ready; you can edit a published article later from
              your profile or the edit flow
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Reading and engagement</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Browse the home feed or filter by topic and communities
            </li>
            <li>
              <strong className="text-black">Support</strong> an article with
              the heart button (sign in required). Support syncs across web and
              the Android app
            </li>
            <li>
              <strong className="text-black">Views</strong> count when someone
              opens an article (with device-level limits so refreshes do not
              inflate numbers unfairly)
            </li>
            <li>
              Use{" "}
              <Link href="/search" className="text-blue-600 hover:underline">
                search
              </Link>{" "}
              to find articles by title, content, or category
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Communities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Explore{" "}
              <Link
                href="/communities"
                className="text-blue-600 hover:underline"
              >
                communities
              </Link>{" "}
              built around shared interests
            </li>
            <li>Follow a community or join as a member where available</li>
            <li>
              Publish articles into a community so members can find them in one
              place
            </li>
            <li>
              Subscribe to community newsletters when organizers offer them;
              unsubscribe anytime from the options provided
            </li>
            <li>
              Community organizers may manage members, roles, and newsletter
              issues from the community dashboard
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Mobile app</h2>
          <p>
            Prefer reading and writing on your phone? Install the Readme Android
            app from{" "}
            <a
              href="https://play.google.com/store/apps/details?id=com.drishtant.readme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Play
            </a>
            . Your account, articles, support, and communities stay in sync with
            the website.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Community guidelines</h2>
          <p>Help keep Readme useful and respectful:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be kind — disagree with ideas, not people</li>
            <li>Publish original work or content you have rights to share</li>
            <li>No spam, scams, harassment, or illegal content</li>
            <li>Do not artificially inflate views or support counts</li>
            <li>
              Respect community rules set by organizers, as long as they align
              with our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Privacy and data</h2>
          <p>
            Learn what we collect and how we use it in our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            . For legal terms of using Readme, see the{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Still need help?</h2>
          <p>
            Email us and we will do our best to help:
          </p>
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-blue-600 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </StaticPage>
  );
}
