# test-switcher

Switch between implementation and test files with Ctrl+`.

# Features

This is a VS Code extension that allows you to quickly switch between an implementation file
and its related test file - and vice versa.

Supported languages:

- Elixir
- Ruby
- Typescript

This extension needs to guess the name of the test file, given the implementation file,
and vice versa.

For each language there is a default pair of regular-expression-based rules for the most common case.

If these do not match your project's requirements, you can override them - see below.

# Extension Settings

This extension contributes the following settings:

- `TestSwitcher.knownLanguages`: the list of languages that are handled by the extension,

For each language there is a further set of 4 settings:

- `TestSwitcher.${LANGAUGE}.implementationMatcher`: a regular expression (with captures) which matches implementation
  paths in the language,
- `TestSwitcher.${LANGAUGE}.implementationReplacer`: a replacement string (which uses the captures) to
  construct the path to the test file,
- `TestSwitcher.${LANGAUGE}.testMatcher`: a regular expression (with captures) which matches test
  paths in the language,
- `TestSwitcher.${LANGAUGE}.testReplacer`: a replacement string (which uses the captures) to
  construct the path to the implementation file.

Each of these sets of 4 settings provides a mapping between test and implementation files for a language.

In a project's root folder, you can create a directory `.vscode` with a `settings.json` file
with overrides of these settingsi (see below).

You can do the same in a VS Code project workspace file, in the `"settings"` section.

# Default Mapping Examples

| LanguageId | Implementation path      | Test path                       |
| ---------- | ------------------------ | ------------------------------- |
| typescript | foo/bar/example.ts       | foo/bar/test/example.test.ts    |
| elixir     | lib/foo/bar/my_module.ex | test/foo/bar/my_module_test.exs |
| ruby       | lib/foo/bar/my_class.rb  | test/foo/bar/my_class_test.rb   |

# Settings Override Example

## Typescript

If your project's test files are in the same folder as your implementation files,
you can do the following in `settings.json`:

```json
{
  "TestSwitcher.typescript.implementationMatcher": "(.*?)\\.ts$",
  "TestSwitcher.typescript.implementationReplacer": "$1.test.ts",
  "TestSwitcher.typescript.testMatcher": "(.*?).test\\.ts$",
  "TestSwitcher.typescript.testReplacer": "$1.ts"
}
```

# Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

# Release Notes

## 0.0.1

Initial release.
