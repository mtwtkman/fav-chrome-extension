function isFolder(node) {
  return node.children !== undefined
}

function isEmptyFolder(node) {
  return isFolder(node) && node.children.length === 0
}

function buildContextMenuId(value) {
  return `fav:${value}`;
}

function createMenu(parentId, id, node) {
  return chrome.contextMenus.create({
    id: buildContextMenuId(id),
    title: node.title,
    parentId,
  });
}

function createFolderMenu(parentId, node) {
  return createMenu(parentId, node.id, node);
}

function createItemMenu(parentId, node) {
  return createMenu(parentId, node.url, node);
}

function iterateNodes(parentId, nodes) {
  nodes.forEach(node => {
    if (isEmptyFolder(node)) {
      return;
    }

    if (isFolder(node)) {
      const currentParentId = createFolderMenu(parentId, node);
      iterateNodes(currentParentId, node.children);
      return;
    }
    createItemMenu(parentId, node);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  const parentId = chrome.contextMenus.create({
    id: buildContextMenuId("root"),
    title: "Fav",
  });
  chrome.bookmarks.getTree(nodes => {
    const bookmarkGroup = nodes[0];
    const favRoot = bookmarkGroup.children[0];
    iterateNodes(parentId, favRoot.children);
  });
});

const extensionId = "fav";

chrome.contextMenus.onClicked.addListener(async info => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  resp = await chrome.tabs.sendMessage(tab.id, {url: info.menuItemId});
  console.log(resp);
});
