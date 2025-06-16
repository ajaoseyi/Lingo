// This shows the HTML page in "ui.html
figma.showUI(__uiFiles__.main, {
  height: 450,
  width: 360,
});

// Initialize selection state
let currentSelection = figma.currentPage.selection;
// Save the initial frame instance before any actions

let initialFrameInstance: SceneNode | null = null;

if (currentSelection.length > 0) {
  const selectedNode = currentSelection[0];
  if (selectedNode.type === "FRAME") {
    initialFrameInstance = selectedNode;
  }
}
// Function to package and send selection information to the UI
function updateSelectionInfo() {
  const isFrameSelected = figma.currentPage.selection.length > 0;
  let isThereTextNode = false;

  const traverseChildren = (node: SceneNode) => {
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
      isThereTextNode,
    },
  });
}
function getText() {
	let node: any = null;
	for (const selectedNode of figma.currentPage.selection) {
		if ("children" in selectedNode) {
      node = selectedNode.children.find((child: any) => child.type === "TEXT");
      console.log(node, 'nodesss')
			if (node) break;
    } else if (selectedNode.type === "TEXT") {
      node = selectedNode;
    }
  }
  console.log(figma.currentPage.selection, "node any");
	if (!node) return;
	return node.characters;
}

// Set up the event listener for selection changes
figma.on("selectionchange", () => {
  // Get the current selection
  currentSelection = figma.currentPage.selection;
  // Send updated selection info to UI
  updateSelectionInfo();
  sendMessage({ content: getText(), type: "detectLanguage" });


});

function postMessageWithPromise(message: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      figma.ui.postMessage(message);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

const sendMessage = (message: any) => {
  postMessageWithPromise(message)
    .then(() => {
      console.log("Message sent to UI");
    })
    .catch((error) => {
      console.error("Failed to send message", error);
    });
};

figma.ui.onmessage = (msg) => {
  if (msg.type === "open-url") {
    figma.openExternal(msg.url);
  }
  if (msg.type === "sendError") {
    figma.notify("An error occurred. Please try again.", { timeout: 4000 });
  }

  async function changeTextInFrame(textTo: string, id: any) {
    const node: any = await figma.getNodeByIdAsync(id);
    if (!node) {
      return;
    }
    const currentFont = node.fontName as FontName;
    // Load that exact font before modifying
    await figma.loadFontAsync(currentFont);
    if (node.type === "TEXT") {
      node.characters = textTo;
    }
  }


  if (msg.type === "changeText") {
    changeTextInFrame(msg.data.text, msg.data.node);
  }
  if (msg.type === "detectLanguage") {
    sendMessage({ content: getText(), type: 'detectLanguage' });
    
	}
  if (msg.type === "sendNotification") {
    figma.notify(msg.message, {
      timeout: 6000,
      button: {
        text: "Undo",
        action: () => {
          figma.triggerUndo();
          figma.notify("Undo action completed.");
        },
      },
    });
  }
  if (msg.type === "isFrameSelected") {
    const isFrameSelected = figma.currentPage.selection.length > 0;
    let isThereTextNode = false;

    const traverseChildren = (node: SceneNode) => {
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
        isThereTextNode,
      },
    });
  }

  if (msg.type === "getText") {
    figma.currentPage.selection.map((node) => {
      if (!node) {
        return;
      }

      const traverseChildren = (node: SceneNode) => {
        if (node.type === "TEXT") {
          sendMessage({
            type: "getText",
            node: node.id,
            content:
              node.type === "TEXT"
                ? node.characters
                : "Frame does not have text content",
          });
        }
        if ("children" in node) {
          node.children.forEach(traverseChildren);
        }
      };

      figma.currentPage.selection.forEach((node) => {
        traverseChildren(node);
      });
    });
  }
};
