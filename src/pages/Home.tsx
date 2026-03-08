import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import defaultLogo from '../../public/default_course_logo.png';
import {
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail_url?: string;
    type: string;
    format?: string;
    status: string;
    duration?: string;
    start_date?: string;
    progress?: number;
    teacher_name?: string;
}

export default function Home() {
    const { user } = useAuthStore();
    const [recentCourses, setRecentCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Since our backend handles descending sorting by created_at, 
                // we can just take the first 3 from the general response.
                const res = await api.get('/courses');
                setRecentCourses(res.data.slice(0, 3));
            } catch (err) {
                console.error("Failed to load recent courses", err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <section className="hero-gradient glass-panel search-hero-section" style={{
                padding: '6rem 2rem',
                textAlign: 'center',
                marginBottom: '4rem',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '99px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                        <SparklesIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--brand-secondary)' }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Next-Gen Learning Platform</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Master Your Skills with <br />
                        <span className="text-gradient">ESDC LMS</span>
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
                        Dive into premium courses, collaborate with peers, and earn verifiable certificates. Elevate your learning journey today.
                    </p>

                    {!user ? (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                                Start Learning For Free
                                <ArrowRightIcon style={{ width: '1.2rem', height: '1.2rem', marginLeft: '0.5rem' }} />
                            </Link>
                            <Link to="/courses" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                                Explore Courses
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                                Go to Dashboard
                                <ArrowRightIcon style={{ width: '1.2rem', height: '1.2rem', marginLeft: '0.5rem' }} />
                            </Link>
                            <Link to="/courses" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                                Browse Courses
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            {/* <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
                {[
                    { number: '10,000+', label: 'Active Students', icon: UsersIcon },
                    { number: '50+', label: 'Expert Courses', icon: PlayIcon },
                    { number: '4.9/5', label: 'Average Rating', icon: StarIcon },
                    { number: '100%', label: 'Job Ready', icon: CheckCircleIcon }
                ].map((stat, i) => (
                    <div key={i} className="stat-box">
                        <stat.icon style={{ width: '2rem', height: '2rem', color: 'var(--brand-primary)', marginBottom: '1rem', margin: '0 auto' }} />
                        <h4 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{stat.number}</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</p>
                    </div>
                ))}
            </section> */}

            {/* Features Section */}
            {/* <section style={{ marginBottom: '5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: 700 }}>Why Choose <span className="text-gradient">Us?</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        We provide an exceptional learning experience through our intuitive platform and high-quality content.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        { title: 'Learn from Experts', desc: 'High-quality curated content designed by industry leaders.', icon: AcademicCapIcon },
                        { title: 'Interactive Chat', desc: 'Collaborate with your peers and get instant help from teachers.', icon: ChatBubbleLeftRightIcon },
                        { title: 'Earn Certificates', desc: 'Showcase your newly acquired skills with verifiable certificates.', icon: DocumentCheckIcon }
                    ].map((feature, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-icon-wrapper">
                                <feature.icon style={{ width: '2rem', height: '2rem' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* Latest Courses Section */}
            <section style={{ marginBottom: '5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: 700 }}>Latest <span className="text-gradient">Courses</span></h2>
                        <p className="text-secondary" style={{ margin: 0, fontSize: '1.1rem' }}>Discover our most recently added premium content.</p>
                    </div>
                    <Link to="/courses" className="btn btn-secondary" style={{ borderRadius: '12px' }}>Explore All Courses</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
                    {recentCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-card-img-wrapper">
                                <div className="course-card-image" style={{ 
                                    backgroundImage: course.thumbnail_url ? `url(${course.thumbnail_url})` : `url(${defaultLogo})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }} />
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    {course.type === 'free' || course.price === 0 ? (
                                        <span className="badge badge-success badge-blur">Free</span>
                                    ) : (
                                        <span className="badge badge-primary badge-blur">Premium</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 1rem 0', lineHeight: 1.4, color: 'var(--text-primary)' }}>{course.title}</h3>

                                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                                    {course.description.length > 100 ? `${course.description.substring(0, 100)}...` : course.description || "No description provided."}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                        {course.price === 0 || course.type === 'free' ? 'Free' : `$${course.price}`}
                                    </span>
                                    <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            {/* <section className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(203, 166, 247, 0.1) 0%, rgba(245, 194, 231, 0.05) 100%)', border: '1px solid rgba(203, 166, 247, 0.2)' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Ready to Start <span className="text-gradient">Learning?</span></h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    Join thousands of students who are already advancing their careers and acquiring new skills.
                </p>
                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '12px' }}>
                    Create Your Account Now
                </Link>
            </section> */}

            {/* Footer */}
            <footer className="responsive-footer" style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                <div>
                    <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>ESDC LMS</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Empowering learners worldwide with cutting-edge tools and expert knowledge.
                    </p>
                </div>
                <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Links</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link to="/" className="footer-link">Home</Link>
                        <Link to="/courses" className="footer-link">All Courses</Link>
                        <Link to="/leaderboard" className="footer-link">Leaderboard</Link>
                    </div>
                </div>
                <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Legal</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <a href="#" className="footer-link">Terms of Service</a>
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <a href="#" className="footer-link">Cookie Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

