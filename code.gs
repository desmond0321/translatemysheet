/**
 *
 * OnInstall method.
 *
 * Necessary for the menu items to populate the first time after the add-on is installed.
 *
 **/
function onInstall(e) {
  onOpen(e);
}

/**
 *
 * Toolbar menu creation.
 *
 * Called on worbook opening.
 *
 **/
function onOpen() {
    SpreadsheetApp.getUi()
        .createAddonMenu()
        .addItem('Start a new translation', 'showSidebar')
        .addItem('About', 'showAbout')
        .addToUi();
}

/**
 *
 * Sidebar title, content & size.
 *
 **/
function showSidebar() {
    var html = HtmlService.createHtmlOutputFromFile('index')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle('Translate My Sheet')
        .setWidth(300);

    // Open sidebar
    SpreadsheetApp.getUi().showSidebar(html);
}

function showAbout() {
  var html = HtmlService.createHtmlOutputFromFile('about')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('About')
      .setWidth(250)
      .setHeight(450);
  SpreadsheetApp.getActive().show(html);
}

/**
 *
 * Sidebar title, content & size.
 *
 **/
function translate(radioFull, radioSelected, radioOgSheet, radioNewSheet, sourceLangage, targetLangage) {
    SpreadsheetApp.getActiveSpreadsheet().toast("Translation in progress...", "", -1);
    try {
        var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        var activeSheet = activeSpreadsheet.getActiveSheet();
        var activeRange = activeSheet.getActiveRange().getA1Notation();
        if (radioOgSheet) {
			var targetSheet = activeSheet
		} else if (radioNewSheet) {
			var targetSheet = activeSpreadsheet.duplicateActiveSheet().setName(activeSheet.getName() + " - " + targetLangage);
			targetSheet.setTabColor("1E824C");
		}
        var activeCell = activeSheet.getActiveCell();
        if (radioFull) {
            translateFullPage(activeSpreadsheet, targetSheet, sourceLangage, targetLangage);
        } else if (radioSelected) {
            translateSelectedCells(activeSpreadsheet, targetSheet, activeRange, sourceLangage, targetLangage);
        }
        SpreadsheetApp.getActiveSpreadsheet().toast("Done.", "", 3);
    } catch (err) {
      SpreadsheetApp.getActiveSpreadsheet().toast("An error occured:" + err);
    }
}

/**
 *
 * Code for translate full page content from a source to a target langage. 
 *
 **/
function translateFullPage(activeSpreadsheet, targetSheet, sourceLangage, targetLangage) {
    var lrow = activeSpreadsheet.getLastRow();
    var lcol = activeSpreadsheet.getLastColumn();
    for (var i = 1; i <= lrow; i++) {
        for (var j = 1; j <= lcol; j++) {
            if (SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(i, j).getValue() != "") {
                var activeCellText = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(i, j).getValue();
                var activeCellTranslation = LanguageApp.translate(activeCellText, sourceLangage, targetLangage);
                targetSheet.getRange(i, j).setValue(activeCellTranslation);
            }
        }
    }
}

/**
 *
 * Code for translate only selected range content in a sheet from a source to a target langage. 
 *
 **/
function translateSelectedCells(activeSpreadsheet, targetSheet, activeRange, sourceLangage, targetLangage) {
    var range = SpreadsheetApp.getActiveSheet().getRange(activeRange);
    var numRows = range.getNumRows();
    var numCols = range.getNumColumns();
    for (var i = 1; i <= numRows; i++) {
      for (var j = 1; j <= numCols; j++) {
        var activeCellText = range.getCell(i,j).getValue();
        var activeCellTranslation = LanguageApp.translate(activeCellText, sourceLangage, targetLangage);
        range.getCell(i,j).setValue(activeCellTranslation);
        range.getCell(i,j).setBackground("#1E824C");
        range.getCell(i,j).setFontColor("#FFFFFF");
      }
    }
}
