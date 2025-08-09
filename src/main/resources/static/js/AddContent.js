
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
