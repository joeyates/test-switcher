# test-switcher

Switch between implementation and test files.

# Features

This is a VS Code extension that allows you to quickly switch between an implementation file
and its related test file - and vice versa.

Supported languages:

* Elixir
* Ruby
* Typescript

This extension needs to guess the name of the test file, given the implementation file,
and vice versa.

For each language there is a default pair of regular-expression-based rules for the most common case.

If these do not match your project's requirements, you can override them - see below.

# Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

# Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

# Release Notes

## 0.0.1

Initial release.