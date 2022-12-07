const SQUIGGLE = 0;
const MAYAN = 1;

function switchType(type) {
    var render = document.getElementById('render');
    var artType = document.createElement("script");
    artType.setAttribute("src", type);
    artType.setAttribute("id", "switch");
    render.replaceChild(artType, document.getElementById("switch"));
    clearCanvas();
}

function switchClass(type) {
    type = type;
    draw();
}