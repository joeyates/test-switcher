import {Switcher} from '../switcher'
import expect from 'expect.js'
import * as vscode from 'vscode'

type Overrides = {[key: string]: any}

class ConfigurationMock {
  #configuration: vscode.WorkspaceConfiguration
  #overrides: Overrides

  constructor({
    overrides,
    configuration
  }: {
    overrides: Overrides
    configuration: vscode.WorkspaceConfiguration
  }) {
    this.#overrides = overrides
    this.#configuration = configuration
  }

  get(section: string, defaultValue?: any) {
    if (this.#overrides[section]) {
      return this.#overrides[section]
    }
    return this.#configuration.get(section, defaultValue)
  }
}


const override = (overrides: Overrides) => {
  return new ConfigurationMock({
    configuration: configuration(),
    overrides
  }) as unknown as vscode.WorkspaceConfiguration
}

const configuration = () => vscode.workspace.getConfiguration('TestSwitcher')

suite('Switcher', () => {
  suite('isKnownLanguage', () => {
    suite('when the language is not known', () => {
      test('is false', () => {
        const switcher = new Switcher('cobol', 'path', configuration())
        expect(switcher.isKnownLanguage()).to.not.be.ok()
      })
    })

    suite('with configuration overriddes', () => {
      test('are used', () => {
        const switcher = new Switcher(
          'cobol',
          'path',
          override({knownLanguages: ['cobol']})
        )
        expect(switcher.isKnownLanguage()).to.be.ok()
      })
    })
  })

  suite('other', () => {
    suite('when the language is not known', () => {
      test('raises an error', () => {
        const switcher = new Switcher('cobol', 'path', configuration())
        expect(() => switcher.other()).to.throwError(/cobol is not/)
      })
    })

    suite('with Elixir', () => {
      suite('when the path is an implementation file', () => {
        test('returns the test path', () => {
          const switcher = new Switcher(
            'elixir',
            '/home/user/foo/my_project/lib/some/path.ex',
            configuration()
          )
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/test/some/path_test.exs'
          )
        })
      })

      suite('when the path is a test file', () => {
        test('returns the implementation path', () => {
          const switcher = new Switcher(
            'elixir',
            '/home/user/foo/my_project/test/some/path_test.exs',
            configuration()
          )
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/path.ex'
          )
        })
      })
    })

    suite('with Ruby', () => {
      suite('when the path is an implementation file', () => {
        test('returns the test path', () => {
          const switcher = new Switcher(
            'ruby',
            '/home/user/foo/my_project/lib/some/path.rb',
            configuration()
          )
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/test/some/path_test.rb'
          )
        })
      })

      suite('when the path is a test file', () => {
        test('returns the implementation path', () => {
          const switcher = new Switcher(
            'ruby',
            '/home/user/foo/my_project/test/some/path_test.rb',
            configuration()
          )
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/path.rb'
          )
        })
      })
    })

    suite('with Typescript', () => {
      suite('when the path is an implementation file', () => {
        test('returns the test path', () => {
          const switcher = new Switcher(
            'typescript',
            '/home/user/foo/my_project/lib/some/path.ts',
            configuration()
          )
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/test/path.test.ts'
          )
        })
      })

      suite('when the path is a test file', () => {
        test('returns the implementation path', () => {
          const switcher = new Switcher(
            'typescript',
            '/home/user/foo/my_project/lib/some/test/path.test.ts',
            configuration()
          )
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/path.ts'
          )
        })
      })
    })
  })
})
