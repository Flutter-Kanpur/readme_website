import Navbar from '@/components/Navbar/Navbar'
import ProfileHeader from '@/components/ProfileHeader/ProfileHeader'
import UserStats from '@/components/UserStats/UserStats'
import ArticleCard from '@/components/ArticleCard/ArticleCard'

import {
  getProfileById,
  getPublishedBlogsByAuthor,
  getAuthorByBlogId
} from '@/lib/queries'
import Footer from '../../../components/Footer.jsx/Footer'
import './styles.css'

export default async function ProfilePage({ params }) {
  const { userId } = await params


  if (!userId) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Invalid profile URL</h2>
      <p>No user ID provided.</p>
    </div>
  )
}


  // Fetch profile by ID
  const profile = await getProfileById(userId)

  if (!profile) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>User not found</h2>
      </div>
    )
  }

  // Fetch user's published blogs
  const blogs = await getPublishedBlogsByAuthor(profile.id)
  const blogsWithAuthors = await Promise.all(
    blogs.map(async (blog) => {
      const author = await getAuthorByBlogId(blog.blog_id)
      return {
        ...blog,
        author
      }
    })
  )

  return (
    <div className="page">
      <Navbar />

      <div className="container">
        <ProfileHeader profile={profile} />

        <div className="blogsarea">
          {/* Articles */}
          <div>
            <h2 className="sectionTitle">Published</h2>

            <div className="articles">
              {blogs.length === 0 && (
                <p className="empty">No published articles yet.</p>
              )}

              {blogsWithAuthors.map(blog => (
                <ArticleCard key={blog.blog_id} blog={blog} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <UserStats profile={profile} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}








// import Navbar from '@/components/layout/Navbar'
// import ProfileHeader from '@/components/profile/ProfileHeader'
// import UserStats from '@/components/profile/UserStats'
// import ArticleCard from '@/components/blog/ArticleCard'

// export default function ProfilePage({ params }) {
//   return (
//     <div style={styles.page}>
//       <Navbar />

//       <div style={styles.container}>
//         <ProfileHeader />

//         <div style={styles.grid}>
//           <div>
//             <h2 style={styles.sectionTitle}>
//               Articles by {params.username}
//             </h2>

//             <div style={styles.articles}>
//               <ArticleCard />
//               <ArticleCard />
//               <ArticleCard />
//             </div>
//           </div>

//           <div>
//             <UserStats />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// const styles = {
//   page: {
//     minHeight: '100vh',
//     background: '#f5f7fb'
//   },
//   container: {
//     maxWidth: '1100px',
//     margin: '0 auto',
//     padding: '40px 20px'
//   },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: '3fr 1fr',
//     gap: '40px',
//     marginTop: '40px'
//   },
//   articles: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '20px'
//   },
//   sectionTitle: {
//     fontSize: '22px',
//     marginBottom: '20px'
//   }
// }
