# Typescript JS NComps NPM module


# To Do

1. Minification of code

2. Development of whole app

3. Figure out some css/html packing, perhaps already in the `bundled.js` file.

# BUILD

1. go to `repo_root` 

2. and `npm run build`

3. This will create the distribution files in `dist/`

4. Now you just need to use it as an NPM Module (check [NPM Module](###-NPM-Module) section)

5. If you want to import the bundled version, use file `/dist/ncomps.bundle.js` and copy it to your `site/assets/javascript` files. Then import as is explained in the [How does it work?](##-How-does-it-work?) section under [Bundled](###-Bundled)



## How does it work?

It can be bundled or used as a module
KEEP REEDING: http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/

### Bundled:

1. Import `<script src="ncomps.bundle.js" type="text/javascript" charset="utf-8" async defer></script>`

2. Now you can use `NComps` module on your code as is present on `window` global.

3. Add the following:

```html
<script src="./scripts/vendor/ncomps.bundle.js"></script>
<script>
	NComps.init(element, mode);
</script>
```

### NPM Module:

1. todo




## Many Thanks to:
Courtesy of 

https://www.tsmean.com/articles/how-to-write-a-typescript-library/ 

and

https://stackoverflow.com/questions/37430055/typescript-attach-module-namespaces-to-window

CSS Modules as SCSS in React Apps
https://medium.com/@kswanie21/css-modules-sass-in-create-react-app-37c3152de9