// variable with name
var name = "Marian1";
var todoList = []; // <- store the todo elements here
var serverURL = 'http://127.0.0.1:8080';


// function with parameter
function hello(text) {
    console.log("text");
}

function init() {
    //javascript
    // control: label
    // DOM manipulation
    var lbl = document.getElementById("lblTodo");
    lbl.innerText = "JS!";

    /* catch the click event using JS */

    // get a reference to the button 
    var btn = document.getElementById("btnSave");
    // asing the function for the click event 
    btn.onclick = saveToDo; // <- pass the name, don't execute function
}

//Jquery
function init2() {
    var lbl = $("#lblTodo");
    lbl.innerText = "JQUERY";

    $("#btnSave").click(saveTodo);

    getDataFromServer();
}

function saveTodo() {
    var txt = $("#txtTodo");
    console.log(txt);
    var todoText = txt.val();

    if (todoText.length < 1) {
        // no text
        txt.addClass('error');
    } else {
        // ALL GOOD!!
        // remove error
        txt.removeClass('error');
        // save the todo item
        // todoList.push(todoText);
        // clean the field
        txt.val('');

        sendToServer(todoText);
    }
}

// else remove the error class, 
// save the ToDo text

function sendToServer(text) {
    var priority = $("#selPriority").val();

    var todoItem = {
        text: text,
        user: "Marian",
        priority: priority,
        status: 0
    };

    console.log("Started server communication");
    $.ajax({
        url: serverURL + "/API/todo",
        type: "POST",
        data: JSON.stringify(todoItem),
        contentType: "application/json",
        success: function (res) {
            console.log("Server says: ", res);
            res.id=res._id;
            todoList.push(res);
            displayTodo(res.text, res._id);
        },
        error: function (error) {
            console.error("*ERROR*", error);
        }
    });
}

function getDataFromServer() {

    $.ajax({
        url: serverURL + "/API/todo",
        type: "GET",
        success: function (res) {
            console.log("Server response", res);

            for (var i = 0; i < res.length; i++) {
                var item = res[i];
                item.id = item._id;
                if (item.user == "Marian") {
                    todoList.push(item);

                    if (item.status && item.status == 1) {
                        displayDone(item.text, item.id);
                    } else {
                        displayTodo(item.text, item.id);
                    }
                }
            }

        },
        error: function (error) {
            console.error("*ERROR*", error);
        }

    });
}


function displayTodo(simpleText, id) {
    // get the ul
    var ul = $("#todoList");
    // create an li element
    var li = "<li id='" + id + "' class='list-group-item'>" + simpleText +
        " <button class='btn btn-sm btn-info btn-done' onclick=markDone('" + id + "');> Done </button> </li>";
    // add the li to the ul
    ul.append(li);
}

function displayDone(simpleText, id) {
    var ul = $("#doneList");
    var li = "<li id='" + id + "' class='list-group-item done-item'>" + simpleText +
        " <button class='btn btn-sm btn-info btn-done' onclick=deleteTodo('" + id + "');> Delete </button> </li>";
    ul.append(li);
}

function markDone(id) {
    console.log("done:", id);
    // find the object with the id 
    var theItem;
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].id == id) {
            // found it
            theItem = todoList[i];
            break; // break the for 
        }
    }



    /**
     * get
     * post
     * 
     * put -> to update full object
     * patch -> partial update 
     * delete -> remove
     */

    //notify the server 

    theItem.status = 1; //done

    // create the LI on the done list
    displayDone(theItem.text, theItem.id); //creates li in ul 

    // remove the LI from the todo list
    $("#" + theItem.id).remove(); // removes li from ul

    // notify the server
    $.ajax({
        url: serverURL + "/API/todo",
        type: "PUT",
        data: JSON.stringify(theItem),
        contentType: "application/JSON",
        success: function (res) {
            console.log("Server response", res);
        },
        error: function (error) {
            console.error("** ERROR**", error);
        }
    });
}


function deleteTodo(id) {
    console.log("Removed: ", id);
    // find the object with the id 
    var theItem;
    for (var i = 0; i < todoList.length; i++) {
        if (todoList[i].id == id) {
            // found it
            theItem = todoList[i];
            break; // break the for 
        }
    }

    // remove the LI from the todo list
    $("#" + theItem.id).remove(); // removes li from ul

    // notify the server
    $.ajax({
        url: serverURL + "/API/todo",
        type: "DELETE",
        data: JSON.stringify(theItem),
        contentType: "application/JSON",
        success: function (res) {
            console.log("Server response", res);
        },
        error: function (error) {
            console.error("** ERROR**", error);
        }
    });
}



// when the browser finishes loading
// please execute such function (init)
window.onload = init2;

//labs
//1= simple server that responds to two endpoints (localhost and about)
//2= stores info on array 
// server stores info on mongo
//CR webserver +restserver 