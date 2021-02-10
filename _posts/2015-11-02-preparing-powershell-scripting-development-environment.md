---
title: Preparing Powershell Development Environment
date: 2015-11-02
category:
- articles
tags:
- conemu
- powershell
- psreadline
- windows

---

The Windows Powershell scripting language is a powerful advancement from older scripting language in Windows (Batch, VBScript). The language integrates features from other scripting languages (bash) and it is able to utilize existing (.Net) libraries.\
A big difference between other scripting languages and Powershell is that it is fully object-based and not text-based. Therefore it is important to keep in mind that what you might see as output on your screen is only a representation of the object, but not the object itself.\
In this post I will explain the basic steps to set up a "sane" working environment, which allows you similar experience as a Bash shell with TMUX.

In specific I will discuss the following tools/modules:

* ConEmu
* Environment Settings
* Powershell Profile
* Using Modules
* PSGet / NuGet
* PSReadline

# ConEmu

[ConEmu]("https://conemu.github.io/") is a console emulator with tabs and panes.\
It is able to provide a similar management experience as [Tmux]("https://tmux.github.io/") on Linux.

For usage with Powershell I use the following settings in ConEmu:

* Startup
  * `"Specified named task" = {Shells::Powershell}`
  * Tasks > `"5 {Shells::Powershell}" = "C:\Windows\System32\WindowsPowershell\v1.0\powershell.exe -new_console:d:C:\gitrepo\powershell"`
  * Environment > `"Set up environment variables" = "set HOME=C:\gitrepo\powershell"`
* Features
  * `Colors = <xterm>`
* Keys &amp; Macro
  * create new split /vertical /horizontal
  * new tab
  * zoom
  * switch windows

The above settings ensure that any new shell is spawned from the directory containing my Powershell scripts and also allows to run scripts directly from this path.

# Environment Settings

Only one environment variable should be set for Powershell, namely the "PSModulePath" variable. This variable allows the usage of modules (and functions within these modules) straight from any Powershell CLI, it doesn't matter whether it is the powershell.exe, the Powershell ISE, or a custom execution from a different path.

To set the variable go the following:

```powershell
# get current path
$curpath = [Environment]::GetEnvironmentVariable("PSModulePath")
# update path with new path
[Environment]::SetEnvironmentVariable( "PSModulePath", "C:\gitrepo\powershell\modules;" + $curpath)
# check if settings were updated correctly
get-childitem env:psmodulepath
```
Source: [MS TechNet]("https://technet.microsoft.com/en-us/library/dd878326(v=vs.85).aspx")

# Powershell Profile

Powershell also allows you to specify a set of commands which will be run before spawning a new shell. This is convenient for pre-loading modules, setting aliases and setting the path.

The powershell powerfile can be set up by creating a new textfile in the following location:

```powershell
# $HOME\Documents\WindowsPowerShell\Microsoft.Powershell_profile.ps1
# powershell profile

#set path
$env:Path = "C:\gitrepo\powershell"

# import modules
import-module psreadline

# set aliases
set-alias vim 'C:\Program Files (x86)\Vim\Vim74\vim.exe'

# To edit the Powershell Profile
Function Edit-Profile {
    vim $profile
}
# To edit Vim settings
Function Edit-Vimrc {
    vim D:\powershell\_vimrc
}
```

Besides some convenient shortcuts, the most important module I load here is the PSReadline module.

# Using Modules

Powershell modules allow you to reuse existing code of yourself and others.\
Modules are basically plain powershell scripts without any directly executed statements, but merely (groups of) functions. Also the extension ends with .psm1 instead of .ps1 .

Powershell modules can also contain some documentation and things like author and license however this is not required.

To be able to use modules the PSModulePath needs to be set and your modules should be available in this path.

Alternatively, from Powershell 4, the following path is <a href="https://technet.microsoft.com/en-us/library/dd878350(v=vs.85).aspx" target="_blank" rel="noopener noreferrer">added by default</a>, which can be used for global modules:

```powershell
$EnvProgramFiles\WindowsPowerShell\Modules\
```

# PSGet

PSGet is a module and repository of useful powershell modules, a.o. the PSReadline module, to install it follow the instructions <a href="http://psget.net/" target="_blank" rel="noopener noreferrer">on the site</a>


# PSReadline

PSReadline enables readline support for Powershell terminals. The features are a.o.
* enhanced tab completion
* history
* history search (Ctrl+r)
* command line editing

See also Scripting Guy's blog at: [http://blogs.technet.com/b/heyscriptingguy/archive/2014/06/17/a-better-powershell-command-line-edit.aspx](http://blogs.technet.com/b/heyscriptingguy/archive/2014/06/17/a-better-powershell-command-line-edit.aspx)

To install PSReadline, first install PSGet, then execute the following command in your environment:

```powershell
# install psreadline with psget
install-module PsReadLine
```

