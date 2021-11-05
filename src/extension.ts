// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const jsSnippets = require("./snippets/snippets.json");

type Snippet = {
  body: Array<string> | string;
  description: string;
  prefix: Array<string> | string;
};

const convertSnippetArrayToString = (snippetArray: Array<string>): string =>
  snippetArray.join("\n");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const {
    commands: { registerCommand },
    window: { showQuickPick, activeTextEditor },
  } = vscode;

  const disposable = registerCommand("extension.ZSearch", async () => {
    const javascriptSnippets = Object.entries(jsSnippets as Array<Snippet>);
    const snippetsArray: Array<[string, Snippet]> = javascriptSnippets;

    const items = snippetsArray.map(
      ([shortDescription, { prefix, body, description }], index) => {
        const value = typeof prefix === "string" ? prefix : prefix[0];

        return {
          id: index,
          description: description || shortDescription,
          label: value,
          value,
          body,
        };
      }
    );

    const options = {
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: "Search snippet",
    };

    const snippet = (await showQuickPick(items, options)) || {
      body: "",
    };

    const body =
      typeof snippet.body === "string"
        ? snippet.body
        : convertSnippetArrayToString(snippet.body);

    if (activeTextEditor) {
      activeTextEditor.insertSnippet(new vscode.SnippetString(body));
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
