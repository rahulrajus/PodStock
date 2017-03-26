function goToLogin(){
  window.location.href = '/login'
}
function getJSONPod(){

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
