Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

$git = 'C:\Program Files\Git\cmd\git.exe'
$env:GIT_AUTHOR_NAME = 'Yina-programmer'
$env:GIT_AUTHOR_EMAIL = '188508415+Yina-programmer@users.noreply.github.com'
$env:GIT_COMMITTER_NAME = $env:GIT_AUTHOR_NAME
$env:GIT_COMMITTER_EMAIL = $env:GIT_AUTHOR_EMAIL

& $git add CONTRIBUTORS.md .githooks/commit-msg
& $git config core.hooksPath .githooks

$tree = & $git write-tree
$parent = & $git rev-parse HEAD
$new = & $git commit-tree $tree -p $parent -m 'chore: atribucion del repositorio solo a Yina-programmer'
& $git reset --hard $new
& $git push origin main
& $git log -1 --format='%an <%ae> - %s'
