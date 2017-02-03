/**
 * Created by candelariajr on 1/30/2017.
 */
$(function() {
    //define how site it setup on startup
    startupState();

    //add Listeners
    $("#toggleUrlList").click(function(){toggleUrlList()});
    $("#start").click(function(){resolver();});
});

function startupState(){
    $(".container").show();
    $("#resultGrid").hide();
}

function toggleUrlList(){
    $("#urlContainer").toggle(200);
    $("#resultGrid").toggle(200);
}

function resolver(){
    //UI Manipulation
    $("#urlContainer").hide(200);
    $("#resultGrid").show(200);
    //End UI Manipulation
}

function urlEntityFactory(){

}

function createSierraURL(){

}

function createNonSierraURL(){

}