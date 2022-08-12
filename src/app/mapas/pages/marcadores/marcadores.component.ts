import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { map } from 'rxjs/operators';
interface MarcadorPersonalizado {
  color: string,
  marker?: mapboxgl.Marker,
  centro?: [number,number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`

    .mapa-container {
      width: 100%;
      height: 100%;
    }


    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;

    }

    li {
      cursor: pointer;
    }

  `]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  centerMapa: [number,number] = [-98.26172548227103,20.823954282884042];

  // Arreglo de marcadores
  marcadores: MarcadorPersonalizado[] = [];
  
  constructor() { }

  ngAfterViewInit(): void {
    
    this.mapa =  new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerMapa,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();

    this.mapa.on('', (ev) => {

    });

  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.centerMapa)
    .addTo(this.mapa);

    this.marcadores.push({
      color, 
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });

  }

  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo({
      center:  marker.getLngLat()
    });

  }

  guardarMarcadoresLocalStorage(){

    const lngLatArr: MarcadorPersonalizado[] = [];

    this.marcadores.forEach( m => {

      const color = m.color;
      const {lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        centro: [lng, lat]
      });

    });

    // Guardar Local Storage
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  leerLocalStorage(){

    if( !localStorage.getItem('marcadores') ) {
      return;
    }

    const lngLatArr: MarcadorPersonalizado[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( m => {

      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

        this.marcadores.push({
          marker: newMarker,
          color: m.color
        });

        newMarker.on('dragend', () => {
          this.guardarMarcadoresLocalStorage();
        });

    });


    
  }
  
  borrarMarcador( i: number){
    console.log('Borrando marcador'+i);
    // Borrar de Mapa
    this.marcadores[i].marker?.remove();
    // Borrar del listaf
    this.marcadores.splice(i,1);
    
    this.guardarMarcadoresLocalStorage();
  }


}
