import {Switcher} from '../switcher'
import expect from 'expect.js'
import * as vscode from 'vscode'

suite('Switcher', () => {
  suite('isKnownLanguage', () => {
    suite('when the language is not known', () => {
      test('is false', () => {
        const switcher = new Switcher(
          'cobol',
          'path',
          vscode.workspace.getConfiguration('Test Switcher')
        )
        expect(switcher.isKnownLanguage()).to.not.be.ok()
      })
    })
  })

  suite('other', () => {
    suite('when the language is not known', () => {
      test('raises an error', () => {
        const switcher = new Switcher(
          'cobol',
          'path',
          vscode.workspace.getConfiguration('Test Switcher')
        )
        expect(() => switcher.other()).to.throwError(/cobol is not/)
      })
    })

    suite('with Elixir', () => {
      suite('when the path is an implementation file', () => {
        test('returns the test path', () => {
          const switcher = new Switcher(
            'elixir',
            '/home/user/foo/my_project/lib/some/path.ex',
            vscode.workspace.getConfiguration('Test Switcher')
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
            vscode.workspace.getConfiguration('Test Switcher')
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
            vscode.workspace.getConfiguration('Test Switcher')
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
            vscode.workspace.getConfiguration('Test Switcher')
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
            vscode.workspace.getConfiguration('Test Switcher')
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
            vscode.workspace.getConfiguration('Test Switcher')
          )
          expect(switcher.other()).to.equal(
            '/home/user/foo/my_project/lib/some/path.ts'
          )
        })
      })
    })
  })
})