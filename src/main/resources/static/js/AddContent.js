script.js
let blockIndex = 0;
function addBlock(type) {

    const container = document.getElementById("block-container");
    let html = "";

    if (type === "paragraph") {
        html = `
            <div class="block1" data-type="paragraph" data-index="${blockIndex}">
                <div class=row>
                    <div class=col-8 id="data-${blockIndex}">
                        <textarea placeholder="Enter paragraph text"></textarea>
                    </div>
                    <div class=col-1>
                        <button class="btn btn-outline-primary" type="button" onclick= removeBlock("${blockIndex}")>Remove</button>
                    </div>
                </div>
            </div>`;
    } else if (type === "image") {
        html = `
            <div class="block2" data-type="image" data-index="${blockIndex}">

                <div class=row>
                     <div class=col-8 id="data-${blockIndex}">
                          <input type="file" accept="image/*">
                     </div>
                     <div class=col-1>
                          <button class="btn btn-outline-primary" type="button" onclick= removeBlock("${blockIndex}")>Remove</button>
                     </div>
                     </div>
            </div>`;
    }else if(type === "subtitle"){
            html = `
                <div class="block3" data-type="subtitle" data-index="${blockIndex}">
                    <div class=row>
                        <div class=col-8 id="data-${blockIndex}">
                            <textarea placeholder="Enter Subtitle"></textarea>
                        </div>
                        <div class=col-1>
                            <button class="btn btn-outline-primary" type="button" onclick= removeBlock("${blockIndex}")>Remove</button>
                        </div>
                    </div>
                </div>`;
    }

    container.insertAdjacentHTML("beforeend", html);
    blockIndex++;

}
function removeBlock(blockNumber){
   console.log(blockNumber);
   const block = document.querySelector(`[data-index="${blockNumber}"]`);

   if(block){
        block.remove();
   }
}


function generatePreview() {
    let htmlContent = "";

    const blocks = document.querySelectorAll("#block-container > div");

    blocks.forEach(block => {
        const type = block.getAttribute("data-type");

        if (type === "paragraph" || type === "subtitle" || type === "title") {
            const textarea = block.querySelector("textarea");
            let content = textarea.value.trim();

            // Convert * lines to <ul>
            if (content.includes("*")) {
                let listItems = content
                    .split("\n")
                    .filter(line => line.trim())
                    .map(line => {
                        if (line.trim().startsWith("*")) {
                            return `<li>${line.trim().substring(1).trim()}</li>`;
                        } else {
                            return `<p>${line.trim()}</p>`;
                        }
                    })
                    .join("");
                content = `<ul>${listItems}</ul>`;
            } else {
                content = `<p>${content.replace(/\n/g, "<br>")}</p>`;
            }

            if (type === "title") htmlContent += `<h1>${content}</h1>`;
            else if (type === "subtitle") htmlContent += `<h3>${content}</h3>`;
            else htmlContent += content;
        }

        if (type === "image") {
            const fileInput = block.querySelector("input[type=file]");
            if (fileInput.files && fileInput.files[0]) {
                const imgSrc = URL.createObjectURL(fileInput.files[0]);
                htmlContent += `<img src="${imgSrc}" alt="Image">`;
            }
        }
    });

    // Save to preview.html using fetch (backend must handle writing the file)
    fetch("/save-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlContent })
    }).then(() => {
        window.open("/templates/preview.html", "_blank");
    });
}


