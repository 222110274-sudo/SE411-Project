import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import AboutPage from './pages/AboutPage'
import AddComputerPage from './pages/AddComputerPage'
import ComputerDetailsPage from './pages/ComputerDetailsPage'
import ComputersPage from './pages/ComputersPage'
import EditComputerPage from './pages/EditComputerPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/computers" element={<ComputersPage />} />
          <Route path="/computers/new" element={<AddComputerPage />} />
          <Route path="/computers/:id" element={<ComputerDetailsPage />} />
          <Route path="/computers/:id/edit" element={<EditComputerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="footer">SE411 Project · Part 1 · Computer Asset Manager</footer>
    </div>
  )
}
