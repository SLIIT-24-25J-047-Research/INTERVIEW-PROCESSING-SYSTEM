import { useState } from "react";
import { Document, Page } from "react-pdf";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

interface FileViewerProps {
  filePath: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ filePath }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const fileExtension = filePath.split(".").pop()?.toLowerCase();

  if (!filePath) {
    return <p>No file selected</p>;
  }

  // Render PDF files
  if (fileExtension === "pdf") {
    return (
      <div>
        <Document file={filePath} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
        {pageNumber > 1 && <button onClick={() => setPageNumber(pageNumber - 1)}>Previous</button>}
        {pageNumber < numPages && <button onClick={() => setPageNumber(pageNumber + 1)}>Next</button>}
      </div>
    );
  }

  // Render DOCX files
  if (fileExtension === "docx") {
    return <DocViewer documents={[{ uri: filePath }]} pluginRenderers={DocViewerRenderers} />;
  }

  // Fallback: Use iframe for unsupported file types
  return (
    <iframe
      src={filePath}
      width="100%"
      height="600px"
      title="File Preview"
      style={{ border: "none" }}
    />
  );
};

export default FileViewer;
