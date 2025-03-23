import React, { useState, useRef, useEffect } from "react";
import mammoth from "mammoth";

const HTMLDocViewer = () => {
  const [docContent, setDocContent] = useState("");
  const [comments, setComments] = useState([]);
  const docRef = useRef(null);

  useEffect(() => {
    // Fetch and convert the document
    fetch(
      "https://apidocument.giglabz.co.in/documents/IT_Audit_Review_lP41cLq.doc"
    )
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        mammoth
          .convertToHtml({ arrayBuffer: arrayBuffer })
          .then((result) => {
            setDocContent(result.value);
          })
          .catch((error) => console.error(error));
      });
  }, []);

  const handleAddComment = (event) => {
    if (!docRef.current) return;

    const rect = docRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const commentText = prompt("Enter your comment:");
    if (commentText) {
      setComments([...comments, { x, y, text: commentText }]);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "600px",
        overflow: "auto",
      }}
    >
      <div
        ref={docRef}
        onClick={handleAddComment}
        dangerouslySetInnerHTML={{ __html: docContent }}
        style={{ position: "relative" }}
      />
      {comments.map((comment, index) => (
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
          }}
        >
          {comment.text}
        </div>
      ))}
    </div>
  );
};

export default HTMLDocViewer;
