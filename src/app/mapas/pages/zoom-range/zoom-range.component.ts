import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'
import { last } from 'rxjs';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .row  {
      background-color: white;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      z-index: 9999;
      width: 400px;
    }

    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  centerMapa: [number,number] = [-98.26172548227103,20.823954282884042];

  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { 
    console.log('construnctor', this.divMapa);
  }

  // Limpiar todos los listener
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit', this.divMapa);
    
    this.mapa =  new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerMapa,
      zoom: this.zoomLevel
    });

    // Hacer zoom con scroll o barra input
    this.mapa.on('zoom', (ev) => {
      console.log('zoom');
      this.zoomLevel = this.mapa.getZoom();
    });

    // Mover mapa
    this.mapa.on('zoomend', (ev) => {
      if(this.mapa.getZoom() > 18 ){
        this.mapa.zoomTo(18);
      }
    });

    // movimiento de mapa
    this.mapa.on('move', (ev) => {
      const target =  ev.target;
      const { lng, lat } = target.getCenter();
      this.centerMapa = [lat, lng];
    });


  }

  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomIn(){
    this.mapa.zoomIn();
  }

  // Centrar mapa cuando se mueve
  zoomCambio(valor: string){
    this.mapa.zoomTo(Number(valor));
  }

}
