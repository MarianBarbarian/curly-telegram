console.log('TEST JS');

function test() {
    console.log("Working!");
    $.ajax({
        url: 'http://localhost:8080/API/test',
        type: "GET",
        success: function (res) {
            console.log("Good to go");
        },

        error: function (error) {
            console.error("ERROR IN AJAX", error);
        }
    });
}

function temperatureConverter(valNum) {
    valNum = parseFloat(valNum);
    document.getElementById("outputCelsius").innerHTML = (valNum - 32) / 1.8;
}


function init() {
    console.log('Test page is ready');
    var btn = $("#btnTest");
    btn.click(test);
}


window.onload = init;