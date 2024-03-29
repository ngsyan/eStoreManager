import { app, BrowserWindow, Menu} from "electron";
import { ConfigGetter } from "../../services/ConfigGetter";
import { EventGetter } from "../../services/EventGetter";
import { Dialog } from "../../services/Dialog";
import {View} from '../shared/View';
import {ProductController} from '../../controllers/ProductController';
import {BuyController} from '../../controllers/BuyController';
import { TextGetter } from "../../services/TextGetter";
const settings = require('electron-settings');
const {ipcMain} = require('electron');
const { dialog } = require('electron');



export class ViewImportBillView extends View {

    private productController:ProductController;
    private data: any;

    // Browser Window that request
    private requestedBrowserWindow:BrowserWindow;

    private constructor(window: BrowserWindow, parent: BrowserWindow) {
        super("view_import_bill", window, parent);
        // this.getWindow().webContents.openDevTools();
        this.productController = new ProductController();
    }
    
    private static instance: ViewImportBillView;
    static getInstance(window: BrowserWindow, parent: BrowserWindow) {
        if (!ViewImportBillView.instance) {
            ViewImportBillView.instance = new ViewImportBillView(window, parent);
        }
        return ViewImportBillView.instance;
    }


    // Handle all logic of this view
    logicHandle():void {

        
        const textGetter = TextGetter.getInstance();


        // ======= Handle requests from renderer process ========
        ipcMain.on(EventGetter.get('request_view_import_bill'), (event:any, data:any) => {
            this.data = data;
            // console.log(data);
            this.setOriginWindow(null);
            this.setOriginParent(event.sender.getOwnerBrowserWindow());
            this.show();
        });

        ipcMain.on(EventGetter.get('request_import_view_data'), (event:any, data:any) => {
            this.requestedBrowserWindow = event.sender.getOwnerBrowserWindow();
            this.requestedBrowserWindow.webContents.send(EventGetter.get('respond_request_import_view_data'), this.data);
        });

    }

}