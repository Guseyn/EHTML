<img src="https://raw.githubusercontent.com/Guseyn/logos/master/ehtml.svg?sanitize=true">

**EHTML (or Extended HTML)** can be described as a set of custom elements that you can put on an HTML page for different purposes and use cases. The main idea and goal of this library is to provide convinient way to get rid of all your JavaScript code on the client side.

# Contents

- [Motivation](#motivation)
- [Usage](#usage)
- [Supported elements](#supported-elements)

# Motivation

Every moment a new JavaScript framework borns here and there, and each of them claims that it's better than other ones for different irrelevant and stupid reasons. The main problem with all those frameworks is JavaScript. And I like this language very much, but it's painful to maintain. Mostly because it's difficult(or even impossible) to make it completely declarative on the client side. On the other hand, HTML is a completely declarative language, it's easy to read and modify. So, why don't we try to replace JavaScript with HTML where it's possible (or just everywhere).

Thanks to HTML5 it's possible for relevant browsers. Read further and you'll see how you can do it.

# Usage

**EHTML** is very easy to include in your project. Just like jQuery, but all you need to do then is just to write HTML code, not JavaScript. Save [this file](https://github.com/Guseyn/EHTML/blob/master/ehtml.bundle.min.js) locally and use it:

```html
<head>
  <script src="/../js/ehtml.bundle.min.js" type="text/javascript"></script>
</head>
```

# Supported elements

<details>
  <summary><b>E-HTML</b></summary>

  Sometimes html files can be very big, so why not just split them into different smaller html files and put sort of links to them in the main html file? `e-html.html` allows you to do that, introducing a module system in HTML.

  So, let's say we have main `articles.html` file

  ```html
    <!-- /../html/articles.html -->
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">

      <head>
        <link rel="shortcut icon" href="/../images/favicon.ico"/>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>e-html</title>
        <link rel="stylesheet" href="/../css/main.css">
        <script src="/../js/ehtml.bundle.min.js" type="text/javascript"></script>
      </head>

      <body class="main">
        <div class="articles">

          <e-html data-src="/../html/first.html"></e-html>
          <e-html data-src="/../html/second.html"></e-html>
          <e-html data-src="/../html/third.html"></e-html>
          <e-html data-src="/../html/fourth.html"></e-html>
          <e-html data-src="/../html/fifth.html"></e-html>
          <e-html data-src="/../html/sixth.html"></e-html>

        </div>
      </body>

    </html>
  ```

  and as you can see, we have 6 `e-html` tags there. And each of them refers to some html file which contains some part of the `article.hmtl`. This tag has only one custom attribute `data-src`, which tells us where exactly the file that we want to include is served.

  And for example, `first.html` would look something like this

  ```html
    <div class="article">
      <!-- some content -->
    </div>
  ```

  And when you open `articles.html` in a browser, it will be rendered as if you included all the parts in one file:

  ```html
    <!-- /../html/articles.html -->
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">

      <head>
        <link rel="shortcut icon" href="/../images/favicon.ico"/>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>e-html</title>
        <link rel="stylesheet" href="/../css/main.css">
        <script src="/../js/ehtml.bundle.min.js" type="text/javascript"></script>
      </head>

      <body class="main">
        <div class="articles">

          <div class="article">
            <!-- content of the first article -->
          </div>
          <div class="article">
            <!-- content of the second article -->
          </div>
          <div class="article">
            <!-- content of the third article -->
          </div>
          <div class="article">
            <!-- content of the fourth article -->
          </div>
          <div class="article">
            <!-- content of the fith article -->
          </div>
          <div class="article">
            <!-- content of the sixth article -->
          </div>

        </div>
      </body>

    </html>
  ```

  The main benefit of using this element is that you can much more easily modify your big html files. So, instead of having on big html file where you have to find a specific part of it to modify, you can just find a file, which contains this specific part and do changes there.

  Of course, this element make an additional http(s) request for fetching a specific part, but you can always cache the files, so it would not cause performance issues.
</details>
