function goToLogin(){
  window.location.href = '/login'
}
function getJSONPod(){
  console.log(document.cookie)
}
function hello(){
  console.log("Added Pod")
}
function doForm(){
  $('#shwpod').on('submit', function(e){
    e.preventDefault();
    $.ajax({
       type: "POST",
       url: "/showpod",
       data: $(this).serialize(),
       success: function() {
         alert('success');
       }
    });
});
}
function getDataFromDB(){
    $.ajax({
       type: "POST",
       url: "/mypods",
       data: $(document.cookie).serialize(),
       success: function() {
         alert('success');
       }
    });
}
