(function($){
    //on load get config object
    getConfigObject();
    initDatePicker();
    //Assign the onclick events to the buttons
    assignStartFunction();
    assignToggleFunction();
    assignReportFunction();
    assignMainFunction();
    focusBin();
})();
//called by self-invoking function
function getConfigObject(){
    $.ajax({url:"/newUrl/App/Config/config.json",
        success: function(result){
            processConfig(result);
        },
        error: function(){
            $(".selectpicker").selectpicker();
            displayUI();
        }
    });
}

//called by self-invoking function
//focus cursor on pastebin
function focusBin(){
    $("#urlPastebin").focus();
    setTimeout(function(){
        $("#urlPastebin").focus();
    },100);
}

//called by getConfigObject callback form Ajax request
function processConfig(results){
    if(results.parameters != null && results.parameters.users_list != 0){
        populateUsersList(results.parameters.users_list);
    }else{
        populateUsersList(["Default User"]);
    }
    if(results.parameters != null && results.parameters.title != undefined){
        $("#resolverTitle").html(results.parameters.title);
    }
    if(results.parameters != null && results.parameters.url_prefix != undefined){
        $("#urlPrefix").html(results.parameters.url_prefix)
    }
}

//called by processConfig with data recieved from first Ajax Call
function populateUsersList(userArray){
    var select = $("<select>");
    select.attr('id', 'userList');
    select.addClass('selectpicker');
    for (var i = 0; i < userArray.length; i++){
        console.log(userArray[i]);
        select.append($("<option>").attr('value', userArray[i]).text(userArray[i]));
    }
    var userListContainer = $("#userListContainer");
    userListContainer.empty();
    userListContainer.append(select);
    $(".selectpicker").selectpicker();
    displayUI();
}

//called by self-invoking function
//assigns event listener to Start Button
function assignStartFunction(){
    $('#startButton').click(function(){
        console.log("start clicked");
        var pasteBin = $("#urlPastebin");
        var urlList = pasteBin.val();
        pasteBin.val(" ");
        var urlArray = urlList.split("\n");
        var cleanArray = removeSpaces(urlArray);
        //Stop execution unless actual values are in pastebin
        if(cleanArray.length >= 1){
            //tidy up pastebin
            pasteBin.prop('disabled', true);
            var cleanString = "<pre style='overflow-x:auto; max-height:70vh;'>";
            for(var i = 0; i < cleanArray.length; i++){
                //cleanString+= cleanArray[i] + "<br />";
                //$("#pasteBinParent").html(pasteBin.html() + cleanArray[i] + "&#013; &#010;");
                cleanString += cleanArray[i] + "&#013; &#010;";
            }
            cleanString += "</pre>";
            $("#pasteBinParent").html(cleanString);
            $(".startControl").hide();
            $(".listControl").show();
            $(".resultsContainer").toggle();
            $(".pasteBinContainer").toggle();
            if(urlArray[0].split("\t").length > 4){
                processSierraData(cleanArray);
            }else{
                processUrlList(cleanArray);
            }
        }
    });
}

//called by self-invoking function
//assigns event listener to Toggle button
function assignToggleFunction(){
    $('#toggleButton').click(function(){
        $('.resultsContainer').toggle();
        $('.pasteBinContainer').toggle();
    });
}

//called by self-invoking function
//assigns event listener to Reporting Button
function assignReportFunction(){
    $('#reportButton').click(function(){
        $(".mainContainer").hide();
        $(".reportContainer").show();
    });
}

//called by self-invoking function
//assigns event listener to Main Button
function assignMainFunction(){
    $('#mainButton').click(function(){
        $(".mainContainer").show();
        $(".reportContainer").hide();
        $(".resultsContainer").hide();
        $(".pasteBinContainer").show();
    });
}
/*
 * Heart of the site:
 * ///////////////////////////////////////////////
 *         SIERRA DATA
 * ///////////////////////////////////////////////
 * Processes the URLs: Produces the table:
 * 1 - clean incoming urlArray of empty rows
 * 2 - generate headers
 * 3 - generate table rows and assign local event listeners
 * 4 - IF SOMETHING BREAKS, THIS IS WHERE YOU BEGIN!
 * */
function processSierraData(lineArray){
    showUserDropdown();
    console.log("Sierra data used");
    //Create table headers
    var trHead = $("<tr>");

    var thId = $("<th>", {
        class: "sierraBib",
        text: "Bib"
    });
    trHead.append(thId);
    var thUrl = $("<th>", {
        class: "noSierraUrl",
        text: "URL"
    });
    trHead.append(thUrl);
    var thCode = $("<th>", {
        class: "urlCode",
        text: "Reply"
    });
    trHead.append(thCode);
    var thRedirect = $("<th>",{
        class: "noSierraUrl",
        text: "Redirect"
    });
    trHead.append(thRedirect);
    var thR = $("<th>", {
        class: "resolverButtonColumn",
        text: "R"
    });
    trHead.append(thR);
    var thCheck = $("<th>", {
        class: "resolverButtonColumn"
    }).append(
        $("<button>", {
            id: "dbSelect",
            onclick: "toggleResolverSelectionCheckbox()",
            class: "btn-xs resolverButton",
            type: "button"
        }).text("X")
    );
    trHead.append(thCheck);
    var parentTable = $("#urlTable");
    parentTable.append(trHead);
    //create Sierra table rows
    //Yes, this could have been brokem up with functions.
    //TODO: REFUNCTIONALIZE THIS!
    $("#totalUrlNumber").text(lineArray.length);
    var urlPrefix = $("#urlPrefix").html();
    //TODO start this at 0
    for(var rowNum = 0; rowNum < lineArray.length; rowNum++){
        //Sierra row
        var splitLine = lineArray[rowNum].split("\t");
        var tableRow = $("<tr>",{
            id: "row" + rowNum
        });
        //Non-Sierra bib column
        var tdBib = $("<td>");
        tdBib.html("<a href='" + urlPrefix + splitLine[1] + "' target='_blank'>" + splitLine[1] + "</a>");
        tableRow.append(tdBib);
        //Sierra original url column
        var tdUrl = $("<td>", {
            id: "urlId" + rowNum,
            onclick: "makeURLModal(\"" + splitLine[3] + "\")"
        }).text(splitLine[3]);
        tableRow.append(tdUrl);
        //Sierra reply
        var tdReply = $("<td>", {
            id: "replyId" + rowNum
        });
        tableRow.append(tdReply);
        //Sierra redirect
        var tdRedir = $("<td>", {
            id: "redirectId" + rowNum,
            onclick: "makeURLModal($('#redirectId" + rowNum + "').text())"
        });
        tableRow.append(tdRedir);
        //Sierra refresh button
        var tdRefreshButton = $("<td>").append(
            $("<button>",{
                class: "btn btn-success btn-xs resolverButton",
                onclick: "resolveURL(" + rowNum + ")"
            }).text("R")
        );
        tableRow.append(tdRefreshButton);
        //Sierra checkbox
        var tdCheckBox = $("<td>").append(
            $("<input>", {
                type: "checkbox",
                class: "resolverCheck",
                checked: 0
            })
        );
        tableRow.append(tdCheckBox);
        parentTable.append(tableRow);
        resolveURL(rowNum);
    }
}


/*
* Heart of the site:
* ///////////////////////////////////////////////
*         NON SIERRA DATA
* ///////////////////////////////////////////////
* Processes the URLs: Produces the table:
* 1 - clean incoming urlArray of empty rows
* 2 - generate headers
* 3 - generate table rows and assign local event listeners
* 4 - IF SOMETHING BREAKS, THIS IS WHERE YOU BEGIN!
* */
function processUrlList(urlArray){
    //Yes, this can be broken up. Yes, some of this code is a little butchered;
    //This is my first complex web application I've ever written. I WILL regret this
    console.log("processing Non Sierra url list");
    //Create Non-Sierra table headers
    var trHead = $("<tr>");
    //Non Sierra Id Header
    var thId = $("<th>", {
        class: "noSierraCounter",
        text: "ID"
    });
    trHead.append(thId);
    //Non Sierra Original URL Header
    var thUrl = $("<th>", {
        class: "noSierraUrl",
        text: "URL"
    });
    trHead.append(thUrl);
    //Non Sierra Reply Code Header
    var thCode = $("<th>", {
        class: "urlCode",
        text: "Reply"
    });
    trHead.append(thCode);
    //Non Sierra Redirect Header
    var thRedirect = $("<th>",{
        class: "noSierraUrl",
        text: "Redirect"
    });
    trHead.append(thRedirect);
    //Non Sierra Refresh Column Header
    var thR = $("<th>", {
        class: "resolverButtonColumn",
        text: "R"
    });
    trHead.append(thR);
    //Non Sierra Toggle Checkbox container and button
    var thCheck = $("<th>", {
        class: "resolverButtonColumn"
    }).append(
        $("<button>", {
            id: "dbSelect",
            onclick: "toggleResolverSelectionCheckbox()",
            class: "btn-xs resolverButton",
            type: "button"
        }).text("X")
    );
    trHead.append(thCheck);
    var parentTable = $("#urlTable");
    parentTable.append(trHead);
    //create Non-Sierra table rows
    //Excessive calls to the array sanitization function were eliminted
    var cleanArray = urlArray;
    $("#totalUrlNumber").text(cleanArray.length);
    for(var rowNum = 0; rowNum < cleanArray.length; rowNum++){
        //Non-Sierra row
        var tableRow = $("<tr>", {
            id: "row" + rowNum
        });
        //Non-Sierra id column
        var tdId = $("<td>");
        tdId.text((rowNum + 1));
        tableRow.append(tdId);
        //Non-Sierra original url column
        var tdUrl = $("<td>", {
            id: "urlId" + rowNum,
            onclick: "makeURLModal(\"" + cleanArray[rowNum] + "\")"
        }).text(cleanArray[rowNum]);
        tableRow.append(tdUrl);
        //Non-Sierra reply
        var tdReply = $("<td>", {
            id: "replyId" + rowNum
        });
        tableRow.append(tdReply);
        //Non-Sierra redirect
        var tdRedir = $("<td>", {
            id: "redirectId" + rowNum,
            onclick: "makeURLModal($('#redirectId" + rowNum + "').text())"
        });
        tableRow.append(tdRedir);
        //Non-Sierra refresh button
        var tdRefreshButton = $("<td>").append(
            $("<button>",{
                class: "btn btn-success btn-xs resolverButton",
                onclick: "resolveURL(" + rowNum + ")"
            }).text("R")
        );
        tableRow.append(tdRefreshButton);
        //Non-Sierra checkbox
        var tdCheckBox = $("<td>").append(
            $("<input>", {
                type: "checkbox",
                class: "resolverCheck",
                checked: 0
            })
        );
        tableRow.append(tdCheckBox);
        parentTable.append(tableRow);
        resolveURL(rowNum);
    }
    showProcessButton("Copy", copyResultsToClipboard);
}

//Takes an array and strips out all elements containing empty strings
//This returns clean array with no random line spaces in it.
//This is used by processSierraData and processUrlList
function removeSpaces(array){
    var index = array.indexOf("");
    while(index > -1){
        array.splice(index, 1);
        index = array.indexOf("");
    }
    return array;
}

//called after all elements from external sources are loaded
//This un-hides the application when the data loads are complete
function displayUI(){
    $("#loadingScreen").hide();
    $('#mainSite').show(200);
}

/*
* This is resolution function. It resolves and refreshes the URL
* entries accordingly.
* */
function resolveURL(row){
    var url = $("#urlId" + row).text();
    //this was added to eliminate weird random
    //scoping errors with this callback.
    var localRow = row;
    $.ajax({url:"/newUrl/App/resolver.php?url=" + url,
        dataType: "json",
        success: function(result){
            incrementCounter();
            insertUrlData(result, localRow);
        },
        error: function(result){
            insertUrlData(null, localRow);
        }
    });
}

/*
* THIS IS FOR TESTING ONLY!
* JUST TO MAKE SURE AJAX CALLS ARE WORKING PROPERLY
* */
function resolveURL2(row){
    //this was added to eliminate weird random
    //scoping errors with this callback.
    var localRow = row;
    $.ajax({url:"/newUrl/App/resolver2.php",
        dataType: "json",
        success: function(result){
            incrementCounter();
            insertUrlData(result, localRow);
        },
        error: function(result){
            insertUrlData(null, localRow);
        }
    });
}
/*
* THIS IS FOR TESTING ONLY
*
* */

/*
* The resolved url counter's total is set by a call by the
* data handlers (the functions that create and maange the tables)
* As each call is made out for each url to resolve, the callback
* on success increments the counter to indicate that a url was
* successfully resolved.
**/
function incrementCounter(){
    var currentUrlContainer = $("#currentUrlNumber");
    var totalUrlContainer = $("#totalUrlNumber");
    var count = currentUrlContainer.text();
    count++;
    if(count <= totalUrlContainer.text()){
        currentUrlContainer.text(count);
    }
}

/*
* called by the URL resolver function.
* This dictates where the resolved url data is put into each row.
* NOTE:
* success(data)'s is a JSON object:
* {
*   url: www.mykitty.com
*   reply: 301
*   redirect: www.mysuperkitty.com
* }
* If there is no redirect, there's just no redirect attribute in the object.
* */
function insertUrlData(reply, row){
    //alert("inserting: " + reply + "\ninto: " + row);
    $("#replyId" + row).text(reply.reply);
    if(reply.reply != null && reply.reply != undefined && reply.reply != ""){
        console.log(reply.reply);
        $("#redirectId" + row).text(reply.redirect);
    }else{
        $("#redirectId" + row).text("");
    }
}

/*
* Takes a URL as an argument and draws the url modal dialog
* (Modal URL Copy Dialog Section #urlCopyModal) from it
* This called by clicking on ANY URL Td element from the result pane
* */
function makeURLModal(url){
    var urlAsLink = "<a href='" + url + "' target='_blank'>" + url + "</a>";
    $("#urlCopyModalText").html(urlAsLink);
    $("#urlCopyModal").modal('show');
}

/*
* This is the function that copies the url form the modal to the clipboard.
* It is attached to a button within the modal.
* */
function copyModalUrl(){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($("#urlCopyModalText").text()).select();
    document.execCommand("copy");
    $temp.remove();
}

//Called by X-shaped button at the top of the RESOLVER table This selects
//all boxes if there are non selected. If any boxes are selected, it deselects
//all.
function toggleResolverSelectionCheckbox(){
    var checkedState = false;
    var urlCheckBoxes = $(".resolverCheck");
    urlCheckBoxes.each(function(){
        if(this.checked){
            checkedState = true;
        }
    });
    if(checkedState){
        urlCheckBoxes.prop('checked', false);
    }else{
        urlCheckBoxes.prop('checked', true);
    }
}

/*This draws the process button, attaches the text given to it and references
* the function called by clicking said button
* the arguments are provided by the two channels:
*   ProcessSierraData and ProcessURLList
*   ProcessSierraData adds submitToDb as the action
*   processURllist adds CopyReultsToClipboard as the action
*/
function showProcessButton(name, action){
    $("#processButton").show().text(name).click(function(){
        action();
    });
}

function copyResultsToClipboard(){
    var tempPasteArea = $("<textarea>");
    var pasteAgg = "";
    $("body").append(tempPasteArea);
    $(".resolverCheck:checked").each(function(){
        var idElement = $(this).parent().parent();
        pasteAgg+=
            "" + idElement.children().eq(0).text().trim()
            + "\t" + idElement.children().eq(1).text().trim()
            + "\t" + idElement.children().eq(2).text().trim()
            + "\t" + idElement.children().eq(3).text().trim()
            + "\r\n";
    });
    tempPasteArea.text(pasteAgg).select();
    document.execCommand("copy");
    tempPasteArea.remove();
}

function submitResultsToDb(){
    alert("Submitted");
}

function showUserDropdown(){
    $("#userListContainerLabel").show();
    //$("#userList").show();
}

function initDatePicker(){
    //Remove this nesting of the datepicker on click functions.


    //var start = moment().subtract(29, 'days');
    var start = moment();
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#reportrange').daterangepicker({
        showDropdowns: true,
        //This is where you put the date range LIMITS from the server!
        minDate : "3/1/2017",
        maxDate: "7/31/2017",
        linkedCalendars : false,
        //This is where you put the CURRENT date range from the server!
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Year to Date' : [moment().startOf('year'), moment()],
            'Last Year': [moment().subtract(1, 'years').startOf('year'), moment().subtract(1, 'years').endOf('year')]
        }
    }, cb);

    cb(start, end);
    /*Add the custom classes without manual CSS overrides.*/
    $(".range_inputs button").addClass("btn-outlined");
}