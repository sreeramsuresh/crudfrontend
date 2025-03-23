import React, { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import mammoth from "mammoth";

const Testone = () => {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    setContent(result.value);

    // Create a blob URL for the uploaded file
    const blob = new Blob([arrayBuffer], { type: file.type });
    const url = URL.createObjectURL(blob);
    setDocumentUrl(url);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSave = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(content)],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, fileName || "document.docx");
    });
  };

  return (
    <div className="p-4">
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".docx"
        className="mb-4"
      />

      {documentUrl && (
        <div className="mb-4">
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              documentUrl
            )}`}
            width="100%"
            height="600px"
            frameBorder="0"
          >
            This is an embedded{" "}
            <a target="_blank" href="http://office.com">
              Microsoft Office
            </a>{" "}
            document, powered by{" "}
            <a target="_blank" href="http://office.com/webapps">
              Office Online
            </a>
            .
          </iframe>
        </div>
      )}

      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full h-64 p-2 border rounded"
      />
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Testone;
