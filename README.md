# flip-animation

A simple an small (3ko) implementation of <a href="https://aerotwist.com/blog/flip-your-animations/">Paul Lewis' Flip animation principle</a>.

## Use it

    const flip = new Flip();
    flip.withClass(element, 'after-animation-css-class')
        .withTransition('500ms')
        .go()
        .then(() => console.log('Animation finished!'));

## Try it

Demos available <a href="https://vguillou.github.io/flip-animation/examples/">here</a>.

## Dependencies

None

## Run it and build it:

* (Recommended) Install Visual Studio Code
* (Recommended) Change the property "editor.tabSize" ("editor.tabSize": 2)
* (Recommended) Download extensions: 'esbenp.prettier-vscode' and 'tombonnike.vscode-status-bar-format-toggle'. Restart. On the bottom right (status bar), activate 'Formatting'
* Run 'npm install'
* Run 'npm run build'
* Run 'npm run dev' to serve the examples (<a href="http://localhost:10002">http://localhost:10002</a>)

## License

[MIT License](https://github.com/vguillou/flip-animation/blob/master/LICENSE.md)
