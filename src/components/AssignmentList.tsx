import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { DocumentTextIcon, CheckBadgeIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Assignment {
    id: string;
    title: string;
    description: string;
    max_score: number;
    due_date?: string;
    created_at: string;
}

interface Submission {
    id: string;
    assignment_id: string;
    user_id: string;
    user_name?: string;
    file_url: string;
    extracted_text: string;
    score?: number;
    feedback?: string;
    submitted_at: string;
    graded_at?: string;
}

interface AssignmentsProps {
    courseId: string;
    isTeacher: boolean;
    isEnrolled: boolean;
}

export default function AssignmentList({ courseId, isTeacher, isEnrolled }: AssignmentsProps) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    // Teacher state
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    // Student state
    const [mySubmission, setMySubmission] = useState<Submission | null>(null);
    const [uploading, setUploading] = useState(false);

    // Teacher grading state
    const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
    const [score, setScore] = useState<number | ''>('');
    const [feedback, setFeedback] = useState('');

    const fetchAssignments = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/assignments`);
            setAssignments(res.data || []);
        } catch (err: any) {
            console.error("Failed to load assignments", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isTeacher || isEnrolled) {
            fetchAssignments();
        }
    }, [courseId, isTeacher, isEnrolled]);

    const handleCreateAssignment = async () => {
        if (!title.trim()) return;
        try {
            await api.post(`/courses/${courseId}/assignments`, {
                title,
                description,
                max_score: maxScore
            });
            setIsCreating(false);
            setTitle('');
            setDescription('');
            setMaxScore(100);
            fetchAssignments();
        } catch (err) {
            alert('Failed to create assignment');
        }
    };

    const handleUpdateAssignment = async () => {
        if (!editingAssignment || !title.trim()) return;
        try {
            await api.put(`/courses/${courseId}/assignments/${editingAssignment.id}`, {
                title,
                description,
                max_score: maxScore
            });
            setEditingAssignment(null);
            setTitle('');
            setDescription('');
            setMaxScore(100);
            fetchAssignments();
        } catch (err) {
            alert('Failed to update assignment');
        }
    };

    const handleDeleteAssignment = async (assignmentId: string) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;
        try {
            await api.delete(`/courses/${courseId}/assignments/${assignmentId}`);
            fetchAssignments();
            if (activeAssignment?.id === assignmentId) setActiveAssignment(null);
        } catch (err) {
            alert('Failed to delete assignment');
        }
    };

    const handleViewSubmissions = async (assignment: Assignment) => {
        setActiveAssignment(assignment);
        if (isTeacher) {
            try {
                const res = await api.get(`/courses/${courseId}/assignments/${assignment.id}/submissions`);
                setSubmissions(res.data || []);
            } catch (err) {
                console.error("Failed to load submissions");
            }
        } else {
            // Fetch student's own submission
            try {
                const res = await api.get(`/courses/${courseId}/assignments/${assignment.id}/submissions/me`);
                setMySubmission(res.data || null);
            } catch (err: any) {
                if (err.response?.status !== 404) {
                    console.error("Failed to load your submission");
                }
                setMySubmission(null);
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const form = new FormData();
        form.append('image', file);

        try {
            const uploadRes = await api.post('/upload/image', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Submit the actual assignment
            await api.post(`/courses/${courseId}/assignments/${assignmentId}/submit`, {
                file_url: uploadRes.data.file_url
            });

            // Refresh view
            if (activeAssignment) {
                handleViewSubmissions(activeAssignment);
            }

            alert("Assignment submitted successfully. AI extraction is processing your image.");
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to submit assignment');
        } finally {
            setUploading(false);
        }
    };

    const handleGradeSubmit = async () => {
        if (!gradingSubmission || score === '') return;

        try {
            await api.put(`/courses/${courseId}/assignments/${gradingSubmission.assignment_id}/submissions/${gradingSubmission.id}/grade`, {
                score: Number(score),
                feedback
            });

            alert("Grade saved successfully");
            setGradingSubmission(null);
            if (activeAssignment) {
                handleViewSubmissions(activeAssignment);
            }
        } catch (err) {
            alert("Failed to save grade");
        }
    };

    if (loading) return <div>Loading assignments...</div>;

    if (!isTeacher && !isEnrolled) {
        return <div style={{ color: 'var(--text-muted)' }}>You must be enrolled to view assignments.</div>;
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Assignments</h3>
                {isTeacher && activeAssignment === null && !isCreating && (
                    <button onClick={() => setIsCreating(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        + New Assignment
                    </button>
                )}
                {activeAssignment && (
                    <button onClick={() => { setActiveAssignment(null); setGradingSubmission(null); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Back to List
                    </button>
                )}
            </div>

            {/* CREATION FORM */}
            {isCreating && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Create New Assignment</h4>
                    <input className="input-field" placeholder="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: '1rem' }} />
                    <textarea className="input-field" placeholder="Instructions/Description" value={description} onChange={e => setDescription(e.target.value)} style={{ marginBottom: '1rem', minHeight: '100px' }} />
                    <input type="number" className="input-field" placeholder="Max Score (e.g. 100)" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} style={{ marginBottom: '1rem' }} />
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setIsCreating(false)} className="btn btn-secondary">Cancel</button>
                        <button onClick={handleCreateAssignment} className="btn btn-primary" disabled={!title}>Create</button>
                    </div>
                </div>
            )}

            {/* EDITING FORM */}
            {editingAssignment && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Edit Assignment</h4>
                    <input className="input-field" placeholder="Assignment Title" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: '1rem' }} />
                    <textarea className="input-field" placeholder="Instructions/Description" value={description} onChange={e => setDescription(e.target.value)} style={{ marginBottom: '1rem', minHeight: '100px' }} />
                    <input type="number" className="input-field" placeholder="Max Score (e.g. 100)" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} style={{ marginBottom: '1rem' }} />
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setEditingAssignment(null)} className="btn btn-secondary">Cancel</button>
                        <button onClick={handleUpdateAssignment} className="btn btn-primary" disabled={!title}>Update</button>
                    </div>
                </div>
            )}

            {/* ASSIGNMENT LIST */}
            {!activeAssignment && !isCreating && !editingAssignment && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {assignments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                            <p className="text-secondary">No assignments posted yet.</p>
                        </div>
                    ) : (
                        assignments.map(a => (
                            <div key={a.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <DocumentTextIcon style={{ width: '1.2rem' }} /> {a.title}
                                    </h4>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Max Score: {a.max_score}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {isTeacher && (
                                        <>
                                            <button onClick={() => {
                                                setEditingAssignment(a);
                                                setTitle(a.title);
                                                setDescription(a.description);
                                                setMaxScore(a.max_score);
                                            }} className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--text-secondary)' }} title="Edit Assignment">
                                                <PencilIcon style={{ width: '1.2rem' }} />
                                            </button>
                                            <button onClick={() => handleDeleteAssignment(a.id)} className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--danger)' }} title="Delete Assignment">
                                                <TrashIcon style={{ width: '1.2rem' }} />
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => handleViewSubmissions(a)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
                                        {isTeacher ? 'View Submissions' : 'View / Submit'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ASSIGNMENT DETAILS / SUBMISSIONS VIEW */}
            {activeAssignment && (
                <div className="animate-fade-in">
                    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{activeAssignment.title}</h2>
                        <span style={{ display: 'inline-block', background: 'var(--bg-tertiary)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Max Score: {activeAssignment.max_score}
                        </span>
                        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{activeAssignment.description}</p>
                    </div>

                    {/* STUDENT VIEW */}
                    {!isTeacher && (
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Your Submission</h3>

                            {mySubmission ? (
                                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mySubmission.score !== undefined && mySubmission.score !== null ? 'var(--success)' : 'var(--text-muted)' }}>
                                            {mySubmission.score !== undefined && mySubmission.score !== null ? <CheckBadgeIcon style={{ width: '1.5rem' }} /> : <ClockIcon style={{ width: '1.5rem' }} />}
                                            <span style={{ fontWeight: 600 }}>
                                                {mySubmission.score !== undefined && mySubmission.score !== null ? `Graded: ${mySubmission.score} / ${activeAssignment.max_score}` : 'Pending Grade'}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Submitted on {new Date(mySubmission.submitted_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {mySubmission.feedback && (
                                        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                            <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teacher Feedback:</strong>
                                            <p style={{ margin: 0, fontSize: '0.95rem' }}>{mySubmission.feedback}</p>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Submitted Image:</strong>
                                            <img src={mySubmission.file_url} alt="Submission" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                        </div>
                                        <div>
                                            <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Auto-Extracted Text:</strong>
                                            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', minHeight: '150px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                {mySubmission.extracted_text || "Waiting for processing..."}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                                    <DocumentTextIcon style={{ width: '3rem', margin: '0 auto 1rem', color: 'var(--brand-primary)' }} />
                                    <h4 style={{ marginBottom: '1rem' }}>Upload your work</h4>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                        Please write your answers clearly, take a picture, and upload it here. Our AI will automatically parse the handwritten text to speed up grading.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={(e) => handleFileUpload(e, activeAssignment.id)}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                        id={`upload-${activeAssignment.id}`}
                                    />
                                    <label htmlFor={`upload-${activeAssignment.id}`} className="btn btn-primary" style={{ display: 'inline-block', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                                        {uploading ? 'Uploading & Processing...' : 'Select Image to Submit'}
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TEACHER VIEW */}
                    {isTeacher && (
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Student Submissions ({submissions.length})</h3>

                            {submissions.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No submissions yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {submissions.map(sub => (
                                        <div key={sub.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <div>
                                                    <h4 style={{ margin: '0 0 0.3rem 0' }}>{sub.user_name || 'Student'}</h4>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        Submitted: {new Date(sub.submitted_at).toLocaleDateString()} at {new Date(sub.submitted_at).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    {sub.score !== undefined && sub.score !== null ? (
                                                        <span style={{ background: 'var(--bg-tertiary)', color: 'var(--success)', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 600 }}>
                                                            Grade: {sub.score} / {activeAssignment.max_score}
                                                        </span>
                                                    ) : (
                                                        <span style={{ background: 'var(--bg-tertiary)', color: 'var(--brand-primary)', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 600 }}>
                                                            Needs Grading
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* AI Grading View */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                                <div>
                                                    <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Original Submission</strong>
                                                    <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img src={sub.file_url} alt="Submission" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                    </div>
                                                    <a href={sub.file_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--brand-primary)' }}>Open Full Image</a>
                                                </div>
                                                <div>
                                                    <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>OCR Extracted Text (AI)</strong>
                                                    <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', height: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                                        {sub.extracted_text || <span style={{ color: 'var(--text-muted)' }}>No text extracted or processing failed.</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Grading Form */}
                                            {gradingSubmission?.id === sub.id ? (
                                                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '1rem' }} className="animate-fade-in">
                                                    <h5 style={{ margin: '0 0 1rem 0' }}>Grade Submission</h5>
                                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Score (Max: {activeAssignment.max_score})</label>
                                                            <input type="number" className="input-field" placeholder="0" value={score} onChange={e => setScore(e.target.value === '' ? '' : Number(e.target.value))} max={activeAssignment.max_score} min={0} />
                                                        </div>
                                                        <div style={{ flex: 3 }}>
                                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Feedback to Student (Optional)</label>
                                                            <textarea className="input-field" placeholder="Great work..." value={feedback} onChange={e => setFeedback(e.target.value)} rows={2} />
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => setGradingSubmission(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Cancel</button>
                                                        <button onClick={handleGradeSubmit} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} disabled={score === ''}>Save Grade</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setGradingSubmission(sub);
                                                        setScore(sub.score !== undefined && sub.score !== null ? sub.score : '');
                                                        setFeedback(sub.feedback || '');
                                                    }}
                                                    className="btn btn-secondary"
                                                    style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)' }}
                                                >
                                                    {sub.score !== undefined && sub.score !== null ? 'Update Grade & Feedback' : 'Grade Submission'}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
