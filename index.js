const $pasteBtn = document.querySelector(".paste");
const $copyBtn = document.querySelector(".copy");

$pasteBtn.addEventListener("click", () => {
  console.log("click me");

  parseClipboardData();
});

async function parseClipboardData() {
  const items = await navigator.clipboard.read().catch((err) => {
    console.error(err);
  });
  console.log("items:", items);
  for (let item of items) {
    console.log("item.type", item.types);
    for (let type of item.types) {
      const result = handleImage(type, item) || handleText(type, item);
      if (result) {
        break;
      }
    }
  }
}
const $container = document.querySelector(".container");
// parse image file
function handleImage(type, clipboardItem) {
  if (type.startsWith("image/")) {
    clipboardItem.getType(type).then((imageBlob) => {
      const image = `<img src="${window.URL.createObjectURL(imageBlob)}" />`;
      $container.innerHTML = image;
    });
    return true;
  }
  return false;
}

function handleText(type, clipboardItem) {
  if (type === "text/plain") {
    clipboardItem
      .getType(type)
      .then((blob) => blob.text())
      .then((text) => {
        const p = `<p>${text}</p>`;
        $container.innerHTML = p;
      });
    return true;
  }
  return false;
}


$copyBtn.addEventListener("click", () => {
  htmlToImage
    .toBlob($container)
    .then(function (blob) {
      return navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    })
    .then(
      () => {
        console.log("copy success");
      },
      (err) => {
        console.error(err);
      }
    );
});
