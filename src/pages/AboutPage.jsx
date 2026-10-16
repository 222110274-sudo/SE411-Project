const TEAM = [
  { name: 'Sultan Almojel', studentId: '222110274' },
  { name: 'Ziyad AlIsmail', studentId: '222110392' },
  { name: 'Nawaf AlTamimi', studentId: '222110323' },
  { name: 'Saud Alnasser', studentId: '222110253' },
]

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export default function AboutPage() {
  return (
    <section>
      <div className="page-header">
        <div>
          <h1>About</h1>
          <p className="muted">SE411 Project — Part 1</p>
        </div>
      </div>

      <div className="card">
        <h2>The project</h2>
        <p>
          AssetHub is a React application for managing a company&apos;s computers: laptops, desktops,
          workstations, servers and tablets. Users can add, view, update, delete and search computers,
          and see an overview of the inventory on the dashboard.
        </p>
        <p className="muted">
          In Part 1 the data is kept in memory as a collection of JavaScript objects (no database), so
          changes reset when the page is reloaded. A backend will be added in Part 2.
        </p>
      </div>

      <h2 className="section-title">Team members</h2>
      <ul className="team">
        {TEAM.map((member) => (
          <li key={member.studentId} className="card member">
            <span className="avatar" aria-hidden="true">{initials(member.name)}</span>
            <div>
              <p className="member-name">{member.name}</p>
              <p className="muted">Student ID: {member.studentId}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
