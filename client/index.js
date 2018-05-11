
function submitPlayer(){
    var username = document.getElementById('name').value;
    var color = document.getElementById('color').value;

    Client.submitPlayer(username, color);

    document.getElementById('start_button').style.display = "block";
    document.getElementById('submitter').style.display = "none";
}

function displayUsers(users){
    var list = document.getElementById('userlist');
    list.innerHTML = "";
    var str = "";
    for (var i = 0; i < users.length; i++){
        str += "<li>" + users[i].id + " " +  users[i].username + " " + users[i].color + "</li>";
    }
    list.innerHTML = str;
}
