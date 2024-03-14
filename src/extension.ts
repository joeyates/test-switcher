import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const toggleCommand = vscode.commands.registerCommand(
    'extension.test-switcher.switch',
    () => {
      vscode.window.showInformationMessage('Test Switcher active!')
    }
  )

  context.subscriptions.push(toggleCommand)
}

export function deactivate() {}
