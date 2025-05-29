const currentmacro = () => {return ScriptApp.getService().getUrl()};
const getScriptURL = () => {return ScriptApp.getService().getUrl()};
const appData ={
  "cookie-domain":"sites.google.com/apsk12.org/carver-steam","country":"US","lang":"en","site-url":"https://sites.google.com/apsk12.org/carver-steam/",
  "base-url":"https://sites.google.com/apsk12.org/carver-steam/","theme": "dark-blue","shadowStyle": "regular", "is-teacher-user": 0,"is-fully-verified": 0
}

const now2 = () => {
    return new Date(Date.now()).toLocaleString('en-US', {
        day: 'numeric',
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    });
}

function create_post(e){
  if (!'frm_id' in e || !'data' in e){return !1}
  let form = FormApp.openById(e.frm_id);
  const formResponse = form.createResponse();
    // Assuming your form items follow a specific order like: Text, Text, Text, Text, Text, Text, Text, Text, Text
  var textItemResponses = e.data.map(function(itemValue) {return itemValue.toString();});
  // Handle text items
  var textItems = form.getItems(FormApp.ItemType.TEXT);
  textItems.forEach(function(item, index) {e.data[index]&&formResponse.withItemResponse(item.asTextItem().createResponse(textItemResponses[index]));});
  // Submits the form response.
  formResponse.submit();
  return true;
}
