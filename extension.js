'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const MessageTray = imports.ui.messageTray;
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

var menu; /* main widget */

var MenuTest = GObject.registerClass({
    GTypeName: 'MenuTest'
}, class MenuTest extends PanelMenu.Button {

   _init() {

       super._init(0.0, Me.metadata.name, false);

        let icon = new St.Icon({
            gicon : Gio.ThemedIcon.new("preferences-desktop-apps-symbolic"),
            style_class : 'system-status-icon',
            y_expand: false,
            y_align: Clutter.ActorAlign.CENTER
        });

        this.add_child(icon);

        let menuToOpen = this._createSubMenuToOpen();

        this.menu.addMenuItem(this._createSubmenu(3, menuToOpen));
        this.menu.addMenuItem(this._createSubmenu(5, menuToOpen));
        this.menu.addMenuItem(this._createSubmenu(10, menuToOpen));
        this.menu.addMenuItem(this._createSubmenu(20, menuToOpen));
        this.menu.addMenuItem(this._createSubmenu(30, menuToOpen));
        this.menu.addMenuItem(this._createSubmenu(50, menuToOpen));
        this.menu.addMenuItem(this._createSubmenu(100, menuToOpen));

        this.menu.addMenuItem(menuToOpen);
   }

   _createSubMenuToOpen() {
        let subMenuToOpen = new PopupMenu.PopupSubMenuMenuItem(
            "This will be opened"
        );

        for (let i = 0; i < 10; i++) {
            let item = new PopupMenu.PopupMenuItem(
                "nothing here"
            )

            subMenuToOpen.menu.addMenuItem(item);
        }
        return (subMenuToOpen);
   }

   _createSubmenu(num, menuToOpen) {
        let subMenu = new PopupMenu.PopupSubMenuMenuItem(
            "Items in this menu: " + num
        );

        subMenu.menu.itemActivated = (animate) => {};

        for (let i = 0; i < num; i++) {
            let item = new PopupMenu.PopupMenuItem(
                "Click to open"
            );

            item.originalActivate = item.activate;
            item.activate = (event) => {

                menuToOpen.menu.open(true);

                return item.originalActivate(event);
            }

            subMenu.menu.addMenuItem(item);
        }

        return(subMenu);
   }
})

function enable() {

    menu = new MenuTest();

    Main.panel.addToStatusArea('menu-test', menu);

    log(`enabling ${Me.metadata.name} version ${Me.metadata.version}`);
}

function disable() {


    menu.destroy();

    log(`disabling ${Me.metadata.name} version ${Me.metadata.version}`);
}
