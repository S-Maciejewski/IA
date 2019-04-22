// $(document).ready(function() {
// 
// });

var categories = [];
var notes = [];
var loggedIn = false;

function login() {
    console.log('Logging in');
    $.ajax({
        type: "POST",
        url: "http://localhost:4000/login",
        data: { passwd: $('#passwd').val() },
        success: function (data) {
            console.log(data);
            loginVisibility(data.success);
        },
    });
}

function saveData(data) {
    categories = data.categories;
    notes = data.notes;
    console.log('Data from server response saved');
    console.log('Notes: ', notes);
    console.log('Categories: ', categories);
}

function init() {
    console.log('Initializing data');
    $.ajax({
        type: "GET",
        url: "http://localhost:4000/init",
        success: data => saveData(data)
    });
}

function loginVisibility(success) {
    if (success){
        $('#loginField').css('visibility', 'hidden');
        $('#loginField label').css('visibility', 'hidden');
    }
    loggedIn = success;
}

$(function () {
    init();
});