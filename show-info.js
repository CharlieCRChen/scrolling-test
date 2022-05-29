var inputArray = [false, false, false, false, false, false];

$(document).ready(function(){
    if ($("#username").val() != "" && $("#andrewId").val() != "" && $("#type").val() != "" && 
        $("#tech").val() != "" && $("#experience").val() != "" && $("#height").val() != ""){
        inputArray = [true, true, true, true, true, true];
        enableBtn(inputArray);
    };
});

$("#username").on("input", function () {
    inputArray[0] = true;
    enableBtn(inputArray);
});
$("#andrewId").on("input", function () {
    inputArray[1] = true;
    enableBtn(inputArray);
});
$("#type").on("change", function () {
    inputArray[2] = true;
    enableBtn(inputArray);
});
$("#tech").on("change", function () {
    inputArray[3] = true;
    enableBtn(inputArray);
});
$("#experience").on("change", function () {
    inputArray[4] = true;
    enableBtn(inputArray);
});
$("#height").on("change", function () {
    inputArray[5] = true;
    enableBtn(inputArray);
});

function enableBtn(array){
    enable = true;
    for (var i = 0; i<6; i++){
        if (array[i] == false){
            enable = false;
        }
    }
    if (enable==true){
        $(".btn-main").css("background-color","black");
        $(".btn-main").removeAttr("disabled");
    }
}

function getValue(){
    var username = $("#username").val();
    var id = $("#andrewId").val();
    var type = $("#type").val();
    var tech = $("#tech").val();
    var detail = $("#detail").val();
    var experience = $("#experience").val();
    var height = $("#height").val();
    var value =  JSON.stringify({"username":username, "id":id, "type":type, "tech":tech, "detail":detail, "exp":experience, "height":height});
    sessionStorage.setItem("info", value);
}
$("#btn-demo").click(function(){
    getValue();
    location.href='./scrolling-test.html?mode=demo'
})
$("#btn-formal").click(function(){
    getValue();
    location.href='./scrolling-test.html?mode=formal'
})