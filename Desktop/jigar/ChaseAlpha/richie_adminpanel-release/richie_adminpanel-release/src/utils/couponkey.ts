export function getKey() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var len = 5;
  var num = 1;
  var generated: any[] = [];
  function generateCodes(number: any, length: any) {
    for (var i = 0; i < number; i++) {
      generateCode(length);
    }
  }
  function generateCode(length?: any) {
    var text = '';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (generated.indexOf(text) === -1) {
      generated.push(text);
    } else {
      generateCode();
    }
  }
  generateCodes(num, len);

  return generated.join('');
}
