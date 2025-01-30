// import React, { useState } from "react";
// import Editor from "@monaco-editor/react";


// interface CodeEditorProps {
//   language?: string;
//   theme?: string;
//   readOnly: boolean;
//   initialCode?: string;
//   onCodeChange?: (value: string | undefined) => void;
// }

// const CodeEditor: React.FC<CodeEditorProps> = ({
//   language = "javascript",
//   theme = "vs-dark",
//   initialCode = "// Write your code here",
//   onCodeChange,
// }) => {
//   const [code, setCode] = useState(initialCode);

//   const handleEditorChange = (value: string | undefined) => {
//     setCode(value || "");
//     if (onCodeChange) {
//       onCodeChange(value); // Notify parent component
//     }
//   };

//   return (
//     <div className="editor-container">
//       <Editor
//         height="100%"
//         width="100%"
//         language={language}
//         value={code}
//         onChange={handleEditorChange}
//         theme={theme}
//         options={{
//           minimap: { enabled: false },
//           fontSize: 14,
//           automaticLayout: true,
//         }}
//       />
//     </div>
//   );
// };

// export default CodeEditor;

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChange,
}) => {
  return (
    <div className="h-[500px] border border-gray-200 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={code}
        onChange={(value) => onChange(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};