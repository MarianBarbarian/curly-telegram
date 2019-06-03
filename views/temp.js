function convert() {
    var f = $("#txtF").val();
    console.log("Converts to:", f);

    $.ajax({
        url: 'http://localhost:8080/API/temp',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({value: f}),
        success: function (res) {
            console.log("Server response:", res);
            $("#txtC").val(res.result);

        },
        error: function (error) {
            console.error("Error on AJAX", error);
        }
    })

}

function init() {
    $("#btnDo").click(convert);
}


window.onload = init;