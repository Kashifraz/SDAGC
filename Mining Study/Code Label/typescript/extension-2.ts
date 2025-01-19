import * as vscode from 'vscode';
import { sendErrorToChatGPT } from "./httprequest";
import { getQueryFromChatGPT } from "./httprequest";

export async function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "programmingtool" is now active!');

    context.subscriptions.push(vscode.languages.registerCodeActionsProvider('*', new AssistedAIFixCodeActionProvider()));
	context.subscriptions.push(vscode.languages.registerCodeActionsProvider('*', new GoogleSearchCodeActionProvider()));


	// This part partially written by Copilot
	vscode.commands.registerCommand('extension.fixSyntaxError', async (lineNumber: number) => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let lineOfCode = editor.document.lineAt(lineNumber);
			let lineOfCodeText = lineOfCode.text;
			// The user has right clicked a highlighted syntax error on this line
			//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
			let diagnostics = vscode.languages.getDiagnostics(editor.document.uri).filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			//Crucial check
			if (diagnostics.length > 0) {
				// Display the line of code
				vscode.window.showInformationMessage('Fixing syntax error: ' + diagnostics[0].message);
				// Replace the line of code with the GPT-3 assisted fix
				let gptAssistedReturnString = await sendErrorToChatGPT(lineOfCodeText);
				let range = lineOfCode.range;
				let match = lineOfCodeText.match(/^\s*/);
				let indentation = match ? match[0] : "";
				if (gptAssistedReturnString !== "unmodified") {
					editor.edit(editBuilder => {
						editBuilder.replace(range, indentation + gptAssistedReturnString);
					});
				}
			}
		}
	});

	vscode.commands.registerCommand('extension.retrieveSearchQuery', async (lineNumber: number) => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let lineOfCode = editor.document.lineAt(lineNumber);
			let lineOfCodeText = lineOfCode.text;
			// The user has right clicked a highlighted syntax error on this line
			//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
			let diagnostics = vscode.languages.getDiagnostics(editor.document.uri).filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			//Crucial check
			if (diagnostics.length > 0) {
				// Display the line of code
				vscode.window.showInformationMessage('Retrieving search query: ' + diagnostics[0].message);
				// Replace the line of code with the GPT-3 assisted fix
				let gptAssistedReturnString = await getQueryFromChatGPT(diagnostics[0].message, lineOfCodeText);
				let text = encodeURI(gptAssistedReturnString);
				let url = "https://www.google.com/search?q=" + text;
				vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
			}
		}
	});
}

export class GoogleSearchCodeActionProvider implements vscode.CodeActionProvider {
	
	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
		let codeActions: vscode.CodeAction[] = [];
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let selection = editor.selection.active;
			let lineNumber = selection.line;
			let lineOfCodeText = editor.document.lineAt(lineNumber).text;
			// The user has right clicked a highlighted syntax error on this line
			//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
			let diagnostics = context.diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			//Crucial check
			if (diagnostics.length > 0) {
				// Display the line of code
				let codeAction = new vscode.CodeAction('Search for error fix: ' + diagnostics[0].message, vscode.CodeActionKind.QuickFix);
				codeAction.command = {
					title: 'Retrieve search query',
					command: 'extension.retrieveSearchQuery',
					arguments: [lineNumber]
				};
				
				codeActions.push(codeAction);
			}
		}
        return codeActions;
    }
}

export class AssistedAIFixCodeActionProvider implements vscode.CodeActionProvider {
	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];
   
	async provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): Promise<(vscode.Command | vscode.CodeAction)[] | null | undefined> {
		let codeActions: vscode.CodeAction[] = [];
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let selection = editor.selection.active;
			let lineNumber = selection.line;
			// The user has right clicked a highlighted syntax error on this line
			//Ensures that the diagnostics are on the same line as the cursor, therefore only one reference is needed
			let diagnostics = context.diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error && diagnostic.range.start.line === lineNumber);
			//Crucial check
			if (diagnostics.length > 0) {
				let codeAction = new vscode.CodeAction('Fix syntax error: ' + diagnostics[0].message, vscode.CodeActionKind.QuickFix);
				codeAction.command = {
					title: 'Fix syntax error',
					command: 'extension.fixSyntaxError',
					arguments: [lineNumber]
				};
				
				codeActions.push(codeAction);
			}
		}

        return codeActions;
    }
}

export function deactivate() {}