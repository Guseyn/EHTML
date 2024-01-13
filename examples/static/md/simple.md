# It's simple markdown that is loaded via e-markdown element.

Let's use here **bold text** and *italic text*. Let's insert code below:

```html
<e-html>
  <e-markdown data-src="/../simple.md"></e-markdown>
</e-html>
```

Let's insert table below:

|Framework|Score|
|--- |--- |
|**EHTML**|10/10|

Let's insert todo list below:

 - [x] This task is done
 - [ ] This is still pending

Let's check code in JS:

```js
class A {
  constructor () {
    this.a = 'a'
  }
}
```

Let's try latex:
<br>

```latex
\displaystyle{f'(x) = \frac{df}{dx}=\lim\limits_{\Delta\to0}\frac{f(x + \Delta) - f(x)}{\Delta}}
```

Seems like it works!
