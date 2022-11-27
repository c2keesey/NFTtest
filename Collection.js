let gen_arr;

function saveArt(img) {
    var div = document.createElement('div');
    document.getElementById('collection').appendChild(div);
    var saved_img = document.createElement('script');
    div.appendChild(saved_img);
    saved_img.innerHTML = image(img);
}
