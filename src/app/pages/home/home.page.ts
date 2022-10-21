import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/model/Usuario';
import { AfterViewInit,  ElementRef, ViewChild } from '@angular/core';
import { Animation, AnimationController} from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

 
export class HomePage implements OnInit, AfterViewInit{
 
  @ViewChild('titulo', { read: ElementRef, static: true}) titulo: ElementRef;
  @ViewChild('mensaje', { read: ElementRef, static: true}) mensaje: ElementRef;
  @ViewChild('video', { static: false })
  private video: ElementRef;
  @ViewChild('canvas', { static: false })
  private canvas: ElementRef;
  @ViewChild('fileinput', { static: false })
  private fileinput: ElementRef;
  public usuario: Usuario;

  public escaneando = false;
  public datosQR = '';
  public loading: HTMLIonLoadingElement = null;

  public bloqueInicio: number = 0;
  public bloqueTermino: number = 0;
  public dia: string = '';
  public horaFin: string = '';
  public horaInicio: string = '';
  public idAsignatura: string = '';
  public nombreAsignatura: string = '';
  public nombreProfesor: string = '';
  public seccion: string = '';
  public sede: string = '';
   
  constructor(
        private activeroute: ActivatedRoute
      , private router: Router
      , private alertController: AlertController
      , private animationController: AnimationController,
       private loadingController: LoadingController) {

    this.activeroute.queryParams.subscribe(params => {       
      if (this.router.getCurrentNavigation().extras.state) { 
        this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
      } else {
        this.router.navigate(['/login']);
      }
  });
}

public ngOnInit() {
}

public ngAfterViewInit(): void {
  this.limpiarDatos();
  const animation = this.animationController
    .create()
    .addElement(this.mensaje.nativeElement)
    .iterations(Infinity)
    .duration(6000)
    .fromTo('transform', 'translate(0%)', 'translate(100%)')
    .fromTo('opacity', 0.5, 1);
    
  animation.play();
  this.imensaje();
}

public imensaje(){
  this.animationController
    .create()
    .addElement(this.titulo.nativeElement)
    .iterations(Infinity)
    .duration(6000)
    .fromTo('transform', 'translate(0%)', 'translate(100%)')
    .fromTo('opacity', 0.4, 1)
    .play();
    
}


  public salir(): void {
    for (const [key, value] of Object.entries(this.usuario)) {
        Object.defineProperty(this.usuario, key, {value: ''});
        this.router.navigate(['/login']);
        this.usuario.correoDuoc = '@duocuc.cl';
      }
    }


    public limpiarDatos(): void {
      this.escaneando = false;
      this.datosQR = '';
      this.loading = null;
      (document.getElementById('input-file') as HTMLInputElement).value = '';
      this.bloqueInicio = 0;
     this.bloqueTermino= 0;
     this.dia= '';
     this.horaFin= '';
     this.horaInicio = '';
     this.idAsignatura= '';
     this.nombreAsignatura= '';
     this.nombreProfesor= '';
     this.seccion= '';
     this.sede= '';
    }

    public async comenzarEscaneoQR() {
      this.limpiarDatos();
      const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
        video: {facingMode: 'environment'}
      });
      this.video.nativeElement.srcObject = mediaProvider;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      this.loading = await this.loadingController.create({});
      await this.loading.present();
      this.video.nativeElement.play();
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  
    public obtenerDatosQR(source?: CanvasImageSource): boolean {
      let w = 0;
      let h = 0;
      if (!source) {
        this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
        this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
      }
  
      w = this.canvas.nativeElement.width;
      h = this.canvas.nativeElement.height;
      console.log(w + ' ' + h);
  
      const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
      context.drawImage(source? source : this.video.nativeElement, 0, 0, w, h);
      const img: ImageData = context.getImageData(0, 0, w, h);
      const qrCode: QRCode = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
      if (qrCode) {
        this.escaneando = false;
        this.datosQR = qrCode.data;
        this.mostrarDatosQROrdenados(this.datosQR);
      }
      return this.datosQR !== '';
    }
  
    public mostrarDatosQROrdenados(datosQR: string): void {
      const objetoDatosQR = JSON.parse(datosQR);
      this.bloqueInicio = objetoDatosQR.bloqueInicio;
      this.bloqueTermino = objetoDatosQR.bloqueTermino;
      this.dia = objetoDatosQR.dia;
        
      this.horaFin = objetoDatosQR.horaFin;
      this.horaInicio = objetoDatosQR.horaInicio;
      this.idAsignatura = objetoDatosQR.idAsignatura;
      this.nombreAsignatura = objetoDatosQR.nombreAsignatura;
      this.nombreProfesor = objetoDatosQR.nombreProfesor;
      this.seccion = objetoDatosQR.seccion;
      this.sede = objetoDatosQR.sede;
    }

    async verificarVideo() {
      if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
        if (this.loading) {
          await this.loading.dismiss();
          this.loading = null;
          this.escaneando = true;
        }
        if (this.obtenerDatosQR()) {
          console.log(1);
        } else {
          if (this.escaneando) {
            console.log(2);
            requestAnimationFrame(this.verificarVideo.bind(this));
          }
        }
      } else {
        console.log(3);
        requestAnimationFrame(this.verificarVideo.bind(this));
      }
    }
  
    public detenerEscaneoQR(): void {
      this.escaneando = false;
    }
  
    public cargarImagenDesdeArchivo(): void {
      this.limpiarDatos();
      this.fileinput.nativeElement.click();
    }
  
    public verificarArchivoConQR(files: FileList): void {
      const file = files.item(0);
      const img = new Image();
      img.onload = () => {
        this.obtenerDatosQR(img);
      };
      img.src = URL.createObjectURL(file);
    }


}
