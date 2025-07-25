import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) mapa: (GoogleMap | undefined);
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: (MapInfoWindow | undefined);
  @ViewChild('modalHelp') modalHelp: TemplateRef<any> | undefined;
  
  public dados1 = true;
  public exibeDetalhes = null;
  public idSelecionado = -1;
  public infoContent = '';
  public lat = 0;
  public lng = 0;

  public center: google.maps.LatLngLiteral = { lat: this.lat, lng: this.lng };
  public options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true
  };
  public markers: { [id: number]: MapMarker } = {};
  public polyline: google.maps.Polyline[] = [];
  public tamanhoPin = 43;
  public zoom = 10;

  public detalhe: any[] = [];
  public listaDados1: any[] = [];
  public listaClusterDados1: any[] = [];

  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.center = { lat: this.lat, lng: this.lng };
    });

    this.limparDados();
    this.carregarListaDados1();
    this.carregarMapa();
  }

  centerChange(item: any): void {
    if (item.position.lat && item.position.lng) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.center = { lat: this.lat, lng: this.lng };
      });

      this.mapa?.panTo(item.position);
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  handlePlaceChange(place: google.maps.places.PlaceResult): void {
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      this.center = { lat, lng };

      this.listaClusterDados1 = [{
        id: 999,
        position: { lat, lng },
        icon: {
          url: '../assets/marker.png',
          scaledSize: { height: 40, width: 40 }
        },
        info: `<b>${place.formatted_address}</b>`,
        horaTitulo: '',
        hora: ''
      }];
    }
  }

  markerMouseOver(marker: any): void {
    marker.marker?.setAnimation(google.maps.Animation.BOUNCE);
  }

  markerMouseOut(marker: any): void {
    marker.marker?.setAnimation(null);
  }

  mouseEnterListItem(item: any): void {
    item.selecionado = true;

    if (item.id > 0) {
      const marker = this.markers[item.id];
    
      if (marker) { this.markerMouseOver(marker); } 
    }
  }

  mouseLeaveListItem(item: any): void {
    item.selecionado = false;

    if (item.id > 0) {
      const marker = this.markers[item.id];
    
      if (marker) { this.markerMouseOut(marker); } 
    }
  }

  mouseOverSelectItem(id: number): void {
    if (this.idSelecionado !== id) {
      this.idSelecionado = id;

      this.carregarMapa();
    }
  }

  onMarkerInitDados1(marker: MapMarker, item: any): any {
    if (item.id > 0) { this.markers[item.id] = marker; } 
    
    return item;
  }

  openMarkerInfo(marker: MapMarker, content: string) {
    this.infoContent = content;

    this.infoWindow?.open(marker);
  }

  public showHelp(): void {
    this.modalService.open( this.modalHelp, { backdrop: 'static', keyboard: false, size: 'lg' } );
  }

  public carregarDados1(): void {
    this.exibeDetalhes = null;
    this.idSelecionado = -1;
    this.dados1 = !this.dados1;

    this.carregarMapa();
  }

  private carregarListaDados1(): void {
    const tamanhoImagem = this.tamanhoPin;

    this.listaDados1.push({
      id: 1,
      selecionado: false,
      position: { lat: -23.5001, lng: -46.4001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 1</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 1 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 1 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 1 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '10:11:01',
      hora: '10:11'
    });

    this.detalhe.push({
      id: 1,
      selecionado: false,
      titulo: 'Título do ID 1',
      detalhe1: '<span>Campo: conteúdo do ID 1 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 1 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 1 - 3</span>',
      horaTitulo: '10:11:01',
      hora: '10:11',
      position: { lat: -23.5001, lng: -46.4001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });

    this.listaDados1.push({
      id: 2,
      selecionado: false,
      position: { lat: -23.6001, lng: -46.9001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } },
      info: `<div class="row m-0">
               <div class="col-12 p-0 text-left mapa-detalhe">
                 <div class="titulo-detalhe"><b>ID 2</b><br></div>
                 <div class="mt-2"><b>Campo: </b>conteúdo do ID 2 - 1</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 2 - 2</span><br></div>
                 <div><b>Campo: </b>conteúdo do ID 2 - 3</span></div>
               </div>
             </div>`,
      horaTitulo: '10:21:02',
      hora: '10:21'
    });

    this.detalhe.push({
      id: 2,
      selecionado: false,
      titulo: 'Título do ID 2',
      detalhe1: '<span>Campo: conteúdo do ID 2 - 1</span>',
      detalhe2: '<span>Campo: conteúdo do ID 2 - 2</span>',
      detalhe3: '<span>Campo: conteúdo do ID 2 - 3</span>',
      horaTitulo: '10:21:02',
      hora: '10:21',
      position: { lat: -23.6001, lng: -46.9001 },
      icon: { url: '../assets/car_pin.png', scaledSize: { height: tamanhoImagem, width: tamanhoImagem } }
    });
  }

  private carregarMapa(): void {
    const detalheTemp: any[] = [];

    let listClusterTemp: any[] = [];

    this.listaClusterDados1 = [];

    if (this.dados1) {
      this.listaDados1.forEach((element) => { listClusterTemp.push(element); });

      const sortedArrayListaDados1: any[] = listClusterTemp.sort((obj1, obj2) => {
        if (obj1.hora < obj2.hora) { return 1; }
        if (obj1.hora > obj2.hora) { return -1; }
  
        return 0;
      });
  
      this.listaClusterDados1 = sortedArrayListaDados1;

      listClusterTemp = [];
    }

    this.detalhe.forEach(function(element) { detalheTemp.push(element); });

    const sortedArrayDetalhe: any[] = detalheTemp.sort((obj1, obj2) => {
      if (obj1.titulo > obj2.titulo) { return 1; }
      if (obj1.titulo < obj2.titulo) { return -1; }

      return 0;
    });

    this.detalhe = sortedArrayDetalhe;
  }

  private limparDados(): void {
    this.idSelecionado = -1;

    this.detalhe = [];
    this.listaDados1 = [];
  }
}
