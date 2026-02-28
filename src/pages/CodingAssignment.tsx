import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    PlayIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowLeftIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline';
import CodeEditor from '../components/CodeEditor';
import { api } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestCase {
    id: string;
    description: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
}

interface TestResult {
    test_case_id: string;
    description: string;
    input?: string;
    expected?: string;
    actual: string;
    passed: boolean;
    error?: string;
    execution_time_ms: number;
}

interface CodingAssignment {
    id: string;
    course_id: string;
    title: string;
    description: string;
    language: 'python' | 'javascript';
    starter_code: string;
    test_cases: TestCase[];
    max_score: number;
    due_date?: string;
    created_at: string;
}

interface Submission {
    id: string;
    code: string;
    score?: number;
    feedback?: string;
    test_results: TestResult[];
    passed: boolean;
    submitted_at: string;
    graded_at?: string;
}

interface RunResult {
    output: string;
    stderr?: string;
    error?: string;
    execution_time_ms: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TestCasePanel({ tc, index }: { tc: TestCase; index: number }) {
    const [open, setOpen] = useState(index === 0);

    if (tc.is_hidden) {
        return (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800 text-gray-500 text-sm">
                <EyeSlashIcon className="w-4 h-4" />
                <span>Hidden test case – visible after submission</span>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-700 overflow-hidden">
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 text-sm font-medium text-gray-200"
            >
                <span>Test {index + 1}: {tc.description || 'No description'}</span>
                {open ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {open && (
                <div className="bg-gray-900 p-4 space-y-3 text-sm font-mono">
                    {tc.input && (
                        <div>
                            <p className="text-xs text-gray-400 mb-1 font-sans">Input (stdin)</p>
                            <pre className="bg-gray-800 p-2 rounded text-green-400 overflow-x-auto whitespace-pre-wrap">{tc.input}</pre>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-sans">Expected Output</p>
                        <pre className="bg-gray-800 p-2 rounded text-blue-300 overflow-x-auto whitespace-pre-wrap">{tc.expected_output}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

function TestResultRow({ result, index }: { result: TestResult; index: number }) {
    const [open, setOpen] = useState(!result.passed);
    const statusColor = result.passed ? 'text-green-400' : 'text-red-400';
    const borderColor = result.passed ? 'border-green-800' : 'border-red-800';

    return (
        <div className={`rounded-lg border ${borderColor} overflow-hidden`}>
            <button
                onClick={() => setOpen((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 text-sm"
            >
                <div className="flex items-center gap-2">
                    {result.passed
                        ? <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        : <XCircleIcon className="w-5 h-5 text-red-400" />}
                    <span className={`font-medium ${statusColor}`}>
                        Test {index + 1}: {result.description || 'Test Case'}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{result.execution_time_ms}ms</span>
                </div>
                {open ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>

            {open && (
                <div className="bg-gray-900 p-4 space-y-3 text-sm font-mono">
                    {result.input !== undefined && (
                        <div>
                            <p className="text-xs text-gray-400 mb-1 font-sans">Input (stdin)</p>
                            <pre className="bg-gray-800 p-2 rounded text-green-400 overflow-x-auto whitespace-pre-wrap">{result.input || '(empty)'}</pre>
                        </div>
                    )}
                    {result.expected !== undefined && (
                        <div>
                            <p className="text-xs text-gray-400 mb-1 font-sans">Expected</p>
                            <pre className="bg-gray-800 p-2 rounded text-blue-300 overflow-x-auto whitespace-pre-wrap">{result.expected}</pre>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-gray-400 mb-1 font-sans">Your Output</p>
                        <pre className={`bg-gray-800 p-2 rounded overflow-x-auto whitespace-pre-wrap ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                            {result.actual || '(empty)'}
                        </pre>
                    </div>
                    {result.error && (
                        <div>
                            <p className="text-xs text-red-400 mb-1 font-sans">Error</p>
                            <pre className="bg-red-950 p-2 rounded text-red-300 overflow-x-auto whitespace-pre-wrap">{result.error}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CodingAssignmentPage() {
    const { courseId, codingAssignmentId } = useParams<{ courseId: string; codingAssignmentId: string }>();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState<CodingAssignment | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);

    // Run panel (free sandbox)
    const [runInput, setRunInput] = useState('');
    const [runResult, setRunResult] = useState<RunResult | null>(null);
    const [running, setRunning] = useState(false);

    // Submit
    const [submitting, setSubmitting] = useState(false);
    const [submitResults, setSubmitResults] = useState<TestResult[] | null>(null);
    const [submitError, setSubmitError] = useState('');

    // Active right-panel tab
    const [tab, setTab] = useState<'cases' | 'run' | 'results'>('cases');

    // ── Load assignment + previous submission ─────────────────────────────────

    const loadData = useCallback(async () => {
        if (!courseId || !codingAssignmentId) return;
        setLoading(true);
        try {
            const [assignRes, subRes] = await Promise.all([
                api.get<CodingAssignment>(`/courses/${courseId}/coding-assignments/${codingAssignmentId}`),
                api.get<Submission | null>(`/courses/${courseId}/coding-assignments/${codingAssignmentId}/submissions/me`),
            ]);

            const a = assignRes.data;
            setAssignment(a);

            if (subRes.data) {
                setSubmission(subRes.data);
                setCode(subRes.data.code);
                setSubmitResults(subRes.data.test_results);
                setTab('results');
            } else {
                setCode(a.starter_code || getDefaultStarter(a.language));
            }
        } catch (e: any) {
            console.error('Failed to load coding assignment', e);
        } finally {
            setLoading(false);
        }
    }, [courseId, codingAssignmentId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ── Run (sandbox) ─────────────────────────────────────────────────────────

    const handleRun = async () => {
        if (!assignment) return;
        setRunning(true);
        setRunResult(null);
        try {
            const res = await api.post<RunResult>('/code/run', {
                code,
                language: assignment.language,
                input: runInput,
            });
            setRunResult(res.data);
            setTab('run');
        } catch (e: any) {
            setRunResult({ output: '', error: e.response?.data?.error ?? e.message, execution_time_ms: 0 });
            setTab('run');
        } finally {
            setRunning(false);
        }
    };

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!assignment || !courseId || !codingAssignmentId) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            const res = await api.post<Submission>(
                `/courses/${courseId}/coding-assignments/${codingAssignmentId}/submit`,
                { code }
            );
            setSubmission(res.data);
            setSubmitResults(res.data.test_results);
            setTab('results');
        } catch (e: any) {
            setSubmitError(e.response?.data?.error ?? 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────

    function getDefaultStarter(lang: string) {
        if (lang === 'python') {
            return `# Write your solution below\n\n# Read input from stdin:\n# data = input()\n\n`;
        }
        return `// Write your solution below\n\n// Read input from stdin:\n// const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');\n\n`;
    }

    const passedCount = submitResults?.filter((r) => r.passed).length ?? 0;
    const totalCount = submitResults?.length ?? 0;
    const scorePercent = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

    // ── Render ────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
                Assignment not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            {/* ── Top bar ── */}
            <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-base font-semibold">{assignment.title}</h1>
                        <p className="text-xs text-gray-400 capitalize">
                            {assignment.language} · {assignment.max_score} pts
                            {assignment.due_date && (
                                <> · Due {new Date(assignment.due_date).toLocaleDateString()}</>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Previous submission badge */}
                    {submission && (
                        <div className={`text-xs px-3 py-1 rounded-full font-medium ${submission.passed ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                            {submission.passed ? '✓ Passed' : `${submission.score ?? 0} / ${assignment.max_score}`}
                        </div>
                    )}

                    <button
                        onClick={handleRun}
                        disabled={running}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                        <PlayIcon className="w-4 h-4 text-green-400" />
                        {running ? 'Running…' : 'Run'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                        {submitting ? 'Submitting…' : 'Submit'}
                    </button>
                </div>
            </header>

            {/* ── Main layout: editor left, panel right ── */}
            <div className="flex flex-1 overflow-hidden">
                {/* ── Left: editor + description ── */}
                <div className="flex flex-col flex-1 min-w-0 border-r border-gray-800">
                    {/* Description */}
                    <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {assignment.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 p-4 overflow-hidden">
                        <CodeEditor
                            value={code}
                            onChange={setCode}
                            language={assignment.language}
                            height="calc(100vh - 220px)"
                        />
                    </div>
                </div>

                {/* ── Right: tabs ── */}
                <div className="w-[420px] shrink-0 flex flex-col overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex border-b border-gray-800 bg-gray-900">
                        {(['cases', 'run', 'results'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${tab === t ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {t === 'cases' && 'Test Cases'}
                                {t === 'run' && 'Console'}
                                {t === 'results' && 'Results'}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* ── Test Cases tab ── */}
                        {tab === 'cases' && (
                            <>
                                {assignment.test_cases.length === 0 && (
                                    <p className="text-sm text-gray-500">No test cases defined.</p>
                                )}
                                {assignment.test_cases.map((tc, i) => (
                                    <TestCasePanel key={tc.id} tc={tc} index={i} />
                                ))}
                            </>
                        )}

                        {/* ── Console / Run tab ── */}
                        {tab === 'run' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Custom stdin (optional)</label>
                                    <textarea
                                        rows={4}
                                        value={runInput}
                                        onChange={(e) => setRunInput(e.target.value)}
                                        placeholder="Enter input to pass via stdin…"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {running && (
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400" />
                                        Executing…
                                    </div>
                                )}

                                {runResult && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <ClockIcon className="w-4 h-4" />
                                            {runResult.execution_time_ms}ms
                                        </div>

                                        {runResult.output && (
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">stdout</p>
                                                <pre className="bg-gray-800 rounded-lg p-3 text-green-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{runResult.output}</pre>
                                            </div>
                                        )}
                                        {runResult.stderr && (
                                            <div>
                                                <p className="text-xs text-yellow-500 mb-1">stderr</p>
                                                <pre className="bg-yellow-950 rounded-lg p-3 text-yellow-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{runResult.stderr}</pre>
                                            </div>
                                        )}
                                        {runResult.error && (
                                            <div>
                                                <p className="text-xs text-red-400 mb-1">Error</p>
                                                <pre className="bg-red-950 rounded-lg p-3 text-red-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap">{runResult.error}</pre>
                                            </div>
                                        )}
                                        {!runResult.output && !runResult.stderr && !runResult.error && (
                                            <p className="text-sm text-gray-500">(no output)</p>
                                        )}
                                    </div>
                                )}

                                {!runResult && !running && (
                                    <p className="text-sm text-gray-500">Press <strong>Run</strong> to execute your code.</p>
                                )}
                            </div>
                        )}

                        {/* ── Results tab ── */}
                        {tab === 'results' && (
                            <div className="space-y-4">
                                {submitError && (
                                    <div className="bg-red-950 border border-red-700 rounded-lg p-3 text-sm text-red-300">
                                        {submitError}
                                    </div>
                                )}

                                {submitting && (
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400" />
                                        Running all tests…
                                    </div>
                                )}

                                {submitResults && !submitting && (
                                    <>
                                        {/* Score summary */}
                                        <div className={`rounded-lg p-4 border ${passedCount === totalCount ? 'border-green-700 bg-green-950' : 'border-yellow-700 bg-yellow-950'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm">
                                                    {passedCount === totalCount ? '🎉 All tests passed!' : `${passedCount} / ${totalCount} tests passed`}
                                                </span>
                                                <span className="text-sm font-mono font-bold">
                                                    {submission?.score ?? scorePercent}
                                                    {submission ? ` / ${assignment.max_score}` : '%'}
                                                </span>
                                            </div>
                                            {/* progress bar */}
                                            <div className="w-full bg-gray-800 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all ${passedCount === totalCount ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${totalCount > 0 ? (passedCount / totalCount) * 100 : 0}%` }}
                                                />
                                            </div>
                                            {submission?.feedback && (
                                                <p className="mt-3 text-sm text-gray-300 italic">Feedback: {submission.feedback}</p>
                                            )}
                                        </div>

                                        {submitResults.map((r, i) => (
                                            <TestResultRow key={r.test_case_id} result={r} index={i} />
                                        ))}
                                    </>
                                )}

                                {!submitResults && !submitting && (
                                    <p className="text-sm text-gray-500">Submit your code to see results.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
