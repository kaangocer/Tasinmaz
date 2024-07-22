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
        center: fromLonLat([37.41, 8.82]), // Default center
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

  setCenterAndZoom(coordinates: [number, number], zoom: number): void {
    const view = this.map.getView();
    const transformedCoordinates = fromLonLat(coordinates);
    view.setCenter(transformedCoordinates);
    view.setZoom(zoom);

    // Özel işaretçi ekle
    this.addMarker(transformedCoordinates);
  }

  addMarker(coordinates: [number, number]): void {
    this.vectorLayer.getSource().clear(); // Eski işaretçileri temizle

    const marker = new Feature({
      geometry: new Point(coordinates)
    });

    marker.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png'
      })
    }));

    this.vectorLayer.getSource().addFeature(marker);
  }
}
