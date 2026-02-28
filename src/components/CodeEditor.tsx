import Editor, { type OnMount } from '@monaco-editor/react';
import { useRef } from 'react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language?: 'python' | 'javascript';
    readOnly?: boolean;
    height?: string;
}

const LANGUAGE_MAP: Record<string, string> = {
    python: 'python',
    javascript: 'javascript',
};

export default function CodeEditor({
    value,
    onChange,
    language = 'python',
    readOnly = false,
    height = '400px',
}: CodeEditorProps) {
    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

    const handleMount: OnMount = (editor) => {
        editorRef.current = editor;
    };

    return (
        <div className="rounded-lg overflow-hidden border border-gray-700 shadow-lg">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
                <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">
                    {language}
                </span>
            </div>

            <Editor
                height={height}
                language={LANGUAGE_MAP[language] ?? 'python'}
                value={value}
                theme="vs-dark"
                options={{
                    readOnly,
                    fontSize: 14,
                    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    tabSize: 4,
                    wordWrap: 'on',
                    smoothScrolling: true,
                    cursorBlinking: 'phase',
                    automaticLayout: true,
                }}
                onChange={(val) => onChange(val ?? '')}
                onMount={handleMount}
            />
        </div>
    );
}
