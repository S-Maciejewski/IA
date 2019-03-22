function isEmpty(arg) {
    return arg.length == 0;
}

function validate(form) {
    var valid = true;
    if (!checkStringAndFocus(form.elements["f_fname"], "First name cannot be empty!")) {
        document.getElementsByName("f_fname")[0].className = 'wrong';
        valid = false;
    }
    if (!checkString(form.elements["f_lname"].value, "Last name cannot be empty!")) {
        document.getElementsByName("f_lname")[0].className = 'wrong';
        valid = false;
    }
    if (checkZIPCodeRegEx(form.elements["f_zip"].value)) {
        document.getElementsByName("f_fname")[0].className = 'wrong';
        valid = false;
    }
    if (!checkString(form.elements["f_street"].value, "Street cannot be empty!")) {
        document.getElementsByName("f_street")[0].className = 'wrong';
        valid = false;
    }
    if (!checkString(form.elements["f_city"].value, "City cannot be empty!")) {
        document.getElementsByName("f_city")[0].className = 'wrong';
        valid = false;
    }
    if (!checkEmailRegEx(form.elements["f_email"].value)) {
        document.getElementsByName("f_email")[0].className = 'wrong';
        valid = false;
    }
    return valid;
}

function isWhiteSpace(str) {
    var ws = "\t\n\r ";
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (ws.indexOf(c) == -1) {
            return false;
        }
    }
    return true;
}

function checkString(str, msg) {
    if (isEmpty(str) || isWhiteSpace(str)) {
        alert(msg);
        return false;
    }
    return true;
}

function checkEmail(str) {
    if (isWhiteSpace(str)) {
        alert("Incorrect e-mail");
        return false;
    }
    else {
        var at = str.indexOf("@");
        if (at < 1) {
            alert("Incorrect e-mail");
            return false;
        }
        else {
            var l = -1;
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (c == ".") {
                    l = i;
                }
            }
            if ((l < (at + 2)) || (l == str.length - 1)) {
                alert("Incorrect e-mail");
                return false;
            }
        }
        return true;
    }
}


function checkStringAndFocus(obj, msg) {
    var str = obj.value;
    var errorFieldName = "e_" + obj.name.substr(2, obj.name.length);
    if (isWhiteSpace(str) || isEmpty(str)) {
        document.getElementById(errorFieldName).innerHTML = msg;
        startTimer(errorFieldName);
        obj.focus();
        return false;
    }
    else {
        return true;
    }
}

var errorField = "";

function startTimer(fName) {
    errorField = fName;
    window.setTimeout("clearError(errorField)", 5000);
}

function clearError(objName) {
    document.getElementById(objName).innerHTML = "";
}

function showElement(e) {
    console.log(document.getElementById(e))
    document.getElementById(e).style.visibility = 'visible';
}

function hideElement(e) {
    console.log(document.getElementById(e))

    document.getElementById(e).style.visibility = 'hidden';
}

function checkEmailRegEx(str) {
    var email = /[a-zA-Z_0-9\.]+@[a-zA-Z_0-9\.]+\.[a-zA-Z][a-zA-Z]+/;
    if (email.test(str))
        return true;
    else {
        alert("Wrong e-mail address");
        return false;
    }
}

function checkZIPCodeRegEx(value) {
    if (value && /\d{2}-\d{3}/.test(value)) {
        document.getElementById('zip').innerHTML = 'OK';
        document.getElementById('zip').className = 'green';
        return false;
    } else {
        document.getElementById('zip').innerHTML = 'WRONG';
        document.getElementById('zip').className = 'red';
        return true;
    }
}

function alterRows(i, e) {
    if (e) {
        if (i % 2 == 1) {
            e.setAttribute("style", "background-color: Aqua;");
        }
        e = e.nextSibling;
        while (e && e.nodeType != 1) {
            e = e.nextSibling;
        }
        alterRows(++i, e);
    }
}

function nextNode(e) {
    while (e && e.nodeType != 1) {
        e = e.nextSibling;
    }
    return e;
}

function prevNode(e) {
    while (e && e.nodeType != 1) {
        e = e.previousSibling;
    }
    return e;
}

function swapRows(b) {
    var tab = prevNode(b.previousSibling);
    var tBody = nextNode(tab.firstChild);
    var lastNode = prevNode(tBody.lastChild);
    tBody.removeChild(lastNode);
    var firstNode = nextNode(tBody.firstChild);
    tBody.insertBefore(lastNode, firstNode);
}

function cnt(form, msg, maxSize) {
    if (form.value.length > maxSize)
    form.value = form.value.substring(0, maxSize);
    else
    msg.innerHTML = maxSize - form.value.length;
   }