/** Android-native, user-owned PDF import. No copyrighted PDF assets bundled. */
import {Capacitor,registerPlugin} from "@capacitor/core";

export type PdfCrop={x:number;y:number;w:number;h:number};
export type PdfFileStatus={
 available:boolean;
 name:string;
 pageCount:number;
 bytes:number;
 sha256:string;
 editionMatched:boolean;
};
export type RenderedPdfPage={dataUrl:string;width:number;height:number;page:number};
export interface TextbookPdfPlugin {
 getStatus():Promise<PdfFileStatus>;
 importPdf():Promise<PdfFileStatus>;
 removePdf():Promise<PdfFileStatus>;
 renderPage(input:{page:number;width:number;crop?:PdfCrop}):Promise<RenderedPdfPage>;
}
export const textbookPdf=registerPlugin<TextbookPdfPlugin>("TextbookPdf");
export const supportsNativePdf=()=>Capacitor.isNativePlatform()&&Capacitor.getPlatform()==="android";

export const FIGURE_CUSTOMIZATIONS="cpc-academy-figure-customizations-v1";
export type FigureLabel={id:string;x:number;y:number;term:string;zh:string};
export type FigureCustomizations={
 pinned:Record<string,string>;
 crops:Record<string,PdfCrop>;
 labels:Record<string,FigureLabel[]>;
};
export const EMPTY_FIGURE_CUSTOMIZATIONS:FigureCustomizations={pinned:{},crops:{},labels:{}};
export function readFigureCustomizations():FigureCustomizations{
 if(typeof window==="undefined")return EMPTY_FIGURE_CUSTOMIZATIONS;
 try{
  const raw=localStorage.getItem(FIGURE_CUSTOMIZATIONS);
  if(!raw)return EMPTY_FIGURE_CUSTOMIZATIONS;
  const saved=JSON.parse(raw) as Partial<FigureCustomizations>;
  return {pinned:saved.pinned??{},crops:saved.crops??{},labels:saved.labels??{}};
 }catch{return EMPTY_FIGURE_CUSTOMIZATIONS;}
}
export function storeFigureCustomizations(data:FigureCustomizations){
 if(typeof window!=="undefined")localStorage.setItem(FIGURE_CUSTOMIZATIONS,JSON.stringify(data));
}