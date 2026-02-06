import './App.css'
import { NavLink, Route, Routes } from "react-router-dom";
import { useUser } from './context/userContextProvider';
import Home from './page/Home';
import Test from './page/Test';
import Users from './page/Users';
import Login from './page/Auth/Login';
import Profile from './page/Auth/Profile';
import Logout from './page/Auth/Logout';
import RequireAuth from './components/RequireAuth';
function App() {
  const { user, logout } = useUser()

  return (
    <>
      <header className="app-nav">
        <div className="nav-brand">React Next Test</div>
        <div className="nav-center">
          <nav className="nav-links">
            <NavLink to="/">Test API</NavLink>
            <NavLink to="/items" end>Items</NavLink>
            <NavLink to="/users">Users</NavLink>
          </nav>
        </div>
        <div className="nav-actions">
          {user?.isLoggedIn ? (
            <>
              <NavLink className="nav-text" to="/profile">Profile</NavLink>
              <NavLink className="nav-text" to="/logout" onClick={logout}>Logout</NavLink>
            </>
          ) : (
            <NavLink className="nav-text" to="/login">Login</NavLink>
          )}
        </div>
      </header>
      <main className="app-main app-center">
        <Routes>
          <Route path="/" element={<Test />} />
          <Route path="/items" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />
          <Route path="/users" element={
            <RequireAuth>
              <Users />
            </RequireAuth>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
          <Route path="/logout" element={
            <RequireAuth>
              <Logout />
            </RequireAuth>} />
        </Routes>
      </main>
    </>
  )
}

export default App
