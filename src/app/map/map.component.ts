import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: Map;
  vectorLayer: VectorLayer;
  osmLayer: TileLayer;
  googleMapsLayer: TileLayer;
  scaleLineControl: ScaleLine;
  tasinmazlar: any[] = []; // Tasinmazları tutacak değişken

  constructor(private tasinmazService: TasinmazService) {}

  ngOnInit(): void {
    this.tasinmazService.getTasinmazlar().subscribe(
      (data) => {
        this.tasinmazlar = data;
        this.initializeMap();
        this.addMarkers();
      },
      (error) => {
        console.error('Tasinmazlar alınırken hata oluştu:', error);
      }
    );
  }

  initializeMap(): void {
    this.osmLayer = new TileLayer({
      source: new OSM(),
      opacity: 1.0,
      properties: { name: 'osm' }
    });

    this.googleMapsLayer = new TileLayer({
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
      }),
      opacity: 1.0,
      properties: { name: 'googleMaps' },
      visible: false
    });

    this.scaleLineControl = new ScaleLine();

    this.vectorLayer = new VectorLayer({
      source: new VectorSource()
    });

    this.map = new Map({
      target: 'map',
      layers: [
        this.osmLayer,
        this.googleMapsLayer,
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4
      }),
      controls: [this.scaleLineControl]
    });
  }

  toggleLayer(layerName: string): void {
    if (layerName === 'osm') {
      this.osmLayer.setVisible(!this.osmLayer.getVisible());
    } else if (layerName === 'googleMaps') {
      this.googleMapsLayer.setVisible(!this.googleMapsLayer.getVisible());
    }
  }

  setLayerOpacity(layerName: string, opacity: number): void {
    if (layerName === 'osm') {
      this.osmLayer.setOpacity(opacity);
    } else if (layerName === 'googleMaps') {
      this.googleMapsLayer.setOpacity(opacity);
    }
  }

  addMarkers(): void {
    this.tasinmazlar.forEach(tasinmaz => {
      const koordinatBilgileri = tasinmaz.koordinatBilgileri.split(',').map(Number);
      
      const marker = new Feature({
        geometry: new Point(fromLonLat(koordinatBilgileri))
      });

      marker.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        })
      }));

      this.vectorLayer.getSource().addFeature(marker);
    });
  }

  // Checkbox işlemleri için metodlar
  isSelected(tasinmaz: any): boolean {
    // Burada taşınmazın seçili olup olmadığını döndürün
    // Örneğin, bir tasinmaz.selected gibi bir alanınız varsa onu kontrol edebilirsiniz
    return tasinmaz.selected === true;
  }

  toggleSelection(tasinmaz: any): void {
    // Checkbox durumuna göre seçim işlemlerini yapın
    tasinmaz.selected = !tasinmaz.selected;
  
    if (tasinmaz.selected) {
      // Koordinat bilgilerini alın ve haritada gösterin
      const koordinatBilgileri = tasinmaz.koordinatBilgileri.split(',').map(parseFloat);
      const lonLat = fromLonLat([koordinatBilgileri[1], koordinatBilgileri[0]]);
  
      // View'i güncelleyin
      this.map.getView().setCenter(lonLat);
      this.map.getView().setZoom(12); // İstediğiniz zoom seviyesini ayarlayabilirsiniz
    }
  }
  
  
}
