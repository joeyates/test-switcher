import {Switcher} from '../switcher'
import expect from 'expect.js'
import * as vscode from 'vscode'
import {before, beforeEach, it} from 'mocha'

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
    configuration: getConfiguration(),
    overrides
  }) as unknown as vscode.WorkspaceConfiguration
}

const getConfiguration = () => vscode.workspace.getConfiguration('TestSwitcher')

suite('Switcher', () => {
  suite('isKnownLanguage', () => {
    suite('when the language is not known', () => {
      it('is false', () => {
        const switcher = new Switcher('cobol', 'path', getConfiguration())
        expect(switcher.isKnownLanguage()).to.not.be.ok()
      })
    })

    suite('with configuration overriddes', () => {
      it('uses the configuration', () => {
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
    let languageId: string
    let path: string
    let configuration: any = getConfiguration()
    let switcher: Switcher

    beforeEach(() => {
      switcher = new Switcher(languageId, path, configuration)
    })

    suite('when the language is not known', () => {
      before(() => {
        languageId = 'cobol'
      })
      it('raises an error', () => {
        expect(() => switcher.other()).to.throwError(/cobol is not/)
      })
    })

    suite('with Elixir', () => {
      before(() => {
        languageId = 'elixir'
      })

      suite('when the path is an implementation file', () => {
        before(() => {
          path = '/home/user/foo/my_project/lib/some/path.ex'
        })

        it('returns the test path', () => {
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/test/some/path_test.exs'
          )
        })
      })

      suite('when the path is a test file', () => {
        before(() => {
          path = '/home/user/foo/my_project/test/some/path_test.exs'
        })

        it('returns the implementation path', () => {
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/path.ex'
          )
        })
      })
    })

    suite('with Ruby', () => {
      before(() => {
        languageId = 'ruby'
      })

      suite('when the path is an implementation file', () => {
        before(() => {
          path = '/home/user/foo/my_project/lib/some/path.rb'
        })

        it('returns the test path', () => {
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/test/some/path_test.rb'
          )
        })
      })

      suite('when the path is a test file', () => {
        before(() => {
          path = '/home/user/foo/my_project/test/some/path_test.rb'
        })

        it('returns the implementation path', () => {
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/path.rb'
          )
        })
      })
    })

    suite('with Typescript', () => {
      before(() => {
        languageId = 'typescript'
      })

      suite('when the path is an implementation file', () => {
        before(() => {
          path = '/home/user/foo/my_project/lib/some/path.ts'
        })

        it('returns the test path', () => {
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/test/path.test.ts'
          )
        })
      })

      suite('when the path is a test file', () => {
        before(() => {
          path = '/home/user/foo/my_project/lib/some/test/path.test.ts'
        })

        it('returns the implementation path', () => {
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/path.ts'
          )
        })
      })
    })

    suite('with configuration overriddes', () => {
      const overrides = {
        knownLanguages: ['perl'],
        'perl.implementationMatcher': 'implementation path',
        'perl.implementationReplacer': 'test path',
        'perl.testMatcher': 'test path',
        'perl.testReplacer': 'implementation path'
      }

      before(() => {
        languageId = 'perl'
        configuration = override(overrides)
      })

      suite('when the path is an implementation file', () => {
        before(() => {
          path = 'implementation path'
        })

        it('returns the test path', () => {
          expect(switcher.other()).to.be.equal('test path')
        })
      })

      suite('when the path is a test file', () => {
        before(() => {
          path = 'test path'
        })

        it('returns the implementation path', () => {
          expect(switcher.other()).to.be.equal('implementation path')
        })
      })
    })
  })
})
