/*
This file is part of hidedit.
(C) Copyright 2012 Ilan Tayari

hidedit is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

hidedit is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with hidedit.  If not, see http://www.gnu.org/licenses/
*/

var ToolbarButton = {
    name: "ToolbarButton",
    New:        { value: 0, name: "New",        title: "New descriptor" },
    Load:       { value: 1, name: "Load",       title: "Load descriptor..." },
    Save:       { value: 2, name: "Save",       title: "Save descriptor..." },
    AddItem:    { value: 3, name: "AddItem",    title: "Add item..." },
    DelItem:    { value: 4, name: "DelItem",    title: "Delete selected item" },
    EditItem:   { value: 5, name: "EditItem",   title: "Edit selected item..." },
    AddReport:  { value: 6, name: "AddReport",  title: "Add report..." },
    DelReport:  { value: 7, name: "DelReport",  title: "Delete report..." },
};

var curToolbar = null;

function clearToolbarState()
{
    if (curToolbar == null)
        return;
    curToolbar.className="tbbtn";
}

function enableToolbarButton(btn, enable)
{
	clearToolbarState();
    var tb = document.getElementById("toolbar");
	tb.childNodes[btn.value].className = "tbbtn" + (enable ? "" : " disabled");
}

function onToolbarMouseDown(o)
{
    clearToolbarState();
    curToolbar = o;
    curToolbar.className="tbbtn pressed";
}

function onToolbarMouseUp(o)
{
    clearToolbarState();
    curToolbar = null;
}

function onToolbarMouseEnter(o)
{
    clearToolbarState();
    curToolbar = o;
}

function onToolbarMouseOut(o)
{
    clearToolbarState();
    curToolbar = null;
}

function populateToolbar() {
    var tb = document.getElementById("toolbar");

    for (var typeName in ToolbarButton)
    {
        var typeObj = ToolbarButton[typeName];
        if (typeof typeObj !== 'object')
            continue;

        var buttonElem = document.createElement('DIV');
        buttonElem.className = "tbbtn";
        buttonElem.id = typeObj.name;
        buttonElem.title = typeObj.title;
        buttonElem.onclick = function() {eval('on' + this.id + 'Clicked()');};
        buttonElem.onmousedown = function() {onToolbarMouseDown(this);};
        buttonElem.onmouseup = function() {onToolbarMouseUp(this);};
        buttonElem.onmouseenter = function() {onToolbarMouseEnter(this);};
        buttonElem.onmouseout = function() {onToolbarMouseOut(this);};
        buttonElem.style.backgroundPosition = "-" + (typeObj.value*32) + "px 0px";

        tb.appendChild(buttonElem);
    }
}

function onDescriptorChanged() {
    var run = new HIDRun(descriptor);
	try
	{
	    run.run();
	}
	catch (runException)
	{
		treeView.show(descriptor);
		treeView.setErrorItem(runException.item.elem);
		reportsView.showError(runException.error);
		return;
	}
	treeView.show(descriptor);
    reportsView.show(run.reports);
}

function onNewClicked()
{
    // Empty descriptor
    descriptor = new HIDDescriptor();
    onDescriptorChanged();
}

    /* Another fine example:
    USAGE_PAGE (Generic Desktop)
USAGE (Game Pad)
COLLECTION (Application)
    COLLECTION (Physical)
        REPORT_ID (1)
        USAGE_PAGE (Button)
        USAGE_MINIMUM (Button 1)
        USAGE_MAXIMUM (Button 16)
        LOGICAL_MINIMUM (0)
        LOGICAL_MAXIMUM (1)
        REPORT_COUNT (16)
        REPORT_SIZE (1)
        INPUT (Data,Var,Abs)
        USAGE_PAGE (Generic Desktop)
        USAGE (X)
        USAGE (Y)
        USAGE (Z)
        USAGE (Rx)
        LOGICAL_MINIMUM (-127)
        LOGICAL_MAXIMUM (127)
        REPORT_SIZE (8)
        REPORT_COUNT (4)
        INPUT (Data,Var,Abs)
    END COLLECTION
END COLLECTION
USAGE_PAGE (Generic Desktop)
USAGE (Game Pad)
COLLECTION (Application)
    COLLECTION (Physical)
        REPORT_ID (2)
        USAGE_PAGE (Button)
        USAGE_MINIMUM (Button 1)
        USAGE_MAXIMUM (Button 16)
        LOGICAL_MINIMUM (0)
        LOGICAL_MAXIMUM (1)
        REPORT_COUNT (16)
        REPORT_SIZE (1)
        INPUT (Data,Var,Abs)
        USAGE_PAGE (Generic Desktop)
        USAGE (X)
        USAGE (Y)
        USAGE (Z)
        USAGE (Rx)
        LOGICAL_MINIMUM (-127)
        LOGICAL_MAXIMUM (127)
        REPORT_SIZE (8)
        REPORT_COUNT (4)
        INPUT (Data,Var,Abs)
    END COLLECTION
END COLLECTION
*/

var examples = {
    length: 5,
    // Mouse with wheel and 8 buttons
    0: "05 01 09 02 A1 01 09 01 A1 00 05 09 19 01 29 08 15 00 25 01 75 01 95 08 81 02 05 01 09 30 09 31 09 38 09 B8 15 81 25 7F 75 08 95 04 81 06 C0 C0",
    // Mouse with wheel and 5 buttons
    1: "05 01 09 02 A1 01 09 01 A1 00 05 09 19 01 29 05 15 00 25 01 95 05 75 01 81 02 95 01 75 03 81 01 05 01 09 30 09 31 09 38 15 81 25 7F 75 08 95 03 81 06 C0 C0",
    // Game pad with 32 buttons
    2: "05 01 09 05 A1 01 05 09 19 0A 29 29 15 00 25 01 95 20 75 01 81 02 C0",
    // Mouse with wheel, 3 buttons, and a wakeup feature
    3: "05 01 09 02 A1 01 05 09 19 01 29 03 15 00 25 01 95 03 75 01 81 02 95 01 75 05 81 03 05 01 09 01 A1 00 09 30 09 31 15 81 25 7F 75 08 95 02 81 06 C0 09 38 95 01 81 06 09 3c 15 00 25 01 75 01 95 01 b1 22 95 07 b1 01 C0",
    // Digital Thermometer
    4: "0600FF0901A101050919012901150025019501750181029501750781010501094615BD257F67030003005500950175088100050809421500250F950175049100950175049101C0",
};

var curExample = 0;
function onLoadClicked()
{
    var s = new ReadStream(examples[curExample]);

	var newDesc = new HIDDescriptor();

	try
	{
		newDesc.parse(s);
	}
	catch (error)
	{
		alert(error);
		return;
	}

    descriptor = newDesc;
    onDescriptorChanged();

    curExample++;
    if (curExample >= examples.length)
        curExample = 0;
}

function onSaveClicked()
{
    var hex = descriptor.pack();
    prompt("The current descriptor's hex dump is below. You may copy it if you want to use it elsewhere:",hex);
}

function onAddItemClicked()
{
}

function onDelItemClicked()
{
	if (treeView.selectedItem == null)
		return;

	var index = treeView.selectedItem.itemIndex;
	descriptor.items.splice(treeView.selectedItem.itemIndex, 1);
    onDescriptorChanged();
	treeView.selectIndex(index);
}

function onEditItemClicked()
{
}

function onAddReportClicked()
{
}

function onDelReportClicked()
{
}

populateToolbar();
var descriptor = new HIDDescriptor();