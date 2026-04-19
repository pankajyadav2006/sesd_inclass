import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, LogOut, Code, User as UserIcon, Settings, Plus, Search, Trash2, Edit2, Users, Layers, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5005/api';

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Toast System
const useToast = () => {
    const [toasts, setToasts] = useState<any[]>([]);
    const addToast = (msg: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };
    const ToastContainer = () => (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div key={t.id} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} className={`toast ${t.type}`}>
                        {t.type === 'success' ? <CheckCircle /> : <AlertCircle />}
                        {t.msg}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
    return { addToast, ToastContainer };
}

const Login = ({ setAuth, addToast }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'STUDENT' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuth(data.user);
        addToast('Successfully logged in!');
      } else {
        await api.post('/auth/register', formData);
        setIsLogin(true);
        addToast('Registration successful! Please login.');
      }
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Authentication failed', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ maxWidth: '450px', margin: '6rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {isLogin ? 'Student Management Login' : 'Register Account'}
      </h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
            </div>
          </>
        )}
        <div className="form-group">
          <label>Email ID</label>
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          {isLogin ? 'Login Securely' : 'Register Securely'} <Plus size={18} />
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '50px' }} onClick={() => setIsLogin(!isLogin)}>
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
      </div>
    </motion.div>
  );
};

const Dashboard = ({ user, addToast }: any) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // Managing Modal States
  const [manageModal, setManageModal] = useState<{isOpen: boolean, course: any}>({ isOpen: false, course: null });

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    const { data } = await api.get('/courses');
    setCourses(data);
  };

  const fetchEnrollments = async () => {
    const { data } = await api.get('/enrollments');
    setEnrollments(data);
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await api.post('/enrollments', { courseId });
      fetchEnrollments();
      addToast('Successfully enrolled in course.');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Error enrolling', 'error');
    }
  };

  const handleDrop = async (enrollmentId: string) => {
    try {
      await api.put(`/enrollments/${enrollmentId}/drop`);
      fetchEnrollments();
      addToast('Successfully dropped course.', 'success');
    } catch (err: any) {
      addToast('Error dropping course', 'error');
    }
  };

  const handleCourseUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const form = e.target as any;
          await api.put(`/courses/${manageModal.course._id}`, {
              title: form.title.value,
              code: form.code.value,
              capacity: form.capacity.value
          });
          fetchCourses();
          setManageModal({ isOpen: false, course: null });
          addToast('Course successfully updated.');
      } catch (err: any) {
          addToast(err.response?.data?.message || 'Error updating course', 'error');
      }
  };

  const handleCourseDelete = async (id: string) => {
      try {
          await api.delete(`/courses/${id}`);
          fetchCourses();
          setManageModal({ isOpen: false, course: null });
          addToast('Course deleted successfully.', 'success');
      } catch (err: any) {
          addToast(err.response?.data?.message || 'Delete failed', 'error');
      }
  };

  const filteredCourses = courses.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      {/* Stats/Welcome Header */}
      <div className="stats-container">
          <div className="stat-card glass-panel" style={{ padding: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,242,254,0.1)', borderRadius: '50px' }}><Activity color="var(--secondary)" /></div>
              <div>
                  <div className="stat-label">Active Role</div>
                  <div className="stat-value" style={{ fontSize: '1.2rem', color: "var(--text-main)"}}>{user.role}</div>
              </div>
          </div>
          <div className="stat-card glass-panel" style={{ padding: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(92,22,255,0.1)', borderRadius: '50px' }}><Layers color="var(--primary)" /></div>
              <div>
                  <div className="stat-label">Total Courses</div>
                  <div className="stat-value">{courses.length}</div>
              </div>
          </div>
          {user.role === 'STUDENT' && (
              <div className="stat-card glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(0,255,136,0.1)', borderRadius: '50px' }}><CheckCircle color="var(--success)" /></div>
                  <div>
                      <div className="stat-label">Active Enrollments</div>
                      <div className="stat-value">{enrollments.filter(e => e.status === 'ACTIVE').length}</div>
                  </div>
              </div>
          )}
      </div>

      {user.role === 'STUDENT' && enrollments.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h3><span style={{ color: 'var(--success)' }}>●</span> My Enrolled Courses</h3>
          <div className="grid">
            {enrollments.map(e => (
              <motion.div layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={e._id} className="glass-panel" style={e.status === 'DROPPED' ? { opacity: 0.5 } : { borderColor: 'rgba(0,255,136,0.3)'}}>
                <div className="course-card-header">
                  <div>
                    <div className="course-title">{e.courseId?.title || 'Unknown'}</div>
                    <div className="course-code">{e.courseId?.code || 'XXX'}</div>
                  </div>
                  <span className={e.status === 'ACTIVE' ? 'badge badge-active' : 'badge badge-danger'}>{e.status}</span>
                </div>
                {e.status === 'ACTIVE' && (
                  <button onClick={() => handleDrop(e._id)} className="btn btn-danger" style={{ width: '100%' }}>Drop Course <Trash2 size={16} /></button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem'}}>
        <h3>Course Catalog</h3>
        <div className="search-bar" style={{ marginBottom: 0, width: '350px' }}>
            <Search style={{ position: 'absolute', margin: '1.1rem', color: 'var(--text-muted)' }} size={20} />
            <input 
                className="search-input" 
                placeholder="Search courses..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ paddingLeft: '3.5rem' }}
            />
        </div>
      </div>

      <div className="grid">
        {filteredCourses.map(course => (
          <motion.div layout initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} key={course._id} className="glass-panel">
            <div className="course-card-header">
              <div>
                <div className="course-title">{course.title}</div>
                <div className="course-code">{course.code}</div>
              </div>
            </div>
            
            <div className="course-meta">
                <div className="meta-item"><Users size={16} /> Capacity: {course.capacity}</div>
            </div>
            
            {user.role === 'STUDENT' && (
              <button 
                onClick={() => handleEnroll(course._id)} 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={enrollments.some(e => e.courseId._id === course._id && e.status === 'ACTIVE')}
              >
                {enrollments.some(e => e.courseId._id === course._id && e.status === 'ACTIVE') ? 'Enrolled' : 'Enroll Now'} <Code size={18} />
              </button>
            )}
            
            {user.role === 'INSTRUCTOR' && user.id === (typeof course.instructorId === 'object' ? course.instructorId._id : course.instructorId) && (
              <button 
                className="btn btn-secondary" 
                onClick={() => setManageModal({ isOpen: true, course })}
                style={{ width: '100%' }}
              >
                 Manage Course <Settings size={18} />
              </button>
            )}
          </motion.div>
        ))}

        {user.role === 'INSTRUCTOR' && (
          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ borderStyle: 'dashed', borderColor: 'var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }} onClick={() => setManageModal({ isOpen: true, course: null })}>
             <div style={{ background: 'rgba(92,22,255,0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}><Plus size={32} color="var(--primary)" /></div>
             <h3>Create New Course</h3>
             <p>Add a new course to the catalog</p>
          </motion.div>
        )}
      </div>

      {/* Modal Interop */}
      <AnimatePresence>
          {manageModal.isOpen && (
              <div className="modal-overlay">
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="modal-content">
                      <h2 style={{ marginBottom: '2rem' }}>{manageModal.course ? 'Update Course' : 'Create Course'}</h2>
                      <form onSubmit={async (e: any) => {
                          e.preventDefault();
                          if(manageModal.course) {
                              await handleCourseUpdate(e);
                          } else {
                              try {
                                  await api.post('/courses', {
                                    code: e.target.code.value,
                                    title: e.target.title.value,
                                    capacity: Number(e.target.capacity.value)
                                  });
                                  fetchCourses();
                                  setManageModal({ isOpen: false, course: null });
                                  addToast('Course successfully created!');
                              } catch(err: any) {
                                  addToast(err.response?.data?.message || 'Error creating course', 'error');
                              }
                          }
                      }}>
                          <div className="form-group">
                              <label>Course Code</label>
                              <input name="code" defaultValue={manageModal.course?.code} placeholder="e.g. CS101" required />
                          </div>
                          <div className="form-group">
                              <label>Course Title</label>
                              <input name="title" defaultValue={manageModal.course?.title} placeholder="Course Title" required />
                          </div>
                          <div className="form-group">
                              <label>Capacity</label>
                              <input name="capacity" type="number" defaultValue={manageModal.course?.capacity} placeholder="Seat Capacity" required />
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                  {manageModal.course ? 'Save Changes' : 'Create Course'} <Edit2 size={16} />
                              </button>
                              <button type="button" onClick={() => setManageModal({ isOpen: false, course: null })} className="btn btn-secondary">Cancel</button>
                          </div>
                      </form>
                      {manageModal.course && (
                          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
                              <button onClick={() => handleCourseDelete(manageModal.course._id)} className="btn btn-danger" style={{ width: '100%' }}>Delete Course <Trash2 size={16} /></button>
                          </div>
                      )}
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

    </motion.div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const { addToast, ToastContainer } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    addToast('Successfully logged out.', 'success');
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <BookOpen color="var(--primary)" size={32} /> LingoTrack
          </Link>
          <div className="nav-links">
            {user && (
              <>
                <div className="user-profile">
                    <UserIcon size={18} color="var(--secondary)" />
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', borderRadius: '50px' }}>
                  <LogOut size={16} style={{ marginRight: '0.4rem' }} /> Logout
                </button>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} addToast={addToast} /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <Login setAuth={setUser} addToast={addToast} /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
