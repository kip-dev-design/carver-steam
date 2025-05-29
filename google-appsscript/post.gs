function doPost(e){
  console.log(JSON.stringify(e));
  var rData = JSON.parse(e.postData.contents);
  console.log("rData ",rData );
}
