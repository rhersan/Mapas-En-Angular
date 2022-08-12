import { Component, OnInit } from '@angular/core';
interface MenuItem  {
  ruta: string
  nombre: string,
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
    li {      cursor: pointer;    }
      
    `
  ]
})
export class MenuComponent {

  menuItems: MenuItem[] = [
    { nombre: 'FullScreen', ruta:  '/mapas/fullScreen' },
    { nombre: 'Zoom Range', ruta:  '/mapas/zoom-range' },
    { nombre: 'Marcadores', ruta:  '/mapas/marcadores' },
    { nombre: 'Propiedades', ruta: '/mapas/propiedades' },
  ];


}
