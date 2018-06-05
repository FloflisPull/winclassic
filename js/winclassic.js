function WinClassicTheme() {
  Theme.call(this);

  this.pickers = document.getElementsByClassName("color-item");
  var exportDestination = document.getElementById("export");
  var importSource = document.getElementById("import");

  for (var i = 0; i < this.pickers.length; i++) {
    var picker = this.pickers[i];
    var itemName = picker.dataset.item;
    this.updateFromStylesheet(itemName);
    picker.value = this.getItemColor(itemName);
    picker.oninput = this.onColorChange.bind(this);
    picker.onchange = function() {
      exportDestination.value = this.exportToIni();
    }.bind(this);
  }

  exportDestination.value = this.exportToIni();

  document.getElementById("import-action").onclick = function(e) {
    this.importIniSection(importSource.value);
  }.bind(this);

  return this;
}

Object.setPrototypeOf(WinClassicTheme.prototype, Theme.prototype);

WinClassicTheme.prototype.onColorChange = function(e) {
  var name = e.target.dataset.item;
  var color = e.target.value;
  this.setItemColor(name, color);
  this.updateStylesheet(name);
}

WinClassicTheme.prototype.exportToIni = function() {
  var ini = "";
  for (var item in this.items) {
    var rgb = window.normalizeColor.rgba(window.normalizeColor(this.items[item].color));
    ini += item + "=" + rgb.r + " " + rgb.g + " " + rgb.b + "\n";
  }

  return ini.trim();
}

WinClassicTheme.prototype.parseIniSection = function(content) {
  return content.split('\n').reduce(function(items, line) {
    var split = line.split('=');
    items[split[0].trim()] = "rgb(" + split[1].trim().replace(/\s+/g, ',') + ")";

    return items;
  }, {});
}

WinClassicTheme.prototype.importIniSection = function(content) {
  var items = this.parseIniSection(content);
  console.log(items);
  for (var item in items) {
    this.setItemColor(item, items[item]);
    this.updateStylesheet(item);
  }
  this.resetPickers();
}

WinClassicTheme.prototype.resetPickers = function() {
  for (var i = 0; i < this.pickers.length; i++) {
    var picker = this.pickers[i];
    picker.value = this.getItemColor(picker.dataset.item);
  }
}
