# flip-animation

A simple an small implementation of [Paul Lewis' Flip animation principle](https://aerotwist.com/blog/flip-your-animations/).

## Use it

    const flip = new Flip();
    flip.withClass(element, 'after-animation-css-class')
        .withTransition('500ms')
        .go()
        .then(() => console.log('Animation finished!'));

## API documentation

[Markdown](https://github.com/vguillou/flip-animation/blob/master/docs/api.md) or [Web](https://vguillou.github.io/flip-animation/docs/).

## Try it

Demos available [here](https://vguillou.github.io/flip-animation/examples/).

## Dependencies

None

## Run it and build it:

* (Recommended) Install Visual Studio Code
* (Recommended) Change the property "editor.tabSize" ("editor.tabSize": 2)
* (Recommended) Download extensions: 'esbenp.prettier-vscode' and 'tombonnike.vscode-status-bar-format-toggle'. Restart. On the bottom right (status bar), activate 'Formatting'
* Run 'npm install'
* Run 'npm run build' (or 'npm run build:prod')
* Run 'npm run dev' to serve the examples ([http://localhost:10002](http://localhost:10002))

## License

[MIT License](https://github.com/vguillou/flip-animation/blob/master/LICENSE)
