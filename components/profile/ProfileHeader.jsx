import Image from 'next/image'

export default function ProfileHeader({ profile }) {
  return (
    <div style={styles.wrapper}>
      <Image
          src={profile.avatar_url}
          alt="avatar"
          width={96}
          height={96}
          style={styles.avatar}
        />

      <div>
        <h1 style={styles.name}>{profile.name}</h1>
        <p style={styles.bio}>{profile.bio}</p>

        <div style={styles.stats}>
          <span><b><span style={styles.statsdata}>{profile.followers_count || 0}</span></b> Followers</span>
          <span><b><span style={styles.statsdata}>{profile.following_count || 0}</span></b> Following</span>
          <span><b><span style={styles.statsdata}>{profile.reads_count || 0}</span></b> Reads</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#000'
  },
  bio: {
    marginTop: '6px',
    maxWidth: '500px',
    color: '#1f2937'
  },
  stats: {
    marginTop: '12px',
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#1f2937'
  },
  statsdata: {
    color: '#000'
  }
}



// export default function ProfileHeader() {
//   return (
//     <div style={styles.wrapper}>
//       <div style={styles.avatar}>👤</div>

//       <div>
//         <h1 style={styles.name}>Arjun Sharma</h1>
//         <p style={styles.bio}>
//           Product Designer & Flutter Enthusiast. I write about bridging design
//           systems and high-performance code.
//         </p>

//         <div style={styles.stats}>
//           <span><b>12.4k</b> Followers</span>
//           <span><b>842</b> Following</span>
//           <span><b>45k</b> Reads</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// const styles = {
//   wrapper: {
//     display: 'flex',
//     gap: '20px',
//     alignItems: 'center'
//   },
//   avatar: {
//     width: '96px',
//     height: '96px',
//     borderRadius: '50%',
//     background: '#eee',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '40px'
//   },
//   name: {
//     fontSize: '28px',
//     margin: 0
//   },
//   bio: {
//     color: '#666',
//     maxWidth: '500px'
//   },
//   stats: {
//     display: 'flex',
//     gap: '20px',
//     marginTop: '10px',
//     fontSize: '14px'
//   }
// }

