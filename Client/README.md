# Client
## Table of content

<!-- vim-markdown-toc GFM -->

* [Introduction](#introduction)
* [Directories](#directories)
  * [<img src="../assets/folder-images.svg" style="height: 30px; display: inline; transform: translateY(5px)"> assets](#img-srcassetsfolder-imagessvg-styleheight-30px-display-inline-transform-translatey5px-assets)
    * [icons](#icons)
    * [imgs](#imgs)
    * [Other](#other)
  * [<img src="../assets/folder-components.svg" style="height: 30px; display: inline; transform: translateY(5px)"> components](#img-srcassetsfolder-componentssvg-styleheight-30px-display-inline-transform-translatey5px-components)
  * [<img src="../assets/folder-json.svg" style="height: 30px; display: inline; transform: translateY(5px)"> data](#img-srcassetsfolder-jsonsvg-styleheight-30px-display-inline-transform-translatey5px-data)
  * [<img src="../assets/folder-font.svg" style="height: 30px; display: inline; transform: translateY(5px)"> fonts](#img-srcassetsfolder-fontsvg-styleheight-30px-display-inline-transform-translatey5px-fonts)
  * [<img src="../assets/folder-hook.svg" style="height: 30px; display: inline; transform: translateY(5px)"> hooks](#img-srcassetsfolder-hooksvg-styleheight-30px-display-inline-transform-translatey5px-hooks)
  * [<img src="../assets/folder-layout.svg" style="height: 30px; display: inline; transform: translateY(5px)"> layout](#img-srcassetsfolder-layoutsvg-styleheight-30px-display-inline-transform-translatey5px-layout)
  * [<img src="../assets/folder-views.svg" style="height: 30px; display: inline; transform: translateY(5px)"> pages](#img-srcassetsfolder-viewssvg-styleheight-30px-display-inline-transform-translatey5px-pages)
  * [<img src="../assets/folder-python.svg" style="height: 30px; display: inline; transform: translateY(5px)"> python](#img-srcassetsfolder-pythonsvg-styleheight-30px-display-inline-transform-translatey5px-python)
  * [<img src="../assets/folder-sass.svg" style="height: 30px; display: inline; transform: translateY(5px)"> style](#img-srcassetsfolder-sasssvg-styleheight-30px-display-inline-transform-translatey5px-style)
  * [<img src="../assets/folder-utils.svg" style="height: 30px; display: inline; transform: translateY(5px)"> utils](#img-srcassetsfolder-utilssvg-styleheight-30px-display-inline-transform-translatey5px-utils)
* [How to test ?](#how-to-test-)

<!-- vim-markdown-toc -->

## Introduction
- The front-end is written in [TypeScript](https://www.typescriptlang.org/).<br/>
- The framework used is [Solid.JS](https://www.solidjs.com).<br/>
- The meta language used to style the page is [Sass](https://sass-lang.com).<br/>
- The application is bundled with [Webpack](https://webpack.js.org/).<br/>
- The environment of the application is [Vite](https://vitejs.dev/).<br/>

## Directories
### <img src="../assets/folder-images.svg" style="height: 30px; display: inline; transform: translateY(5px)"> assets
The directory in which there are the assets of WeekGolf
#### icons
Files ending in `.svg`
#### imgs
Files ending in `.jpe?g`, `.png`, `.webp`
#### Other
All the other files are some files that are also images but that are specific images

### <img src="../assets/folder-components.svg" style="height: 30px; display: inline; transform: translateY(5px)"> components
In this directory there are files in `.tsx` that represents a component.<br/>
A component is a piece of code that does a specific task.<br/>
For example a Toggle switch On/Off can be a component.

### <img src="../assets/folder-json.svg" style="height: 30px; display: inline; transform: translateY(5px)"> data
In this directory, the majority of the files are in `.json`.<br/>
This directory is mainly used to store data that will be reused later by components.

### <img src="../assets/folder-font.svg" style="height: 30px; display: inline; transform: translateY(5px)"> fonts
In this directory, there are all the fonts (files ending in `.ttf`) used by WeekGolf.

### <img src="../assets/folder-hook.svg" style="height: 30px; display: inline; transform: translateY(5px)"> hooks
In this directory there are files in `.tsx?` that represents a hook.<br/>
A hook is a tool used in website design to allow the webpage to be interactive and dynamic.<br/>
It enables certain parts of the webpage to be identified and manipulated, which can change how the page looks or behaves.<br/>
It works like a hook in fishing, where a fisherman catches fish by using a hook.<br/>
Similarly, a hook "catches" certain parts of a webpage and allows them to be changed.

### <img src="../assets/folder-layout.svg" style="height: 30px; display: inline; transform: translateY(5px)"> layout
In this directory there are files in `.tsx` that represents a layout-component.<br/>
layout-components are defined as a component that is used for the layout, like a navbar, a header or a footer for example.

### <img src="../assets/folder-views.svg" style="height: 30px; display: inline; transform: translateY(5px)"> pages
In this directory there are files in `.tsx` that represents a page in WeekGolf.<br/>

### <img src="../assets/folder-python.svg" style="height: 30px; display: inline; transform: translateY(5px)"> python
In this directory there are files in `.py` that are some short python scripts.<br/>
It's useful for creating separate small scripts that are still related to the project

### <img src="../assets/folder-sass.svg" style="height: 30px; display: inline; transform: translateY(5px)"> style
In this directory there are files in `.scss` that are just stylesheets written in sass.

### <img src="../assets/folder-utils.svg" style="height: 30px; display: inline; transform: translateY(5px)"> utils
In this directory there are files in `.tsx?` that are useful functions that are going to be used in components.

## How to test ?
Here is the list of commands that you can do on a Unix system to test the code on local:
```sh
git clone https://github.com/aderepas/WeekGolf
cd WeekGolf/Client
npm i
npm start
```
