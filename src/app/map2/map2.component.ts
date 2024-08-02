import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine';
import { TasinmazService } from '../../services/tasinmazServices/tasinmaz.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css']
})
export class Map2Component implements OnInit {
  map: Map;
  vectorLayer: VectorLayer;
 
  osmLayer: TileLayer;
  googleMapsLayer: TileLayer;
  scaleLineControl: ScaleLine;
  tasinmazlar: any[] = [];
  onCoordinatesSelected: (coordinates: [number, number]) => void;
  userId: number;

  constructor(private tasinmazService: TasinmazService, private authService: AuthService) {
    this.userId = this.authService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.getTasinmazlarByUser();
  }

  getTasinmazlarByUser(): void {
    const filters = {}; // Filtrelerinizi buraya ekleyebilirsiniz

    this.tasinmazService.getTasinmazByKullaniciId(this.userId, filters).subscribe(
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

    // Ana marker'lar için VectorSource
    this.vectorLayer = new VectorLayer({
      source: new VectorSource()
    });

    

    this.map = new Map({
      target: 'map',
      layers: [
        this.osmLayer,
        this.googleMapsLayer,
        this.vectorLayer,
        
      ],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4
      }),
      controls: [this.scaleLineControl]
    });

    this.map.on('click', (event) => {
      const coordinates = event.coordinate;
      const lonLatCoordinates = toLonLat(coordinates);
      const latLonCoordinates: [number, number] = [lonLatCoordinates[1], lonLatCoordinates[0]];
      
      if (this.onCoordinatesSelected) {
        this.onCoordinatesSelected(latLonCoordinates);
      }
    });
  }

  toggleLayer(layerName: string, event: MouseEvent): void {
    event.stopPropagation();

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
    this.vectorLayer.getSource().clear();

    this.tasinmazlar.forEach(tasinmaz => {
      const koordinatBilgileri = tasinmaz.koordinatBilgileri.split(',').map(Number);
      const latLonCoordinates: [number, number] = [koordinatBilgileri[1], koordinatBilgileri[0]];
      const transformedCoordinates = fromLonLat(latLonCoordinates);

      const marker = new Feature({
        geometry: new Point(transformedCoordinates)
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
    const transformedCoordinates = fromLonLat([coordinates[0], coordinates[1]]);
    view.setCenter(transformedCoordinates);
    view.setZoom(zoom);

    this.addMarker([coordinates[1], coordinates[0]]);
  }

  addMarker(coordinates: [number, number]): void {
    this.vectorLayer.getSource().clear();

    const transformedCoordinates = fromLonLat([coordinates[1], coordinates[0]]);

    const marker = new Feature({
      geometry: new Point(transformedCoordinates)
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