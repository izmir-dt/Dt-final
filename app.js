function doGet(e) {
  // Veriyi çekip JSON formatına getirip gönderirken şu başlığı eklemeliyiz:
  var output = ContentService.createTextOutput(JSON.stringify(getData(e)))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Bu satır web sitesinin her yerden erişebilmesini sağlar (Kritik!)
  return output;
}
