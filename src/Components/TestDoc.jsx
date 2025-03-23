import React, { useState, useRef, useEffect } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const TestDoc = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const viewerRef = useRef(null);

  const docs = [
    {
      uri: "https://apidocument.giglabz.co.in/documents/IT_Audit_Review_lP41cLq.doc",
      fileType: "doc",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (viewerRef.current && !viewerRef.current.contains(event.target)) {
        // Click was outside the viewer, do nothing
        return;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddComment = (event) => {
    if (!viewerRef.current) return;

    const rect = viewerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const commentText = prompt("Enter your comment:");
    if (commentText) {
      setComments([
        ...comments,
        { x, y, page: currentPage, text: commentText },
      ]);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      ref={viewerRef}
      style={{ position: "relative", width: "100%", height: "600px" }}
      onClick={handleAddComment}
    >
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{ width: "100%", height: "100%" }}
        config={{
          header: {
            disableHeader: false,
            disableFileName: false,
          },
        }}
        onPageChange={(page) => handlePageChange(page.currentPage)}
      />
      {comments.map(
        (comment, index) =>
          comment.page === currentPage && (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${comment.x}px`,
                top: `${comment.y}px`,
                backgroundColor: "yellow",
                padding: "5px",
                borderRadius: "3px",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              {comment.text}
            </div>
          )
      )}
    </div>
  );
};

export default TestDoc;
