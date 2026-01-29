import "./styles.css"
export default function UserStats({ profile }) {
  return (
    <div className = "box">
      <h5 className = "title">User Statistics</h5>

      <div className = "row">
        <span>Member Since </span>
        <span>
           {new Date(profile.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className = "row">
        <span>Total Articles</span>
        <span>{profile.articles_count || 0}</span>
      </div>

      <div className = "row">
        <span>Article Saves</span>
        <span>{profile.saves_count || 0}</span>
      </div>

      <div className = "row">
        <span>Profile Views</span>
        <span>{profile.views_count || 0}</span>
      </div>
    </div>
  )
}

// const styles = {
//   box: {
//     background: '#fff',
//     padding: '20px',
//     borderRadius: '12px',
//     boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
//   },
//   title: {
//     marginBottom: '16px',
//     color: '#000',
//   },
//   row: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     gap: '8px',
//     fontSize: '14px',
//     color: '#666',
//     marginBottom: '8px'
//   }
// }



// export default function UserStats() {
//   return (
//     <div style={styles.box}>
//       <h3>User Statistics</h3>

//       <div style={styles.row}>
//         <span>Member Since</span>
//         <span>Aug 2023</span>
//       </div>

//       <div style={styles.row}>
//         <span>Total Articles</span>
//         <span>24</span>
//       </div>

//       <div style={styles.row}>
//         <span>Article Saves</span>
//         <span>1.2k</span>
//       </div>

//       <div style={styles.row}>
//         <span>Profile Views</span>
//         <span>3.4k</span>
//       </div>
//     </div>
//   )
// }

// const styles = {
//   box: {
//     background: '#fff',
//     padding: '20px',
//     borderRadius: '12px',
//     boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
//   },
//   row: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginTop: '8px',
//     fontSize: '14px',
//     color: '#666'
//   }
// }
