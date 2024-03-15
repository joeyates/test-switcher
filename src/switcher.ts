'use strict'

import * as vscode from 'vscode'

enum FileCategory {
  Implementation,
  Test,
  Other
}

class Switcher {
  /**
   * The language of the file
   */
  languageId: string
  /**
   * The path to an implementation or test file
   */
  path: string
  /**
   * The VS Code workspace configuration
   */
  #configuration: vscode.WorkspaceConfiguration

  constructor(languageId: string, path: string, configuration: vscode.WorkspaceConfiguration) {
    this.languageId = languageId
    this.path = path
    this.#configuration = configuration
  }

  isKnownLanguage(): Boolean {
    return this.knownLanguages.includes(this.languageId)
  }

  other(): string | null {
    if (!this.isKnownLanguage()) {
      throw new Error(`${this.languageId} is not one of this extension's known languages: ${this.knownLanguages.join(', ')}`)
    }
    const category = this.category()
    switch (category) {
      case FileCategory.Implementation:
        return this.toTest()
      case FileCategory.Test:
        return this.toImplementation()
      case FileCategory.Other:
        return null
    }
  }

  private category(): FileCategory {
    // Check for test regex first as it will always be more specific
    if (this.isTest()) {
      return FileCategory.Test
    }
    if (this.isImplementation()) {
      return FileCategory.Implementation
    }
    return FileCategory.Other
  }

  private isImplementation(): Boolean {
    return this.implementationMatcher.test(this.path)
  }

  private isTest(): Boolean {
    return this.testMatcher.test(this.path)
  }

  protected toImplementation(): string {
    return this.path.replace(this.testMatcher, this.testReplacer)
  }

  protected toTest(): string {
    return this.path.replace(
      this.implementationMatcher,
      this.implementationReplacer
    )
  }

  get knownLanguages(): string[] {
    const config = this.configuration('knownLanguages') as string[] | undefined
    return config ? config : []
  }

  private get implementationMatcher(): RegExp {
    const match = this.configuration(`${this.languageId}.implementationMatcher`)
    if (!match) {
      throw new Error('No implementation matcher found')
    }
    return new RegExp(match)
  }

  private get implementationReplacer(): string {
    const replacement = this.configuration(
      `${this.languageId}.implementationReplacer`
    )
    if (!replacement) {
      throw new Error('No implementation replacer found')
    }
    return replacement
  }

  private get testMatcher(): RegExp {
    const match = this.configuration(`${this.languageId}.testMatcher`)
    if (!match) {
      throw new Error('No test matcher found')
    }
    return new RegExp(match)
  }

  private get testReplacer(): string {
    const replacement = this.configuration(`${this.languageId}.testReplacer`)
    if (!replacement) {
      throw new Error('No test replacer found')
    }
    return replacement
  }

  private configuration(section: string): string | undefined {
    return this.#configuration.get(section)
  }
}

const openFile = (targetFile: string) => {
  return vscode.workspace.openTextDocument(targetFile).then(
    document => {
      vscode.window.showTextDocument(document).then(
        () =>
          vscode.commands.executeCommand(
            'workbench.action.keepEditor',
            document.uri
          ),
        () => vscode.window.showErrorMessage('Failed to show document')
      )
    },
    () =>
      vscode.window.showErrorMessage(
        `Target file ${targetFile} does not seem to exist.`
      )
  )
}

const createFile = (targetFile: string) => {
  vscode.workspace.fs
    .writeFile(vscode.Uri.file(targetFile), new Uint8Array())
    .then(
      () => openFile(targetFile),
      () =>
        vscode.window.showErrorMessage(`Could not create file ${targetFile}.`)
    )
}

const openOrCreateFile = (targetFile: string) => {
  vscode.workspace.fs.stat(vscode.Uri.file(targetFile)).then(
    () => openFile(targetFile),
    () => createFile(targetFile)
  )
}

export function switchBetweenImplementationAndTest() {
  const activeEditor = vscode.window.activeTextEditor

  if (!activeEditor) {
    return vscode.window.showErrorMessage(
      'No file selected. Select either a code file or a test file.'
    )
  }
  const languageId: string = activeEditor.document.languageId
  const currentFile: string = activeEditor.document.fileName
  const switcher = new Switcher(languageId, currentFile, vscode.workspace.getConfiguration('Test Switcher'))

  if (!switcher.isKnownLanguage()) {
    vscode.window.showErrorMessage(
      `Can't toggle between implementation and test files in this language.
        The current file is a ${languageId} file.
        Known languages: ${switcher.knownLanguages.join(', ')}`
    )
  }
  const targetFile = switcher.other()
  if (!targetFile) {
    return vscode.window.showErrorMessage(
      `The selected file is neither an implementation nor a test file in ${languageId}.`
    )
  }

  return openOrCreateFile(targetFile)
}

export {Switcher}
