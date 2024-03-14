import * as vscode from 'vscode'
import * as switcher from './switcher'

export function activate(context: vscode.ExtensionContext) {
  const toggleCommand = vscode.commands.registerCommand(
    'extension.test-switcher.switch',
    () => switcher.switchBetweenImplementationAndTest()
  )

  context.subscriptions.push(toggleCommand)
}

export function deactivate() {}
