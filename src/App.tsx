import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CreateCourse from './pages/CreateCourse';
import AdvancedCourseCreator from './pages/AdvancedCourseCreator';
import CourseDetail from './pages/CourseDetail';
import ChatView from './pages/ChatView';
import Leaderboard from './pages/Leaderboard';
import Users from './pages/Users';
import UserProfile from './pages/UserProfile';
import TrendingCourses from './pages/TrendingCourses';
import EditProfile from './pages/EditProfile';
import CodingAssignment from './pages/CodingAssignment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/trending" element={<TrendingCourses />} />
          <Route path="courses/new" element={<CreateCourse />} />
          <Route path="courses/new/advanced" element={<AdvancedCourseCreator />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserProfile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="chat" element={<ChatView />} />
          <Route path="courses/:courseId/coding/:codingAssignmentId" element={<CodingAssignment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
