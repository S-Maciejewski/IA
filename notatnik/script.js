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
    refreshNotes();
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
    if (success) {
        $('#loginField').css('visibility', 'hidden');
        $('#loginField label').css('visibility', 'hidden');
    }
    loggedIn = success;
    refreshNotes();
}

function refreshNotes() {
    $('#notesField').html(`
    <ul class="mdl-list" id="notesList">
        <li class="mdl-list__item mdl-list__item--two-line">
            <span class="mdl-list__item-primary-content">
                Notes list
            </span>
        </li>
    </ul>
    `);
    for (i in notes) {
        var listElement = $('#notesList');
        console.log('logged in status:', loggedIn);
        if (!loggedIn)
            $(listElement).append(`
            <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-icon">note</i>
                `
                + notes[i].title +
                `
            </span>
            </li>
            `);
        else
            $(listElement).append(`
            <li class="mdl-list__item mdl-list__item--two-line">
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-icon">note</i>
                <span>`
                + notes[i].title +
                `</span>
                <span class="mdl-list__item-sub-title">`
                + notes[i].category +
                `<br>`
                + notes[i].date +
                `</span>
            </span>
            <span class="mdl-list__item-secondary-content">`
                + notes[i].content +
                `</span>
        </li>
            `);
    }
}

$(function () {
    init();
});