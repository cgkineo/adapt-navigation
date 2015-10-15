# adapt-navigation
    

###Description
The is a layout engine for the navigation bar.   
The engine is built using a layout stack. The initial layout in the course.json is the first item on the stack.  
A new layout can be added to or cloned from the layout stack.  
The current layout can be changed, updated or removed.  

###Usage

1. For a single layout course  
Copy [example.json](https://github.com/cgkineo/adapt-navigation/blob/develop/example.json) into ``course.json`` and rearrange / amend.

2. Programmic usage


| Event Name | Description |
| --- | --- |
| ``Adapt.trigger("navigation:addLayout", layoutArray);`` | Add a layout to the stack, hiding all items not listed |
| ``Adapt.trigger("navigation:cloneLayout", layoutArray);`` | Add a layout to the stack, updating all items listed |
| ``Adapt.trigger("navigation:changeLayout", layoutArray);`` | Change the current layout, hiding all items not listed |
| ``Adapt.trigger("navigation:updateLayout", layoutArray);`` | Change the current layout, updating all items not listed |
| ``Adapt.trigger("navigation:removeLayout");`` | Remove the current layout from the stack |
| ``Adapt.trigger("navigation:addButtonDefaults", defaultsObject);`` | Add a button default for tooltips, layout and screen size options |