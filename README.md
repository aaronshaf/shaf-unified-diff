## It's easy peasy

```html
<!-- Custom Elements v1 polyfill (2.7KB gzipped) -->
<script src="https://unpkg.com/@webcomponents/custom-elements@1.0.0-alpha.3"></script>
```

```html
<!-- our custom element's source (3.4KB gzipped) -->
<script src="https://unpkg.com/shaf-unified-diff@1.0.7"></script>
```

### Usage

```html
<shaf-unified-diff>
<pre>
diff -u originaldirectory/file1 updateddirectory/file1
--- originaldirectory/file1 2007-02-04 16:17:57.000000000 +0100
+++ updateddirectory/file1 2007-02-04 16:18:33.000000000 +0100
@@ -1 +1 @@
-This is the first original file.
+This is the first updated file.
</pre>
</shaf-unified-diff>
```

The diff still shows if JavaScript is turned off. Don't indent the contents since the `<pre>` tag assumes preformatted text.

## Dependencies

* [fast-diff](https://github.com/jhchen/fast-diff)
* [leven](https://github.com/sindresorhus/leven)
