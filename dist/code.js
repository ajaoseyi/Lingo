"use strict";
(() => {
  // lib/code.ts
  figma.showUI(__uiFiles__.main, {
    height: 450,
    width: 360
  });
  var currentSelection = figma.currentPage.selection;
  var initialFrameInstance = null;
  if (currentSelection.length > 0) {
    const selectedNode = currentSelection[0];
    if (selectedNode.type === "FRAME") {
      initialFrameInstance = selectedNode;
    }
  }
  function updateSelectionInfo() {
    const isFrameSelected = figma.currentPage.selection.length > 0;
    let isThereTextNode = false;
    const traverseChildren = (node) => {
      if (node.type === "TEXT") {
        isThereTextNode = true;
      }
      if ("children" in node) {
        node.children.forEach(traverseChildren);
      }
    };
    figma.currentPage.selection.forEach((node) => {
      traverseChildren(node);
    });
    sendMessage({
      type: "isFrameSelected",
      data: {
        isFrameSelected,
        isThereTextNode
      }
    });
  }
  figma.on("selectionchange", () => {
    currentSelection = figma.currentPage.selection;
    updateSelectionInfo();
  });
  function postMessageWithPromise(message) {
    return new Promise((resolve, reject) => {
      try {
        figma.ui.postMessage(message);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  var sendMessage = (message) => {
    postMessageWithPromise(message).then(() => {
      console.log("Message sent to UI");
    }).catch((error) => {
      console.error("Failed to send message", error);
    });
  };
  figma.ui.onmessage = (msg) => {
    if (msg.type === "open-url") {
      figma.openExternal(msg.url);
    }
    if (msg.type === "sendError") {
      figma.notify("An error occurred. Please try again.", { timeout: 4e3 });
    }
    async function changeTextInFrame(textTo, id) {
      const node = await figma.getNodeByIdAsync(id);
      if (!node) {
        return;
      }
      const currentFont = node.fontName;
      await figma.loadFontAsync(currentFont);
      console.log(textTo, node, "node");
      if (node.type === "TEXT") {
        node.characters = textTo;
      }
    }
    if (msg.type === "changeText") {
      changeTextInFrame(msg.data.text, msg.data.node);
    }
    if (msg.type === "sendNotification") {
      figma.notify(msg.message, {
        timeout: 6e3,
        button: {
          text: "Undo",
          action: () => {
            figma.triggerUndo();
            figma.notify("Undo action completed.");
          }
        }
      });
    }
    if (msg.type === "isFrameSelected") {
      const isFrameSelected = figma.currentPage.selection.length > 0;
      let isThereTextNode = false;
      const traverseChildren = (node) => {
        if (node.type === "TEXT") {
          isThereTextNode = true;
        }
        if ("children" in node) {
          node.children.forEach(traverseChildren);
        }
      };
      figma.currentPage.selection.forEach((node) => {
        traverseChildren(node);
      });
      sendMessage({
        type: "isFrameSelected",
        data: {
          isFrameSelected,
          isThereTextNode
        }
      });
    }
    if (msg.type === "getText") {
      figma.currentPage.selection.map((node) => {
        if (!node) {
          return;
        }
        const traverseChildren = (node2) => {
          if (node2.type === "TEXT") {
            sendMessage({
              type: "getText",
              node: node2.id,
              content: node2.type === "TEXT" ? node2.characters : "Frame does not have text content"
            });
          }
          if ("children" in node2) {
            node2.children.forEach(traverseChildren);
          }
        };
        figma.currentPage.selection.forEach((node2) => {
          traverseChildren(node2);
        });
      });
    }
  };
})();
