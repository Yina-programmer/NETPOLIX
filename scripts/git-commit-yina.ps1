# Crear commit solo como Yina-programmer (sin trailer de Cursor)
param(
  [Parameter(Mandatory = $true)]
  [string]$Message
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

$git = 'C:\Program Files\Git\cmd\git.exe'
$env:GIT_AUTHOR_NAME = 'Yina-programmer'
$env:GIT_AUTHOR_EMAIL = '188508415+Yina-programmer@users.noreply.github.com'
$env:GIT_COMMITTER_NAME = $env:GIT_AUTHOR_NAME
$env:GIT_COMMITTER_EMAIL = $env:GIT_AUTHOR_EMAIL

& $git add -A
$tree = & $git write-tree
$parent = & $git rev-parse HEAD
$new = & $git commit-tree $tree -p $parent -m $Message
& $git reset --hard $new
Write-Host "Commit: $new"
& $git log -1 --format='%an <%ae> - %s'
