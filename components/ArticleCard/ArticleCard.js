// import Link from 'next/link'
// import Image from 'next/image'
// import ArticleCardAuthorInfo from '@/components/profile/ArticleCardAuthorInfo';

// export default function ArticleCard({ blog }) {

//     return (
//         <div style={styles.card}>
//             <div style={styles.content}>
//                 <div style={styles.meta}>
//                     <ArticleCardAuthorInfo author={blog.author} />
//                     <span>{new Date(blog.created_at).toDateString()}</span>
//                 </div>

//                 <h1 style={styles.title}>{blog.title}</h1>
//                 <p style={styles.desc}>
//                     {blog.excerpt || blog.content.slice(0, 120)}...
//                 </p>

//                 <div style={styles.meta}>
//                     <span style={styles.link}>#{blog.category}</span>
//                     <Link href={`/articles/${blog.blog_id}`} style={styles.link}>
//                         Read More →
//                     </Link>
//                 </div>
//             </div>

//             {blog.cover_image && (
//                 <Image
//                     src={blog.cover_image}
//                     alt="cover"
//                     width={160}
//                     height={160}
//                     style={styles.image}
//                 />

//             )}
//         </div>
//     )
// }

// const styles = {
//     card: {
//         background: '#fff',
//         padding: '20px',
//         borderRadius: '12px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: '20px',
//         boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
//     },
//     title: {
//         margin: 0,
//         fontSize: '30px',
//         color: '#000',
//         fontWeight: '600'
//     },
//     desc: {
//         marginTop: '8px',
//         color: '#666',
//         maxWidth: '500px'
//     },
//     meta: {
//         marginTop: '12px',
//         display: 'flex',
//         gap: '20px',
//         fontSize: '13px',
//         color: '#000'
//     },
//     link: {
//         color: '#2563eb',
//         textDecoration: 'none'
//     },
//     image: {
//         width: '160px',
//         height: '200px',
//         objectFit: 'cover',
//         borderRadius: '8px'
//     },
//     content: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '10px'
//     }
// }

import Link from "next/link";
import Image from "next/image";
import ArticleCardAuthorInfo from "@/components/ArticleCardAuthorInfo/ArticleCardAuthorInfo";
import "./styles.css";

export default function ArticleCard({ blog }) {
  return (
    <div className='card'>
      <div className='content'>
        <div className='meta'>
          <ArticleCardAuthorInfo author={blog.author} />
          <span>{new Date(blog.created_at).toDateString()}</span>
        </div>

        <h1 className='title'>{blog.title}</h1>

        <p className='desc'>
          {blog.excerpt || blog.content.slice(0, 120)}...
        </p>

        <div className='meta'>
          <span className='link'>#{blog.category}</span>
          <Link
            href={`/articles/${blog.blog_id}`}
            className='link'
          >
            Read More →
          </Link>
        </div>
      </div>

      {blog.cover_image && (
        <Image
          src={blog.cover_image}
          alt="cover"
          width={160}
          height={200}
          className='image'
        />
      )}
    </div>
  );
}




// export default function ArticleCard() {
//   return (
//     <div style={styles.card}>
//       <div>
//         <h2 style={styles.title}>
//           From Figma to Flutter: Practical Workflow Steps
//         </h2>

//         <p style={styles.desc}>
//           Learn how to bridge the gap between design systems and real Flutter
//           implementation with practical examples and workflows.
//         </p>

//         <span style={styles.link}>Read More →</span>
//       </div>

//       <div style={styles.image}>📰</div>
//     </div>
//   )
// }

// const styles = {
//   card: {
//     background: '#fff',
//     padding: '20px',
//     borderRadius: '12px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
//   },
//   title: {
//     margin: 0,
//     fontSize: '20px'
//   },
//   desc: {
//     marginTop: '8px',
//     maxWidth: '450px',
//     color: '#666'
//   },
//   link: {
//     display: 'inline-block',
//     marginTop: '10px',
//     color: '#2563eb',
//     fontSize: '14px'
//   },
//   image: {
//     width: '140px',
//     height: '90px',
//     background: '#eee',
//     borderRadius: '8px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '30px'
//   }
// }
