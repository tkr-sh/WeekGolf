# Docker
## Table of content
<!-- vim-markdown-toc GFM -->

* [Introduction](#introduction)
* [Files and directories](#files-and-directories)
    * [Languages](#languages)
    * [languages.json](#languagesjson)
    * [build.sh](#buildsh)
    * [launchvm.sh](#launchvmsh)
    * [test.sh](#testsh)

<!-- vim-markdown-toc -->

## Introduction
This directory is run on a server.<br/>
Each directory with a name of a programming language has this kind of structure
```
language_name
├── Dockerfile
└── launch.sh

1 directory, 2 files
```
Which will correspond to a Docker image.

## Files and directories
### Languages
As said before:
> Each directory with a name of a programming language has this kind of structure
> ```
> language_name
> ├── Dockerfile
> └── launch.sh
> 
> 1 directory, 2 files
> ```
- **Dockerfile**: The Dockerfile will therefore be for the docker image of the language
- **launch.sh**: The launch.sh file is the file to launch every test case

There is an exception with *Sass* that has an extra file (`function.scss`), which is here to add extra function to Sass.

### languages.json
This file contains informations about each programming language in a single file.<br/>
Therefore, we don't need to make multiple `build.sh` file.


In theory, we could also make only one `launch.sh`, but some languages have very unique `launch.sh` (sass, node, csharp/fsharp). So it's a better idea to just create multiple `launch.sh` for every language.

### build.sh
The file that build Dockerfiles.<br/>
It uses `languages.json` to get the extension of every language.

### launchvm.sh
The file that creates Docker container to run the programs.

### test.sh
The file that test a specific language.<br/>
The program for the test is in `languages.json`.
