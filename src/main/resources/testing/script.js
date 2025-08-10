const quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Write your blog content here...',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    handlers:{
    image:imageHandler
    }
  }
});

previewBtn.addEventListener('click', function () {
  const contentHtml = quill.root.innerHTML;
  let html = '';
  html += `<div>${contentHtml}</div><button id="saveBtn">Save</button>`;
  previewArea.innerHTML = html;
  document.getElementById('saveBtn').addEventListener('click', saveBlog);
});

function imageHandler(){
    const input = document.createElement('input');
    input.setAttribute('type','file');
    input.setAttribute('accept','image/*');
    input.click();
    input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);
    const res = await fetch('/upload-image', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', data.url);
}
function saveBlog() {
  let delta = quill.getContents();
  console.log(JSON.stringify(delta));
}
