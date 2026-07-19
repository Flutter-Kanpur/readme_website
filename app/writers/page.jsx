import Link from "next/link";
import StaticPage from "@/components/StaticPage/StaticPage";

export default function WritersPage() {
  return (
    <StaticPage title="For Writers">
      <p className="text-xl text-gray-500">
        Readme is a reader-first community focused on learning, building, and
        growing together through articles.
      </p>

      <p className="mt-6">
        Whether you write about design, technology, Flutter, React, UI,
        backend, DSA, or your creative process, Readme gives you a clean place
        to publish and an audience that actually reads.
      </p>

      <section className="mt-12 space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Why write on Readme</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-black">Reach your audience</strong> —
              share with developers, designers, and creators looking for quality
              writing
            </li>
            <li>
              <strong className="text-black">Stay focused</strong> — a
              minimalist editor keeps attention on your ideas, not the chrome
            </li>
            <li>
              <strong className="text-black">Build in public</strong> — grow a
              profile, earn support on your work, and see how articles perform
            </li>
            <li>
              <strong className="text-black">Join communities</strong> — publish
              into topic communities and connect with people who care about the
              same craft
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">What you can do</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Write and publish rich articles with formatting and images</li>
            <li>Save drafts and continue writing when inspiration returns</li>
            <li>
              Add a cover image, category, and title that help readers find you
            </li>
            <li>Invite coauthors when you want to collaborate on a piece</li>
            <li>
              Follow other writers and support (like) work you appreciate
            </li>
            <li>
              Create or join communities and share newsletter issues with
              subscribers
            </li>
            <li>
              Build a public profile with bio, headline, and social links
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Getting started</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <Link href="/register" className="text-blue-600 hover:underline">
                Create an account
              </Link>{" "}
              or sign in with Google
            </li>
            <li>Complete your profile so readers know who you are</li>
            <li>
              Open{" "}
              <Link href="/write" className="text-blue-600 hover:underline">
                Write
              </Link>{" "}
              and start a draft
            </li>
            <li>Add a title, content, and optional cover image</li>
            <li>Publish when you are ready — or save and come back later</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Writing tips</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Lead with a clear title and a strong opening — readers decide
              quickly
            </li>
            <li>
              Prefer one idea per article; depth beats covering everything
            </li>
            <li>
              Use images where they clarify, not as decoration
            </li>
            <li>
              Pick a category that matches your topic so the right readers find
              you
            </li>
            <li>
              Share finished pieces with your community or network — discovery
              grows with conversation
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Ownership</h2>
          <p>
            You keep ownership of what you publish. By posting on Readme, you
            give us permission to host and display your work so others can read
            it. Details are in our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Ready to write?</h2>
          <p>
            Start a draft now, or explore what others are publishing first.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 not-prose">
            <Link
              href="/write"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Start writing
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center justify-center bg-white border border-gray-200 text-black px-8 py-3.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              Explore articles
            </Link>
          </div>
        </div>
      </section>
    </StaticPage>
  );
}
