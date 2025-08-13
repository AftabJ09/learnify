const quill = new Quill('#editor', {
theme: 'snow',
placeholder: 'Write your blog content here...',
modules: {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }], // Text color & background color
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['code', 'code-block'], // Inline code & code block
    ['clean']
  ]
}
});

function showPreview(){
  const delta = quill.getContents();
  const deltaStr = JSON.stringify(delta);

  // Build HTML content for preview page
  const previewHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Quill Blog Preview</title>
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
    <style>
      body {
        max-width: 700px;
        margin: 30px auto;
        font-family: Arial, sans-serif;
        line-height: 1.6;
      }
      #preview {
        border: 1px solid #ccc;
        padding: 20px;
        min-height: 300px;
        background: #fff;
      }
      #preview img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 15px 0;
        border-radius: 6px;
      }
      #preview h1, #preview h2, #preview h3 {
        margin-top: 1.5em;
        margin-bottom: 0.75em;
      }
    </style>
  </head>
  <body>
    <h1>Blog Post Preview</h1>
    <div id="preview"></div>

    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    <script>
      const savedDelta = ${deltaStr};
      const previewQuill = new Quill('#preview', {
        theme: 'snow',
        readOnly: true,
        modules: { toolbar: false }
      });
      previewQuill.setContents(savedDelta);
    </script>
  </body>
  </html>
  `;

  // Open new window and write the preview HTML
  const newWindow = window.open();
  newWindow.document.open();
  newWindow.document.write(previewHtml);
  newWindow.document.close();
}
